// Cờ Lau Đi — game logic. Plain ES module, no framework, no build step.
import { pointsFor, totalPoints, formatTime, MAX_POINTS, BATTLES } from './score.js';

/* ---------- content ---------- */
const LORDS = [
  { id: 'xuong-xi', name: 'Ngô Xương Xí', land: 'Bình Kiều', alias: 'Sứ quân Codebase Sương Mù',
    taunt: 'Ba trăm file, không một dòng tài liệu. Có dám bước vào không?',
    q: 'Ngày đầu nhận một dự án lạ hoắc. Chiêu nào?',
    opts: ['Thức trắng đọc hết 300 file', 'Nhờ Claude đọc và giải thích kiến trúc, chưa sửa gì vội', 'Ngồi chờ senior rảnh'],
    ok: 1, bad: { 0: 'Trời sáng mới đọc tới file thứ 12. Sứ quân cười khẩy.', 2: 'Senior hẹn... quý sau.' },
    tip: 'Bước <b>Explore</b>: cho Claude đọc code và giải thích trước, chưa cho sửa gì.' },
  { id: 'canh-thac', name: 'Đỗ Cảnh Thạc', land: 'Đỗ Động Giang', alias: 'Sứ quân Bug Ma',
    taunt: 'Lúc có lúc không. Trên máy tôi chạy ngon mà!',
    q: 'Bug chập chờn, đoán mãi không ra. Chiêu nào?',
    opts: ['Rắc console.log khắp nơi', 'Restart server rồi cầu trời', 'Bắt Claude viết test tái hiện bug trước, rồi mới sửa'],
    ok: 2, bad: { 0: 'Log còn dài hơn code. Bug vẫn chơi trốn tìm.', 1: 'Trời nghe. Nhưng 2 giờ sáng thì trời cũng ngủ.' },
    tip: 'Cho agent một cách <b>tự kiểm chứng</b>: test đỏ trước, xanh sau. Có test thì mới dám giao việc.' },
  { id: 'cong-han', name: 'Kiều Công Hãn', land: 'Phong Châu', alias: 'Sứ quân Tính Năng Khổng Lồ',
    taunt: 'Một ticket, mười hai màn hình, hạn chót thứ Sáu.',
    q: 'Tính năng to như núi. Mở đầu thế nào?',
    opts: ['Bật Plan mode, duyệt kế hoạch rồi mới cho code', 'Prompt một câu: “làm hết đi”', 'Code luôn, sai đâu sửa đó'],
    ok: 0, bad: { 1: 'Claude làm hết thật. Diff 4.000 dòng. Chúc review vui vẻ.', 2: 'Sửa chỗ này, vỡ chỗ kia. Vòng lặp vô tận.' },
    tip: '<b>Plan mode</b> (Shift+Tab): Claude chỉ đọc và đề xuất. Duyệt kế hoạch trước, rồi mới động vào code.' },
  { id: 'nguyen-khoan', name: 'Nguyễn Khoan', land: 'Tam Đái', alias: 'Sứ quân Quên Quy Ước',
    taunt: 'Dặn dùng pnpm, hắn lại npm. Dặn tab, hắn lại space.',
    q: 'AI cứ quên quy ước của team. Chiêu nào?',
    opts: ['Nhắc lại trong mọi prompt', 'Đập bàn, đổi tool', 'Ghi quy ước vào CLAUDE.md'],
    ok: 2, bad: { 0: 'Ba tuần sau đã thuộc lòng prompt. AI vẫn quên.', 1: 'Tool mới cũng quên. Còn cái bàn thì gãy.' },
    tip: '<b>CLAUDE.md</b>: luật luôn bật, tự nạp vào mọi phiên làm việc. Viết ngắn, viết đúng.' },
  { id: 'nhat-khanh', name: 'Ngô Nhật Khánh', land: 'Đường Lâm', alias: 'Sứ quân Format Lộn Xộn',
    taunt: 'Dấu chấm phẩy lúc có lúc không. Ai làm gì được?',
    q: 'Muốn code lúc nào cũng được format, không ngoại lệ?',
    opts: ['Hook tự chạy formatter sau mỗi lần sửa file', 'Năn nỉ Claude nhớ format', 'Review tay từng dấu cách'],
    ok: 0, bad: { 1: 'Claude hứa. Mười lần nhớ chín. Sứ quân sống nhờ lần thứ mười.', 2: 'Mắt đã nhòe trước khi PR kịp merge.' },
    tip: 'Việc <b>phải luôn xảy ra</b> thì giao cho <b>hook</b>: script chạy chắc chắn, không phụ thuộc trí nhớ của model.' },
  { id: 'ly-khue', name: 'Lý Khuê', land: 'Siêu Loại', alias: 'Sứ quân Checklist Deploy',
    taunt: 'Mười bảy bước deploy, tuần nào cũng làm, lần nào cũng quên bước 9.',
    q: 'Quy trình lặp lại hằng tuần. Xử thế nào?',
    opts: ['Copy prompt dài từ Notes mỗi lần', 'Đóng gói thành Skill, gọi bằng /deploy', 'Giao cho thực tập sinh'],
    ok: 1, bad: { 0: 'Notes có 14 bản. Bản nào mới nhất? Không ai biết.', 2: 'Thực tập sinh hết kỳ. Bước 9 lại bị quên.' },
    tip: '<b>Skill</b>: quy trình và kiến thức đóng gói sẵn, chỉ nạp khi cần, gọi bằng <b>/tên</b>, chia sẻ cho cả team.' },
  { id: 'nguyen-sieu', name: 'Nguyễn Siêu', land: 'Tây Phù Liệt', alias: 'Sứ quân Năm Việc Một Lúc',
    taunt: 'Năm ticket. Một người. Một ngày.',
    q: 'Năm việc độc lập cần xong trong hôm nay?',
    opts: ['Một phiên làm cả năm việc', 'Chạy song song nhiều phiên trên git worktree, mỗi phiên một việc', 'Tăng ca tới sáng'],
    ok: 1, bad: { 0: 'Năm việc giẫm chân nhau trong cùng một thư mục. Loạn.', 2: 'Sáng ra xong hai việc và một quầng thâm.' },
    tip: '<b>Worktree</b> giữ các phiên song song không giẫm file của nhau. Việc của người cầm quân là review.' },
  { id: 'thu-tiep', name: 'Nguyễn Thủ Tiệp', land: 'Tiên Du', alias: 'Sứ quân Context Phình To',
    taunt: 'Một phiên chat kéo dài từ đầu sprint. Sương mù đã phủ kín đầu AI.',
    q: 'Phiên làm việc dài, AI bắt đầu lú lẫn. Chiêu nào?',
    opts: ['GÕ IN HOA CHO NÓ TỈNH', 'Dán lại toàn bộ yêu cầu từ đầu', '/clear giữa các việc, giao phần tìm hiểu cho subagent'],
    ok: 2, bad: { 0: 'NÓ KHÔNG TỈNH. NÓ CHỈ THẤY NGƯƠI ĐANG GIẬN.', 1: 'Context phình thêm. Sứ quân mạnh thêm.' },
    tip: 'Context sạch là đòn bẩy lớn nhất: <b>/clear</b>, <b>/compact</b>, và <b>subagent</b> làm việc trong context riêng.' },
  { id: 'la-duong', name: 'Lã Đường', land: 'Tế Giang', alias: 'Sứ quân Ticket Jira',
    taunt: 'Yêu cầu trong Jira, thiết kế trong Figma, dữ liệu trong DB. Copy-paste tới bao giờ?',
    q: 'Thông tin nằm ngoài repo. Chiêu nào?',
    opts: ['Kết nối MCP để Claude tự đọc ticket, thiết kế, dữ liệu', 'Chụp màn hình từng trang', 'Đọc to cho Claude nghe'],
    ok: 0, bad: { 1: 'Ảnh thứ 37 bị mờ. Đúng trang quan trọng nhất.', 2: 'Hàng xóm đã thuộc spec. Claude thì chưa.' },
    tip: '<b>MCP</b> nối Claude với công cụ ngoài repo: Jira, cơ sở dữ liệu, Figma, tài liệu nội bộ.' },
  { id: 'bach-ho', name: 'Phạm Bạch Hổ', land: 'Đằng Châu', alias: 'Sứ quân PR Nghìn Dòng',
    taunt: 'PR ba nghìn dòng. Ai review nổi thì cứ review.',
    q: 'AI viết nhanh hơn người review kịp đọc. Chiêu nào?',
    opts: ['Chia nhỏ việc, mỗi bước một commit xanh test', 'Gõ “LGTM” rồi approve', 'Bắt AI viết chậm lại'],
    ok: 0, bad: { 1: 'Production đã ghi nhận lời khen. Và cả bug.', 2: 'Vấn đề không nằm ở tốc độ viết.' },
    tip: 'Khi viết code gần như miễn phí, <b>sự chú ý của người review</b> là nút thắt. Thiết kế việc để dễ review.' },
  { id: 'kieu-thuan', name: 'Kiều Thuận', land: 'Hồi Hồ', alias: 'Sứ quân rm -rf',
    taunt: 'Một lệnh thôi, cả thành sụp đổ.',
    q: 'Sợ agent chạy lệnh nguy hiểm. Chiêu nào?',
    opts: ['Tin tưởng tuyệt đối, cấp mọi quyền', 'Rút dây mạng mỗi lần chạy', 'Đặt luật quyền hạn và hook chặn lệnh nguy hiểm'],
    ok: 2, bad: { 0: 'Can đảm. Nhưng không khôn ngoan.', 1: 'An toàn tuyệt đối. Năng suất cũng bằng không.' },
    tip: '<b>Permission mode</b>, luật deny, sandbox và hook: agent chỉ làm được những gì được cho phép.' },
  { id: 'tran-lam', name: 'Trần Lãm', land: 'Bố Hải Khẩu', alias: 'Sứ quân Senior Reviewer', ally: true,
    taunt: 'Không cần giao chiến. Một bên có kinh nghiệm, một bên có cờ lau: hợp lại mới mạnh.',
    note: 'Sử chép: Trần Lãm nhận Đinh Bộ Lĩnh làm con nuôi và trao lại binh quyền.',
    q: 'Gặp vị tiền bối giàu kinh nghiệm. Nên làm gì?',
    opts: ['Thay ông bằng AI cho nhanh', 'Kết đồng minh: AI viết, người giàu kinh nghiệm review', 'Né ông ra mà đi'],
    ok: 1, bad: { 0: 'Sai lầm lớn nhất của cả chiến dịch.', 2: 'Rồi ai bắt mấy lỗi logic tinh vi?' },
    tip: 'Claude không thay người giỏi. <b>Claude cho người giỏi thêm quân.</b>' }
];
const POS = [[1,1],[1,2],[1,3],[1,4],[2,4],[3,4],[4,4],[4,3],[4,2],[4,1],[3,1],[2,1]];
const QUICK_WINS = 2;
const PRESENTER = (() => { try { return new URLSearchParams(location.search).has('presenter'); } catch { return false; } })();

