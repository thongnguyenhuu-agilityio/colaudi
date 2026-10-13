// Bảng vàng API: one Redis sorted set holds the leaderboard.
// GET    /api/leaderboard                       → top 10 + total (cached 2 s at the CDN and in the instance)
// POST   /api/leaderboard {action:'start', runId} → server records when the run started
// POST   /api/leaderboard {name, points, runId, code} → server computes the time, returns { rank, total, timeSec }
// POST   /api/leaderboard {action:'close'|'open'}  → organisers stop or reopen sign-ups (header x-admin-key)
// DELETE /api/leaderboard?id=…                  → remove one entry (header x-admin-key)
// DELETE /api/leaderboard?all=1                 → wipe the board (header x-admin-key)
// Uses Upstash Redis over REST when its env vars exist. Locally (no VERCEL_ENV) it falls back to memory;
// on Vercel without Redis it refuses to run, so instances never show different boards.
import { MAX_POINTS, MAX_TIME_SEC, rankValue } from '../public/score.js';

// Keys are scoped by Vercel environment, so rehearsals on preview URLs never touch the production board.
const ENV = process.env.VERCEL_ENV || 'local';
const KEY = `colaudi:${ENV}:leaderboard`;
const START = `colaudi:${ENV}:start:`;   // runId → start time (ms), set by the server
const DONE = `colaudi:${ENV}:done:`;     // runId → already submitted
const RATE = `colaudi:${ENV}:rate:`;     // ip → POSTs in the last 10 minutes
const CLOSED = `colaudi:${ENV}:closed`;  // present → sign-ups closed
const TOP = 10;
const RATE_LIMIT = Number(process.env.RATE_LIMIT_PER_10_MIN) || 40; // generous: many players share the office NAT
const minRunSec = () => Number(process.env.MIN_RUN_SEC ?? 45);       // fastest honest full run, from rehearsal

let now = () => Date.now();
export const __setNow = fn => { now = fn || (() => Date.now()); }; // tests only

/* ---------- storage ---------- */
function redisConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

const mem = globalThis.__colaudiMem ??= { zset: new Map(), keys: new Map() };
function memory(cmd) {
  const [op, ...a] = cmd;
  const sorted = () => [...mem.zset.entries()].sort((x, y) => y[1] - x[1] || (x[0] < y[0] ? -1 : 1)).map(e => e[0]);
  switch (op) {
    case 'ZADD': mem.zset.set(a[2], Number(a[1])); return 1;
    case 'ZREVRANGE': { const all = sorted(); const end = Number(a[2]) === -1 ? all.length : Number(a[2]) + 1; return all.slice(Number(a[1]), end); }
    case 'ZREVRANK': { const i = sorted().indexOf(a[1]); return i < 0 ? null : i; }
    case 'ZCARD': return mem.zset.size;
    case 'ZREM': return mem.zset.delete(a[1]) ? 1 : 0;
    case 'SET': { if (a.includes('NX') && mem.keys.has(a[0])) return null; mem.keys.set(a[0], a[1]); return 'OK'; }
    case 'GET': return mem.keys.has(a[0]) ? mem.keys.get(a[0]) : null;
    case 'INCR': { const v = Number(mem.keys.get(a[0]) || 0) + 1; mem.keys.set(a[0], String(v)); return v; }
    case 'EXISTS': return mem.keys.has(a[0]) ? 1 : 0;
    case 'DEL': { if (a[0] === KEY) { const n = mem.zset.size; mem.zset.clear(); return n ? 1 : 0; } return mem.keys.delete(a[0]) ? 1 : 0; }
    default: throw new Error('unsupported ' + op);
  }
}
export const __resetMemory = () => { mem.zset.clear(); mem.keys.clear(); cache = null; }; // tests only

