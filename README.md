# Memory Card Game

Một tựa game lật thẻ bài kinh điển (Match Pairs) được phát triển bằng **PixiJS v8** và **GSAP**.

## Tính Năng Nổi Bật
- **Lối chơi quen thuộc:** Lật 2 thẻ giống nhau để ghi điểm.
- **Hiệu ứng mượt mà:** Sử dụng GSAP để tạo hiệu ứng lật thẻ 3D, hiệu ứng xuất hiện và biến mất.
- **Hệ thống Particle:** Các hiệu ứng hạt đẹp mắt khi ghép đúng thẻ hoặc hoàn thành game.
- **Âm thanh:** Hệ thống âm thanh tương tác trọn vẹn bằng Web Audio API.
- **Responsive:** Giao diện tự động co giãn và sắp xếp số lượng thẻ phù hợp trên mọi kích thước màn hình (Mobile & Desktop).

## Kiến Trúc & Công Nghệ
- **Engine:** PixiJS v8 (Canvas/WebGL/WebGPU)
- **Animation:** GSAP 3
- **Quản lý trạng thái:** Lớp `Game` quản lý toàn bộ vòng lặp trò chơi, tính điểm và bộ đếm thời gian.
- **Assets:** Quản lý tập trung qua thư mục `assest/` của hệ thống.

## Cài Đặt & Chạy Game
1. Mở terminal tại thư mục này (`Memory Card`).
2. Cài đặt các gói phụ thuộc:
   ```bash
   pnpm install
   ```
3. Chạy server phát triển:
   ```bash
   pnpm run dev
   ```
4. Build bản production:
   ```bash
   pnpm run build
   ```
