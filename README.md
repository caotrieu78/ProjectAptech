# Project Aptech

## Website cho công ty Maverick Dresses - Mô tả sản xuất và phân phối quần áo học sinh

### Giới thiệu
Dự án này là một website được phát triển cho công ty Maverick Dresses, tập trung vào việc cung cấp thông tin và dịch vụ liên quan đến sản xuất và phân phối đồng phục học sinh.

### Công nghệ sử dụng
- **Laravel**: Framework PHP làm backend.
- **ReactJS**: Thư viện JavaScript để phát triển giao diện frontend.
- **MySQL**: Hệ quản trị cơ sở dữ liệu.

### Hướng dẫn cài đặt và sử dụng với Laravel và ReactJS

1. **Yêu cầu hệ thống**
   - PHP >= 8.1
   - Composer
   - Node.js và NPM
   - MySQL
   - Server với PHP (ví dụ: Apache hoặc Nginx)

2. **Cài đặt**
   - Clone repository: `git clone <repository-url>`
   - Di chuyển vào thư mục dự án: `cd ProjectAptech`
   - Cài đặt các dependencies:
     - `composer install` (cho backend Laravel)
     - `npm install` (cho frontend ReactJS)
   - Sao chép file `.env.example` thành `.env` và cấu hình thông tin kết nối database:
     ```
     DB_DATABASE=your_database
     DB_USERNAME=your_username
     DB_PASSWORD=your_password
     ```
   - Tạo key cho ứng dụng: `php artisan key:generate`
   - Chạy migration để tạo bảng trong database: `php artisan migrate`

3. **Chạy ứng dụng**
   - Chạy server backend: `php artisan serve`
   - Chuyển đến thư mục frontend (nếu tách biệt), chạy: `npm start`
   - Mở trình duyệt và truy cập: `http://localhost:3000` (ReactJS) hoặc `http://localhost:8000` (Laravel API)

4. **Quản lý tài nguyên**
   - Biên dịch tài nguyên frontend ReactJS: `npm run build`

### Hướng dẫn sử dụng
- Truy cập trang chủ để xem danh sách sản phẩm.
- Quản trị viên có thể đăng nhập để quản lý danh mục và đơn hàng qua giao diện admin.
