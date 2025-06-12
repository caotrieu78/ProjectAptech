# Project Aptech - Maverick Dresses Website

## Giới thiệu
Đây là website chính thức của công ty **Maverick Dresses**, chuyên sản xuất và phân phối đồng phục học sinh. Website cung cấp thông tin về sản phẩm, dịch vụ, và giao diện quản trị để quản lý danh mục sản phẩm và đơn hàng.

## Công nghệ sử dụng
- **Backend**: Laravel (PHP Framework)
- **Frontend**: ReactJS (JavaScript Library)
- **Database**: MySQL
- **Hỗ trợ**: Composer, Node.js, NPM

## Yêu cầu hệ thống
- PHP >= 8.1
- Composer
- Node.js và NPM (phiên bản LTS)
- MySQL 5.7 hoặc cao hơn
- Server hỗ trợ PHP (Apache/Nginx hoặc `php artisan serve`)

## Hướng dẫn cài đặt

### 1. Clone repository
```bash
git clone <repository-url>
cd ProjectAptech
```

### 2. Cài đặt backend (Laravel)
- Cài đặt dependencies:
```bash
composer install
```
- Sao chép file `.env.example` thành `.env`:
```bash
cp .env.example .env
```
- Cấu hình thông tin database trong file `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=maverick_dresses
DB_USERNAME=your_username
DB_PASSWORD=your_password
```
- Tạo khóa ứng dụng:
```bash
php artisan key:generate
```
- Chạy migration để tạo bảng trong database:
```bash
php artisan migrate
```
- (Tùy chọn) Chạy seeder nếu có dữ liệu mẫu:
```bash
php artisan db:seed
```

### 3. Cài đặt frontend (ReactJS)
- Chuyển đến thư mục frontend (nếu tách biệt, ví dụ `frontend/`):
```bash
cd frontend
npm install
```
- Cấu hình API URL trong file `.env` của frontend:
```env
REACT_APP_API_URL=http://localhost:8000/api
```
- Biên dịch tài nguyên (cho production):
```bash
npm run build
```

### 4. Cấu hình CORS
- Đảm bảo backend Laravel cho phép gọi API từ frontend ReactJS (chạy trên `http://localhost:3000`).
- Cài đặt package CORS nếu chưa có:
```bash
composer require fruitcake/laravel-cors
```
- Cập nhật file `config/cors.php`:
```php
'paths' => ['api/*'],
'allowed_methods' => ['*'],
'allowed_origins' => ['http://localhost:3000'],
'allowed_headers' => ['*'],
```

### 5. Chạy ứng dụng
- **Backend**: Khởi động server Laravel:
```bash
php artisan serve
```
- **Frontend**: Chuyển đến thư mục frontend và chạy:
```bash
cd frontend
npm run dev
```
- Truy cập:
  - Frontend: `http://localhost:3000`
  - Backend API: `http://localhost:8000`

