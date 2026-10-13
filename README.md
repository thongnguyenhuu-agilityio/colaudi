# Cờ Lau Đi

Game demo cho buổi thuyết trình nội bộ "Claude cho Dev, BA và QA". Đinh Bộ Lĩnh dẹp loạn 12 sứ quân, mỗi sứ quân là một nỗi khổ của nghề phần mềm; bảng vàng chung cập nhật trực tiếp.

- Bộ tài liệu tiếng Việt: [docs/00-muc-luc.md](docs/00-muc-luc.md) (yêu cầu, hỏi đáp, kiến trúc, kế hoạch, tổ chức Google Meet, kịch bản)
- Chi phí hạ tầng: 0 đồng (Vercel Hobby + Upstash Redis miễn phí)

## Cấu trúc

```
public/index.html      giao diện, CSS
public/game.js         logic game, bảng vàng phía trình duyệt
public/score.js        luật tính điểm (hàm thuần, dùng chung cho trình duyệt và server)
api/leaderboard.js     API bảng vàng: GET top 10, POST ghi danh, DELETE cho ban tổ chức
scripts/dev.mjs        server chạy thử ở máy, không cần cài gì thêm
tests/                 kiểm thử đơn vị (Vitest)
e2e/                   kiểm thử đầu cuối (Playwright)
docs/                  bộ tài liệu dự án (bắt đầu từ 00-muc-luc.md)
```

## Chạy thử ở máy

```bash
npm run dev            # http://localhost:3000, bảng vàng lưu trong bộ nhớ
```

Không cần `npm install` để chạy game. Chỉ cần cài khi chạy kiểm thử:

```bash
npm install
npm test               # 28 kiểm thử đơn vị và API
npx playwright install chromium
npm run test:e2e       # 5 kiểm thử đầu cuối
```

## Deploy

Production chỉ thay đổi khi đẩy `main` lên GitHub (Vercel tự deploy). Không deploy production trong lúc trình bày. Các bước, lịch và checklist: [docs/07-deployment.md](docs/07-deployment.md). Kết quả review: [docs/08-red-team-review.md](docs/08-red-team-review.md).

```bash
npm run smoke -- https://<domain> --write      # kiểm tra nhanh sau mỗi lần deploy, không ghi gì lên bảng vàng
```

## Việc của ban tổ chức

Đặt khoá quản trị trong biến môi trường, không gõ thẳng vào lệnh: `export ADMIN_KEY=…`

```bash
npm run board -- https://<domain> top           # xem top 10 kèm id
npm run board -- https://<domain> rm "<tên>"    # xoá mọi lượt mang tên này
npm run board -- https://<domain> wipe          # xoá trắng bảng vàng
npm run board -- https://<domain> close         # khoá sổ, không nhận ghi danh nữa
npm run board -- https://<domain> open          # mở lại
```

## Phím tắt cho người trình bày

Mở game với `?presenter` để xem đủ phím tắt: `A` `B` `C` chọn chiêu · `Enter` tiếp tục · `Esc` về bản đồ · `L` bảng vàng · `S` tới đoạn kết (chỉ chế độ nhanh) · `M` tắt tiếng