async function redis(cmds) {
  const cfg = redisConfig();
  if (!cfg) {
    if (process.env.VERCEL_ENV) throw new Error('Redis is not configured for this deployment');
    return cmds.map(memory);
  }
  const res = await fetch(cfg.url.replace(/\/$/, '') + '/pipeline', {
    method: 'POST',
    headers: { Authorization: `Bearer ${cfg.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmds)
  });
  if (!res.ok) throw new Error(`Redis answered ${res.status}`);
  const out = await res.json();
  return out.map(r => { if (r.error) throw new Error(r.error); return r.result; });
}

/* ---------- helpers ---------- */
const json = (body, status = 200, headers = {}) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers } });

const parse = m => { try { const e = JSON.parse(m); return { id: e.id, name: e.n, points: e.p, timeSec: e.t }; } catch { return null; } };
const validRunId = id => typeof id === 'string' && /^[a-z0-9-]{8,40}$/i.test(id);

export function cleanName(raw) {
  if (typeof raw !== 'string') return '';
  const s = raw.normalize('NFC').replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u2028-\u202e]/g, '').replace(/\s+/g, ' ').trim();
  return [...s].slice(0, 20).join('');
}

const codeRequired = () => Boolean(process.env.EVENT_CODE);
const isAdmin = req => Boolean(process.env.ADMIN_KEY) && req.headers.get('x-admin-key') === process.env.ADMIN_KEY;
const clientIp = req => (req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for') || 'local').split(',')[0].trim();

// The board read is cached per warm instance for 2 s, so even requests that miss the CDN rarely reach Redis.
let cache = null;
async function readBoard() {
  if (cache && now() - cache.at < 2000) return cache.data;
  const [members, total, closed] = await redis([['ZREVRANGE', KEY, '0', String(TOP - 1)], ['ZCARD', KEY], ['EXISTS', CLOSED]]);
  const top = members.map(parse).filter(Boolean).map((e, i) => ({ rank: i + 1, ...e }));
  const data = { top, total, closed: closed === 1, codeRequired: codeRequired(), store: redisConfig() ? 'redis' : 'memory', env: ENV };
  cache = { at: now(), data };
  return data;
}

/* ---------- handlers ---------- */
export async function GET(req) {
  // Any query string would bypass the CDN cache; refuse it so nobody can hammer Redis with ?r=random.
  if (req && new URL(req.url).search) return json({ error: 'Không hỗ trợ tham số.' }, 400);
  try {
    return json(await readBoard(), 200, { 'Cache-Control': 'public, max-age=0, s-maxage=2, stale-while-revalidate=2' });
  } catch {
    return json({ error: 'Không đọc được bảng vàng. Thử lại sau vài giây.' }, 503);
  }
}

export async function POST(req) {
  let body;
  try { body = await req.json(); } catch { return json({ error: 'Dữ liệu gửi lên không hợp lệ.' }, 400); }

  try {
    if (body?.action === 'close' || body?.action === 'open') {
      if (!isAdmin(req)) return json({ error: 'Không có quyền.' }, 401);
      await redis([body.action === 'close' ? ['SET', CLOSED, '1'] : ['DEL', CLOSED]]);
      cache = null;
      return json({ ok: true, closed: body.action === 'close' });
    }

    const rateKey = RATE + clientIp(req);
    const [, used, closed] = await redis([['SET', rateKey, '0', 'NX', 'EX', '600'], ['INCR', rateKey], ['EXISTS', CLOSED]]);
    if (used > RATE_LIMIT) return json({ error: 'Gửi quá nhiều lần. Chờ vài phút rồi thử lại.' }, 429);
    if (closed === 1) return json({ error: 'Bảng vàng đã khoá sổ.' }, 403);

    const runId = body?.runId;
    if (!validRunId(runId)) return json({ error: 'Lượt chơi không hợp lệ.' }, 400);

    if (body?.action === 'start') {
      await redis([['SET', START + runId, String(now()), 'NX', 'EX', String(MAX_TIME_SEC)]]);
      return json({ ok: true }, 201);
    }

    const name = cleanName(body?.name);
    const points = body?.points;
    if (!name) return json({ error: 'Hãy nhập tên (tối đa 20 ký tự).' }, 400);
    if (!Number.isInteger(points) || points < 0 || points > MAX_POINTS) return json({ error: 'Điểm không hợp lệ.' }, 400);
    if (codeRequired() && String(body?.code ?? '').trim().toLowerCase() !== process.env.EVENT_CODE.trim().toLowerCase()) {
      return json({ error: 'Sai mã sự kiện. Mã được chiếu trong buổi họp.' }, 403);
    }

    // The server, not the browser, measures the run: from the recorded start to this request.
    const [startedAt] = await redis([['GET', START + runId]]);
    if (startedAt === null) return json({ error: 'Không tìm thấy lượt chơi trên máy chủ. Hãy chơi lại từ đầu.' }, 400);
    const timeSec = Math.round((now() - Number(startedAt)) / 1000);
    if (timeSec < minRunSec()) return json({ error: 'Thời gian không hợp lệ.' }, 400);
    if (timeSec > MAX_TIME_SEC) return json({ error: 'Lượt chơi đã quá hạn. Hãy chơi lại từ đầu.' }, 400);

    const [first] = await redis([['SET', DONE + runId, '1', 'NX', 'EX', '86400']]);
    if (first === null) return json({ error: 'Lượt chơi này đã được ghi danh.' }, 409);

    // Equal points and seconds: whoever submitted first stays ahead.
    const score = rankValue(points, timeSec) + (1 - now() / 1e13);
    const member = JSON.stringify({ id: runId, n: name, p: points, t: timeSec });
    const [, rank, total] = await redis([['ZADD', KEY, String(score), member], ['ZREVRANK', KEY, member], ['ZCARD', KEY]]);
    cache = null;
    return json({ rank: rank + 1, total, name, timeSec }, 201);
  } catch {
    return json({ error: 'Chưa ghi danh được. Thử lại sau vài giây.' }, 503);
  }
}

export async function DELETE(req) {
  if (!isAdmin(req)) return json({ error: 'Không có quyền.' }, 401);
  const url = new URL(req.url);
  if (url.searchParams.get('all') === '1') {
    await redis([['DEL', KEY]]);
    cache = null;
    return json({ ok: true, cleared: true });
  }
  const id = url.searchParams.get('id');
  const name = url.searchParams.get('name');
  const [members] = await redis([['ZREVRANGE', KEY, '0', '-1']]);
  const hits = members.filter(m => { const e = parse(m); return e && (id ? e.id === id : name && e.name === name); });
  if (!hits.length) return json({ error: 'Không tìm thấy.' }, 404);
  await redis(hits.map(h => ['ZREM', KEY, h]));
  cache = null;
  return json({ ok: true, removed: hits.length });
}