/* ---------- state ---------- */
const fresh = () => ({ scene: 'title', prev: 'title', mode: 'quick', done: {}, wrongs: {}, cur: null, wrong: [], resolved: false,
  startedAt: 0, finishedAt: 0, runId: '', submitted: null, muted: false });
let state = fresh();
let timers = [];
let poll = null;
const $main = document.getElementById('main');
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const wins = () => Object.keys(state.done).length;
const points = () => totalPoints(state.wrongs);
const timeSec = () => Math.round(((state.finishedAt || Date.now()) - state.startedAt) / 1000);
const newRunId = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2, 10));

/* ---------- the reed flag: stem, nodes, blade leaves, and a silky panicle blown downwind ---------- */
function rng(seed) { return () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const REED = (() => {
  const r = rng(968), f = n => n.toFixed(1);
  const top = { x: 112, y: 92 };
  // Stem: slightly bent culm with nodes.
  const stem = `M98 438 C 101 360, 95 270, 104 190 S 110 120, ${top.x} ${top.y}`;
  const nodes = [[99, 392], [99, 318], [101, 246], [106, 172]];
  // Leaves: long, narrow blades from each node, arching then drooping at the tip.
  const leaf = (x, y, dir, len, lift) => {
    const tx = x + dir * len, ty = y - lift + len * 0.32;
    const c1x = x + dir * len * 0.35, c1y = y - lift * 1.35;
    return `M${f(x)} ${f(y)} Q${f(c1x)} ${f(c1y - 3)} ${f(tx)} ${f(ty)} Q${f(c1x + dir * 4)} ${f(c1y + 5)} ${f(x)} ${f(y + 7)}Z`;
  };
  const leaves = [leaf(99, 392, -1, 86, 34), leaf(99, 318, 1, 92, 40), leaf(101, 246, -1, 80, 44), leaf(106, 172, 1, 70, 38)];
  // Panicle: a long, loose plume. The rachis arcs up then droops downwind; side branches carry long silky hairs.
  const P = t => { const S = top, C = { x: 178, y: 30 }, E = { x: 252, y: 160 }; const u = 1 - t;
    return { x: u * u * S.x + 2 * u * t * C.x + t * t * E.x, y: u * u * S.y + 2 * u * t * C.y + t * t * E.y }; };
  const rachis = `M${top.x} ${top.y} Q178 30 252 160`;
  let branches = '', hairs = '', hairs2 = '';
  const N = 34;
  for (let i = 0; i < N; i++) {
    const t = 0.03 + (i / (N - 1)) * 0.95, p = P(t), q = P(Math.min(t + 0.01, 1));
    const base = Math.atan2(q.y - p.y, q.x - p.x);
    for (const side of [-1, 1]) {
      const len = (18 + 38 * Math.sin(Math.PI * Math.min(0.15 + t, 1))) * (0.7 + r() * 0.55);
      const ang = base + side * (0.22 + r() * 0.38) + 0.42; // trails downwind, sags with gravity
      const ex = p.x + Math.cos(ang) * len, ey = p.y + Math.sin(ang) * len + len * 0.22;
      const cx = p.x + Math.cos(ang) * len * 0.55, cy = p.y + Math.sin(ang) * len * 0.45;
      branches += `M${f(p.x)} ${f(p.y)} Q${f(cx)} ${f(cy)} ${f(ex)} ${f(ey)}`;
      const H = 11;
      for (let k = 1; k <= H; k++) {
        const s = k / H, hx = p.x + (ex - p.x) * s, hy = p.y + (ey - p.y) * s;
        for (const hs of [-1, 1]) {
          const ha = ang + hs * (0.3 + r() * 0.55) + 0.3, hl = 6 + r() * 9 * (1 - s * 0.35);
          const bend = hs * (1.5 + r() * 2);
          const seg = `M${f(hx)} ${f(hy)} q${f(Math.cos(ha) * hl * 0.5 - Math.sin(ha) * bend)} ${f(Math.sin(ha) * hl * 0.5 + Math.cos(ha) * bend)} ${f(Math.cos(ha) * hl)} ${f(Math.sin(ha) * hl)}`;
          if (r() < 0.3) hairs2 += seg; else hairs += seg;
        }
      }
    }
  }
  return `<path d="${stem}" fill="none" stroke="#b39260" stroke-width="5" stroke-linecap="round"/>
    <path d="${stem}" fill="none" stroke="#d8bf8c" stroke-width="1.4" stroke-linecap="round" opacity=".6" transform="translate(-1.2 0)"/>
    ${nodes.map(([x, y]) => `<rect x="${x - 4}" y="${y - 2}" width="8" height="4" rx="2" fill="#8a6c3f"/>`).join('')}
    <g>${leaves.map((d, i) => `<path d="${d}" fill="${i % 2 ? '#8e8f55' : '#767a45'}" stroke="#5f6337" stroke-width=".6"/>`).join('')}</g>
    <g class="plume">
      <path d="${rachis}" fill="none" stroke="#c9b18c" stroke-width="2.2" stroke-linecap="round"/>
      <path d="${branches}" fill="none" stroke="#d3bf9f" stroke-width=".9" stroke-linecap="round" opacity=".85"/>
      <path class="hair" d="${hairs}" fill="none" stroke="#f5efe4" stroke-width=".8" stroke-linecap="round" opacity=".5"/>
      <path class="hair" d="${hairs2}" fill="none" stroke="#dcc6b2" stroke-width=".8" stroke-linecap="round" opacity=".45"/>
    </g>`;
})();
const reed = (cls = '') => `<svg class="reed ${cls}" viewBox="0 0 310 440" aria-hidden="true">${REED}</svg>`;

/* ---------- the royal seal on the decree: an original carved seal reading CLAU / DE (Cờ Lau Đi → Claude) ---------- */
const SEAL = `<svg viewBox="0 0 160 160" role="img" aria-label="Ấn triện CLAUDE">
  <defs>
    <filter id="seal-ink" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency=".75" numOctaves="2" seed="968" result="grain"/>
      <feDisplacementMap in="SourceGraphic" in2="grain" scale="1.8" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </defs>
  <g filter="url(#seal-ink)">
    <rect x="8" y="8" width="144" height="144" rx="8" fill="#b3311d"/>
    <rect x="17" y="17" width="126" height="126" rx="4" fill="none" stroke="#efe3c7" stroke-width="5"/>
    <line x1="27" y1="80" x2="133" y2="80" stroke="#efe3c7" stroke-width="2.5"/>
    <text x="80" y="66" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-weight="700" font-size="39" letter-spacing="1" fill="#efe3c7">CLAU</text>
    <text x="80" y="126" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-weight="700" font-size="46" letter-spacing="8" fill="#efe3c7">DE</text>
    <circle cx="36" cy="40" r="1.6" fill="#b3311d"/><circle cx="121" cy="112" r="1.3" fill="#b3311d"/><circle cx="104" cy="35" r="1.1" fill="#b3311d"/>
  </g>
</svg>`;

/* ---------- sound ---------- */
let ac = null;
function audio() { if (state.muted) return null; try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); return ac; } catch { return null; } }
function tone(from, to, dur, type, vol, delay = 0) {
  const c = audio(); if (!c) return;
  const t = c.currentTime + delay, o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.setValueAtTime(from, t); o.frequency.exponentialRampToValueAtTime(to, t + dur);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g).connect(c.destination); o.start(t); o.stop(t + dur + 0.05);
}
const sfx = {
  drum(d = 0) { tone(140, 48, 0.35, 'sine', 0.9, d); },
  roll() { [0, .22, .5].forEach(d => sfx.drum(d)); },
  bad() { tone(110, 70, 0.25, 'sawtooth', 0.12); },
  gong() { [196, 293, 415, 587].forEach((fq, i) => tone(fq, fq * 0.98, 3.4, 'sine', 0.26 / (i + 1))); }
};

