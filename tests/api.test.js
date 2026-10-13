import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { GET, POST, DELETE, cleanName, __setNow, __resetMemory } from '../api/leaderboard.js';

let clock = 1_800_000_000_000;
const ip = { 'x-real-ip': '10.0.0.1' };
const req = (body, headers = ip) => new Request('http://x/api/leaderboard', { method: 'POST', headers, body: JSON.stringify(body) });
const post = (body, headers) => POST(req(body, headers));
const get = async () => (await GET(new Request('http://x/api/leaderboard'))).json();
const newRun = () => 'run-' + Math.random().toString(36).slice(2, 10);

// Start a run on the server, let `seconds` pass, then submit it.
async function play({ name = 'Bộ Lĩnh', points = 30, seconds = 200, runId = newRun(), code, headers } = {}) {
  await post({ action: 'start', runId }, headers);
  clock += seconds * 1000;
  return post({ name, points, runId, code }, headers);
}

beforeEach(() => {
  delete process.env.EVENT_CODE;
  delete process.env.VERCEL_ENV;
  process.env.ADMIN_KEY = 'admin';
  process.env.MIN_RUN_SEC = '45';
  __resetMemory();
  __setNow(() => clock);
});
afterEach(() => __setNow(null));

describe('leaderboard API (memory store)', () => {
  it('starts empty and open', async () => {
    const j = await get();
    expect(j).toMatchObject({ top: [], total: 0, closed: false });
  });

  it('accepts a run and measures its time on the server', async () => {
    const r = await play({ seconds: 200 });
    expect(r.status).toBe(201);
    expect(await r.json()).toMatchObject({ rank: 1, total: 1, timeSec: 200 });
  });

  it('ignores a time sent by the browser', async () => {
    const runId = newRun();
    await post({ action: 'start', runId });
    clock += 120_000;
    const r = await post({ name: 'Gian lận', points: 36, runId, timeSec: 1 });
    expect((await r.json()).timeSec).toBe(120);
  });

  it('rejects a submit with no recorded start', async () => {
    expect((await post({ name: 'curl', points: 36, runId: newRun() })).status).toBe(400);
  });

  it('rejects a run faster than the minimum', async () => {
    expect((await play({ seconds: 10 })).status).toBe(400);
  });

  it('orders by points, then by faster time, then by who submitted first', async () => {
    await play({ name: 'Chậm', points: 30, seconds: 300 });
    await play({ name: 'Nhanh', points: 30, seconds: 100 });
    await play({ name: 'Cao', points: 33, seconds: 900 });
    await play({ name: 'Trước', points: 27, seconds: 100 });
    await play({ name: 'Sau', points: 27, seconds: 100 });
    clock += 3000;
    const { top } = await get();
    expect(top.map(e => e.name)).toEqual(['Cao', 'Nhanh', 'Chậm', 'Trước', 'Sau']);
  });

  it('rejects the same run twice', async () => {
    const runId = newRun();
    expect((await play({ runId })).status).toBe(201);
    expect((await post({ name: 'Lần 2', points: 30, runId })).status).toBe(409);
  });

  it.each([
    ['score above 36', { points: 37 }],
    ['negative score', { points: -1 }],
    ['empty name', { name: '   ' }]
  ])('rejects %s', async (_, o) => {
    expect((await play(o)).status).toBe(400);
  });

  it('rejects a bad run id', async () => {
    expect((await post({ action: 'start', runId: 'x' })).status).toBe(400);
  });

  it('requires the event code when one is set', async () => {
    process.env.EVENT_CODE = 'HoaLu968';
    expect((await play({ code: 'sai' })).status).toBe(403);
    expect((await play({ code: ' hoalu968 ' })).status).toBe(201);
  });

  it('limits how often one address can post', async () => {
    process.env.RATE_LIMIT_PER_10_MIN = '';
    const h = { 'x-real-ip': '10.9.9.9' };
    let last;
    for (let i = 0; i < 41; i++) last = await post({ action: 'start', runId: newRun() }, h);
    expect(last.status).toBe(429);
    expect((await post({ action: 'start', runId: newRun() }, { 'x-real-ip': '10.9.9.8' })).status).toBe(201);
  });

  it('refuses a GET with a query string, so the CDN cache cannot be bypassed', async () => {
    expect((await GET(new Request('http://x/api/leaderboard?r=123'))).status).toBe(400);
  });

  it('lets organisers close and reopen sign-ups', async () => {
    const admin = { ...ip, 'x-admin-key': 'admin' };
    expect((await post({ action: 'close' })).status).toBe(401);
    expect((await post({ action: 'close' }, admin)).status).toBe(200);
    expect((await get()).closed).toBe(true);
    expect((await play()).status).toBe(403);
    await post({ action: 'open' }, admin);
    expect((await play()).status).toBe(201);
  });

  it('lets only the admin remove entries, by id or by name', async () => {
    const runId = newRun();
    await play({ runId });
    await play({ name: 'Tên xấu' });
    await play({ name: 'Tên xấu' });
    const del = (q, h) => DELETE(new Request(`http://x/api/leaderboard?${q}`, { method: 'DELETE', headers: h }));
    expect((await del(`id=${runId}`, {})).status).toBe(401);
    expect((await del(`id=${runId}`, { 'x-admin-key': 'admin' })).status).toBe(200);
    expect(await (await del(`name=${encodeURIComponent('Tên xấu')}`, { 'x-admin-key': 'admin' })).json()).toMatchObject({ removed: 2 });
    clock += 3000;
    expect((await get()).total).toBe(0);
  });

  it('refuses to run on Vercel without Redis', async () => {
    process.env.VERCEL_ENV = 'production';
    clock += 3000;
    expect((await GET(new Request('http://x/api/leaderboard'))).status).toBe(503);
  });
});

describe('cleanName', () => {
  it('trims, collapses spaces and caps at 20 characters', () => {
    expect(cleanName('  Đinh   Bộ  Lĩnh ')).toBe('Đinh Bộ Lĩnh');
    expect([...cleanName('x'.repeat(40))].length).toBe(20);
  });
  it('strips control characters', () => expect(cleanName('a\u0000b\u200bc')).toBe('abc'));
});
