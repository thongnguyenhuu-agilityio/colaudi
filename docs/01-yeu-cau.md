# Cờ Lau Đi — Tài liệu yêu cầu

| Mục | Nội dung |
| --- | --- |
| Dự án | Cờ Lau Đi: game demo cho buổi thuyết trình nội bộ "Claude cho Dev, BA và QA" |
| Phiên bản tài liệu | 1.0 |
| Ngày cập nhật | 13/10/2026 |
| Chủ sản phẩm (quyết định phi kỹ thuật) | Thông |
| Phân tích, kiến trúc, phát triển, kiểm thử | Claude |
| Trạng thái | Đã chốt yêu cầu; đã có bản chạy được; còn 6 việc mở (mục 11) |
| Bộ tài liệu | [00 Mục lục](00-muc-luc.md) |

Tài liệu này được viết như một hồ sơ yêu cầu thật trong quy trình phát triển phần mềm: yêu cầu → hỏi đáp làm rõ → quyết định → user story → truy vết tới code và test. Nó cũng là "đáp án mẫu" cho phần live demo BA → Dev → QA trong buổi thuyết trình.

---

## 1. Bối cảnh và mục tiêu

Công ty phần mềm thuê ngoài, khách hàng nói tiếng Anh. Thông trình bày nội bộ về Claude cho hơn 100 lập trình viên, BA và QA đã từng dùng một công cụ AI lập trình.

**Mục tiêu của buổi thuyết trình**

1. Mỗi vai trò (Dev, BA, QA) thấy rõ Claude giúp mình ở đâu trong công việc hằng ngày.
2. Khán giả thấy một quy trình liền mạch: yêu cầu mơ hồ → user story → code có test → kiểm thử tự động → deploy.
3. Khán giả rời buổi với một việc cụ thể để thử ngay trong tuần.

**Mục tiêu của game**

1. Mở màn gây chú ý: khán giả bỏ phiếu A/B/C trong chat Google Meet.
2. Làm sản phẩm thật cho phần live demo: một tính năng đi qua đủ BA → Dev → QA.
3. Kết bài bằng một câu chốt dễ nhớ: "Cờ Lau Đi" đọc nhanh thành "Claude".

---

## 2. Phạm vi

**Trong phạm vi**

- Game một trang chạy trên trình duyệt, máy tính và điện thoại.
- Chế độ tập trận nhanh (3 trận, cho người trình bày) và chế độ đủ 12 trận (cho khán giả).
- Tính điểm và bảng xếp hạng chung (bảng vàng) cập nhật trực tiếp.
- Màn lên ngôi năm 968 và màn kết "Claude ra đời".
- Deploy miễn phí cho một buổi demo.

**Ngoài phạm vi**

- Tài khoản người chơi, đăng nhập.
- Dữ liệu công ty hoặc khách hàng (game không chứa bất kỳ dữ liệu nào như vậy).
- Dùng cho mục đích thương mại.

---

## 3. Người dùng

| Vai trò | Mô tả | Nhu cầu chính |
| --- | --- | --- |
| Người trình bày | Thông, chia sẻ màn hình trong Meet | Điều khiển hoàn toàn bằng bàn phím; chữ đủ to khi qua phòng relay |
| Khán giả | Hơn 100 người, Dev là đa số, có BA và QA | Bỏ phiếu trong chat; tự chơi trên máy hoặc điện thoại; thấy tên mình trên bảng vàng |
| Người điều phối | Co-host phòng A, người vận hành phòng relay B | Đọc chat, giữ giờ, xoá tên không phù hợp trên bảng vàng |

---

## 4. Yêu cầu chức năng