/* ---------- leaderboard client ----------
   The mode is decided once, at load: 'server' when /api/leaderboard exists (even if it is briefly failing),
   'local' only when there is no API at all (the claude.ai preview, or the file opened directly).
   A server-mode page never falls back to local storage, so a network blip can never fake a saved score. */
const LOCAL_KEY = 'colaudi.board.v1';
const lb = {
  mode: 'unknown', codeRequired: false, closed: false, last: { top: [], total: 0 }, stale: false, ready: null,
  readLocal() { try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]'); } catch { return []; } },
  writeLocal(list) { try { localStorage.setItem(LOCAL_KEY, JSON.stringify(list)); } catch { /* storage blocked */ } },
  sortLocal(list) { return list.sort((a, b) => b.points - a.points || a.timeSec - b.timeSec); },
  localBoard() { const list = this.sortLocal(this.readLocal()); return { top: list.slice(0, 10).map((e, i) => ({ rank: i + 1, ...e })), total: list.length }; },
  probe() {
    return this.ready ??= (async () => {
      try {
        const r = await fetch('/api/leaderboard', { cache: 'no-store' });
        const isJson = (r.headers.get('content-type') || '').includes('json');
        if (r.status === 404 || !isJson) { this.mode = 'local'; return; }
        this.mode = 'server';
        if (r.ok) this.absorb(await r.json());
      } catch { this.mode = 'server'; this.stale = true; } // unreachable for now: retry later, never fake it
    })();
  },
  absorb(j) { this.last = j; this.codeRequired = !!j.codeRequired; this.closed = !!j.closed; this.stale = false; },
  async fetch() {
    await this.probe();
    if (this.mode === 'local') return this.localBoard();
    try {
      const r = await fetch('/api/leaderboard', { cache: 'no-store' });
      if (!r.ok) throw new Error(String(r.status));
      this.absorb(await r.json());
    } catch { this.stale = true; }
    return this.last;
  },
  async start(runId) {
    await this.probe();
    if (this.mode !== 'server') return;
    for (let i = 0; i < 3; i++) {
      try {
        const r = await fetch('/api/leaderboard', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'start', runId }) });
        if (r.ok) return;
      } catch { /* retry */ }
      await new Promise(res => setTimeout(res, 1500 * (i + 1)));
    }
  },
  async submit(entry) {
    await this.probe();
    if (this.mode === 'local') {
      const list = this.readLocal().filter(e => e.id !== entry.runId);
      list.push({ id: entry.runId, name: entry.name.trim().slice(0, 20), points: entry.points, timeSec: entry.timeSec });
      this.sortLocal(list); this.writeLocal(list);
      return { rank: list.findIndex(e => e.id === entry.runId) + 1, total: list.length, name: entry.name.trim().slice(0, 20), timeSec: entry.timeSec };
    }
    let r;
    try {
      r = await fetch('/api/leaderboard', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(entry) });
    } catch { throw new Error('Không kết nối được máy chủ. Kiểm tra mạng rồi bấm Ghi danh lần nữa.'); }
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || 'Chưa ghi danh được. Bấm Ghi danh lần nữa.');
    return j;
  }
};
function boardRows(data, meId) {
  if (!data.top.length) return '<div class="empty">Bảng vàng còn trống. Người đầu tiên ghi danh sẽ đứng đầu.</div>';
  return data.top.map(e => `<div class="r ${e.id && e.id === meId ? 'me' : ''}"><span class="rk">${e.rank}</span><span class="nm">${esc(e.name)}</span><span class="pt">${e.points} điểm</span><span class="tm">${formatTime(e.timeSec)}</span></div>`).join('');
}
function startPolling(render) {
  stopPolling();
  const tick = async () => { const d = await lb.fetch(); render(d); };
  tick(); poll = setInterval(tick, 3000);
}
function stopPolling() { if (poll) clearInterval(poll); poll = null; }

