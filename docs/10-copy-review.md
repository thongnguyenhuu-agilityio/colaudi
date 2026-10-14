# Rà soát lời văn: giọng sử ký, hịch, chiếu

| Mục | Nội dung |
| --- | --- |
| Ngày cập nhật | 14/10/2026 (thêm vòng hai, mục 5) |
| Trạng thái | Chờ Thông duyệt từng dòng |
| Nhánh | `fix/archaic-copy` |
| Liên quan | [01 Yêu cầu](01-yeu-cau.md) NFR-09, mục 12 · [02 Hỏi đáp](02-hoi-dap.md) Q-24 · [06 Kịch bản](06-kich-ban-va-hoi-dap-khan-gia.md) |

## 1. Nguyên tắc

- **Vòng một (13/10):** giọng cổ chỉ dùng nơi **câu chuyện lên tiếng**: màn giới thiệu, lời thách và lời nhận xét của sứ quân, màn quy phục, màn lên ngôi, lời hịch. Nút, phím tắt, nhãn biểu mẫu, bảng vàng, thông báo lỗi và **các phương án A/B/C** giữ nguyên, ngắn và hiện đại. **Vòng hai (14/10, [Q-31](02-hoi-dap.md#q-31)) thay quy tắc này:** giọng cổ trang phủ cả tiêu đề, nút, nhãn và thông báo ngắn (mục 5); phương án A/B/C và đáp án vẫn giữ nguyên.
- Thuật ngữ phần mềm (Claude, CLAUDE.md, subagent, /clear, Explore, Jira, PR, deploy...) giữ nguyên: cái hay là giọng xưa đi với công cụ nay.
- Dữ kiện lịch sử giữ nguyên theo [01](01-yeu-cau.md) mục 12 (tên, năm 968, Đại Thắng Minh Hoàng Đế, Đại Cồ Việt, Thái Bình, Hoa Lư, lời Lê Văn Hưu).
- **Không dùng "ta", "ngươi", "các ngươi"** dù yêu cầu rà soát có nêu: Thông đã chốt ở [Q-24](02-hoi-dap.md#q-24) và NFR-09 (kiểm bằng `grep -i "ngươi" public/game.js`). Giọng cổ đạt được bằng từ Hán Việt, nhịp đối, "há", "chớ", "vậy", "chúng ta". Nếu muốn lật Q-24, đó là quyết định của Thông.
- Ý câu "Quân dẫu nhiều hay ít, thắng bại đều cốt ở chỗ luyện tập trước khi ra trận" giữ nguyên, không hàm ý quân đông là tốt hơn.
- Độ dài mỗi màn không tăng quá khoảng 10%.

## 2. Bảng trước → sau (38 dòng)

Cột "Màn" cho biết dòng nằm ở đâu. Gạch bỏ dòng nào thì giữ lại câu cũ ở cột "Trước".

| # | Màn | Trước | Sau |
| --- | --- | --- | --- |
| 1 | Giới thiệu | Bên sông Hoàng Long, cậu bé Đinh Bộ Lĩnh chăn trâu cùng lũ trẻ trong làng. Không có cờ, cậu bẻ bông lau làm cờ, bày trận đánh nhau như thật. | Thuở ấy, bên sông Hoàng Long, cậu bé Đinh Bộ Lĩnh chăn trâu cùng lũ trẻ trong làng. Không cờ xí, cậu bẻ bông lau làm cờ, bày trận như thật. |
| 2 | Giới thiệu | Mỗi lần xuất quân, cả bọn hô vang: | Mỗi phen xuất quân, cả bọn hô vang: |
| 3 | Giới thiệu | Lớn lên, đất nước rơi vào loạn mười hai sứ quân. Mỗi sứ quân giữ một vùng. Kỳ lạ thay, sứ quân nào cũng mang đúng một nỗi khổ của nghề phần mềm. | Đến khi trưởng thành, thiên hạ loạn mười hai sứ quân, mỗi người chiếm giữ một cõi. Lạ thay, sứ quân nào cũng mang đúng một nỗi khổ của nghề phần mềm. |
| 4 | Ngô Xương Xí · lời thách | Ba trăm file, không một dòng tài liệu. Có dám bước vào không? | Ba trăm file, không một dòng tài liệu. Kẻ nào dám bước vào? |
| 5 | Ngô Xương Xí · chọn sai A | Trời sáng mới đọc tới file thứ 12. Sứ quân cười khẩy. | Rạng sáng mới đọc tới file thứ 12. Sứ quân cười khẩy. |
| 6 | Ngô Xương Xí · chọn sai C | Senior hẹn... quý sau. | Senior hẹn sang quý sau. Giặc nào chờ được? |
| 7 | Đỗ Cảnh Thạc · lời thách | Lúc có lúc không. Trên máy tôi chạy ngon mà! | Khi hiện khi ẩn. Trên máy tại hạ, chạy ngon lành! |
| 8 | Đỗ Cảnh Thạc · chọn sai B | Trời nghe. Nhưng 2 giờ sáng thì trời cũng ngủ. | Trời nghe. Nhưng canh tư thì trời cũng ngủ. |
| 9 | Kiều Công Hãn · lời thách | Một ticket, mười hai màn hình, hạn chót thứ Sáu. | Một ticket, mười hai màn hình, hạn chót thứ Sáu. Ai gánh nổi? |
| 10 | Kiều Công Hãn · chọn sai B | Claude làm hết thật. Diff 4.000 dòng. Chúc review vui vẻ. | Claude làm hết thật. Diff bốn nghìn dòng, review xong tóc đã bạc. |
| 11 | Kiều Công Hãn · chọn sai C | Sửa chỗ này, vỡ chỗ kia. Vòng lặp vô tận. | Vá chỗ này, vỡ chỗ kia. Vòng lặp chẳng có hồi kết. |
| 12 | Nguyễn Khoan · lời thách | Dặn dùng pnpm, hắn lại npm. Dặn tab, hắn lại space. | Dặn dùng pnpm, hắn lại npm. Dặn tab, hắn lại space. Nào chịu nghe! |
| 13 | Ngô Nhật Khánh · lời thách | Dấu chấm phẩy lúc có lúc không. Ai làm gì được? | Dấu chấm phẩy khi có khi không. Thiên hạ biết làm sao? |
| 14 | Lý Khuê · lời thách | Mười bảy bước deploy, tuần nào cũng làm, lần nào cũng quên bước 9. | Mười bảy bước deploy, tuần nào cũng làm, lần nào cũng quên bước thứ chín. |
| 15 | Lý Khuê · chọn sai A | Notes có 14 bản. Bản nào mới nhất? Không ai biết. | Notes có mười bốn bản. Bản nào mới nhất? Không ai hay. |
| 16 | Lý Khuê · chọn sai C | Thực tập sinh hết kỳ. Bước 9 lại bị quên. | Thực tập sinh mãn kỳ. Bước thứ chín lại bị quên. |
| 17 | Nguyễn Siêu · lời thách | Năm ticket. Một người. Một ngày. | Năm ticket. Một người. Một ngày. Há có thể? |
| 18 | Nguyễn Siêu · chọn sai A | Năm việc giẫm chân nhau trong cùng một thư mục. Loạn. | Năm việc giẫm chân nhau trong một thư mục. Đại loạn. |
| 19 | Nguyễn Siêu · chọn sai C | Sáng ra xong hai việc và một quầng thâm. | Rạng sáng xong hai việc, thêm một quầng thâm. |
| 20 | Nguyễn Thủ Tiệp · chọn sai A | NÓ KHÔNG TỈNH. NÓ CHỈ THẤY NGƯƠI ĐANG GIẬN. | NÓ KHÔNG TỈNH. NÓ CHỈ BIẾT CÓ NGƯỜI ĐANG GIẬN. |
| 21 | Lã Đường · lời thách | Yêu cầu trong Jira, thiết kế trong Figma, dữ liệu trong DB. Copy-paste tới bao giờ? | Yêu cầu ở Jira, thiết kế ở Figma, dữ liệu ở DB. Copy-paste đến bao giờ cho cùng? |
| 22 | Lã Đường · chọn sai B | Ảnh thứ 37 bị mờ. Đúng trang quan trọng nhất. | Ảnh thứ ba mươi bảy bị mờ, đúng trang hệ trọng nhất. |
| 23 | Phạm Bạch Hổ · lời thách | PR ba nghìn dòng. Ai review nổi thì cứ review. | PR ba nghìn dòng. Ai review nổi, cứ đến đây! |
| 24 | Phạm Bạch Hổ · chọn sai B | Production đã ghi nhận lời khen. Và cả bug. | Production đã nhận lời khen. Nhận luôn cả bug. |
| 25 | Phạm Bạch Hổ · chọn sai C | Vấn đề không nằm ở tốc độ viết. | Gốc rễ chẳng nằm ở tốc độ viết. |
| 26 | Kiều Thuận · lời thách | Một lệnh thôi, cả thành sụp đổ. | Chỉ một lệnh, cả thành sụp đổ. |
| 27 | Kiều Thuận · chọn sai A | Can đảm. Nhưng không khôn ngoan. | Có dũng mà thiếu mưu. |
| 28 | Trần Lãm · lời thách | Không cần giao chiến. Một bên có kinh nghiệm, một bên có cờ lau: hợp lại mới mạnh. | Chẳng cần giao chiến. Một bên giàu kinh nghiệm, một bên có cờ lau: hợp lại ắt mạnh. |
| 29 | Trần Lãm · chọn sai A | Sai lầm lớn nhất của cả chiến dịch. | Đại sai lầm của cả chiến dịch. |
| 30 | Trần Lãm · chọn sai C | Rồi ai bắt mấy lỗi logic tinh vi? | Rồi ai bắt nổi những lỗi logic tinh vi? |
| 31 | Quy phục | Nghe tiếng hô “Cờ Lau” đi, các sứ quân còn lại lần lượt xin quy phục | Nghe tiếng hô “Cờ Lau” đi, các sứ quân còn lại khiếp vía, lần lượt xin quy phục |
| 32 | Lên ngôi · nhịp 1 | Mười hai sứ quân quy phục. Giang sơn thu về một mối. Tại Hoa Lư, Đinh Bộ Lĩnh lên ngôi. | Mười hai sứ quân đều phục, giang sơn thu về một mối. Bấy giờ tại Hoa Lư, Đinh Bộ Lĩnh lên ngôi. |
| 33 | Lên ngôi · nhịp 4 | Lần đầu tiên người đứng đầu nước Việt xưng <b>Hoàng đế</b>, đặt nước mình ngang hàng phương Bắc. Nhà Tống chỉ phong tước vương, nhưng trong cõi Nam, các triều đại về sau đều nối theo. | Lần đầu tiên người đứng đầu nước Việt xưng <b>Hoàng đế</b>, ngang hàng phương Bắc. Nhà Tống chỉ phong tước vương, song trong cõi Nam, các triều đại về sau đều noi theo. |
| 34 | Màn kết · nhịp 3 | Năm 2023, Claude ra đời. | Năm 2023, Claude xuất thế. |
| 35 | Hịch · đoạn 1 | Quân dù nhiều hay ít, thắng bại đều cốt ở luyện tập trước khi ra trận. | Quân dẫu nhiều hay ít, thắng bại đều cốt ở chỗ luyện tập trước khi ra trận. |
| 36 | Hịch · đoạn 2 | hạn chót dồn như thác lũ. Bao bữa quên ăn, bao đêm thức trắng, chỉ mong sớm dẹp yên bờ cõi. | hạn chót dồn như nước lũ. Bao bữa quên ăn, bao đêm trắng mắt, lòng những mong sớm dẹp yên bờ cõi. |
| 37 | Hịch · đoạn 3 | làm siêng năng, chớ lấy việc vá lỗi qua loa làm công trạng, chớ vì quen lối cũ mà ngại binh pháp mới. Giặc đã tới ải, lẽ nào khoanh tay mà nhìn? | làm cần mẫn, chớ lấy việc vá lỗi qua loa làm công trạng, chớ vì quen lối cũ mà ngại binh pháp mới. Giặc đã tới ải, há khoanh tay mà nhìn? |
| 38 | Hịch · đoạn 4 | Cùng nhau luyện binh pháp: hỏi cho tường, lập kế rồi hãy đánh, thử cho chắc rồi mới tin. Được vậy thì giặc nào cũng dẹp, ải nào cũng qua. | Hãy cùng luyện binh pháp: hỏi cho tường, lập kế rồi hãy đánh, thử cho chắc rồi mới tin. Được vậy, giặc nào chẳng dẹp, ải nào chẳng qua. |

## 3. Các điểm cố ý giữ nguyên

- Phương án A/B/C, câu hỏi thử thách, mẹo "Chiêu Claude" (nội dung dạy, cần hiểu ngay).
- Câu chốt "Cùng “Cờ Lau”, chúng ta tiến!" (Q-27), "Hỡi tướng sĩ!", "Cờ đã phất. Tướng sĩ, xuất trận!", "Bố cáo khắp nơi, ai nấy đều hay.", "Lưu danh thiên cổ.", "Trải hơn một nghìn năm…", lời bàn của Lê Văn Hưu, "Không xưng Vương. Xưng Hoàng Đế.".
- Tiêu đề màn giới thiệu "Cậu bé chăn trâu và lá cờ lau" (có kiểm thử đọc tiêu đề này).

## 4. Việc chờ Thông quyết

- Dòng "Năm 967" ở màn quy phục không có trong [01](01-yeu-cau.md) mục 12 (mục này chỉ ghi loạn 965–968 và lên ngôi 968). Chưa sửa vì không có nguồn để đối chiếu.
- Chữ "sỹ" đã đổi thành "sĩ" (tướng sĩ) cho khớp tên "Hịch tướng sĩ" gốc. Thông duyệt ngày 13/10/2026.
- "Năm 967" ở màn quy phục được giữ: năm dẹp xong mười hai sứ quân, trước khi lên ngôi năm 968. Thông duyệt ngày 13/10/2026.
- Dòng 1 trong [06 Kịch bản](06-kich-ban-va-hoi-dap-khan-gia.md) đã đổi "Mỗi lần xuất quân" thành "Mỗi phen xuất quân" cho khớp màn hình.

## 5. Vòng hai (14/10/2026): giọng cổ trang cho nút, nhãn và thông báo

Thông chốt ở [Q-31](02-hoi-dap.md#q-31): "Duyệt lại nội dung, đổi sang tông giọng cổ trang hơn. Ví dụ: Lên ngôi thì gọi là 'Đăng cơ'." Cùng đợt đó bỏ chế độ nhanh, nên các dòng của chế độ nhanh và màn quy phục được ghi là bỏ. Bảng dưới có 36 dòng (số 39 đến 74), mỗi dòng là một chuỗi đã đổi hoặc đã bỏ trong `public/game.js` và `public/index.html`.

**Giữ nguyên có chủ ý (đã cổ sẵn hoặc cần hiểu ngay):** "Bảng vàng", "Ghi danh", "Xuất quân", "Ngàn năm sau…", "Xem bảng vàng", nhãn "Đã dẹp" và "Kết minh", "Điểm N / 36" (kiểm thử đọc chuỗi này), "Đúng ngay / Sai một lần / Sai hai lần / Thời gian" ở bảng điểm, "Mã sự kiện", "Chiêu Claude:", câu hỏi và phương án A/B/C, mọi dữ kiện ở [01](01-yeu-cau.md) mục 12, các thuật ngữ phần mềm. Lời báo lỗi của máy chủ (`api/leaderboard.js`) chưa đổi vì được trích trong [01](01-yeu-cau.md) (AC-06, AC-07) và [03](03-kien-truc.md); nếu Thông muốn đổi giọng cả phần đó thì làm cùng test và tài liệu.

Kiểm tra: `grep -ci ngươi public/game.js` = 0; không có "ta" xưng hô mới ("chúng ta" ở lời hịch và câu chốt là câu cũ); mỗi cảnh vẫn vừa một màn hình ở 1440×810 và không cuộn ngang ở 390px (đo trước và sau, số đo giống nhau).

| # | Chỗ | Trước | Sau |
| --- | --- | --- | --- |
| 39 | Màn đầu · tiêu đề phụ | Dẹp loạn mười hai sứ quân, phiên bản dân phần mềm. | Dẹp loạn mười hai sứ quân, bản dành cho giới phần mềm. |
| 40 | Màn đầu · nút | Tập trận nhanh · 2 trận | (bỏ: không còn chế độ nhanh) |
| 41 | Màn đầu · nút | Đánh đủ 12 trận · ghi danh bảng vàng | Khởi binh · dẹp đủ 12 sứ quân |
| 42 | Màn đầu · dòng mới | (không có) | Dẹp đủ mười hai sứ quân mới được đăng cơ, danh xưng ghi lên bảng vàng. |
| 43 | Màn đầu · dòng phím | <kbd>Enter</kbd> tiếp tục | <kbd>Enter</kbd> tiếp bước |
| 44 | Màn đầu · dòng phím | <kbd>Esc</kbd> về bản đồ | <kbd>Esc</kbd> về địa đồ |
| 45 | Màn đầu · dòng phím người trình bày | <kbd>S</kbd> tới đoạn kết | (bỏ: phím S đã bị gỡ) |
| 46 | Giới thiệu · luật chơi | Đánh đủ 12 trận: đúng ngay lần đầu được 3 điểm, sai một lần được 1 điểm, sai hai lần được 0 điểm. Bằng điểm thì ai nhanh hơn xếp trên. | Luật quân: đúng ngay lần đầu được 3 điểm, sai một lần được 1 điểm, sai hai lần không được điểm. Bằng điểm thì ai nhanh hơn xếp trên. |
| 47 | Bản đồ · dòng dưới số sứ quân | Đánh đủ 12 trận để ghi danh bảng vàng. | Dẹp đủ mười hai sứ quân mới được đăng cơ. |
| 48 | Bản đồ · dòng của chế độ nhanh | Tập trận nhanh: thắng 2 trận, các sứ quân còn lại sẽ xin quy hàng. | (bỏ) |
| 49 | Bản đồ và trận · nút của chế độ nhanh | Tiếp tục | (bỏ) |
| 50 | Trận · nút sau thắng | Về bản đồ | Về địa đồ |
| 51 | Trận · nút góc trái | ← Bản đồ | ← Địa đồ |
| 52 | Trận · nhãn câu hỏi | Thử thách | Khiêu chiến |
| 53 | Trận · thanh bỏ phiếu | Khán giả bỏ phiếu trong chat: A, B hay C? | Ba quân bỏ phiếu trong chat: A, B hay C? |
| 54 | Trận · hết giờ bỏ phiếu | Hết giờ bỏ phiếu. Chốt đáp án! | Hết giờ bỏ phiếu. Mau chốt chiêu! |
| 55 | Màn quy phục (đã bỏ) · tiêu đề | Nghe tiếng hô “Cờ Lau” đi, các sứ quân còn lại khiếp vía, lần lượt xin quy phục | (bỏ cả màn: sau 12 trận không còn sứ quân nào để quy phục) |
| 56 | Màn quy phục (đã bỏ) · dòng năm | Năm 967 | (bỏ cùng màn; việc chờ Thông về "Năm 967" ở mục 4 không còn) |
| 57 | Ghi danh · nhãn ô tên | Tên ghi trên bảng vàng (tối đa 20 ký tự) | Danh xưng ghi trên bảng vàng (tối đa 20 ký tự) |
| 58 | Ghi danh · nút sang màn đăng cơ | Lên ngôi | Đăng cơ |
| 59 | Ghi danh · bảng đã khoá | Bảng vàng đã khoá sổ. Cảm ơn đã tham gia tập trận! | Bảng vàng đã khoá sổ. Đa tạ đã dự cuộc tập trận! |
| 60 | Ghi danh · bản xem thử | Khi deploy lên Vercel, bảng vàng là chung cho mọi người. | Khi đưa lên Vercel, bảng vàng là chung cho mọi người. |
| 61 | Ghi danh · thiếu tên | Hãy nhập tên để ghi danh. | Xin điền danh xưng để ghi danh. |
| 62 | Ghi danh · lỗi mạng | Không kết nối được máy chủ. Kiểm tra mạng rồi bấm Ghi danh lần nữa. | Chưa liên lạc được với máy chủ. Kiểm tra mạng rồi bấm Ghi danh lần nữa. |
| 63 | Ghi danh · lỗi khác | Chưa ghi danh được. Bấm Ghi danh lần nữa. | Ghi danh chưa thành. Bấm Ghi danh lần nữa. |
| 64 | Bảng vàng · đang tải (hai nơi) | Đang tải… | Đang truyền tin… |
| 65 | Bảng vàng · mất mạng | Mất kết nối, đang thử lại… | Mất liên lạc, đang thử lại… |
| 66 | Bảng vàng · trạng thái | Cập nhật trực tiếp · N người đã ghi danh | Cập nhật tức thời · N người đã ghi danh |
| 67 | Bảng vàng · bảng trống | Bảng vàng còn trống. Người đầu tiên ghi danh sẽ đứng đầu. | Bảng vàng còn bỏ trống. Ai ghi danh trước, người ấy đứng đầu. |
| 68 | Bảng vàng toàn màn hình · nút | Quay lại | Trở lại |
| 69 | Đăng cơ · nhịp 1 | Đinh Bộ Lĩnh lên ngôi. | Đinh Bộ Lĩnh đăng cơ. |
| 70 | Đăng cơ · gợi ý phím | Enter sang nhịp kế | Enter để tiếp nhịp |
| 71 | Màn kết · nút | Chơi lại | Khởi binh lại |
| 72 | Màn kết · dòng cuối | Trò chơi này được làm cùng Claude. | Trò chơi này dựng nên cùng Claude. |
| 73 | Thanh trên · nút | Màn đầu | Cổng thành |
| 74 | Thanh trên · nút âm thanh | Âm thanh: bật / tắt / bản tổng hợp (mẫu lỗi) · bấm để tải lại | Chiêng trống: bật / tắt / bản tổng hợp (mẫu lỗi) · bấm để tải lại |
