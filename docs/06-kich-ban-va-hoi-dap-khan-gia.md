# Kịch bản lời nói và hỏi đáp khán giả

| Mục | Nội dung |
| --- | --- |
| Ngày cập nhật | 14/10/2026 (bỏ chế độ nhanh) |
| Trạng thái | Bản đầu, chờ Thông duyệt (gói việc 5 trong [04 Kế hoạch](04-ke-hoach.md)) |
| Liên quan | [04 Kế hoạch](04-ke-hoach.md) · [02 Hỏi đáp](02-hoi-dap.md) Q-01, Q-14 |

Ba thông điệp được nhắc ở đầu và ở cuối buổi:

1. Claude là agent: giao cho nó mục tiêu và một cách tự kiểm tra.
2. Chất lượng đến từ ngữ cảnh: CLAUDE.md, skill, hook, subagent, MCP.
3. Khi viết code gần như không tốn chi phí, review mới là nút thắt.

## 1. Mở màn: Cờ Lau Đi (0:00–2:00, cần xếp lại)

> **⚠ Thời lượng: 12 trận trên sân khấu.** Không còn chế độ nhanh: muốn tới màn đăng cơ ở phần kết thì phải dẹp đủ 12 sứ quân. Mỗi trận khoảng 50 giây (bỏ phiếu 20 giây, đọc kết quả chat, tiếng hô, câu "Chiêu Claude"), nên 12 trận khoảng 10 phút, thêm khoảng 10 đến 11 phút so với lịch ở [04](04-ke-hoach.md) mục 3. Việc xếp lại lịch đang chờ Thông quyết; các bước dưới đây ghi cách chơi, không ghi giờ.

**Màn hình:** game ở màn đầu (cổng thành). Nhấn Enter để "Khởi binh", Enter nữa để "Xuất quân".

**Lời nói (màn giới thiệu):**

> "Trước khi nói về AI, mình kể một chuyện cổ. Cậu bé Đinh Bộ Lĩnh chăn trâu ở Hoa Lư, bẻ bông lau làm cờ, bày trận với lũ trẻ. Mỗi phen xuất quân, cả bọn hô: “Cờ Lau” đi!"
>
> "Hôm nay mình cần anh em giúp dẹp loạn mười hai sứ quân. Mỗi trận có ba chiêu A, B, C. Anh em gõ đáp án vào chat Meet, mình chốt theo số đông."

**Chơi các trận:** mở đầu bằng Kiều Công Hãn (Plan mode) và Nguyễn Khoan (CLAUDE.md), vì hai chiêu này sẽ làm thật ở phần demo; các trận còn lại theo thứ tự trên bản đồ. Đọc to kết quả chat ("đa số chọn C!"), nhấn phím, để tiếng hô vang lên. Nếu khán giả chọn sai, đọc câu đùa rồi cho bỏ phiếu lại.

**Dừng trước trận cuối.** Để game ở bản đồ với 11 sứ quân đã dẹp, chuyển sang slide; trận thứ 12 chơi ngay trước phần kết (mục 5). Nếu đã chơi đủ 12 trận ở mở màn, dừng ở bảng điểm rồi chuyển sang slide.

> "Mấy chiêu vừa rồi anh em sẽ thấy làm thật trong ít phút nữa. Câu hỏi là: anh em đang dùng AI để gõ code giùm, hay đã giao cho nó cả một trận đánh?"

**Ghi chú:** nếu chat im, co-host gõ đáp án đầu tiên để mở màn. Phòng B bỏ phiếu ở chat riêng; người vận hành đọc giúp.

## 2. Slide 1–9 (2:00–11:00)

