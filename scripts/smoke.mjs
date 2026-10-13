// Smoke test a deployed (or local) Cờ Lau Đi.
// Usage: node scripts/smoke.mjs https://colaudi.vercel.app [--write]
// --write also checks the write path and the anti-forgery rules without adding anything to the board.
const base = (process.argv[2] || process.env.SMOKE_URL || 'http://localhost:3000').replace(/\/$/, '');
const write = process.argv.includes('--write');
let failed = 0;
const check = (ok, label, detail = '') => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? '  ' + detail : ''}`); if (!ok) failed++; };

const page = await fetch(base + '/');
check(page.ok && (await page.text()).includes('Cờ Lau'), 'game page loads', String(page.status));
for (const f of ['/game.js', '/score.js']) {
  const r = await fetch(base + f);
  check(r.ok, `${f} loads`, String(r.status));
}
const api = await fetch(base + '/api/leaderboard');
const body = api.ok ? await api.json() : {};
check(api.ok, 'leaderboard API answers', String(api.status));
check(body.store === 'redis' || base.includes('localhost'), 'leaderboard uses Redis', `store=${body.store} env=${body.env}`);
console.log(`      ${body.total ?? '?'} entries, event code ${body.codeRequired ? 'required' : 'not required'}`);

if (write) {
  // Proves the write path without touching the board: a start is stored in Redis, and an instant submit
  // is refused because the server measured the run as too fast.
  const runId = 'smoke-' + Date.now().toString(36);
  const post = body => fetch(base + '/api/leaderboard', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const start = await post({ action: 'start', runId });
  check(start.status === 201, 'can record a run start (Redis write)', String(start.status));
  const early = await post({ name: 'Smoke test', points: 36, runId, code: process.env.EVENT_CODE || '' });
  check(early.status === 400, 'refuses a too-fast submit (server-side timing)', String(early.status));
  const forged = await post({ name: 'Smoke test', points: 36, runId: runId + 'x', timeSec: 60 });
  check(forged.status === 400, 'refuses a submit with no recorded start', String(forged.status));
}
console.log(failed ? `\n${failed} check(s) failed` : '\nAll checks passed');
process.exit(failed ? 1 : 0);
