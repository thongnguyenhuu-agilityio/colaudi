// Cờ Lau Đi — game logic. Plain ES module, no framework, no build step.
import { pointsFor, totalPoints, formatTime, MAX_POINTS, BATTLES } from './score.js';

/* ---------- content ---------- */
const LORDS = [
  { id: 'xuong-xi', name: 'Ngô Xương Xí', land: 'Bình Kiều', alias: 'Sứ quân Codebase Sương Mù',
    taunt: 'Ba trăm file, không một dòng tài liệu. Kẻ nào dám bước vào?',
    q: 'Ngày đầu nhận một dự án lạ hoắc. Chiêu nào?',
    opts: ['Thức trắng đọc hết 300 file', 'Nhờ Claude đọc và giải thích kiến trúc, chưa sửa gì vội', 'Ngồi chờ senior rảnh'],
    ok: 1, bad: { 0: 'Rạng sáng mới đọc tới file thứ 12. Sứ quân cười khẩy.', 2: 'Senior hẹn sang quý sau. Giặc nào chờ được?' },
    tip: 'Bước <b>Explore</b>: cho Claude đọc code và giải thích trước, chưa cho sửa gì.' },
  { id: 'canh-thac', name: 'Đỗ Cảnh Thạc', land: 'Đỗ Động Giang', alias: 'Sứ quân Bug Ma',
    taunt: 'Khi hiện khi ẩn. Trên máy tại hạ, chạy ngon lành!',
    q: 'Bug chập chờn, đoán mãi không ra. Chiêu nào?',
    opts: ['Rắc console.log khắp nơi', 'Restart server rồi cầu trời', 'Bắt Claude viết test tái hiện bug trước, rồi mới sửa'],
    ok: 2, bad: { 0: 'Log còn dài hơn code. Bug vẫn chơi trốn tìm.', 1: 'Trời nghe. Nhưng canh tư thì trời cũng ngủ.' },
    tip: 'Cho agent một cách <b>tự kiểm chứng</b>: test đỏ trước, xanh sau. Có test thì mới dám giao việc.' },
  { id: 'cong-han', name: 'Kiều Công Hãn', land: 'Phong Châu', alias: 'Sứ quân Tính Năng Khổng Lồ',
    taunt: 'Một ticket, mười hai màn hình, hạn chót thứ Sáu. Ai gánh nổi?',
    q: 'Tính năng to như núi. Mở đầu thế nào?',
    opts: ['Bật Plan mode, duyệt kế hoạch rồi mới cho code', 'Prompt một câu: “làm hết đi”', 'Code luôn, sai đâu sửa đó'],
    ok: 0, bad: { 1: 'Claude làm hết thật. Diff bốn nghìn dòng, review xong tóc đã bạc.', 2: 'Vá chỗ này, vỡ chỗ kia. Vòng lặp chẳng có hồi kết.' },
    tip: '<b>Plan mode</b> (Shift+Tab): Claude chỉ đọc và đề xuất. Duyệt kế hoạch trước, rồi mới động vào code.' },
  { id: 'nguyen-khoan', name: 'Nguyễn Khoan', land: 'Tam Đái', alias: 'Sứ quân Quên Quy Ước',
    taunt: 'Dặn dùng pnpm, hắn lại npm. Dặn tab, hắn lại space. Nào chịu nghe!',
    q: 'AI cứ quên quy ước của team. Chiêu nào?',
    opts: ['Nhắc lại trong mọi prompt', 'Đập bàn, đổi tool', 'Ghi quy ước vào CLAUDE.md'],
    ok: 2, bad: { 0: 'Ba tuần sau đã thuộc lòng prompt. AI vẫn quên.', 1: 'Tool mới cũng quên. Còn cái bàn thì gãy.' },
    tip: '<b>CLAUDE.md</b>: luật luôn bật, tự nạp vào mọi phiên làm việc. Viết ngắn, viết đúng.' },
  { id: 'nhat-khanh', name: 'Ngô Nhật Khánh', land: 'Đường Lâm', alias: 'Sứ quân Format Lộn Xộn',
    taunt: 'Dấu chấm phẩy khi có khi không. Thiên hạ biết làm sao?',
    q: 'Muốn code lúc nào cũng được format, không ngoại lệ?',
    opts: ['Hook tự chạy formatter sau mỗi lần sửa file', 'Năn nỉ Claude nhớ format', 'Review tay từng dấu cách'],
    ok: 0, bad: { 1: 'Claude hứa. Mười lần nhớ chín. Sứ quân sống nhờ lần thứ mười.', 2: 'Mắt đã nhòe trước khi PR kịp merge.' },
    tip: 'Việc <b>phải luôn xảy ra</b> thì giao cho <b>hook</b>: script chạy chắc chắn, không phụ thuộc trí nhớ của model.' },
  { id: 'ly-khue', name: 'Lý Khuê', land: 'Siêu Loại', alias: 'Sứ quân Checklist Deploy',
    taunt: 'Mười bảy bước deploy, tuần nào cũng làm, lần nào cũng quên bước thứ chín.',
    q: 'Quy trình lặp lại hằng tuần. Xử thế nào?',
    opts: ['Copy prompt dài từ Notes mỗi lần', 'Đóng gói thành Skill, gọi bằng /deploy', 'Giao cho thực tập sinh'],
    ok: 1, bad: { 0: 'Notes có mười bốn bản. Bản nào mới nhất? Không ai hay.', 2: 'Thực tập sinh mãn kỳ. Bước thứ chín lại bị quên.' },
    tip: '<b>Skill</b>: quy trình và kiến thức đóng gói sẵn, chỉ nạp khi cần, gọi bằng <b>/tên</b>, chia sẻ cho cả team.' },
  { id: 'nguyen-sieu', name: 'Nguyễn Siêu', land: 'Tây Phù Liệt', alias: 'Sứ quân Năm Việc Một Lúc',
    taunt: 'Năm ticket. Một người. Một ngày. Há có thể?',
    q: 'Năm việc độc lập cần xong trong hôm nay?',
    opts: ['Một phiên làm cả năm việc', 'Chạy song song nhiều phiên trên git worktree, mỗi phiên một việc', 'Tăng ca tới sáng'],
    ok: 1, bad: { 0: 'Năm việc giẫm chân nhau trong một thư mục. Đại loạn.', 2: 'Rạng sáng xong hai việc, thêm một quầng thâm.' },
    tip: '<b>Worktree</b> giữ các phiên song song không giẫm file của nhau. Việc của người cầm quân là review.' },
  { id: 'thu-tiep', name: 'Nguyễn Thủ Tiệp', land: 'Tiên Du', alias: 'Sứ quân Context Phình To',
    taunt: 'Một phiên chat kéo dài từ đầu sprint. Sương mù đã phủ kín đầu AI.',
    q: 'Phiên làm việc dài, AI bắt đầu lú lẫn. Chiêu nào?',
    opts: ['GÕ IN HOA CHO NÓ TỈNH', 'Dán lại toàn bộ yêu cầu từ đầu', '/clear giữa các việc, giao phần tìm hiểu cho subagent'],
    ok: 2, bad: { 0: 'NÓ KHÔNG TỈNH. NÓ CHỈ BIẾT CÓ NGƯỜI ĐANG GIẬN.', 1: 'Context phình thêm. Sứ quân mạnh thêm.' },
    tip: 'Context sạch là đòn bẩy lớn nhất: <b>/clear</b>, <b>/compact</b>, và <b>subagent</b> làm việc trong context riêng.' },
  { id: 'la-duong', name: 'Lã Đường', land: 'Tế Giang', alias: 'Sứ quân Ticket Jira',
    taunt: 'Yêu cầu ở Jira, thiết kế ở Figma, dữ liệu ở DB. Copy-paste đến bao giờ cho cùng?',
    q: 'Thông tin nằm ngoài repo. Chiêu nào?',
    opts: ['Kết nối MCP để Claude tự đọc ticket, thiết kế, dữ liệu', 'Chụp màn hình từng trang', 'Đọc to cho Claude nghe'],
    ok: 0, bad: { 1: 'Ảnh thứ ba mươi bảy bị mờ, đúng trang hệ trọng nhất.', 2: 'Hàng xóm đã thuộc spec. Claude thì chưa.' },
    tip: '<b>MCP</b> nối Claude với công cụ ngoài repo: Jira, cơ sở dữ liệu, Figma, tài liệu nội bộ.' },
  { id: 'bach-ho', name: 'Phạm Bạch Hổ', land: 'Đằng Châu', alias: 'Sứ quân PR Nghìn Dòng',
    taunt: 'PR ba nghìn dòng. Ai review nổi, cứ đến đây!',
    q: 'AI viết nhanh hơn người review kịp đọc. Chiêu nào?',
    opts: ['Chia nhỏ việc, mỗi bước một commit xanh test', 'Gõ “LGTM” rồi approve', 'Bắt AI viết chậm lại'],
    ok: 0, bad: { 1: 'Production đã nhận lời khen. Nhận luôn cả bug.', 2: 'Gốc rễ chẳng nằm ở tốc độ viết.' },
    tip: 'Khi viết code gần như miễn phí, <b>sự chú ý của người review</b> là nút thắt. Thiết kế việc để dễ review.' },
  { id: 'kieu-thuan', name: 'Kiều Thuận', land: 'Hồi Hồ', alias: 'Sứ quân rm -rf',
    taunt: 'Chỉ một lệnh, cả thành sụp đổ.',
    q: 'Sợ agent chạy lệnh nguy hiểm. Chiêu nào?',
    opts: ['Tin tưởng tuyệt đối, cấp mọi quyền', 'Rút dây mạng mỗi lần chạy', 'Đặt luật quyền hạn và hook chặn lệnh nguy hiểm'],
    ok: 2, bad: { 0: 'Có dũng mà thiếu mưu.', 1: 'An toàn tuyệt đối. Năng suất cũng bằng không.' },
    tip: '<b>Permission mode</b>, luật deny, sandbox và hook: agent chỉ làm được những gì được cho phép.' },
  { id: 'tran-lam', name: 'Trần Lãm', land: 'Bố Hải Khẩu', alias: 'Sứ quân Senior Reviewer', ally: true,
    taunt: 'Chẳng cần giao chiến. Một bên giàu kinh nghiệm, một bên có cờ lau: hợp lại ắt mạnh.',
    note: 'Sử chép: Trần Lãm nhận Đinh Bộ Lĩnh làm con nuôi và trao lại binh quyền.',
    q: 'Gặp vị tiền bối giàu kinh nghiệm. Nên làm gì?',
    opts: ['Thay ông bằng AI cho nhanh', 'Kết đồng minh: AI viết, người giàu kinh nghiệm review', 'Né ông ra mà đi'],
    ok: 1, bad: { 0: 'Đại sai lầm của cả chiến dịch.', 2: 'Rồi ai bắt nổi những lỗi logic tinh vi?' },
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

/* ---------- the reed flag: an upright stem, nodes, blade leaves, and a silky panicle standing like a banner in the wind ---------- */
function rng(seed) { return () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const REED = (() => {
  const r = rng(968), f = n => n.toFixed(1);
  const top = { x: 110, y: 168 };
  // Stem: a straight, upright culm with nodes (a very slight lean downwind).
  const stem = `M98 438 C 100 370, 101 300, 104 240 S 108 190, ${top.x} ${top.y}`;
  const nodes = [[99, 396], [100, 336], [102, 276], [106, 214]];
  const leaf = (x, y, dir, len, lift) => {
    const tx = x + dir * len, ty = y - lift + len * 0.32;
    const c1x = x + dir * len * 0.35, c1y = y - lift * 1.35;
    return `M${f(x)} ${f(y)} Q${f(c1x)} ${f(c1y - 3)} ${f(tx)} ${f(ty)} Q${f(c1x + dir * 4)} ${f(c1y + 5)} ${f(x)} ${f(y + 7)}Z`;
  };
  const leaves = [leaf(99, 396, -1, 84, 30), leaf(100, 336, 1, 88, 40), leaf(102, 276, -1, 76, 44), leaf(106, 214, 1, 66, 40)];
  // Panicle: stands up like a banner on its pole; the rachis rises and only its tip leans downwind,
  // the side branches point up and stream to the right, widest low, tapering to a tip.
  const C = { x: 118, y: 80 }, E = { x: 160, y: 10 };
  const P = t => { const S = top, u = 1 - t;
    return { x: u * u * S.x + 2 * u * t * C.x + t * t * E.x, y: u * u * S.y + 2 * u * t * C.y + t * t * E.y }; };
  const rachis = `M${top.x} ${top.y} Q${C.x} ${C.y} ${E.x} ${E.y}`;
  let branches = '', hairs = '', hairs2 = '';
  const N = 34;
  for (let i = 0; i < N; i++) {
    const t = 0.02 + (i / (N - 1)) * 0.96, p = P(t), q = P(Math.min(t + 0.01, 1));
    const base = Math.atan2(q.y - p.y, q.x - p.x);
    for (const side of [-1, 1]) {
      const len = (13 + 50 * Math.sin(Math.PI * (0.16 + 0.8 * t))) * (0.75 + r() * 0.45);
      const ang = base + side * (0.28 + r() * 0.34) + 0.5; // up and downwind
      const ex = p.x + Math.cos(ang) * len, ey = p.y + Math.sin(ang) * len + len * 0.05;
      const cx = p.x + Math.cos(ang) * len * 0.5, cy = p.y + Math.sin(ang) * len * 0.5 - 2;
      branches += `M${f(p.x)} ${f(p.y)} Q${f(cx)} ${f(cy)} ${f(ex)} ${f(ey)}`;
      const H = 11;
      for (let k = 1; k <= H; k++) {
        const s = k / H, hx = p.x + (ex - p.x) * s, hy = p.y + (ey - p.y) * s;
        for (const hs of [-1, 1]) {
          const ha = ang + hs * (0.25 + r() * 0.5) + 0.25, hl = 6 + r() * 9 * (1 - s * 0.35);
          const bend = hs * (1.5 + r() * 2);
          const seg = `M${f(hx)} ${f(hy)} q${f(Math.cos(ha) * hl * 0.5 - Math.sin(ha) * bend)} ${f(Math.sin(ha) * hl * 0.5 + Math.cos(ha) * bend)} ${f(Math.cos(ha) * hl)} ${f(Math.sin(ha) * hl)}`;
          if (r() < 0.3) hairs2 += seg; else hairs += seg;
        }
      }
    }
  }
  return `<g class="stand">
    <path d="${stem}" fill="none" stroke="#b39260" stroke-width="5" stroke-linecap="round"/>
    <path d="${stem}" fill="none" stroke="#d8bf8c" stroke-width="1.4" stroke-linecap="round" opacity=".6" transform="translate(-1.2 0)"/>
    ${nodes.map(([x, y]) => `<rect x="${x - 4}" y="${y - 2}" width="8" height="4" rx="2" fill="#8a6c3f"/>`).join('')}
    <g>${leaves.map((d, i) => `<path class="leaf" d="${d}" fill="${i % 2 ? '#8e8f55' : '#767a45'}" stroke="#5f6337" stroke-width=".6"/>`).join('')}</g>
    <g class="plume">
      <path d="${rachis}" fill="none" stroke="#c9b18c" stroke-width="2.2" stroke-linecap="round"/>
      <path d="${branches}" fill="none" stroke="#d3bf9f" stroke-width=".9" stroke-linecap="round" opacity=".85"/>
      <path class="hair" d="${hairs}" fill="none" stroke="#f5efe4" stroke-width=".8" stroke-linecap="round" opacity=".5"/>
      <path class="hair" d="${hairs2}" fill="none" stroke="#dcc6b2" stroke-width=".8" stroke-linecap="round" opacity=".45"/>
    </g></g>`;
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

/* ---------- sound ----------
   Recorded CC0 samples (public/sound/*.mp3, provenance in public/sound/LICENSES.md) played as short, self-contained
   phrases: the engine never runs a beat grid, because the crown and finale steps are setTimeout-driven and Enter skips
   them. Drum hits go through an "ensemble" (3 or 4 layers, micro-timing, tiny pitch offsets, one low layer) and a
   hall reverb. The Web Audio synth below (osc/noise/syn) is the fallback when a sample fails to load, and adds a quiet
   mid-range "skin" under the big strokes, because the recorded drums keep ~90% of their energy under 300 Hz and laptop
   speakers lose it.
   Lifecycle: every scene owns one gain node. go() calls sfx.scene(), which fades that node over 150 ms and stops its
   sources, so nothing from the previous scene rings on. Inside crown/finale each step owns a "step group" that is
   faded when the next step starts (Enter-skipping), but the gong lives in its own group: one gong voice at a time,
   a new gong fades the old one. A mute, a hidden tab or a scene change all go through the same fade.
   The clipper is a WaveShaper, not a DynamicsCompressor: Chrome's compressor ducks the first ~50 ms of a new context,
   which swallowed the drum on the start button. Sound code never throws: every entry point is wrapped. */
const MASTER = PRESENTER ? 0.82 : 0.574; // players hear the cues at 70% of the presenter level
const AHEAD = 0.01; // a little lookahead so a hit's attack is never cut by the render quantum
const WET = 0.9; // hall reverb return; per-voice sends decide how much of each sound goes in
const MUTE_KEY = 'colaudi.muted';
const SAMPLE_FILES = ['taiko_manh', 'taiko_vua', 'taiko_nhe', 'taiko_don', 'chieng', 'chieng_nguoc', 'tu_va'];
let ac = null, bus = null, scene = null, rnd = Math.random;
const buf = {}; // decoded samples by file name
let sampleState = 'idle'; // idle | loading | ok | failed
function seeded(seed) { // mulberry32: the offline measurement renders are repeatable
  let a = seed >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
const SOFT = (() => { // linear up to the knee, then bends smoothly towards 1
  const knee = 0.7, soft = new Float32Array(2048);
  for (let i = 0; i < soft.length; i++) {
    const x = i / 1023.5 - 1, a = Math.abs(x);
    soft[i] = a <= knee ? x : Math.sign(x) * (knee + (1 - knee) * Math.tanh((a - knee) / (1 - knee)));
  }
  return soft;
})();
// Hall impulse: 30 ms pre-delay, ~5 s, the tail is progressively lowpassed so it darkens as it dies.
function hallIR(c) {
  const rate = c.sampleRate, len = Math.round(rate * 5.2), pre = Math.round(rate * 0.03), r = seeded(7);
  const ir = c.createBuffer(2, len, rate);
  for (let ch = 0; ch < 2; ch++) {
    const d = ir.getChannelData(ch); let y = 0;
    for (let i = pre; i < len; i++) {
      const t = (i - pre) / rate, x = r() * 2 - 1;
      const fc = 6000 * Math.pow(0.1, Math.min(1, t / 3.5)); // 6 kHz at the start, 600 Hz by 3.5 s
      y += (1 - Math.exp(-2 * Math.PI * fc / rate)) * (x - y);
      d[i] = y * Math.exp(-t / 0.66) * (1 - Math.exp(-t / 0.02)); // ~4.5 s to -60 dB, soft onset
    }
  }
  return ir;
}
// One bus per context: master gain -> soft clipper -> output. Scenes plug into master (see sc()).
function makeBus(c, o = {}) {
  const master = c.createGain(), clip = c.createWaveShaper(), rate = c.sampleRate;
  master.gain.value = o.master ?? MASTER;
  clip.curve = o.clip === false ? null : SOFT; // null = pass-through, for the pre-clip measurement
  master.connect(clip).connect(c.destination);
  const noise = c.createBuffer(1, rate, rate), nd = noise.getChannelData(0);
  for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
  const curve = new Float32Array(1024);
  for (let i = 0; i < curve.length; i++) curve[i] = Math.tanh(3 * (i / 511.5 - 1));
  return { master, ir: hallIR(c), noise, curve };
}
function ensureCtx() {
  if (!ac) { ac = new (window.AudioContext || window.webkitAudioContext)(); bus = makeBus(ac); }
  return ac;
}
// The context to play on right now, or null: muted, tab hidden, or no Web Audio.
function audio() {
  if (state.muted || document.hidden) return null;
  try {
    const c = ensureCtx();
    if (c.state === 'suspended') c.resume().catch(() => {});
    return c;
  } catch { return null; }
}
function syncMute() {
  try { if (bus) bus.master.gain.setTargetAtTime(state.muted || document.hidden ? 0 : MASTER, ac.currentTime, 0.03); } catch { /* never throw */ }
}

/* scene -> groups -> sources. A scene has one gain node; a group is a gain node whose sources can be faded together. */
function sc() {
  if (!scene) { const g = ac.createGain(); g.connect(bus.master); scene = { g, groups: new Set(), step: null, gong: null, verb: null }; }
  return scene;
}
function mkGroup(s) {
  const g = ac.createGain(); g.connect(s.g);
  const o = { g, srcs: new Set(), dead: false, s }; s.groups.add(o); return o;
}
const grp = (s = sc()) => (s.step && !s.step.dead ? s.step : (s.step = mkGroup(s)));
function verbOf(s) { // one convolver per scene, so a scene change also silences its reverb tail
  if (!s.verb) {
    const v = ac.createConvolver(), w = ac.createGain();
    v.buffer = bus.ir; w.gain.value = WET; v.connect(w).connect(s.g); s.verb = v;
  }
  return s.verb;
}
function track(o, src) {
  o.srcs.add(src);
  src.onended = () => { // onended, not addEventListener: old webkit nodes are not EventTargets
    o.srcs.delete(src); try { src.disconnect(); } catch { /* gone */ }
    if (o.dead && !o.srcs.size) { try { o.g.disconnect(); } catch { /* gone */ } o.s.groups.delete(o); }
  };
}
// Fade a group out from `at` (default now) over `sec`, then stop its sources.
function fade(o, sec, at) {
  if (!o) return;
  const t = Math.max(at ?? 0, ac.currentTime);
  if (o.dead && t >= o.fadeAt) return; // already fading, and no later than this; an earlier fade (scene change) still wins
  o.dead = true; o.fadeAt = t;
  o.g.gain.cancelScheduledValues(t); o.g.gain.setTargetAtTime(0, t, sec / 6);
  o.srcs.forEach(src => { try { src.stop(t + sec + 0.03); } catch { /* not started */ } });
  if (!o.srcs.size) { try { o.g.disconnect(); } catch { /* gone */ } o.s.groups.delete(o); }
}
function killScene() {
  const s = scene; scene = null;
  if (!s || !ac) return;
  const t = ac.currentTime;
  s.g.gain.cancelScheduledValues(t); s.g.gain.setTargetAtTime(0, t, 0.025);
  [...s.groups].forEach(g => fade(g, 0.15));
  setTimeout(() => { try { s.g.disconnect(); } catch { /* gone */ } }, 700);
}

/* Sample player. o: gain, rate, dt (s), pan, send (reverb), lp (lowpass Hz), off/dur (slice, buffer seconds),
   cut (fade the slice end), cap [from, to] (ramp to silence between those playback seconds), grp. */
function play(name, t, o = {}) {
  const c = ac, b = buf[name]; if (!b) return;
  const s = sc(), gp = o.grp || grp(s), rate = o.rate || 1, off = o.off || 0, g = o.gain ?? 1;
  const src = c.createBufferSource(), env = c.createGain();
  src.buffer = b; src.playbackRate.value = rate;
  const t0 = t + (o.dt || 0), len = Math.min(o.dur ?? b.duration, b.duration - off) / rate;
  env.gain.setValueAtTime(g, t0);
  if (o.cut) { const f = Math.min(0.08, len / 2); env.gain.setValueAtTime(g, t0 + len - f); env.gain.linearRampToValueAtTime(0, t0 + len); }
  if (o.cap) { env.gain.setValueAtTime(g, t0 + o.cap[0]); env.gain.linearRampToValueAtTime(0, t0 + o.cap[1]); }
  let node = src;
  if (o.lp) { const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = o.lp; node.connect(f); node = f; }
  if (o.pan && c.createStereoPanner) { const p = c.createStereoPanner(); p.pan.value = o.pan; node.connect(p); node = p; }
  node.connect(env); env.connect(gp.g);
  if (o.send) { const sg = c.createGain(); sg.gain.value = o.send; env.connect(sg).connect(verbOf(s)); }
  src.start(t0, off); src.stop(t0 + (o.cap ? Math.min(len, o.cap[1]) : len) + 0.05);
  track(gp, src);
}
// Ensemble: 3 or 4 layers, +-10..30 ms micro-timing, +-1..3% pitch, one low layer (rate 0.75, lowpassed).
// Big strokes also get a quiet synth skin for the mid band.
const ENS = 0.42;
function ens(name, t, g, o = {}) {
  const send = o.send ?? 0.35, r = o.rate || 1, p = { off: o.off, dur: o.dur, cut: o.cut }, k = g * ENS;
  const j = () => (0.01 + rnd() * 0.02) * (rnd() < 0.5 ? -1 : 1);
  play(name, t, { ...p, gain: k, send, rate: r });
  play(name, t, { ...p, gain: k * 0.75, send, pan: -0.45, rate: r * (1 + j()), dt: 0.01 + rnd() * 0.02 });
  play(name, t, { ...p, gain: k * 0.75, send, pan: 0.45, rate: r * (1 + j()), dt: 0.01 + rnd() * 0.02 });
  if (!o.light) play(name, t, { ...p, gain: k * 0.8, send: send + 0.1, rate: r * 0.75, dt: rnd() * 0.01, lp: 3000 });
  if (!o.light && o.body !== false) syn.skin(t, g * 0.4 * (r < 1 ? r : 1));
}
// Gong: one voice at a time. The raw strike plus a quiet half-speed layer; the ring is capped at ~10.5 s (+ reverb).
function gong(t, g, o = {}) {
  const s = sc();
  if (s.gong) fade(s.gong, 0.35, t);
  const gp = s.gong = mkGroup(s), cap = o.cap || [7.5, 10.5];
  for (const r of o.rates || [1]) play('chieng', t, { grp: gp, gain: g * 0.8, rate: r, send: 0.6, cap });
  if (o.sub !== false) play('chieng', t, { grp: gp, gain: g * 0.25, rate: 0.5, lp: 500, dt: 0.004, send: 0.4, dur: 6, cap });
}
// Horn (conch): two detuned layers. dur cuts it short.
function horn(t, g, o = {}) {
  const cut = o.dur != null, d = o.dur;
  play('tu_va', t, { gain: g * 0.5, send: 0.5, rate: Math.pow(2, -12 / 1200), pan: -0.35, dur: d, cut });
  play('tu_va', t, { gain: g * 0.5, send: 0.5, rate: Math.pow(2, 12 / 1200), pan: 0.35, dt: 0.012, dur: d, cut });
}
// A roll: [delay, level] pairs of single hits, alternating the two softer slices.
function roll(t, hits, base, o = {}) {
  hits.forEach(([d, v], i) => ens(i % 2 ? 'taiko_nhe' : 'taiko_vua', t + d, base * v, { light: true, send: 0.3, ...o }));
}
const ROLL = [[.2, .55], [.38, .7], [.53, .6], [.66, .8], [.77, .65], [.86, .85], [.94, .75], [1.01, .9]];

/* The synth: used when a sample failed, and for the skin/stick/sub/pulse layers. All times are absolute. */
const syn = {
  voice(src, t, peak, attack, decay, send = 0.2, out = src) {
    const c = ac, s = sc(), gp = grp(s), g = c.createGain();
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
    out.connect(g).connect(gp.g);
    if (send) { const sg = c.createGain(); sg.gain.value = send * 0.45; g.connect(sg).connect(verbOf(s)); }
    src.start(t); src.stop(t + attack + decay + 0.05);
    track(gp, src);
  },
  osc(type, from, to, t, glide) {
    const o = ac.createOscillator(); o.type = type;
    o.frequency.setValueAtTime(from, t); o.frequency.exponentialRampToValueAtTime(to, t + glide);
    return o;
  },
  noise(t, freq, q, peak, decay, send) {
    const n = ac.createBufferSource(), f = ac.createBiquadFilter();
    n.buffer = bus.noise; f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = q;
    n.connect(f); syn.voice(n, t, peak, 0.002, decay, send, f);
  },
  tone(from, to, dur, type, vol, t) { syn.voice(syn.osc(type, from, to, t, dur), t, vol, 0.005, dur, 0); },
  // Mid-range skin: saturated triangle + stick slap, without the low body.
  skin(t, v) {
    const p = 1 + (rnd() - 0.5) * 0.06, skin = ac.createWaveShaper(), so = syn.osc('triangle', 260 * p, 118 * p, t, 0.09);
    skin.curve = bus.curve; so.connect(skin);
    syn.voice(so, t, 0.6 * v, 0.003, 0.22, 0.3, skin);
    syn.noise(t, 1900, 0.9, 0.6 * v, 0.05, 0.15);
  },
  // Trống trận: low body + saturated skin + stick slap. v is the accent (1 = normal hit).
  drum(t, v = 1) {
    const p = 1 + (rnd() - 0.5) * 0.06;
    syn.voice(syn.osc('sine', 165 * p, 52, t, 0.22), t, 0.9 * v, 0.004, 0.5 + 0.2 * v, 0.25);
    syn.skin(t, v);
  },
  // An accelerating war-drum figure that lands on one big accented stroke (~1.3 s, under the battle-cry overlay).
  roll(t) {
    [[0, .7], [.2, .55], [.38, .75], [.53, .6], [.66, .8], [.77, .65], [.86, .85], [.94, .75], [1.01, .9]]
      .forEach(([d, v]) => syn.drum(t + d, v));
    syn.drum(t + 1.2, 1.35); syn.drum(t + 1.21, 0.9);
  },
  bad(t) { syn.tone(110, 70, 0.25, 'sawtooth', 0.12, t); },
  // Chiêng: a low drum under an inharmonic, beating gong body; high partials die first.
  gong(t) {
    const f = 128;
    syn.drum(t, 1.1);
    [[1, 0.34, 6], [1.012, 0.24, 5.5], [1.98, 0.2, 4.2], [2.01, 0.12, 4], [2.76, 0.13, 3], [3.95, 0.09, 2.2],
     [5.43, 0.06, 1.6], [6.9, 0.04, 1.1], [8.6, 0.03, 0.8]]
      .forEach(([r, a, dec]) => syn.voice(syn.osc('sine', f * r * 1.015, f * r, t, 0.4), t, a, 0.006, dec, 0.55));
    syn.noise(t, 950, 1.2, 0.3, 0.09, 0.4);
  },
  stick(t, v) { // a dry stick tick for the vote countdown
    syn.noise(t, 2600, 1.2, 1.4 * v, 0.05, 0.1);
    syn.voice(syn.osc('triangle', 480, 220, t, 0.04), t, 0.7 * v, 0.002, 0.07, 0.05);
  },
  sub(t, f0, f1, dur, v) { syn.voice(syn.osc('sine', f0, f1, t, dur), t, v, 0.01, dur, 0.1); },
  pulse(t, v) { for (let i = 0; i < 3; i++) syn.noise(t + i * 0.2, 500 + i * 450, 2.5, 0.35 * v, 0.16, 0.2); }
};

/* Cue sheet (docs/09 §4). Sample versions first, then the synth fallback with the same names.
   Gains are the measured mix: see docs/09 §6. */
const BIG = 'taiko_manh', MID = 'taiko_vua', DON = 'taiko_don';
const CUES = {
  // Horn call, then three big-drum strikes.
  start(t) { horn(t, 0.9, { dur: 2.4 }); [[1.5, .8], [2.2, .9], [2.9, 1]].forEach(([d, v]) => ens(BIG, t + d, v)); },
  // Short horn, then a war-drum fill (~1 s) that lands on a big stroke.
  fight(t) { horn(t, 0.8, { dur: 1.0 }); ens(DON, t + 0.55, 0.9, { light: true, dur: 1.45, cut: true }); },
  // Vote countdown, last 5 s: five sticks speeding up and getting louder. Presenter only.
  tick(t) { [[0, .3], [1.5, .4], [2.8, .55], [3.8, .7], [4.5, .9]].forEach(([d, v]) => syn.stick(t + d, v)); },
  // "Hết giờ": one gong, then silence until the pick. Presenter only.
  timeup(t) { gong(t, 0.8); },
  // Ensemble hit, the accelerating roll, a huge stroke and a gong that rings out.
  correct(t) { ens(BIG, t, 0.9); roll(t, ROLL, 0.85); ens(BIG, t + 1.2, 1); gong(t + 1.2, 0.9); },
  // Muffled low drum and a short, dissonant gong.
  wrong(t) {
    play(MID, t, { gain: 0.5, rate: 0.6, lp: 500, send: 0.3 });
    gong(t + 0.05, 0.45, { rates: [1, 1.06], sub: false, cap: [0.4, 1.8] });
  },
  // Surrender cascade: one hit per tile, rising in pitch and level.
  tile(t, i, n) {
    const p = n > 1 ? i / (n - 1) : 1;
    play(MID, t, { gain: 0.3 + 0.45 * p, rate: 0.8 + 0.5 * p, send: 0.25 });
    syn.skin(t, 0.15 + 0.2 * p);
  },
  end(t) { ens(BIG, t + 0.1, 0.9); gong(t + 0.1, 1); },
  submitted(t) { gong(t, 0.9); roll(t, [[.1, .5], [.25, .6], [.38, .7], [.5, .8]], 0.85); },
  crown(t, n) {
    if (n === 0) [[0, .85], [.85, .95], [1.7, 1]].forEach(([d, v]) => ens(BIG, t + d, v)); // three slow ceremonial strokes
    else if (n === 2) { ens(BIG, t, 1); ens(MID, t, 0.45, { rate: 0.8, body: false }); horn(t, 0.7, { dur: 5 }); gong(t, 0.8); } // tutti
    else if (n === 3) { gong(t, 0.8); gong(t + 0.55, 0.85, { rates: [0.94], sub: false }); gong(t + 1.1, 1, { rates: [0.88] }); } // three gongs, staggered
    else if (n === 7) ens(BIG, t, 1); // closing stroke
  },
  finale(t, n) {
    if (n === 0) play('chieng_nguoc', t, { gain: 0.9, send: 0.4 }); // time rewinding
    else if (n === 1) ens(BIG, t, 0.9);
    else if (n === 2) { ens(BIG, t, 1, { rate: 0.8 }); syn.sub(t, 80, 45, 1.2, 0.4); syn.pulse(t + 0.1, 0.8); } // ancient turns modern
    else if (n === 3) { ens(BIG, t, 1); syn.sub(t, 85, 40, 1.8, 0.5); gong(t, 0.9); } // hybrid impact
    else if (n === 5) ens(DON, t, 0.95); // war-drum call to arms
    else if (n === 6) { ens(BIG, t, 1); ens(MID, t, 0.45, { rate: 0.8, body: false }); horn(t, 0.5, { dur: 3 }); syn.sub(t, 85, 40, 1.8, 0.3); gong(t, 0.85); } // seal: stamp, tutti, gong
  }
};
const SYN_CUES = {
  start: t => syn.drum(t), fight: t => syn.drum(t),
  tick: CUES.tick, timeup: t => syn.gong(t),
  correct: t => syn.roll(t), wrong: t => syn.bad(t),
  tile: (t, i) => { if (i % 3 === 0) syn.drum(t); }, end: t => syn.gong(t), submitted: t => syn.roll(t),
  crown: (t, n) => { if (n === 0) syn.roll(t); else if (n === 3) syn.gong(t); else if (n === 2 || n === 7) syn.drum(t); },
  finale: (t, n) => { if (n === 3) syn.gong(t); else if (n === 6) { syn.drum(t); syn.gong(t); } else if (n === 1 || n === 2 || n === 5) syn.drum(t); }
};

async function loadSamples() {
  if (sampleState === 'loading') return;
  sampleState = 'loading';
  try {
    const c = ensureCtx(); // created suspended; the first gesture resumes it
    await Promise.all(SAMPLE_FILES.map(async n => {
      if (buf[n]) return;
      const r = await fetch('sound/' + n + '.mp3', { signal: AbortSignal.timeout ? AbortSignal.timeout(20000) : undefined });
      if (!r.ok) throw new Error(n + ': HTTP ' + r.status);
      const ab = await r.arrayBuffer(); // callback form: old Safari's decodeAudioData returns no promise
      buf[n] = await new Promise((ok, bad) => c.decodeAudioData(ab, ok, bad));
    }));
    if (SAMPLE_FILES.some(n => !buf[n])) throw new Error('sample missing');
    sampleState = 'ok';
  } catch { sampleState = 'failed'; }
  syncSnd();
}
const sfx = {
  cue(name, a, b) {
    try {
      const c = audio(); if (!c) return;
      const t = c.currentTime + AHEAD, s = sc();
      if (name === 'crown' || name === 'finale') { fade(s.step, 0.12); s.step = null; } // Enter-skip: end the previous step's drums
      (sampleState === 'ok' ? CUES : SYN_CUES)[name]?.(t, a, b);
    } catch { /* sound must never break the game */ }
  },
  scene() { try { killScene(); } catch { /* never throw */ } },
  silence() { try { killScene(); } catch { /* never throw */ } }
};
// Tab hidden: fade out and suspend. Visible again: resume and restore the level (unless muted).
document.addEventListener('visibilitychange', () => {
  try {
    if (!ac) return;
    if (document.hidden) { killScene(); syncMute(); setTimeout(() => { if (document.hidden) ac.suspend().catch(() => {}); }, 250); }
    else { ac.resume().catch(() => {}); syncMute(); }
  } catch { /* never throw */ }
});
// The first key or click wakes the context (browsers keep it suspended until then).
const unlock = () => { try { if (ac && !state.muted && !document.hidden && ac.state !== 'running') ac.resume().catch(() => {}); } catch { /* never throw */ } };
addEventListener('pointerdown', unlock, true); addEventListener('keydown', unlock, true);
// Measurement hook for the offline renders in docs/09 §6 (only with ?soundtest).
if (PRESENTER && new URLSearchParams(location.search).has('soundtest')) {
  window.__sound = {
    ready: async () => { await loadSamples(); return sampleState; },
    // script: [[atSeconds, cueName | '@scene', a, b], ...] -> { sr, data: [L, R] } rendered through the real bus
    async render(script, seconds, { clip = true, seed = 1 } = {}) {
      const sr = 44100, off = new OfflineAudioContext(2, Math.ceil(sr * seconds), sr);
      const saved = { ac, bus, scene, rnd, muted: state.muted };
      try {
        ac = off; bus = makeBus(off, { clip }); scene = null; rnd = seeded(seed); state.muted = false;
        const run = ([, name, a, b]) => (name === '@scene' ? sfx.scene() : sfx.cue(name, a, b));
        const at = new Map(); // one suspend per render quantum, however many cues start there
        script.forEach(s => { const q = Math.round(s[0] * sr / 128) * 128 / sr; at.set(q, [...(at.get(q) || []), s]); });
        at.forEach((list, q) => { if (q <= 0) list.forEach(run); else off.suspend(q).then(() => { list.forEach(run); off.resume(); }); });
        const out = await off.startRendering();
        return { sr, data: [out.getChannelData(0).slice(), out.getChannelData(1).slice()] };
      } finally { ({ ac, bus, scene, rnd } = saved); state.muted = saved.muted; }
    }
  };
}

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
let voteT = []; // the vote bar's timers: rescheduled on every battle render so sound follows the visible bar
function clearVote() { voteT.forEach(clearTimeout); voteT = []; }
function clearTimers() { timers.forEach(clearTimeout); timers = []; clearVote(); }
function go(scene, extra = {}) {
  clearTimers(); stopPolling(); sfx.scene();
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
      <p>Thuở ấy, bên sông Hoàng Long, cậu bé Đinh Bộ Lĩnh chăn trâu cùng lũ trẻ trong làng. Không cờ xí, cậu bẻ bông lau làm cờ, bày trận như thật.</p>
      <p>Mỗi phen xuất quân, cả bọn hô vang:</p>
      <div class="cry">“Cờ Lau” đi!</div>
      <p>Đến khi trưởng thành, thiên hạ loạn mười hai sứ quân, mỗi người chiếm giữ một cõi. Lạ thay, sứ quân nào cũng mang đúng một nỗi khổ của nghề phần mềm.</p>
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
      <h2>Nghe tiếng hô “Cờ Lau” đi, các sứ quân còn lại khiếp vía, lần lượt xin quy phục</h2>
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
        <p class="lead" data-at="1">Mười hai sứ quân đều phục, giang sơn thu về một mối. Bấy giờ tại Hoa Lư, Đinh Bộ Lĩnh lên ngôi.</p>
        <div data-at="2"><div class="han" lang="zh-Hant">大勝明皇帝</div><h2>Đại Thắng Minh Hoàng Đế</h2></div>
        <div class="claim" data-at="3">Không xưng <s>Vương</s>. Xưng <em>Hoàng Đế</em>.</div>
        <p class="why" data-at="4">Lần đầu tiên người đứng đầu nước Việt xưng <b>Hoàng đế</b>, ngang hàng phương Bắc. Nhà Tống chỉ phong tước vương, song trong cõi Nam, các triều đại về sau đều noi theo.</p>
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
      <p class="born" data-at="3">Năm 2023, Claude xuất thế.</p>
      <article class="decree" data-at="4">
        <header><span>Hoa Lư truyền hịch</span><h3>Hịch Cờ Lau</h3></header>
        <p>Từng nghe: thuở Hoa Lư, trẻ chăn trâu bẻ lau làm cờ mà dựng nên nghiệp đế. Quân dẫu nhiều hay ít, thắng bại đều cốt ở chỗ luyện tập trước khi ra trận.</p>
        <p>Nay mười hai sứ quân lại nổi: code rối như tơ vò, lỗi ẩn như bóng ma, hạn chót dồn như nước lũ. Bao bữa quên ăn, bao đêm trắng mắt, lòng những mong sớm dẹp yên bờ cõi.</p>
        <p class="address" data-at="5">Hỡi tướng sỹ!</p>
        <p data-at="5">Chúng ta chớ lấy việc gõ tay từng dòng làm cần mẫn, chớ lấy việc vá lỗi qua loa làm công trạng, chớ vì quen lối cũ mà ngại binh pháp mới. Giặc đã tới ải, há khoanh tay mà nhìn?</p>
        <p data-at="5">Nay lá cờ lau mới đã trong tay. Hãy cùng luyện binh pháp: hỏi cho tường, lập kế rồi hãy đánh, thử cho chắc rồi mới tin. Được vậy, giặc nào chẳng dẹp, ải nào chẳng qua.</p>
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
  if (state.scene === 'crown' || state.scene === 'finale') sfx.cue(state.scene, n);
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
    clearVote();
    voteT.push(setTimeout(() => { const m = document.getElementById('vote-msg'); if (m) m.textContent = 'Hết giờ bỏ phiếu. Chốt đáp án!'; }, 20000));
    if (PRESENTER) { voteT.push(setTimeout(() => sfx.cue('tick'), 15000)); voteT.push(setTimeout(() => sfx.cue('timeup'), 20000)); }
  }
  if (state.scene === 'surrender') {
    const pending = [...$main.querySelectorAll('.tile.pending')];
    pending.forEach((t, i) => timers.push(setTimeout(() => {
      t.classList.remove('pending'); t.classList.add('won', 'fall'); state.done[t.dataset.id] = 'won'; header();
      sfx.cue('tile', i, pending.length); if (i === pending.length - 1) sfx.cue('end');
    }, 450 + i * 380)));
  }
  if (state.scene === 'crown') stage(document.getElementById('crown'), 7);
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
      state.submitted = res; sfx.cue('submitted'); render();
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
    state.wrong.push(i); sfx.silence(); sfx.cue('wrong'); render(); // silence: the restarted bar must not hear the old ticks
  }
}
function shout() {
  sfx.cue('correct');
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
    go('intro', { ...fresh(), muted: state.muted, mode: a === 'start-quick' ? 'quick' : 'full', startedAt: Date.now(), runId: newRunId() });
    sfx.cue('start'); // after go(): a cue fired before it would belong to the scene being left
    if (state.mode === 'full') lb.start(state.runId);
  }
  else if (a === 'map') go('map');
  else if (a === 'fight') { go('battle', { cur: b.dataset.id, wrong: [], resolved: false }); sfx.cue('fight'); }
  else if (a === 'pick') pick(+b.dataset.i);
  else if (a === 'back') go(state.prev && state.prev !== 'board' ? state.prev : 'title');
  else if (['surrender', 'tally', 'crown', 'finale', 'title', 'board'].includes(a)) go(a);
});
document.getElementById('home').onclick = e => { e.currentTarget.blur(); go('title'); };
document.getElementById('boardBtn').onclick = e => { e.currentTarget.blur(); go('board'); };
const sndBtn = document.getElementById('snd');
// Label precedence: muted wins; otherwise a failed sample load is shown, never silent (the synth plays instead).
const syncSnd = () => { sndBtn.textContent = 'Âm thanh: ' + (state.muted ? 'tắt' : sampleState === 'failed' ? 'bản tổng hợp (mẫu lỗi) · bấm để tải lại' : 'bật'); syncMute(); };
function setMuted(v) {
  state.muted = v;
  try { localStorage.setItem(MUTE_KEY, v ? '1' : '0'); } catch { /* storage blocked: the choice just is not remembered */ }
  if (v) sfx.silence();
  syncSnd();
}
// In the fallback state a click retries the load; M still toggles mute.
sndBtn.onclick = () => { sndBtn.blur(); if (!state.muted && sampleState === 'failed') loadSamples(); else setMuted(!state.muted); };

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
  else if (k === 'm') setMuted(!state.muted);
});

/* ---------- boot ---------- */
function start(data) {
  if (data && data.scene) state = Object.assign(fresh(), data);
  try { const m = localStorage.getItem(MUTE_KEY); if (m !== null) state.muted = m === '1'; } catch { /* storage blocked */ }
  syncSnd(); lb.probe().finally(() => { if (state.scene === 'tally') render(); }); render();
  // Samples: the presenter loads at once; players wait for the first leaderboard poll so the two never compete.
  if (PRESENTER) loadSamples(); else lb.probe().finally(loadSamples);
}
window.claude?.hot?.snapshot?.(() => ({ ...state, scene: ['crown', 'finale'].includes(state.scene) ? 'map' : state.scene }));
window.claude?.hot?.ready ? window.claude.hot.ready(start) : start(window.claude?.hot?.data ?? {});