| Slide | Lời nói chính |
| --- | --- |
| 1 | "“Cờ Lau” là tiếng lóng của mình để gọi Claude: anh em đọc nhanh thử xem, Cờ… Lau… Claude. Còn chữ “đi” là lời rủ: dùng nó đi!" |
| 2 | "Có ba mức dùng AI: gợi ý dòng kế tiếp, chat để xin một đoạn code, và agent nhận cả một việc. Lợi ích lớn nằm ở mức thứ ba." |
| 3 | "Agent làm theo vòng lặp: tìm hiểu, lên kế hoạch, làm, kiểm tra, sai thì làm lại. Nếu không cho nó cách tự kiểm tra (test, build, linter), thì chưa giao việc được." |
| 4 | "Cùng một bộ não, ba cánh cửa: ứng dụng Claude để suy nghĩ và viết tài liệu, Claude Code để làm việc trong repo, API để xây sản phẩm." |
| 5 | "Với Dev: tìm hiểu, lên kế hoạch, làm, kiểm tra, review. Việc lớn hơn vài dòng thì bật Plan mode trước." |
| 6 | "Phần lớn kết quả kém là do thiếu ngữ cảnh. Việc phải luôn xảy ra thì dùng hook; điều phải luôn biết thì ghi vào CLAUDE.md; thứ thỉnh thoảng cần thì đóng thành skill; việc cần đầu óc sạch thì giao subagent; thông tin ngoài repo thì nối bằng MCP." |
| 7 | "Với BA: đưa email khách hàng vào, Claude liệt kê điểm mơ hồ, đề xuất câu hỏi làm rõ, rồi viết user story và tiêu chí chấp nhận." |
| 8 | "Với QA: từ tiêu chí chấp nhận, Claude thiết kế test case, viết test tự động, và chạy trên trình duyệt." |
| 9 | "Giờ mình làm thật: một tính năng, ba vai trò, ngay trước mắt anh em. Lưu ý: code và dữ liệu khách hàng tuân theo hợp đồng; con người review mọi thứ trước khi merge." |

## 3. Live demo (11:00–27:00)

Câu lệnh và các bước xem [04 Kế hoạch](04-ke-hoach.md) mục 5. Câu nói chính:

- **Chặng BA:** "Claude không đoán thay khách hàng. Nó liệt kê điểm mơ hồ để BA hỏi lại. Đó mới là phần giá trị."
- **Chặng Dev (trong lúc test chạy):** "Anh em để ý: mình không gõ code, cũng không copy lỗi qua lại. Mình chỉ làm ba việc: nói rõ mục tiêu, duyệt kế hoạch, và cho nó một cách tự kiểm tra."
- **Chặng QA:** "Acceptance criteria của BA biến thành test chạy được. Story, code, test nằm cùng một repo; truy vết được từ yêu cầu tới test."
- **Phát hành (đẩy nhánh demo, CI chạy, có link xem trước):** "Trong dự án thật, nhánh này được review rồi mới merge. Còn bản hoàn chỉnh thì đã chạy sẵn: link và mã sự kiện đang ở trong chat. Mời anh em vào chơi, lát nữa mình xướng danh ba người đứng đầu."
- **Nếu demo hỏng:** "Đây là lý do phải có test." Chuyển sang điểm lưu hoặc video dự phòng; không sửa lỗi trực tiếp quá 30 giây.

## 4. Slide 10 (27:00–28:30)

> "Tuần này mỗi người thử một việc. Dev: viết một file CLAUDE.md cho dự án đang làm. BA: đưa một email khách hàng vào Claude và xin user story. QA: đưa một story vào và xin bộ test case."

Nội dung slide này phụ thuộc việc còn mở V-02 (công ty đã có Claude cho nhân viên chưa).

## 5. Kết: đăng cơ và Hịch Cờ Lau (28:30–30:00)

**Màn hình:** quay lại game, chơi nốt trận còn lại (nếu chưa đủ 12). Ở bảng điểm nhấn Enter (không cần ghi danh), sang "Đăng cơ". Không còn phím tắt: phím `S` đã gỡ.

**Lời nói (màn đăng cơ, có thể để màn tự chạy):**

> "Năm 968, cậu bé cầm cờ lau năm nào đăng cơ, xưng Đại Thắng Minh Hoàng Đế, quốc hiệu Đại Cồ Việt. Không xưng vương, xưng Hoàng đế. Lưu danh thiên cổ."

Nhấn Enter sang "Trải hơn một nghìn năm…". **Im lặng** trong lúc chữ "Cờ Lau Đi" biến thành "Claude" (khoảng 6 giây). Để tiếng chiêng vang hết.

Để lời hịch tự hiện. Khi ấn son đóng xuống:

> "Ba điều trong binh pháp: hỏi cho tường, lập kế rồi hãy đánh, thử cho chắc rồi mới tin. Chính là ba điều hôm nay: làm rõ yêu cầu, Plan mode, và kiểm thử."
>
> "Cờ đã phất. Cùng “Cờ Lau”, chúng ta tiến! Giờ mời anh em vào chơi và đặt câu hỏi."

**Ghi chú:** nếu khán giả chưa bắt được câu chơi chữ, đọc chậm "Cờ… Lau… Đi" một lần rồi đọc nhanh một lần, trước khi chữ "Claude" hiện ra.