/* ---------- navigation ---------- */
function clearTimers() { timers.forEach(clearTimeout); timers = []; }
function go(scene, extra = {}) {
  clearTimers(); stopPolling();
  if (scene === 'board' && state.scene !== 'board') state.prev = state.scene;
  Object.assign(state, extra, { scene });
  render(); $main.scrollTop = 0;
}
function header() {
  document.getElementById('pips').innerHTML = LORDS.map(l => `<span class="pip ${state.done[l.id] || ''}" title="${esc(l.name)}"></span>`).join('');
  const sb = document.getElementById('scorebox');
  const fought = Object.keys(state.wrongs).length;
  sb.innerHTML = fought ? `Điểm <b>${points()}</b> / ${state.mode === 'full' ? MAX_POINTS : fought * 3}` : '';
}

/* ---------- scenes ---------- */
const scenes = {
  title: () => `<section class="scene title">
      ${reed()}
      <div class="stack">
        <div class="eyebrow">Hoa Lư · thế kỷ X</div>
        <h1>“Cờ Lau” đi</h1>
        <p class="sub">Dẹp loạn mười hai sứ quân, phiên bản dân phần mềm.</p>
        <div class="row">
          <button class="btn" data-primary data-act="start-quick">Tập trận nhanh · 2 trận</button>
          <button class="btn alt" data-act="start-full">Đánh đủ 12 trận · ghi danh bảng vàng</button>
        </div>
        ${PRESENTER ? '' : '<p class="keys"><kbd>A</kbd> <kbd>B</kbd> <kbd>C</kbd> chọn chiêu · <kbd>Enter</kbd> tiếp tục · <kbd>Esc</kbd> về bản đồ</p>'}
        <p class="keys" ${PRESENTER ? '' : 'hidden'}><kbd>A</kbd> <kbd>B</kbd> <kbd>C</kbd> chọn chiêu · <kbd>Enter</kbd> tiếp tục · <kbd>Esc</kbd> về bản đồ · <kbd>L</kbd> bảng vàng · <kbd>S</kbd> tới đoạn kết · <kbd>M</kbd> tắt tiếng</p>
      </div>
    </section>`,

  intro: () => `<section class="scene story">
      <div class="eyebrow">Hoa Lư · thế kỷ X</div>
      <h2>Cậu bé chăn trâu và lá cờ lau</h2>
      <p>Bên sông Hoàng Long, cậu bé Đinh Bộ Lĩnh chăn trâu cùng lũ trẻ trong làng. Không có cờ, cậu bẻ bông lau làm cờ, bày trận đánh nhau như thật.</p>
      <p>Mỗi lần xuất quân, cả bọn hô vang:</p>
      <div class="cry">“Cờ Lau” đi!</div>
      <p>Lớn lên, đất nước rơi vào loạn mười hai sứ quân. Mỗi sứ quân giữ một vùng. Kỳ lạ thay, sứ quân nào cũng mang đúng một nỗi khổ của nghề phần mềm.</p>
      ${state.mode === 'full' ? '<p class="keys">Đánh đủ 12 trận: đúng ngay lần đầu được 3 điểm, sai một lần được 1 điểm, sai hai lần được 0 điểm. Bằng điểm thì ai nhanh hơn xếp trên.</p>' : ''}
      <div class="row"><button class="btn" data-primary data-act="map">Xuất quân</button></div>
    </section>`,

  map() {
    const quick = state.mode === 'quick', n = wins();
    const next = quick ? (n >= QUICK_WINS ? ['surrender', 'Tiếp tục'] : null) : (n >= BATTLES ? ['tally', 'Ghi danh bảng vàng'] : null);
    const tiles = LORDS.map((l, i) => {
      const st = state.done[l.id];
      const stamp = st === 'won' ? 'Đã dẹp' : st === 'ally' ? 'Kết minh' : '';
      return `<button class="tile ${st || ''}" style="grid-row:${POS[i][0]};grid-column:${POS[i][1]}" data-act="fight" data-id="${l.id}" ${st ? 'disabled' : ''}>
        ${stamp ? `<span class="stamp">${stamp}</span>` : ''}
        <span class="nm">${l.name}</span><span class="ld">${l.land}</span><span class="al">${l.alias}</span></button>`;
    }).join('');
    return `<section class="scene"><div class="map">${tiles}
      <div class="capital">${reed()}
        <div class="stack">
          <div class="eyebrow">Đại bản doanh</div>
          <h2>Hoa Lư</h2>
          <div class="count"><b>${n}</b> / 12 sứ quân đã thu phục</div>
          <p class="keys">${quick ? `Tập trận nhanh: thắng ${QUICK_WINS} trận, các sứ quân còn lại sẽ xin quy hàng.` : 'Đánh đủ 12 trận để ghi danh bảng vàng.'}</p>
          ${next ? `<div class="row"><button class="btn" data-primary data-act="${next[0]}">${next[1]}</button></div>` : ''}
        </div>
      </div></div></section>`;
  },

  battle() {
    const l = LORDS.find(x => x.id === state.cur);
    const opts = l.opts.map((t, i) => {
      const cls = state.wrong.includes(i) ? 'bad' : (state.resolved && i === l.ok ? 'good' : '');
      return `<button class="opt ${cls}" data-act="pick" data-i="${i}" ${state.resolved || state.wrong.includes(i) ? 'disabled' : ''}><span class="ltr">${'ABC'[i]}</span><span>${t}</span></button>`;
    }).join('');
    const lastBad = state.wrong.length ? l.bad[state.wrong.at(-1)] : '';
    const n = wins();
    const next = state.mode === 'full'
      ? (n >= BATTLES ? ['tally', 'Ghi danh bảng vàng'] : ['map', 'Về bản đồ'])
      : (n >= QUICK_WINS ? ['surrender', 'Tiếp tục'] : ['map', 'Về bản đồ']);
    const earned = state.resolved ? pointsFor(state.wrongs[l.id]) : 0;
    return `<section class="scene battle">
      <div class="foe">
        <div class="eyebrow">Sứ quân · ${l.land}</div>
        <h2>${l.name}</h2>
        <div class="alias">${l.alias}</div>
        <blockquote>“${l.taunt}”</blockquote>
        ${l.note ? `<p class="note">${l.note}</p>` : ''}
        <div class="row"><button class="ghost" data-act="map">← Bản đồ</button></div>
      </div>
      <div class="fight">
        <div class="eyebrow">Thử thách</div>
        <div class="q">${l.q}</div>
        ${opts}
        ${state.resolved ? `<div class="result ${l.ally ? 'ally' : ''}">
            <div class="head"><span>${l.ally ? 'Kết minh!' : 'Đã dẹp ' + l.name + '!'}</span><span class="pts">+${earned} điểm</span></div>
            <p class="tip">Chiêu Claude: ${l.tip}</p>
            <div class="row"><button class="btn" data-primary data-act="${next[0]}">${next[1]}</button></div>
          </div>`
          : `<div class="react" aria-live="polite">${lastBad}</div>
             <div class="vote"><span id="vote-msg">Khán giả bỏ phiếu trong chat: A, B hay C?</span><div class="track"><div class="fill"></div></div></div>`}
      </div>
    </section>`;
  },

  surrender() {
    const tiles = LORDS.map(l => {
      const st = state.done[l.id] || 'pending';
      return `<div class="tile ${st}" data-id="${l.id}"><span class="nm">${l.name}</span><span class="ld">${l.land}</span></div>`;
    }).join('');
    return `<section class="scene surrender">
      <div class="eyebrow">Năm 967</div>
      <h2>Nghe tiếng hô “Cờ Lau” đi, các sứ quân còn lại lần lượt xin quy phục</h2>
      <div class="mini">${tiles}</div>
      <div class="row"><button class="btn" data-primary data-act="crown">Lên ngôi</button></div>
    </section>`;
  },

  tally() {
    const counts = [0, 0, 0];
    Object.values(state.wrongs).forEach(w => counts[Math.min(w, 2)]++);
    const done = state.submitted;
    return `<section class="scene tally">
      <div class="card">
        <div class="eyebrow">Mười hai sứ quân đã quy phục</div>
        <div class="big">${points()}<small> / ${MAX_POINTS} điểm</small></div>
        <div class="breakdown"><span>Đúng ngay: <b>${counts[0]}</b> trận</span><span>Sai một lần: <b>${counts[1]}</b></span><span>Sai hai lần: <b>${counts[2]}</b></span><span>Thời gian: <b>${formatTime(done?.timeSec ?? timeSec())}</b></span></div>
        ${done ? `<p class="msg ok">Đã ghi danh <b>${esc(done.name)}</b>: hạng ${done.rank} trên ${done.total} người.</p>` : lb.closed ? '<p class="msg">Bảng vàng đã khoá sổ. Cảm ơn đã tham gia tập trận!</p>' : `
        <form id="sign" class="card" style="padding:0;border:0;background:none" novalidate>
          <div class="field"><label for="pname">Tên ghi trên bảng vàng (tối đa 20 ký tự)</label><input id="pname" name="pname" maxlength="20" autocomplete="nickname" required></div>
          <div class="field" id="codeField" ${lb.codeRequired ? '' : 'hidden'}><label for="pcode">Mã sự kiện (chiếu trong buổi họp)</label><input id="pcode" name="pcode" autocomplete="off"></div>
          <p class="msg" id="signMsg" aria-live="polite"></p>
          <div class="row"><button class="btn" type="submit" id="signBtn">Ghi danh</button></div>
        </form>`}
        ${lb.mode === 'local' ? '<p class="local">Đang chạy bản xem thử: bảng vàng chỉ lưu trên trình duyệt này. Khi deploy lên Vercel, bảng vàng là chung cho mọi người.</p>' : ''}
        <div class="row"><button class="btn ${done ? '' : 'alt'}" ${done ? 'data-primary' : ''} data-act="crown">Lên ngôi</button></div>
      </div>
      <div class="card">
        <div class="row" style="justify-content:space-between"><h3 style="font-size:2em;color:var(--gold)">Bảng vàng</h3><span class="live" id="liveTotal">Đang tải…</span></div>
        <div class="board" id="board"></div>
      </div>
    </section>`;
  },

  board: () => `<section class="scene wall">
      <div class="head">
        <div class="eyebrow">Đại Cồ Việt · khoa tập trận</div>
        <h2>Bảng vàng</h2>
        <span class="live" id="liveTotal">Đang tải…</span>
        <p class="keys">Mười người dẫn đầu. Nhiều điểm hơn xếp trên; bằng điểm thì ai nhanh hơn xếp trên.</p>
        ${lb.mode === 'local' ? '<p class="local">Bản xem thử: chỉ hiện kết quả trên trình duyệt này.</p>' : ''}
        <div class="row"><button class="btn alt" data-act="back">Quay lại</button></div>
      </div>
      <div class="board" id="board"></div>
    </section>`,

  crown: () => `<section class="scene crown" id="crown">
      <div class="rays" aria-hidden="true"></div>
      <div class="regalia" data-at="0">
        ${reed('l')}${reed('r')}
        <div class="seal">
          <div class="stamp"><span lang="zh-Hant">大瞿越</span></div>
          <div class="cap">Đại Cồ Việt</div>
        </div>
      </div>
      <div class="edict">
        <div class="eyebrow" data-at="0">Năm Mậu Thìn · 968 · Kinh đô Hoa Lư</div>
        <p class="lead" data-at="1">Mười hai sứ quân quy phục. Giang sơn thu về một mối. Tại Hoa Lư, Đinh Bộ Lĩnh lên ngôi.</p>
        <div data-at="2"><div class="han" lang="zh-Hant">大勝明皇帝</div><h2>Đại Thắng Minh Hoàng Đế</h2></div>
        <div class="claim" data-at="3">Không xưng <s>Vương</s>. Xưng <em>Hoàng Đế</em>.</div>
        <p class="why" data-at="4">Lần đầu tiên người đứng đầu nước Việt xưng <b>Hoàng đế</b>, đặt nước mình ngang hàng phương Bắc. Nhà Tống chỉ phong tước vương, nhưng trong cõi Nam, các triều đại về sau đều nối theo.</p>
        <div class="tablets" data-at="5">
          <div class="tablet"><span>Quốc hiệu</span><b>Đại Cồ Việt</b></div>
          <div class="tablet"><span>Kinh đô</span><b>Hoa Lư</b></div>
          <div class="tablet"><span>Niên hiệu</span><b>Thái Bình</b></div>
          <div class="tablet"><span>Triều đình</span><b>Văn, võ ban</b></div>
        </div>
        <div class="verse" data-at="6"><q>Một phen cất quân mà mười hai sứ quân phục hết</q><span>Sử gia Lê Văn Hưu bàn về Đinh Tiên Hoàng · Đại Việt sử ký</span></div>
        <div class="row legacy-row" data-at="7"><div class="legacy">Lưu danh thiên cổ.</div><button class="btn" data-primary data-act="finale">Ngàn năm sau…</button></div>
      </div>
      <p class="hint" data-at="1"><kbd>Enter</kbd> sang nhịp kế</p>
    </section>`,

  finale: () => `<section class="scene fin" id="fin">
      <div class="ago" data-at="0">Trải hơn một nghìn năm…</div>
      <div class="morph">
        <span data-at="1" data-until="1">“Cờ Lau” đi</span>
        <span class="mid" data-at="2" data-until="2">C<i>ờ</i> · lau · <i>Đi</i> → de</span>
        <span class="claude" data-at="3">Claude</span>
      </div>
      <p class="born" data-at="3">Năm 2023, Claude ra đời.</p>
      <article class="decree" data-at="4">
        <header><span>Hoa Lư truyền hịch</span><h3>Hịch Cờ Lau</h3></header>
        <p>Từng nghe: thuở Hoa Lư, trẻ chăn trâu bẻ lau làm cờ mà dựng nên nghiệp đế. Quân chẳng cốt ở đông, cốt ở luyện tập trước khi ra trận.</p>
        <p>Nay mười hai sứ quân lại nổi: code rối như tơ vò, lỗi ẩn như bóng ma, hạn chót dồn như thác lũ. Bao bữa quên ăn, bao đêm thức trắng, chỉ mong sớm dẹp yên bờ cõi.</p>
        <p class="address" data-at="5">Hỡi tướng sỹ!</p>
        <p data-at="5">Chúng ta chớ lấy việc gõ tay từng dòng làm siêng năng, chớ lấy việc vá lỗi qua loa làm công trạng, chớ vì quen lối cũ mà ngại binh pháp mới. Giặc đã tới ải, lẽ nào khoanh tay mà nhìn?</p>
        <p data-at="5">Nay lá cờ lau mới đã trong tay. Cùng nhau luyện binh pháp: hỏi cho tường, lập kế rồi hãy đánh, thử cho chắc rồi mới tin. Được vậy thì giặc nào cũng dẹp, ải nào cũng qua.</p>
        <footer data-at="5"><span>Bố cáo khắp nơi, ai nấy đều hay.</span><div class="royal-seal" data-at="6">${SEAL}</div></footer>
      </article>
      <div class="call" data-at="6">
        <span class="kicker">Cờ đã phất. Tướng sỹ, xuất trận!</span>
        <span class="cta">Cùng “Cờ Lau”,<br>chúng ta tiến!</span>
      </div>
      <div class="row" data-at="6"><button class="btn alt" data-act="board">Xem bảng vàng</button><button class="btn alt" data-act="title">Chơi lại</button><span class="made">Trò chơi này được làm cùng Claude.</span></div>
    </section>`
};