| Mã | Yêu cầu | Ưu tiên |
| --- | --- | --- |
| FR-01 | Câu chuyện dựa trên điển tích Đinh Bộ Lĩnh dùng cờ lau tập trận và dẹp loạn 12 sứ quân | Bắt buộc |
| FR-02 | Tiếng hô xuất trận viết là “Cờ Lau” đi: “Cờ Lau” trong ngoặc kép là tiếng lóng chỉ Claude, “đi” là lời khuyến khích dùng Claude | Bắt buộc |
| FR-03 | Bản đồ 12 sứ quân quanh Hoa Lư; mỗi sứ quân là một nỗi khổ của nghề phần mềm | Bắt buộc |
| FR-04 | Mỗi trận là câu hỏi 3 lựa chọn A/B/C; đáp án đúng là một kỹ thuật dùng Claude, kèm giải thích ngắn | Bắt buộc |
| FR-05 | Chọn sai thì hiện câu đùa và cho chọn lại | Bắt buộc |
| FR-06 | Chế độ nhanh: thắng 3 trận, các sứ quân còn lại quy phục | Bắt buộc |
| FR-07 | Chế độ đủ 12 trận để ghi danh bảng vàng | Bắt buộc |
| FR-08 | Tính điểm: đúng ngay lần đầu 3 điểm, sai một lần 1 điểm, sai hai lần 0 điểm; tối đa 36 | Bắt buộc |
| FR-09 | Bảng vàng: 10 người dẫn đầu, sắp theo điểm giảm dần, bằng điểm thì ai nhanh hơn xếp trên | Bắt buộc |
| FR-10 | Bảng vàng cập nhật trực tiếp (tối đa vài giây) cho mọi người xem | Bắt buộc |
| FR-11 | Người chơi ghi danh bằng tên tối đa 20 ký tự; mỗi lượt chơi chỉ ghi danh một lần | Bắt buộc |
| FR-12 | Có thể yêu cầu mã sự kiện khi ghi danh; mã chỉ chiếu trong buổi họp | Nên có |
| FR-13 | Người điều phối xoá được một tên hoặc xoá trắng bảng vàng | Nên có |
| FR-14 | Màn lên ngôi năm 968: văn phong hào hùng, đúng sử liệu, nhấn mạnh việc xưng Hoàng đế | Bắt buộc |
| FR-15 | Màn kết: "Trải hơn một nghìn năm", "Cờ Lau Đi" biến thành "Claude", rồi "Hịch Cờ Lau" theo giọng Hịch tướng sĩ, hiệu triệu tướng sỹ tập trận cùng Claude, không gọi đích danh vai trò; câu chốt "Cùng “Cờ Lau”, chúng ta tiến!" | Bắt buộc |
| FR-16 | Cờ lau vẽ giống cây lau thật: thân có đốt, lá dài hẹp, bông lau tơ mềm bay theo gió | Bắt buộc |
| FR-17 | Điều khiển bằng bàn phím: A/B/C, Enter, Esc, L (bảng vàng), S (tới đoạn kết), M (tắt tiếng) | Bắt buộc |
| FR-18 | Có âm thanh trống và chiêng, bật tắt được | Nên có |
| FR-19 | Màn kết trình bày lời hịch như chiếu thư trên giấy dó, đóng ấn son khắc "CLAU · DE" (không dùng logo nhãn hiệu Claude) | Bắt buộc |

---

## 5. Yêu cầu phi chức năng

| Mã | Yêu cầu | Cách kiểm chứng |
| --- | --- | --- |
| NFR-01 | Chi phí hạ tầng bằng 0 | Chỉ dùng gói miễn phí Vercel Hobby và Upstash Redis |
| NFR-02 | Chịu được hơn 100 người chơi cùng lúc trong 30 phút | Bảng vàng được giữ 2 giây ở CDN và trong bộ nhớ function; GET có tham số bị từ chối; giới hạn 40 lần gửi mỗi IP mỗi 10 phút |
| NFR-03 | Đọc rõ qua chia sẻ màn hình hai lớp (phòng A → phòng relay B) | Chữ chính từ 16px trở lên; một màn hình mỗi cảnh ở 1440×810 |
| NFR-04 | Chạy được trên điện thoại | Bố cục một cột dưới 820px |
| NFR-05 | Không lộ ra ngoài công ty | Không chứa dữ liệu công ty; link và mã sự kiện chỉ chia sẻ trong buổi họp |
| NFR-06 | Chống phá điểm cơ bản | Server ghi giờ bắt đầu mỗi lượt và tự đo thời gian (bỏ qua thời gian trình duyệt gửi); tối thiểu `MIN_RUN_SEC` (mặc định 45 giây); điểm 0–36; tên đã làm sạch; mỗi lượt một lần; ban tổ chức khoá sổ được ngay |
| NFR-07 | Không deploy production trong lúc trình bày | Production chỉ thay đổi khi Thông đẩy `main`; Claude Code bị chặn `vercel --prod` bằng `.claude/settings.json` |
| NFR-08 | Code đọc được trên màn chiếu | HTML, CSS, JS thuần, không framework |
| NFR-10 | Không giả kết quả: khi mất kết nối máy chủ, game báo lỗi và cho gửi lại, không lưu tạm rồi báo đã ghi danh | e2e "a failed leaderboard poll never fakes a saved score" |
| NFR-09 | Lời văn tôn trọng người nghe: không xưng "ta", không gọi "ngươi", "các ngươi" | Rà soát nội dung: `grep -i "ngươi" public/game.js` không có kết quả |

---

## 6. Ràng buộc

