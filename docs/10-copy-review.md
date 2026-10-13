# Rà soát lời văn: giọng sử ký, hịch, chiếu

| Mục | Nội dung |
| --- | --- |
| Ngày cập nhật | 13/10/2026 |
| Trạng thái | Chờ Thông duyệt từng dòng |
| Nhánh | `fix/archaic-copy` |
| Liên quan | [01 Yêu cầu](01-yeu-cau.md) NFR-09, mục 12 · [02 Hỏi đáp](02-hoi-dap.md) Q-24 · [06 Kịch bản](06-kich-ban-va-hoi-dap-khan-gia.md) |

## 1. Nguyên tắc

- Giọng cổ chỉ dùng nơi **câu chuyện lên tiếng**: màn giới thiệu, lời thách và lời nhận xét của sứ quân, màn quy phục, màn lên ngôi, lời hịch. Nút, phím tắt, nhãn biểu mẫu, bảng vàng, thông báo lỗi và **các phương án A/B/C** giữ nguyên, ngắn và hiện đại.
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
