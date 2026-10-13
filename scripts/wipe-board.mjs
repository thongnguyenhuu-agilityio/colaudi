// Wipe the leaderboard of one deployment. Usage: ADMIN_KEY=… node scripts/wipe-board.mjs https://colaudi.vercel.app
const base = (process.argv[2] || process.env.SMOKE_URL || '').replace(/\/$/, '');
if (!base || !process.env.ADMIN_KEY) { console.error('Usage: ADMIN_KEY=<key> node scripts/wipe-board.mjs <url>'); process.exit(1); }
const r = await fetch(`${base}/api/leaderboard?all=1`, { method: 'DELETE', headers: { 'x-admin-key': process.env.ADMIN_KEY } });
console.log(r.ok ? `Board wiped on ${base}` : `Failed: ${r.status} ${await r.text()}`);
process.exit(r.ok ? 0 : 1);