- Google Meet của công ty chỉ có gói tối đa 100 người.
- Không chia sẻ nội dung ra ngoài công ty.
- Một buổi duy nhất, hoàn toàn online, phải tương tác được.
- Thời lượng: 30 phút trình bày và 30 phút hỏi đáp.
- Nói tiếng Việt, slide tiếng Anh.

---

## 7. Nhật ký hỏi đáp làm rõ yêu cầu

Toàn bộ 30 câu hỏi, yêu cầu và góp ý, kèm câu trả lời, phương án cân nhắc và quyết định, nằm ở [02 Hỏi đáp và quyết định](02-hoi-dap.md). Các mục ảnh hưởng trực tiếp tới yêu cầu:

| Yêu cầu | Mục hỏi đáp |
| --- | --- |
| FR-01 đến FR-07, FR-17 (nội dung và cách chơi) | Q-07, Q-24, Q-28 |
| FR-08 đến FR-13 (tính điểm, bảng vàng) | Q-12, Q-15, Q-16 |
| FR-14 (màn lên ngôi) | Q-17, Q-20 |
| FR-15, FR-19 (màn kết, lời hịch, ấn son, câu chốt) | Q-08, Q-21, Q-22, Q-23, Q-24, Q-26, Q-27 |
| FR-16 (cờ lau) | Q-18 |
| NFR-01, NFR-02 (chi phí, tải) | Q-13, Q-15 |
| NFR-03, NFR-05 (hiển thị qua phòng relay, nội bộ) | Q-02 đến Q-06 |
| NFR-09 (lời văn tôn trọng người nghe) | Q-24 |

---

## 8. Quyết định kiến trúc

Sáu quyết định kiến trúc (ADR-01 đến ADR-06), kèm sơ đồ, API và dữ liệu, nằm ở [03 Kiến trúc](03-kien-truc.md). Tóm tắt: game là trang tĩnh; bảng vàng dùng một Vercel Function và một sorted set trong Upstash Redis; HTML, CSS, JS thuần; trình duyệt hỏi lại mỗi 3 giây, CDN giữ kết quả 2 giây; mã sự kiện thay cho đăng nhập; không dùng logo nhãn hiệu Claude.

---

## 9. User story và tiêu chí chấp nhận

### US-01: Ghi danh bảng vàng

> Là người chơi chế độ đủ 12 trận, tôi muốn được tính điểm và ghi tên lên bảng vàng chung, để thi đua với đồng nghiệp trong buổi thuyết trình.

**Tiêu chí chấp nhận**

| Mã | Given | When | Then |
| --- | --- | --- | --- |
| AC-01 | Tôi đang chơi chế độ đủ 12 trận | Tôi chọn đúng ngay lần đầu | Tôi được 3 điểm cho trận đó |
| AC-02 | Tôi đang chơi chế độ đủ 12 trận | Tôi chọn sai một lần rồi chọn đúng | Tôi được 1 điểm |
| AC-03 | Tôi đang chơi chế độ đủ 12 trận | Tôi chọn sai hai lần rồi chọn đúng | Tôi được 0 điểm |
| AC-04 | Tôi đã thắng đủ 12 trận | Tôi nhập tên và bấm Ghi danh | Tên, điểm và thời gian của tôi xuất hiện trên bảng vàng, kèm thứ hạng |
| AC-05 | Hai người bằng điểm | Bảng vàng hiển thị | Người hoàn thành nhanh hơn xếp trên |
| AC-06 | Tôi đã ghi danh lượt chơi này | Tôi gửi lại lần nữa | Hệ thống từ chối: "Lượt chơi này đã được ghi danh." |
| AC-07 | Ban tổ chức đặt mã sự kiện | Tôi nhập sai mã | Hệ thống từ chối và nhắc mã được chiếu trong buổi họp |
| AC-08 | Có người khác vừa ghi danh | Tôi đang xem bảng vàng | Bảng cập nhật trong vòng vài giây, không cần tải lại trang |
| AC-09 | Tôi nhập tên dài hơn 20 ký tự | Tôi ghi danh | Tên được cắt còn 20 ký tự |

### US-02: Màn lên ngôi

> Là người trình bày, tôi muốn màn lên ngôi hào hùng và đúng sử liệu, để câu chuyện có cao trào trước khi tiết lộ "Claude".

**Tiêu chí chấp nhận**

| Mã | Tiêu chí |
| --- | --- |
| AC-10 | Hiện lần lượt từng nhịp, Enter để sang nhịp kế; tự chạy nếu không bấm |
| AC-11 | Nêu đúng: năm Mậu Thìn 968, tước hiệu Đại Thắng Minh Hoàng Đế, quốc hiệu Đại Cồ Việt, kinh đô Hoa Lư, niên hiệu Thái Bình |
| AC-12 | Nhấn mạnh "Không xưng Vương, xưng Hoàng Đế" và nói đúng rằng nhà Tống chỉ phong tước vương |
| AC-13 | Toàn bộ màn vừa một màn hình 1440×810 |