/* ---------- staged reveals (coronation, finale) ---------- */
let step = -1, stepMax = 0, stepRoot = null;
function setStep(n) {
  step = n;
  stepRoot.querySelectorAll('[data-at]').forEach(el => {
    const at = +el.dataset.at, until = el.dataset.until == null ? Infinity : +el.dataset.until;
    el.classList.toggle('on', n >= at && n <= until);
  });
  if (state.scene === 'crown') { if (n === 3) sfx.gong(); else if (n > 0) sfx.drum(); }
  if (state.scene === 'finale') { if (n === 3) sfx.gong(); else if (n === 6) { sfx.drum(); sfx.gong(); } else if (n >= 4) sfx.drum(); }
}
function stage(root, max, gap) {
  stepRoot = root; stepMax = max; step = -1; advance(gap);
}
function advance(gap = state.scene === 'crown' ? 2600 : 2400) {
  clearTimers();
  const next = step + 1;
  if (next > stepMax) return false;
  setStep(next);
  for (let s = next + 1; s <= stepMax; s++) timers.push(setTimeout(() => setStep(s), (s - next) * gap));
  return true;
}

/* ---------- render ---------- */
function render() {
  header();
  $main.innerHTML = scenes[state.scene]();
  if (state.scene === 'battle' && !state.resolved) {
    timers.push(setTimeout(() => { const m = document.getElementById('vote-msg'); if (m) m.textContent = 'Hết giờ bỏ phiếu. Chốt đáp án!'; }, 20000));
  }
  if (state.scene === 'surrender') {
    [...$main.querySelectorAll('.tile.pending')].forEach((t, i) => timers.push(setTimeout(() => {
      t.classList.remove('pending'); t.classList.add('won', 'fall'); state.done[t.dataset.id] = 'won'; header(); if (i % 3 === 0) sfx.drum();
    }, 450 + i * 380)));
  }
  if (state.scene === 'crown') { sfx.roll(); stage(document.getElementById('crown'), 7); }
  if (state.scene === 'finale') stage(document.getElementById('fin'), 6);
  if (state.scene === 'tally' || state.scene === 'board') {
    startPolling(d => {
      const b = document.getElementById('board'), t = document.getElementById('liveTotal');
      if (b) b.innerHTML = boardRows(d, state.runId);
      if (t) t.textContent = lb.stale ? 'Mất kết nối, đang thử lại…' : `${lb.mode === 'local' ? 'Trên máy này' : 'Cập nhật trực tiếp'} · ${d.total} người đã ghi danh`;
      const cf = document.getElementById('codeField'); if (cf) cf.hidden = !lb.codeRequired;
    });
  }
  if (state.scene === 'tally' && !state.submitted) wireSignForm();
}

