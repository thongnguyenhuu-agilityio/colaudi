# Cờ Lau Đi — Nhật ký hỏi đáp và quyết định

| Mục | Nội dung |
| --- | --- |
| Thời gian | 12/10/2026 – 13/10/2026 |
| Người tham gia | Thông (chủ sản phẩm, người trình bày) · Claude (phân tích, kiến trúc, phát triển, kiểm thử) |
| Nguyên tắc ra quyết định | Thông chốt các vấn đề phi kỹ thuật. Claude tự quyết các vấn đề kỹ thuật và chủ động phản biện khi một quyết định có thể làm kết quả kém đi (xem Q-13, Q-14) |
| Tài liệu liên quan | [01 Yêu cầu](01-yeu-cau.md) · [03 Kiến trúc](03-kien-truc.md) · [04 Kế hoạch](04-ke-hoach.md) · [05 Tổ chức Google Meet](05-to-chuc-google-meet.md) · [06 Kịch bản và hỏi đáp khán giả](06-kich-ban-va-hoi-dap-khan-gia.md) |

Tài liệu này ghi lại mọi câu hỏi, yêu cầu và góp ý đã trao đổi, theo đúng thứ tự thời gian. Mỗi mục gồm: câu hỏi hoặc yêu cầu, câu trả lời, các phương án đã cân nhắc (nếu có), kết quả, và yêu cầu hoặc tài liệu bị ảnh hưởng.

## Tóm tắt