---

## 10. Ma trận truy vết

| Yêu cầu | Code | Kiểm thử |
| --- | --- | --- |
| FR-08, AC-01–AC-03 | `public/score.js` → `pointsFor`, `totalPoints` | `tests/score.test.js`; `e2e/leaderboard.spec.js` (kiểm điểm sau mỗi trận) |
| FR-09, AC-05 | `public/score.js` → `rankValue`; `api/leaderboard.js` → `GET` | `tests/score.test.js`; `tests/api.test.js` (thứ tự theo điểm rồi thời gian) |
| FR-10, AC-08 | `public/game.js` → `startPolling`; header `Cache-Control` trong `GET` | Kiểm tra tay trong buổi chạy thử 2 |
| FR-11, AC-04, AC-06, AC-09 | `api/leaderboard.js` → `POST`, `cleanName` | `tests/api.test.js`; `e2e/leaderboard.spec.js` |
| FR-12, AC-07 | `api/leaderboard.js` → `EVENT_CODE` | `tests/api.test.js` |
| FR-13 | `api/leaderboard.js` → `DELETE` | `tests/api.test.js` |
| NFR-06 | `api/leaderboard.js` → kiểm tra đầu vào | `tests/api.test.js` (5 trường hợp từ chối) |
| FR-06, FR-14, FR-15, FR-19 | `public/game.js` → cảnh `surrender`, `crown`, `finale`, ấn `SEAL` | `e2e/leaderboard.spec.js` (chế độ nhanh tới màn "Claude") |
| FR-18 | `public/game.js` → khối `sound` (`sfx.drum`, `roll`, `gong`, `syncMute`): tổng hợp bằng Web Audio, không file âm thanh | Nghe thử bằng loa máy chiếu trong buổi chạy thử; tắt tiếng (M) cắt cả tiếng ngân |

---

## 11. Việc còn mở

| Mã | Việc | Người phụ trách |
| --- | --- | --- |
| V-01 | Ngày thuyết trình: **đã chốt Thứ Sáu 16/10/2026** (Q-29) | Thông |
| V-02 | Công ty đã cấp Claude cho nhân viên chưa (quyết định nội dung slide cuối) | Thông |
| V-03 | Tên co-host và người vận hành phòng relay B | Thông |
| V-04 | Đồng ý chạy game trên link công khai có mã sự kiện | Thông |
| V-05 | Phần thưởng nhỏ cho 3 người đứng đầu bảng vàng (không bắt buộc) | Thông |
| V-06 | Deploy lần đầu | Thông, theo [07 Deployment plan](07-deployment.md) mục 4 |

---

## 12. Kiểm chứng dữ kiện lịch sử

| Dữ kiện dùng trong game | Nguồn |
| --- | --- |
| Năm 968 xưng Đại Thắng Minh Hoàng Đế, quốc hiệu Đại Cồ Việt; ý nghĩa đề cao chủ quyền | [SGGP: 1050 năm Nhà nước Đại Cồ Việt](https://www.sggp.org.vn/1050-nam-nha-nuoc-dai-co-viet-dung-rieng-mot-nuoc-ngang-hang-voi-phuong-bac-post475637.html) |
| Kinh đô Hoa Lư; niên hiệu Thái Bình (970–980); lập triều đình với văn ban, võ ban; người đầu tiên xưng Hoàng đế | [Wikipedia: Đinh Bộ Lĩnh](https://en.wikipedia.org/wiki/%C4%90inh_B%E1%BB%99_L%C4%A9nh) |
| Nhà Tống phong Đinh Liễn làm Giao Chỉ quận vương năm 975, tức tước vương, không phải hoàng đế | [Wikipedia: Đinh Liễn](https://en.wikipedia.org/wiki/%C4%90inh_Li%E1%BB%85n) |
| Trần Lãm nhận Đinh Bộ Lĩnh làm con nuôi; danh sách 12 sứ quân | Sử liệu phổ thông về loạn 12 sứ quân (965–968) |
| "Một phen cất quân mà mười hai sứ quân phục hết" | Lời bàn của sử gia Lê Văn Hưu về Đinh Tiên Hoàng, chép trong Đại Việt sử ký toàn thư |

Ghi chú: trang Wikipedia tiếng Việt về Đinh Tiên Hoàng không truy cập được từ môi trường làm việc lúc soạn tài liệu, nên các dữ kiện trên được đối chiếu qua các nguồn liệt kê.