function wireSignForm() {
  const form = document.getElementById('sign'); if (!form) return;
  const name = document.getElementById('pname'), code = document.getElementById('pcode'), msg = document.getElementById('signMsg'), btn = document.getElementById('signBtn');
  try { name.value = localStorage.getItem('colaudi.name') || ''; code.value = new URLSearchParams(location.search).get('code') || localStorage.getItem('colaudi.code') || ''; } catch { /* storage blocked */ }
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!name.value.trim()) { msg.className = 'msg err'; msg.textContent = 'Hãy nhập tên để ghi danh.'; name.focus(); return; }
    btn.disabled = true; msg.className = 'msg'; msg.textContent = 'Đang ghi danh…';
    try {
      const res = await lb.submit({ name: name.value, points: points(), timeSec: timeSec(), runId: state.runId, code: code.value });
      try { localStorage.setItem('colaudi.name', name.value.trim()); localStorage.setItem('colaudi.code', code.value.trim()); } catch { /* storage blocked */ }
      state.submitted = res; sfx.roll(); render();
    } catch (err) {
      msg.className = 'msg err'; msg.textContent = err.message; btn.disabled = false;
    }
  });
}

function pick(i) {
  const l = LORDS.find(x => x.id === state.cur);
  if (state.resolved || state.wrong.includes(i)) return;
  if (i === l.ok) {
    state.resolved = true; state.done[l.id] = l.ally ? 'ally' : 'won'; state.wrongs[l.id] = state.wrong.length;
    if (state.mode === 'full' && wins() >= BATTLES) state.finishedAt = Date.now();
    clearTimers(); render(); shout();
  } else {
    state.wrong.push(i); sfx.bad(); render();
  }
}
function shout() {
  sfx.roll();
  const fx = document.createElement('div');
  fx.className = 'cryfx';
  fx.innerHTML = reed() + '<div class="word">“Cờ Lau” đi!</div>';
  document.body.appendChild(fx);
  setTimeout(() => fx.remove(), 1600);
}