| Mã | Ngày | Chủ đề | Quyết định bởi |
| --- | --- | --- | --- |
| [Q-01](#q-01) | 12/10 | Mục tiêu và khán giả của buổi thuyết trình | Thông |
| [Q-02](#q-02) | 12/10 | Hơn 100 người nhưng Google Meet giới hạn 100 | Thông, Claude |
| [Q-03](#q-03) | 12/10 | Chỉ có gói 100 người, không chia sẻ ra ngoài | Thông, Claude |
| [Q-04](#q-04) | 12/10 | Toàn bộ online, không nửa online nửa offline | Thông, Claude |
| [Q-05](#q-05) | 12/10 | Một buổi, tương tác được; mượn tài khoản Meet làm phòng dự phòng? | Thông |
| [Q-06](#q-06) | 12/10 | Cách vận hành phòng relay A/B | Claude |
| [Q-07](#q-07) | 13/10 | Ý tưởng game Cờ Lau Đi | Thông |
| [Q-08](#q-08) | 13/10 | "Hàng trăm năm sau" hay "hơn một nghìn năm sau" | Claude |
| [Q-09](#q-09) | 13/10 | Cấu trúc buổi: slide cho Dev, BA, QA rồi demo | Thông |
| [Q-10](#q-10) | 13/10 | Chốt yêu cầu và kế hoạch trước khi làm | Thông |
| [Q-11](#q-11) | 13/10 | Kiểu demo, tỷ lệ khán giả, thời lượng, vai trò game | Thông |
| [Q-12](#q-12) | 13/10 | Ngôn ngữ, công cụ slide, tính năng demo, công ty đã có Claude chưa | Thông |
| [Q-13](#q-13) | 13/10 | Ai quyết định vấn đề kỹ thuật; ưu tiên rẻ, deploy miễn phí | Thông |
| [Q-14](#q-14) | 13/10 | Claude phản biện khi quyết định có thể làm kết quả kém đi | Thông |
| [Q-15](#q-15) | 13/10 | Game có cần Cloudflare không | Claude |
| [Q-16](#q-16) | 13/10 | Chưa thấy bảng xếp hạng | Claude |
| [Q-17](#q-17) | 13/10 | Màn lên ngôi hoành tráng, đúng sử liệu | Claude |
| [Q-18](#q-18) | 13/10 | Cờ lau giống thật hơn | Claude |
| [Q-19](#q-19) | 13/10 | Viết tài liệu yêu cầu bằng tiếng Việt kèm hỏi đáp | Thông |
| [Q-20](#q-20) | 13/10 | Câu "Nam quốc sơn hà" không thuộc thời Đinh | Thông phát hiện, Claude sửa |
| [Q-21](#q-21) | 13/10 | Màn kết còn trẻ con; cần giọng hịch | Thông góp ý, Claude sửa |
| [Q-22](#q-22) | 13/10 | Không gọi đích danh "Dev, BA, QA" | Thông |
| [Q-23](#q-23) | 13/10 | Giọng "Hịch tướng sĩ"; con dấu như ấn vua trên chiếu thư | Thông góp ý, Claude quyết định |
| [Q-24](#q-24) | 13/10 | Bỏ cách xưng "ta", "các ngươi" | Thông |
| [Q-25](#q-25) | 13/10 | Ghi chép đầy đủ mọi trao đổi vào tài liệu tiếng Việt | Thông |
| [Q-26](#q-26) | 13/10 | Câu chốt cuối màn hịch: Cùng “Cờ Lau”, chúng ta đi! | Thông |
| [Q-27](#q-27) | 13/10 | Đổi câu chốt thành: Cùng “Cờ Lau”, chúng ta tiến! | Thông |
| [Q-28](#q-28) | 13/10 | Viết “Cờ Lau” đi: tiếng lóng trong ngoặc kép, “đi” là lời khuyến khích | Thông |
| [Q-29](#q-29) | 13/10 | Kế hoạch cài đặt và triển khai | Claude đề xuất, Thông cung cấp thông tin |
| [Q-30](#q-30) | 13/10 | Red-team review kế hoạch và code | Claude (người review độc lập), Thông đẩy GitHub |

---

<a id="q-01"></a>
## Q-01 · Mục tiêu và khán giả của buổi thuyết trình

- **Ngày:** 12/10 · **Quyết định bởi:** Thông

**Yêu cầu:** Lên kịch bản một bài thuyết trình hiệu quả về Claude cho lập trình viên đã dùng một công cụ AI lập trình trong công việc, để họ biết Claude có gì và dùng như thế nào. Trình bày khoảng 30 phút, hỏi đáp khoảng 30 phút. Claude đóng vai một chuyên gia giảng dạy về AI dễ hiểu.

**Trả lời:** Claude soạn kịch bản đầu tiên (tiếng Anh) gồm 9 phần, xoay quanh ba thông điệp:

1. Claude Code là một agent, không phải công cụ gợi ý code. Hãy giao cho nó mục tiêu và một cách tự kiểm tra kết quả.
2. Chất lượng đầu ra phụ thuộc chủ yếu vào ngữ cảnh: CLAUDE.md, skill, subagent, hook, MCP.
3. Khi viết code gần như không tốn chi phí, sự chú ý của người review trở thành nút thắt. Hãy thiết kế công việc để dễ review.

Kịch bản có kèm demo trực tiếp, sơ đồ, bảng so sánh với công cụ đang dùng, kế hoạch tuần đầu, và bộ câu trả lời chuẩn bị sẵn cho phần hỏi đáp.

**Kết quả:** Kịch bản đầu tiên. Về sau được cập nhật theo Q-09 đến Q-14 và chuyển thành [04 Kế hoạch](04-ke-hoach.md) và [06 Kịch bản](06-kich-ban-va-hoi-dap-khan-gia.md).

---

<a id="q-02"></a>
## Q-02 · Hơn 100 người nhưng Google Meet giới hạn 100

- **Ngày:** 12/10 · **Quyết định bởi:** Thông (thông tin), Claude (phân tích)

**Câu hỏi:** Buổi trình bày qua Google Meet dự kiến có hơn 100 người, vượt giới hạn 100. Làm cách nào hỗ trợ hết số lượng đó?

**Trả lời:** Giới hạn 100 người không cố định mà phụ thuộc gói Google Workspace của **tài khoản tạo cuộc họp**:

| Gói Workspace | Số người tối đa mỗi cuộc họp |
| --- | --- |
| Business Starter | 100 |
| Business Standard | 150 |
| Business Plus | 500 |
| Enterprise | Có thêm phát trực tiếp nội bộ, tới 100.000 người xem |

Các hướng đề xuất: nhờ người có gói cao hơn tạo lịch họp; dùng phát trực tiếp nội bộ nếu có gói Enterprise; hoặc chia hai buổi. Dù chọn cách nào cũng nên gom câu hỏi về một kênh duy nhất (Slido, Google Form hoặc kênh chat công ty), có một co-host đọc câu hỏi, và tự ghi hình buổi họp.

**Kết quả:** Cần biết gói Workspace của công ty → Q-03.

---

<a id="q-03"></a>
## Q-03 · Chỉ có gói 100 người, không chia sẻ ra ngoài

- **Ngày:** 12/10 · **Quyết định bởi:** Thông (ràng buộc), Claude (phương án)

**Thông tin từ Thông:** Công ty chỉ có gói tối đa 100 người. Không được chia sẻ ra ngoài công ty.

**Trả lời:** Loại phương án phát công khai lên YouTube. Ba phương án còn lại:

| Phương án | Cách làm | Ưu điểm | Nhược điểm |
| --- | --- | --- | --- |
| 1. Gom người theo phòng họp | Mỗi phòng họp ở văn phòng dùng một kết nối Meet, chiếu màn hình lớn | Đơn giản, không tốn chi phí | Phải có người ngồi văn phòng |
| 2. Chia hai buổi | Mỗi buổi 50–60 người | Tương tác tốt nhất | Trình bày hai lần |
| 3. Phát trực tiếp nội bộ | OBS đẩy hình lên server trong mạng công ty, xem qua VPN | Một buổi | Cần IT dựng và chạy thử |

Ghi chú: gói Business Starter không có chức năng ghi hình cuộc họp, nên người trình bày tự ghi bằng OBS rồi tải lên Google Drive, chỉ chia sẻ trong domain công ty.

**Kết quả:** Chờ Thông chọn → Q-04.

---

<a id="q-04"></a>
## Q-04 · Toàn bộ online, không nửa online nửa offline

- **Ngày:** 12/10 · **Quyết định bởi:** Thông (ràng buộc), Claude (đề xuất)

**Thông tin từ Thông:** Muốn toàn bộ online, không muốn vừa online vừa offline.

**Trả lời:** Loại phương án gom người theo phòng họp. Claude đề xuất **chia hai buổi** vì vừa giữ được tương tác vừa không cần thêm hạ tầng. Nếu bắt buộc chỉ một buổi thì có hai lựa chọn, đều kém hơn: Meet kèm phát trực tiếp nội bộ, hoặc dùng nền tảng khác công ty đã có bản quyền (Teams, Zoom).

**Kết quả:** Chờ Thông chọn → Q-05.

---

<a id="q-05"></a>
## Q-05 · Một buổi, tương tác được; mượn tài khoản Meet làm phòng dự phòng?

- **Ngày:** 12/10 · **Quyết định bởi:** Thông

**Câu hỏi:** Chỉ một buổi duy nhất, phải tương tác được. Có nên mượn tài khoản Google Meet của một nhân viên khác trong công ty để phát sang một phiên dự phòng?

**Trả lời:** Nên, và đây là cách hợp lý nhất cho yêu cầu "một buổi, online, tương tác, nội bộ". Cách này gọi là phòng relay (phòng tràn). Điều chỉnh quan trọng: **không mượn mật khẩu**. Đồng nghiệp tự tạo và tự vận hành phòng thứ hai bằng tài khoản của họ. Dùng chung tài khoản thường vi phạm chính sách bảo mật của công ty, và khi có sự cố thì rất khó xác định trách nhiệm.

**Kết quả:** Chốt phương án phòng relay A/B. Chi tiết vận hành → Q-06 và [05 Tổ chức Google Meet](05-to-chuc-google-meet.md).

---

<a id="q-06"></a>
## Q-06 · Cách vận hành phòng relay A/B

- **Ngày:** 12/10 · **Quyết định bởi:** Claude

**Trả lời:**

- **Phòng A** (người trình bày): khoảng 90 người, giữ trống 5 chỗ.
- **Phòng B** (đồng nghiệp tạo): tối đa khoảng 99 người. Máy relay mở phòng A ở một tab Chrome, mở phòng B ở tab khác, rồi dùng "Present a tab" để chiếu tab phòng A vào phòng B, có bật âm thanh của tab. Mic của máy relay tắt ở cả hai phòng; người vận hành đeo tai nghe để tránh hú, vọng.
- **Câu hỏi từ phòng B:** gõ vào chat phòng B; người điều phối chuyển sang người trình bày.
- **Ghế phát biểu:** người ở phòng B muốn hỏi trực tiếp thì rời B, vào A bằng một trong 5 chỗ trống, hỏi xong quay lại.
- **Rủi ro chính:** hình qua hai lớp chia sẻ bị mờ (tăng cỡ chữ lên 18–20pt), phòng B trễ vài giây, máy relay rớt mạng (cắm dây mạng, chuẩn bị máy thứ hai).
- **Bắt buộc chạy thử** trước 1–2 ngày với đủ 3 người: người trình bày, người vận hành relay, một người xem ở phòng B.

**Kết quả:** [05 Tổ chức Google Meet](05-to-chuc-google-meet.md).

---

<a id="q-07"></a>
## Q-07 · Ý tưởng game Cờ Lau Đi

- **Ngày:** 13/10 · **Quyết định bởi:** Thông

**Yêu cầu:** Làm một game để demo cho bài thuyết trình. Nội dung hài hước, dựa trên điển tích Đinh Bộ Lĩnh dẹp loạn 12 sứ quân, trong đó Đinh Bộ Lĩnh dùng cờ lau tập trận. Dùng hình ảnh "cờ lau" và câu xuất trận "Cờ lau đi" như một tiếng lóng chỉ Claude. Sau phần giới thiệu, Đinh Bộ Lĩnh lên ngôi Hoàng đế, lưu danh thiên cổ. Cuối cùng hiện dòng chữ cho thấy sau nhiều năm thì Claude ra đời, làm câu chốt khuyến khích mọi người cùng tập trận và dùng Claude.

**Trả lời:** Claude làm bản game đầu tiên:

- Bản đồ 12 sứ quân quanh Hoa Lư. Mỗi sứ quân mang tên một sứ quân trong sử và một nỗi khổ của nghề phần mềm, ví dụ Kiều Công Hãn là "Sứ quân Tính Năng Khổng Lồ", Nguyễn Thủ Tiệp là "Sứ quân Context Phình To".
- Mỗi trận là câu hỏi 3 lựa chọn A/B/C. Đáp án đúng là một kỹ thuật dùng Claude (Plan mode, CLAUDE.md, hook, skill, subagent, MCP, worktree…), kèm tiếng hô "Cờ lau đi!".
- Trần Lãm là đồng minh chứ không phải kẻ thù, đúng như sử chép ông nhận Đinh Bộ Lĩnh làm con nuôi. Đáp án đúng là "AI viết, người giàu kinh nghiệm review".
- Chế độ nhanh 3 trận cho người trình bày, chế độ đủ 12 trận cho khán giả.
- Màn lên ngôi năm 968, rồi màn kết "Cờ Lau Đi" biến thành "Claude".
- Khán giả bỏ phiếu A/B/C trong chat Meet; người trình bày điều khiển bằng bàn phím.

Game được lồng vào kịch bản: mở màn bằng game, demo trực tiếp trên chính game, kết bài bằng màn "Claude ra đời".

**Kết quả:** FR-01 đến FR-07, FR-14, FR-15, FR-17 trong [01 Yêu cầu](01-yeu-cau.md).

---

<a id="q-08"></a>
## Q-08 · "Hàng trăm năm sau" hay "hơn một nghìn năm sau"

- **Ngày:** 13/10 · **Quyết định bởi:** Claude

**Vấn đề:** Ý tưởng ban đầu viết "sau hàng trăm năm thì Claude ra đời".

**Trả lời:** Từ năm 968 (Đinh Bộ Lĩnh lên ngôi) đến năm 2023 (Claude ra đời) là hơn 1.000 năm. Màn kết dùng "Trải hơn một nghìn năm…".

**Kết quả:** FR-15.

---

<a id="q-09"></a>
## Q-09 · Cấu trúc buổi: slide cho Dev, BA, QA rồi demo

- **Ngày:** 13/10 · **Quyết định bởi:** Thông

**Yêu cầu:** Chốt yêu cầu và lên kế hoạch trước. Trình bày bằng slide một số nội dung về Claude cho lập trình viên, BA và QA trước, rồi mới demo sản phẩm hoặc demo trực tiếp.

**Trả lời:** Có thêm BA và QA nên bài không thể chỉ nói về Claude Code. Mỗi vai trò cần thấy Claude giúp mình ở đâu. Claude đề xuất demo trực tiếp **một sản phẩm đi qua cả ba vai trò**, chính là game Cờ Lau Đi:

- **BA:** dùng Claude biến ý tưởng thành user story và tiêu chí chấp nhận.
- **Dev:** dùng Claude Code xây hoặc sửa tính năng theo đúng story đó.
- **QA:** dùng Claude sinh test case, rồi chạy kiểm thử tự động trên trình duyệt.

**Kết quả:** Cấu trúc buổi trong [04 Kế hoạch](04-ke-hoach.md).

---

<a id="q-10"></a>
## Q-10 · Chốt yêu cầu và kế hoạch trước khi làm

- **Ngày:** 13/10 · **Quyết định bởi:** Thông

**Yêu cầu:** Chốt yêu cầu, lên kế hoạch trước; khi nào xong thì mới cài đặt.

**Trả lời:** Làm theo 5 bước, xong bước nào mới sang bước sau: (1) chốt yêu cầu, (2) dàn ý slide, (3) kịch bản demo, (4) kế hoạch triển khai gồm việc, mốc và buổi chạy thử, (5) làm slide, game, kịch bản. Game và kịch bản đã làm trước đó được coi là bản nháp.

**Kết quả:** Quy trình làm việc của dự án.

---

<a id="q-11"></a>
## Q-11 · Kiểu demo, tỷ lệ khán giả, thời lượng, vai trò game

- **Ngày:** 13/10 · **Quyết định bởi:** Thông

| Câu hỏi | Trả lời |
| --- | --- |
| Phần demo sau slide theo kiểu nào? | Demo trực tiếp một tính năng đi qua BA → Dev → QA |
| Tỷ lệ khán giả? | Dev là đa số |
| Có giữ 30 phút trình bày + 30 phút hỏi đáp? | Giữ 30 + 30 |
| Game đóng vai trò gì? | Sản phẩm demo chính: mở màn, demo trực tiếp trên game, và kết bài |

**Lưu ý Claude nêu ra:** 30 phút cho cả slide lẫn demo trực tiếp ba vai trò là chật. Phân bổ sơ bộ: game mở màn 2–3 phút, slide khoảng 9–10 phút, demo trực tiếp khoảng 15–16 phút, kết 1,5–2 phút. Mỗi chặng demo (BA xong, Dev xong, QA xong) có sẵn một điểm lưu trong git; chặng nào chậm hoặc lỗi thì nhảy thẳng sang điểm lưu kế tiếp.

**Kết quả:** Lịch chạy chương trình trong [04 Kế hoạch](04-ke-hoach.md).

---

<a id="q-12"></a>
## Q-12 · Ngôn ngữ, công cụ slide, tính năng demo, công ty đã có Claude chưa

- **Ngày:** 13/10 · **Quyết định bởi:** Thông

| Câu hỏi | Trả lời |
| --- | --- |
| Ngôn ngữ trình bày và slide? | Nói tiếng Việt, slide tiếng Anh |
| Làm slide bằng công cụ nào? | Claude Slides |
| Tính năng nào đi qua BA → Dev → QA? | Tính điểm và bảng xếp hạng |
| Công ty đã cấp Claude cho nhân viên chưa? | Chưa rõ |

**Kết quả:** Việc "công ty đã có Claude chưa" là việc còn mở V-02, quyết định nội dung slide cuối: "dùng ngay từ mai" hay "đề xuất triển khai". Câu hỏi còn lại về bảng xếp hạng (chỉ người trình bày hay cả khán giả cùng chơi) được Claude tự quyết theo Q-13: khán giả cùng chơi và bảng cập nhật trực tiếp.

---

<a id="q-13"></a>
## Q-13 · Ai quyết định vấn đề kỹ thuật; ưu tiên rẻ, deploy miễn phí

- **Ngày:** 13/10 · **Quyết định bởi:** Thông

**Yêu cầu:** Claude mạnh dạn đề xuất hướng tối ưu; sai thì tìm hướng khác cho tới khi không thể được nữa, thay vì hỏi Thông về các vấn đề công nghệ. Thông chỉ chốt các vấn đề phi kỹ thuật. Xây dựng theo hướng rẻ cho demo, deploy trên Vercel hoặc nền tảng tương đương miễn phí.

**Trả lời:** Claude lập kế hoạch gồm: yêu cầu đã chốt, quyết định kỹ thuật, kiến trúc, lịch chạy chương trình, dàn ý 11 slide, kịch bản demo BA → Dev → QA, kế hoạch 7 gói việc, rủi ro và phương án dự phòng, và 5 việc còn mở cho Thông. Lựa chọn hạ tầng ban đầu là Cloudflare Workers + D1, vì gói miễn phí của Vercel chỉ dành cho mục đích cá nhân, phi thương mại. Lựa chọn này được xem lại ở Q-15.

**Kết quả:** [04 Kế hoạch](04-ke-hoach.md).

---

<a id="q-14"></a>
## Q-14 · Claude phản biện khi quyết định có thể làm kết quả kém đi

- **Ngày:** 13/10 · **Quyết định bởi:** Thông

**Yêu cầu:** Claude là chuyên gia, hãy mạnh dạn giúp; tránh để quyết định của Thông làm kết quả kém đi.

**Trả lời:** Năm điều chỉnh để bảo vệ kết quả:

1. **Game không được trông như đồ chơi trong mắt BA và QA.** Phần demo bắt đầu từ một email khách hàng mơ hồ bằng tiếng Anh, đúng loại đầu vào BA nhận hằng tuần ở công ty phần mềm thuê ngoài. Game chỉ là phương tiện; quy trình mới là bài học.
2. **Demo trực tiếp ba vai trò trong 15 phút là rủi ro nếu không có lưới an toàn.** Mỗi chặng có giới hạn thời gian và điểm lưu dựng sẵn.
3. **Game mở và kết chiếm 5 trên 30 phút.** Rút còn 2 phút đầu (2 trận thay vì 3) và 1,5 phút cuối, dồn thời gian cho demo.
4. **Dev là đa số nên slide nghiêng về Dev:** 2 slide Dev, 1 slide BA, 1 slide QA. Phần demo vẫn cân bằng ba vai trò.
5. **Khán giả chơi chính tính năng vừa được xây.** Tính năng được deploy ngay cuối phần demo; 5 phút đầu hỏi đáp chạy cùng bảng xếp hạng trên màn hình, biến 100 người xem thành 100 người chơi.

**Kết quả:** [04 Kế hoạch](04-ke-hoach.md).

---

<a id="q-15"></a>
## Q-15 · Game có cần Cloudflare không

- **Ngày:** 13/10 · **Quyết định bởi:** Claude

**Câu hỏi:** Với game như vậy có cần Cloudflare không? Đây là demo cho bài thuyết trình, không có ý định thương mại. Claude cân nhắc kỹ và mạnh dạn quyết định kiến trúc.

**Trả lời:** Không cần. Bản thân game là một trang tĩnh, không cần server. Thứ duy nhất cần backend là **bảng xếp hạng chung cho hơn 100 người**. Vì đây là demo cá nhân, phi thương mại, gói Hobby miễn phí của Vercel là phù hợp. Chọn **Vercel Hobby + Upstash Redis**:

| Phương án | Kết luận | Lý do |
| --- | --- | --- |
| Không backend, bảng điểm riêng từng máy | Loại | Mất phần thi đua chung, vốn là điểm tương tác chính |
| Artifact của Claude có cơ sở dữ liệu chung | Loại | Mọi người chơi phải có tài khoản claude.ai trong tổ chức |
| Firebase hoặc Supabase gọi thẳng từ trình duyệt | Loại | Không kiểm tra điểm ở server, ai cũng sửa được điểm qua console |
| Cloudflare Workers + D1 | Dự phòng | Tốt, nhưng thêm schema SQL; giữ làm phương án nếu mạng công ty chặn `vercel.app` |
| **Vercel + Upstash Redis** | **Chọn** | Sorted set của Redis chính là bảng xếp hạng; deploy chung với trang tĩnh; đa số Dev đã biết Vercel |

Bảng xếp hạng được trình duyệt hỏi lại mỗi 3 giây, CDN của Vercel giữ kết quả 2 giây. Vì vậy 100 người cùng xem thì Redis chỉ nhận khoảng 30 lượt đọc mỗi phút, trong khi gói miễn phí của Upstash cho 500.000 lệnh mỗi tháng.

**Kết quả:** ADR-01 trong [03 Kiến trúc](03-kien-truc.md); NFR-01, NFR-02.

---

<a id="q-16"></a>
## Q-16 · Chưa thấy bảng xếp hạng

- **Ngày:** 13/10 · **Quyết định bởi:** Claude

**Góp ý:** Chưa thấy phần leaderboard.

**Trả lời:** Claude dựng repo `p-colaudi` trên máy Thông, gồm:

- **Tính điểm:** đúng ngay lần đầu 3 điểm, sai một lần 1 điểm, sai hai lần 0 điểm, tối đa 36. Bằng điểm thì ai nhanh hơn xếp trên.
- **Bảng vàng:** người chơi đủ 12 trận nhập tên để ghi danh, xem thứ hạng của mình và 10 người dẫn đầu, cập nhật mỗi 3 giây. Phím `L` mở bảng vàng toàn màn hình để chiếu trong phần hỏi đáp.
- **API:** đọc 10 người dẫn đầu, ghi danh, xoá một tên hoặc xoá trắng bảng (chỉ ban tổ chức). Server tự kiểm tra mọi dữ liệu gửi lên.
- **Chạy được ngay khi chưa deploy:** bản xem thử lưu điểm trên trình duyệt của từng người; khi deploy lên Vercel thì bảng vàng là chung.
- **Kiểm thử:** 22 kiểm thử đơn vị và API, 3 kiểm thử đầu cuối chơi đủ 12 trận rồi ghi danh.

Trong quá trình làm, Claude phát hiện và sửa một lỗi: nút bắt đầu đưa người chơi quay về màn đầu thay vì vào trận.

**Kết quả:** FR-08 đến FR-13; [03 Kiến trúc](03-kien-truc.md); README hướng dẫn deploy.

---

<a id="q-17"></a>
## Q-17 · Màn lên ngôi hoành tráng, đúng sử liệu

- **Ngày:** 13/10 · **Quyết định bởi:** Claude

**Yêu cầu:** Màn lên ngôi hoành tráng hơn, đậm tính sử học, văn phong hào hùng. Thông dẫn trang Wikipedia về Đinh Tiên Hoàng và nêu: từ triều đại này, các vua sau đều xưng Hoàng đế thay vì xưng vương hay xưng đế, và các chính quyền phong kiến Trung Quốc phải công nhận là "Hoàng đế" thay vì vương.

**Trả lời:** Claude đối chiếu sử liệu:

- **Đúng:** năm 968, Đinh Bộ Lĩnh xưng Đại Thắng Minh Hoàng Đế, đặt quốc hiệu Đại Cồ Việt, đóng đô ở Hoa Lư. Ông là người đầu tiên xưng Hoàng đế; các triều sau nối theo.
- **Cần sửa:** nhà Tống không công nhận là Hoàng đế. Năm 975, nhà Tống phong Đinh Liễn (con trai Đinh Bộ Lĩnh) làm Giao Chỉ quận vương, tức tước vương. Trong nước xưng Hoàng đế, với phương Bắc nhận tước vương.

Màn lên ngôi mới hiện lần lượt từng nhịp, kèm tiếng trống và chiêng: ấn đỏ 大瞿越 (Đại Cồ Việt) giữa hai lá cờ lau; "Năm Mậu Thìn · 968 · Kinh đô Hoa Lư"; tước hiệu 大勝明皇帝 · Đại Thắng Minh Hoàng Đế; câu nhấn "Không xưng Vương. Xưng Hoàng Đế."; câu giải thích "Nhà Tống chỉ phong tước vương, nhưng trong cõi Nam, các triều đại về sau đều nối theo"; bốn thẻ quốc hiệu, kinh đô, niên hiệu Thái Bình, triều đình văn võ ban; một lời bình của sử gia (xem Q-20); và "Lưu danh thiên cổ."

Trang Wikipedia tiếng Việt không mở được từ môi trường làm việc, nên dữ kiện được đối chiếu qua các nguồn khác (mục 12 của [01 Yêu cầu](01-yeu-cau.md)).

**Kết quả:** FR-14; US-02 và AC-10 đến AC-13.

---

<a id="q-18"></a>
## Q-18 · Cờ lau giống thật hơn

- **Ngày:** 13/10 · **Quyết định bởi:** Claude

**Yêu cầu:** Thiết kế "cờ lau" nhìn giống cờ lau thực tế hơn.

**Trả lời:** Vẽ lại theo cấu tạo cây lau thật: thân có đốt, bốn lá dài và hẹp mọc từ các đốt; bông lau dài, rủ theo chiều gió, gồm nhiều nhánh nhỏ phủ lông tơ mỏng màu trắng ngà pha hồng nhạt; bông lau đung đưa nhẹ như trước gió. Hình được sinh bằng thuật toán với hạt giống cố định (968), nên lần nào hiện ra cũng giống nhau.

**Kết quả:** FR-16.

---

<a id="q-19"></a>
## Q-19 · Viết tài liệu yêu cầu bằng tiếng Việt kèm hỏi đáp

- **Ngày:** 13/10 · **Quyết định bởi:** Thông

**Yêu cầu:** Viết yêu cầu bằng tiếng Việt vào file Markdown, kèm nội dung hỏi đáp. Dùng làm tài liệu như một quy trình phát triển phần mềm để demo.

**Trả lời:** Tạo [01 Yêu cầu](01-yeu-cau.md) theo khung của một hồ sơ yêu cầu thật: bối cảnh, phạm vi, người dùng, yêu cầu chức năng và phi chức năng, ràng buộc, nhật ký hỏi đáp, quyết định kiến trúc, user story với tiêu chí chấp nhận dạng Given/When/Then, ma trận truy vết từ yêu cầu tới code và test, việc còn mở, nguồn kiểm chứng sử liệu.

**Kết quả:** [01 Yêu cầu](01-yeu-cau.md).

---

<a id="q-20"></a>
## Q-20 · Câu "Nam quốc sơn hà" không thuộc thời Đinh

- **Ngày:** 13/10 · **Quyết định bởi:** Thông phát hiện, Claude sửa

**Góp ý (trên bản xem thử):** Câu "Nam quốc sơn hà Nam đế cư" ở màn lên ngôi không thuộc thời Đinh.

**Trả lời:** Đúng. Bài thơ ra đời ở thế kỷ XI, thời Lý, sau nhà Đinh. Thay bằng lời bàn của sử gia Lê Văn Hưu về Đinh Tiên Hoàng, chép trong Đại Việt sử ký: "Một phen cất quân mà mười hai sứ quân phục hết". Câu này nói đúng về nhà Đinh và khớp với câu chuyện dẹp loạn 12 sứ quân.

**Kết quả:** FR-14; mục 12 của [01 Yêu cầu](01-yeu-cau.md).

---

<a id="q-21"></a>
## Q-21 · Màn kết còn trẻ con; cần giọng hịch

- **Ngày:** 13/10 · **Quyết định bởi:** Thông góp ý, Claude sửa

**Góp ý (trên bản xem thử):** Cải thiện giọng điệu trang trọng, hào hùng hơn; hiện tại cảm giác hơi trẻ con. Văn phong mang tính hiệu triệu hơn, kiểu như hịch.

**Trả lời:** Viết lại màn kết. Bên trái: "Trải hơn một nghìn năm…", chữ "Cờ Lau Đi" biến thành "Claude", "Năm 2023, Claude ra đời", rồi lời hô xuất trận. Bên phải: lời hịch. Mỗi nhịp có tiếng trống, câu cuối có tiếng chiêng. Nội dung lời hịch được hoàn thiện tiếp ở Q-22, Q-23 và Q-24.

**Kết quả:** FR-15.

---

<a id="q-22"></a>
## Q-22 · Không gọi đích danh "Dev, BA, QA"

- **Ngày:** 13/10 · **Quyết định bởi:** Thông

**Yêu cầu:** Chỉ dùng "Hỡi tướng sỹ", bỏ "Dev, BA, QA" vì không muốn chỉ đích danh.

**Trả lời:** Đổi thành "Hỡi tướng sỹ!". Câu kế tiếp lúc đó vẫn nhắc gián tiếp ba nhóm ("Người viết code… Người phân tích… Người kiểm thử…"); câu này được bỏ hẳn khi viết lại ở Q-23.

**Kết quả:** FR-15.

---

<a id="q-23"></a>
## Q-23 · Giọng "Hịch tướng sĩ"; con dấu như ấn vua trên chiếu thư

- **Ngày:** 13/10 · **Quyết định bởi:** Thông góp ý, Claude quyết định

**Yêu cầu:** Xem xét giọng văn của "Hịch tướng sĩ" cho hào hùng. Thêm logo của Claude vào chỗ phù hợp, kiểu như con dấu của vua trên bản chiếu thư. Claude mạnh dạn nghĩ cách tốt nhất.

**Trả lời:**

- **Giọng văn:** đi theo kết cấu của "Hịch tướng sĩ" nhưng viết câu mới, đặt tên "Hịch Cờ Lau": nêu gương xưa, nói nỗi lo hiện tại, nhắc bỏ thói quen cũ bằng nhịp điệp "chớ… chớ… chớ…", hiệu triệu cùng luyện binh pháp, kết bằng "Bố cáo khắp nơi, ai nấy đều hay." Ba điều trong binh pháp "hỏi cho tường, lập kế rồi hãy đánh, thử cho chắc rồi mới tin" chính là ba bài học của buổi thuyết trình: làm rõ yêu cầu, dùng Plan mode, và kiểm thử.
- **Trình bày:** lời hịch nằm trên một cuộn chiếu thư giấy dó, hai đầu có trục cuộn.
- **Con dấu:** logo Claude là nhãn hiệu của Anthropic nên không vẽ lại. Thay vào đó là một ấn son vuông khắc "CLAU / DE": chữ đầu của "Cờ Lau" và chữ cuối "Đi" đọc lái. Con dấu chính là đáp án của câu chơi chữ "Cờ Lau Đi → Claude". Ở nhịp cuối, ấn đóng xuống chiếu thư kèm tiếng trống và chiêng.

**Kết quả:** FR-15, FR-19.

---

<a id="q-24"></a>
## Q-24 · Bỏ cách xưng "ta", "các ngươi"

- **Ngày:** 13/10 · **Quyết định bởi:** Thông

**Yêu cầu:** Vì demo cho người khác xem, nội dung có từ "ta", "các ngươi" là không phù hợp. Tìm cách diễn đạt không trịch thượng, không thiếu tôn trọng, không coi người khác là kẻ dưới.

**Trả lời:** Bỏ toàn bộ "ta", "ngươi", "các ngươi" trong game, kể cả lời thoại sứ quân và lời nhận xét trong từng trận. Lời hịch chuyển sang giọng đồng đội, cùng đứng một phía với người nghe:

| Trước | Sau |
| --- | --- |
| Ta thường nghe… | Từng nghe… |
| Ta ngày quên ăn, đêm quên ngủ… | Bao bữa quên ăn, bao đêm thức trắng, chỉ mong sớm dẹp yên bờ cõi. |
| Các ngươi, hoặc lấy việc… | Chúng ta chớ lấy việc gõ tay từng dòng làm siêng năng, chớ lấy việc vá lỗi qua loa làm công trạng… |
| Nay ta trao lá cờ lau mới | Nay lá cờ lau mới đã trong tay. Cùng nhau luyện binh pháp… |
| Chúc ngươi review vui | Chúc review vui vẻ |
| Ta không chống ngươi. Ta có kinh nghiệm, ngươi có cờ lau. | Không cần giao chiến. Một bên có kinh nghiệm, một bên có cờ lau: hợp lại mới mạnh. |

Khí thế được giữ nhờ "Hỡi tướng sỹ!" và nhịp điệp "chớ… chớ… chớ…".

**Kết quả:** NFR-09; FR-04, FR-05, FR-15.

---

<a id="q-25"></a>
## Q-25 · Ghi chép đầy đủ mọi trao đổi vào tài liệu tiếng Việt

- **Ngày:** 13/10 · **Quyết định bởi:** Thông

**Yêu cầu:** Ghi chép đầy đủ, dễ hiểu bằng tiếng Việt những nội dung đã thảo luận qua lại vào các tài liệu tương ứng, kèm phản hồi hoặc câu trả lời trong danh sách hỏi đáp.

**Trả lời:** Tách thành bộ tài liệu trong thư mục `docs/`:

| Tài liệu | Nội dung |
| --- | --- |
| [00 Mục lục](00-muc-luc.md) | Danh sách tài liệu và cách đọc |
| [01 Yêu cầu](01-yeu-cau.md) | Yêu cầu, user story, truy vết, sử liệu |
| 02 Hỏi đáp (tài liệu này) | Toàn bộ câu hỏi, câu trả lời và quyết định |
| [03 Kiến trúc](03-kien-truc.md) | Kiến trúc, API, dữ liệu, quyết định kiến trúc, cách chạy và deploy |
| [04 Kế hoạch](04-ke-hoach.md) | Lịch chạy chương trình, dàn ý slide, kịch bản demo BA → Dev → QA, kế hoạch làm việc, rủi ro |
| [05 Tổ chức Google Meet](05-to-chuc-google-meet.md) | Vượt giới hạn 100 người bằng phòng relay A/B |
| [06 Kịch bản và hỏi đáp khán giả](06-kich-ban-va-hoi-dap-khan-gia.md) | Lời nói chính cho từng phần và câu trả lời chuẩn bị sẵn |

**Kết quả:** Bộ tài liệu này.

---

<a id="q-26"></a>
## Q-26 · Câu chốt cuối màn hịch

- **Ngày:** 13/10 · **Quyết định bởi:** Thông

**Yêu cầu:** Thay chữ "Cờ Lau Đi" ở cuối trang bài hịch thành một câu chốt kiểu như "Cùng 'Cờ Lau', chúng ta đi".

**Trả lời:** Dòng chữ lớn màu son ở cuối màn kết đổi từ "Cờ Lau Đi!" thành hai dòng:

> Cùng “Cờ Lau”,
> chúng ta đi!

Câu này giữ được tiếng hô xuất trận, nhắc lại câu chơi chữ (Cờ Lau → Claude), và cùng giọng "chúng ta" với lời hịch (Q-24). Dòng phía trên vẫn là "Cờ đã phất. Tướng sỹ, xuất trận!". Tên game "Cờ Lau Đi" ở đầu trang giữ nguyên.

**Kết quả:** FR-15; lời nói kết bài trong [06 Kịch bản](06-kich-ban-va-hoi-dap-khan-gia.md). Câu chốt được chỉnh tiếp ở Q-27.

---

<a id="q-27"></a>
## Q-27 · Đổi "đi" thành "tiến" trong câu chốt

- **Ngày:** 13/10 · **Quyết định bởi:** Thông

**Yêu cầu:** Đổi "Cùng “Cờ Lau”, chúng ta đi!" thành "Cùng “Cờ Lau”, chúng ta tiến!".

**Trả lời:** Đã đổi. "Tiến" mang khí thế tiến quân, hợp với lời hịch và dòng "Cờ đã phất. Tướng sỹ, xuất trận!" phía trên. Câu chốt hiện tại ở cuối màn kết:

> Cùng “Cờ Lau”,
> chúng ta tiến!

**Kết quả:** FR-15; lời nói kết bài trong [06 Kịch bản](06-kich-ban-va-hoi-dap-khan-gia.md).

---

<a id="q-28"></a>
## Q-28 · Viết “Cờ Lau” đi

- **Ngày:** 13/10 · **Quyết định bởi:** Thông

**Yêu cầu:** Trong cụm "Cờ Lau Đi", đặt "Cờ Lau" trong dấu ngoặc kép để người xem hiểu đó là tiếng lóng. Chữ "đi" được hiểu như một lời khuyến khích dùng nó.

**Trả lời:** Cụm này giờ viết là **“Cờ Lau” đi**, với "đi" viết thường để đọc như lời rủ ("dùng đi!"). Đã đổi ở mọi chỗ cụm này xuất hiện trong game:

| Chỗ | Trước | Sau |
| --- | --- | --- |
| Tên game ở màn đầu và thanh trên cùng | Cờ Lau Đi | “Cờ Lau” đi |
| Tiếng hô ở màn giới thiệu | Cờ lau đi! | “Cờ Lau” đi! |
| Tiếng hô sau mỗi trận thắng | Cờ lau đi! | “Cờ Lau” đi! |
| Màn các sứ quân quy phục | Nghe tiếng “Cờ lau đi!”, … | Nghe tiếng hô “Cờ Lau” đi, … |
| Màn kết, trước khi biến thành "Claude" | Cờ Lau Đi | “Cờ Lau” đi |

Câu chốt "Cùng “Cờ Lau”, chúng ta tiến!" (Q-27) vốn đã đặt "Cờ Lau" trong ngoặc kép nên giữ nguyên. Tên dự án, tên repo và tiêu đề tab trình duyệt vẫn là "Cờ Lau Đi" vì đó là tên định danh, không phải lời hô. Lời nói ở slide 1 trong kịch bản được viết lại để giải thích cả hai ý: “Cờ Lau” là tiếng lóng chỉ Claude, “đi” là lời rủ dùng Claude.

**Kết quả:** FR-02; [04 Kế hoạch](04-ke-hoach.md) slide 1; [06 Kịch bản](06-kich-ban-va-hoi-dap-khan-gia.md).

---

<a id="q-29"></a>
## Q-29 · Kế hoạch cài đặt và triển khai

- **Ngày:** 13/10 · **Quyết định bởi:** Claude đề xuất, Thông cung cấp thông tin

**Yêu cầu:** Lên kế hoạch cài đặt và triển khai game; mạnh dạn đề xuất hướng tối ưu trong phạm vi đề tài; chỉ hỏi lại khi không thể đi tiếp. Nội dung kế hoạch viết bằng tiếng Anh.

**Đề xuất:** dùng repo GitHub riêng tư kết nối Vercel. Đẩy nhánh nào thì có link xem trước cho nhánh đó (chỉ dùng khi chạy thử); merge vào `main` thì lên production (link duy nhất khán giả dùng). Một cơ sở dữ liệu Upstash miễn phí, khoá dữ liệu tách theo môi trường để điểm chạy thử không lẫn vào bảng vàng thật. GitHub Actions chạy kiểm thử cho mỗi lần đẩy code. Có lệnh kiểm tra nhanh sau mỗi lần deploy và lệnh xoá trắng bảng vàng.

**Câu hỏi Claude đặt ra và trả lời của Thông:**

| Câu hỏi | Trả lời |
| --- | --- |
| Có được để code trong repo riêng tư trên GitHub không? | Đã tạo repo và thêm remote `origin`: `github.com/thongnguyenhuu-agilityio/colaudi` |
| Đã có tài khoản Vercel và đăng nhập CLI chưa? | Đã đăng nhập Vercel |
| Ngày thuyết trình? | Thứ Sáu tuần này, 16/10/2026 |

**Điều chỉnh vì còn ba ngày:** bỏ lịch D-7 ban đầu. Thứ Ba deploy lần đầu; Thứ Tư tạo `cp0`, chạy thử 1, làm slide; Thứ Năm chạy thử 2 qua phòng relay và từ mạng văn phòng; Thứ Sáu thuyết trình; Thứ Bảy gỡ bỏ. Trong buổi thuyết trình, production luôn chạy bản `final`, nên dù phần demo trực tiếp có trục trặc thì khán giả vẫn chơi được; nhánh demo không merge trên sân khấu.

**Đã làm:** khoá Redis theo môi trường trong `api/leaderboard.js`; `scripts/smoke.mjs` và `scripts/wipe-board.mjs`; `.github/workflows/test.yml`; cố định Node 22. Đã kiểm tra trên tài liệu Vercel rằng file `api/leaderboard.js` (xuất hàm `GET`, `POST`, `DELETE`) chạy được mà không cần framework, và các lệnh `vercel link`, `vercel git connect`.

**Kết quả:** [07 Deployment plan](07-deployment.md); việc còn mở V-01 (ngày thuyết trình) đã đóng.

---

<a id="q-30"></a>
## Q-30 · Red-team review kế hoạch và code

- **Ngày:** 13/10 · **Quyết định bởi:** Claude (người review độc lập); Thông đẩy GitHub

**Yêu cầu:** Đóng vai red team: review các kế hoạch, sửa chúng, ghi kế hoạch vào tài liệu Markdown. Tự commit code nếu đã review và sửa. Nhắc Thông đẩy lên GitHub để tự deploy.

**Trả lời:** Một người review độc lập (không biết quá trình thiết kế) đã chạy test, thử bằng curl và Playwright, rồi báo 16 phát hiện: 2 nghiêm trọng, 5 cao, 5 trung bình, 4 thấp. Tất cả đã được sửa hoặc giảm thiểu trước lần commit đầu tiên. Chi tiết: [08 Red-team review](08-red-team-review.md).

| Phát hiện chính | Cách sửa |
| --- | --- |
| Một lần lỗi mạng khiến game lưu điểm trên trình duyệt mà vẫn báo "đã ghi danh" | Chế độ chỉ quyết định một lần lúc tải trang; mất kết nối thì báo lỗi và cho gửi lại |
| Tài liệu mâu thuẫn về việc deploy production trên sân khấu | Một nguyên tắc: không deploy trên sân khấu; chặn `vercel --prod` trong `.claude/settings.json` |
| Gửi điểm giả bằng curl lên đứng đầu | Server tự đo thời gian từ giờ bắt đầu; giới hạn số lần gửi; co-host kiểm tra top 3 |
| `cp0` theo kế hoạch cũ làm backend lỗi | `cp0` chỉ để trống luật tính điểm |
| Bước gỡ bỏ cũ lại mở bảng vàng cho mọi người | Lệnh khoá sổ `npm run board -- <url> close` |

**Về việc tự commit:** công cụ của Claude không được phép ghi vào thư mục `.git` trên máy Thông, nên Claude không tự commit được. Code đã được review, sửa và kiểm thử (28 kiểm thử đơn vị và API, 5 kiểm thử đầu cuối); Thông chạy lệnh commit và đẩy lên GitHub theo [07 Deployment plan](07-deployment.md) mục 4.

**Kết quả:** [07 Deployment plan](07-deployment.md) viết lại; [08 Red-team review](08-red-team-review.md); cập nhật 01, 03, 04, 05, 06; NFR-02, NFR-06, NFR-07 sửa; thêm NFR-10; thêm ADR-07, ADR-08.