## 6. Cách chạy 30 phút hỏi đáp

1. **Phút 0–5:** khán giả chơi đủ 12 trận, bảng vàng chiếu toàn màn hình (phím `L`). Gom câu hỏi vào một kênh duy nhất (chat Meet hoặc Google Form nội bộ).
2. **Phút 5–28:** gom câu hỏi theo nhóm (bảo mật, chi phí, so sánh công cụ, quy trình) và trả lời từng nhóm.
3. **Phút 20–27 (nếu còn thời gian):** demo nhỏ theo yêu cầu của khán giả, ví dụ "viết test cho hàm này". Phần này thường được nhớ nhất.
4. **Phút 28–30:** xướng danh 3 người đứng đầu bảng vàng; câu hỏi chưa trả lời được ghi lại và trả lời bằng văn bản sau buổi.

**Khi không biết câu trả lời:** "Câu hỏi hay. Mình sẽ kiểm tra tài liệu và trả lời trong kênh chat ngay hôm nay." Và làm đúng như vậy.

## 7. Câu trả lời chuẩn bị sẵn

Các thông tin về sản phẩm cần kiểm tra lại trên tài liệu chính thức trong tuần thuyết trình, vì Claude Code cập nhật hằng tuần.

| Câu hỏi có thể gặp | Trả lời ngắn |
| --- | --- |
| Code của mình có bị dùng để huấn luyện mô hình không? | Tùy gói và cài đặt; điều khoản cho doanh nghiệp và API khác với tài khoản cá nhân. Xem trang Data usage trong tài liệu Claude Code. Với code khách hàng, hợp đồng với khách hàng là căn cứ quyết định. |
| Khác Cursor hay Copilot ở đâu? | Trọng tâm khác: một agent chạy trong terminal, mở rộng bằng skill, hook, MCP, plugin, và chạy giống nhau ở IDE, CI và cloud. Nếu chỉ cần gợi ý code trong lúc gõ, có thể giữ công cụ cũ song song. |
| Chi phí bao nhiêu? | Có gói thuê bao và tính theo lượng dùng qua API. Mở trang giá hiện hành thay vì đọc con số từ trí nhớ. Lệnh `/usage` cho biết phần nào tốn hạn mức nhất. |
| Nên dùng mô hình nào? | Sonnet cho công việc hằng ngày, Opus cho bài toán khó, Haiku cho việc nhỏ, nhanh, số lượng lớn. |
| Chạy được trên Windows không? | Được, chạy trực tiếp; ứng dụng desktop còn chạy được phiên làm việc trong WSL. |
| Repo cũ, rất lớn hoặc monorepo thì sao? | Được, cần chuẩn bị: CLAUDE.md riêng cho từng gói, plugin hiểu code theo ngôn ngữ, và luôn có bước tìm hiểu trước khi sửa. |
| Claude có bịa không? | Có lúc có. Vì vậy vòng kiểm tra và review của con người là một phần của quy trình, không phải tùy chọn. |
| Viết yêu cầu bằng tiếng Việt được không? | Được. Code, tên biến và commit message giữ tiếng Anh nếu đó là quy ước của team. |
| Nó có tự chạy `rm -rf` hay push lên main không? | Chỉ làm được những gì được cho phép: chế độ quyền, luật cấm, sandbox, và hook chặn lệnh nguy hiểm. |
| Chạy offline hoặc dùng mô hình riêng được không? | Không chạy mô hình tại máy, nhưng có thể đi qua Amazon Bedrock, Google Cloud, Microsoft Foundry hoặc gateway của công ty; phiên làm việc trên cloud có thể chạy trên hạ tầng tự quản. |
| AI có thay lập trình viên không? | Công việc dịch chuyển sang mô tả yêu cầu, chia nhỏ việc và review. Ai giỏi những việc đó sẽ làm được nhiều hơn hẳn. |
| Đo hiệu quả bằng gì? | Thời gian hoàn thành việc, số PR, số lỗi lọt ra ngoài; không đo bằng số dòng code. Trang analytics cho biết mức sử dụng. |
| Game này làm mất bao lâu? | Toàn bộ game, bảng vàng, kiểm thử và bộ tài liệu này được làm cùng Claude trong hai buổi trao đổi. Nhật ký trao đổi nằm ở `docs/02-hoi-dap.md`. |