/* ---------- input ---------- */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  const a = b.dataset.act;
  if (a === 'start-quick' || a === 'start-full') {
    sfx.drum();
    go('intro', { ...fresh(), muted: state.muted, mode: a === 'start-quick' ? 'quick' : 'full', startedAt: Date.now(), runId: newRunId() });
    if (state.mode === 'full') lb.start(state.runId);
  }
  else if (a === 'map') go('map');
  else if (a === 'fight') { sfx.drum(); go('battle', { cur: b.dataset.id, wrong: [], resolved: false }); }
  else if (a === 'pick') pick(+b.dataset.i);
  else if (a === 'back') go(state.prev && state.prev !== 'board' ? state.prev : 'title');
  else if (['surrender', 'tally', 'crown', 'finale', 'title', 'board'].includes(a)) go(a);
});
document.getElementById('home').onclick = e => { e.currentTarget.blur(); go('title'); };
document.getElementById('boardBtn').onclick = e => { e.currentTarget.blur(); go('board'); };
const sndBtn = document.getElementById('snd');
const syncSnd = () => { sndBtn.textContent = 'Âm thanh: ' + (state.muted ? 'tắt' : 'bật'); };
sndBtn.onclick = () => { sndBtn.blur(); state.muted = !state.muted; syncSnd(); };

