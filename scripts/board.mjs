// Organiser commands for one deployment's leaderboard. The admin key is read from the environment, never typed on the command line.
//   ADMIN_KEY=… node scripts/board.mjs <url> wipe            clear the board (between rehearsals, and at 25:00 on the day)
//   ADMIN_KEY=… node scripts/board.mjs <url> rm "<name>"     remove every entry with this exact name
//   ADMIN_KEY=… node scripts/board.mjs <url> close|open      stop or reopen sign-ups (no redeploy needed)
//   node scripts/board.mjs <url> top                         print the current top 10
const [url, cmd, arg] = process.argv.slice(2);
const base = (url || '').replace(/\/$/, '');
const key = process.env.ADMIN_KEY;
if (!base || !cmd) { console.error('Usage: node scripts/board.mjs <url> wipe|rm <name>|close|open|top'); process.exit(1); }
if (cmd !== 'top' && !key) { console.error('Set ADMIN_KEY in the environment first (export ADMIN_KEY=…).'); process.exit(1); }
const admin = { 'x-admin-key': key, 'Content-Type': 'application/json' };
let r;
if (cmd === 'wipe') r = await fetch(`${base}/api/leaderboard?all=1`, { method: 'DELETE', headers: admin });
else if (cmd === 'rm') r = await fetch(`${base}/api/leaderboard?name=${encodeURIComponent(arg || '')}`, { method: 'DELETE', headers: admin });
else if (cmd === 'close' || cmd === 'open') r = await fetch(`${base}/api/leaderboard`, { method: 'POST', headers: admin, body: JSON.stringify({ action: cmd }) });
else if (cmd === 'top') {
  r = await fetch(`${base}/api/leaderboard`);
  const j = await r.json();
  j.top?.forEach(e => console.log(`${String(e.rank).padStart(2)}. ${e.name.padEnd(20)} ${String(e.points).padStart(2)} pts  ${e.timeSec}s  id=${e.id}`));
  console.log(`${j.total} entries · ${j.closed ? 'CLOSED' : 'open'} · env=${j.env}`);
  process.exit(r.ok ? 0 : 1);
} else { console.error('Unknown command: ' + cmd); process.exit(1); }
console.log(r.ok ? `${cmd}: ${await r.text()}` : `Failed (${r.status}): ${await r.text()}`);
process.exit(r.ok ? 0 : 1);