document.addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.target.matches('input')) return;
  const k = e.key.toLowerCase();
  if (state.scene === 'battle' && !state.resolved && ['a', 'b', 'c', '1', '2', '3'].includes(k)) { pick('abc123'.indexOf(k) % 3); return; }
  if (k === 'enter' || k === ' ' || k === 'arrowright') {
    if (document.activeElement?.matches('button') && k !== 'arrowright') return;
    e.preventDefault();
    if ((state.scene === 'crown' || state.scene === 'finale') && advance()) return;
    $main.querySelector('[data-primary]')?.click();
  } else if (k === 'escape') {
    if (state.scene === 'board') go(state.prev || 'title');
    else if (['battle', 'surrender', 'tally'].includes(state.scene)) go('map');
  } else if (k === 'l') { if (state.scene !== 'board') go('board'); }
  else if (k === 's') { if (state.mode !== 'full' && ['title', 'intro', 'map', 'battle'].includes(state.scene)) go(state.mode === 'full' && wins() >= BATTLES ? 'tally' : wins() >= BATTLES ? 'crown' : 'surrender'); }
  else if (k === 'm') { state.muted = !state.muted; syncSnd(); }
});

/* ---------- boot ---------- */
function start(data) {
  if (data && data.scene) state = Object.assign(fresh(), data);
  syncSnd(); lb.probe().finally(() => { if (state.scene === 'tally') render(); }); render();
}
window.claude?.hot?.snapshot?.(() => ({ ...state, scene: ['crown', 'finale'].includes(state.scene) ? 'map' : state.scene }));
window.claude?.hot?.ready ? window.claude.hot.ready(start) : start(window.claude?.hot?.data ?? {});
