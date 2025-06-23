-- Tạo CSDL
CREATE DATABASE IF NOT EXISTS MaverickDressesDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE MaverickDressesDB;

-- Bảng Roles
CREATE TABLE Roles (
    RoleID INT AUTO_INCREMENT PRIMARY KEY,
    RoleName VARCHAR(50) NOT NULL
);


CREATE TABLE Users (
    UserID CHAR(255) PRIMARY KEY,
    Username VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Email VARCHAR(100),
    FullName VARCHAR(100),
    Avatar VARCHAR(255), 
    RoleID INT,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    IsActive BOOLEAN DEFAULT TRUE,
    remember_token VARCHAR(100),
    FOREIGN KEY (RoleID) REFERENCES Roles(RoleID) ON DELETE SET NULL
);

-- Bảng token Sanctum
CREATE TABLE personal_access_tokens (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id CHAR(255)  NOT NULL,
    name VARCHAR(255) NOT NULL,
    token VARCHAR(64) NOT NULL,
    abilities TEXT,
    last_used_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    INDEX tokenable_type_id_index (tokenable_type, tokenable_id)
);

-- Bảng loại sản phẩm
CREATE TABLE ProductCategory (
    CategoryID INT AUTO_INCREMENT PRIMARY KEY,
    CategoryName VARCHAR(100) NOT NULL
);



-- Bảng sản phẩm
CREATE TABLE Product (
    ProductID INT AUTO_INCREMENT PRIMARY KEY,
    ProductName VARCHAR(200) NOT NULL,
    Description VARCHAR(500),
    Gender ENUM('Male', 'Female', 'Unisex'),
    CategoryID INT,
    ThumbnailURL VARCHAR(300),
    Price DECIMAL(10,2), -- Thêm cột này để lưu giá chung của sản phẩm
    FOREIGN KEY (CategoryID) REFERENCES ProductCategory(CategoryID) ON DELETE SET NULL
);

-- Bảng Size
CREATE TABLE Size (
    SizeID INT AUTO_INCREMENT PRIMARY KEY,
    SizeName VARCHAR(50) NOT NULL
);

-- Bảng Màu
CREATE TABLE Color (
    ColorID INT AUTO_INCREMENT PRIMARY KEY,
    ColorName VARCHAR(50) NOT NULL
);

-- Bảng biến thể sản phẩm
CREATE TABLE ProductVariant (
    VariantID INT AUTO_INCREMENT PRIMARY KEY,
    ProductID INT,
    SizeID INT,
    ColorID INT,
    Price DECIMAL(10,2),
    StockQuantity INT,
    ImageURL VARCHAR(300),
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID) ON DELETE CASCADE,
    FOREIGN KEY (SizeID) REFERENCES Size(SizeID) ON DELETE SET NULL,
    FOREIGN KEY (ColorID) REFERENCES Color(ColorID) ON DELETE SET NULL
);

-- Bảng phản hồi
CREATE TABLE Feedback (
    FeedbackID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100),
    Email VARCHAR(100),
    Message TEXT,
    SubmittedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Bảng chi nhánh
CREATE TABLE Branch (
    BranchID INT AUTO_INCREMENT PRIMARY KEY,
    BranchName VARCHAR(100),
    Address VARCHAR(300),
    City VARCHAR(100),
    Latitude DOUBLE,
    Longitude DOUBLE,
    Phone VARCHAR(20),
    Email VARCHAR(100)
);

-- Bảng thông tin liên hệ
CREATE TABLE ContactInfo (
    ContactID INT AUTO_INCREMENT PRIMARY KEY,
    Address VARCHAR(300),
    City VARCHAR(100),
    Email VARCHAR(100),
    Phone VARCHAR(20),
    Latitude DOUBLE,
    Longitude DOUBLE
);

-- ✅ Bảng log truy cập (đã thêm UserID)
CREATE TABLE VisitorLog (
    VisitID INT AUTO_INCREMENT PRIMARY KEY,
    IPAddress VARCHAR(50),
    VisitTime DATETIME DEFAULT CURRENT_TIMESTAMP,
    Location VARCHAR(200),
    UserID CHAR(255), -- sửa lại kiểu
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE SET NULL
)

CREATE TABLE CartItems (
    CartItemID INT AUTO_INCREMENT PRIMARY KEY,
    UserID CHAR(255),
    VariantID INT,
    Quantity INT NOT NULL DEFAULT 1,
    AddedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (VariantID) REFERENCES ProductVariant(VariantID) ON DELETE CASCADE
);
-- Bảng đơn hàng
CREATE TABLE Orders (
    OrderID INT AUTO_INCREMENT PRIMARY KEY,
    UserID CHAR(255),
    OrderDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    Status VARCHAR(50) DEFAULT 'Pending',
    TotalAmount DECIMAL(10,2),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE SET NULL
);

-- Bảng chi tiết đơn hàng
CREATE TABLE OrderDetails (
    OrderDetailID INT AUTO_INCREMENT PRIMARY KEY,
    OrderID INT,
    VariantID INT,
    Quantity INT,
    Price DECIMAL(10,2),
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID) ON DELETE CASCADE,
    FOREIGN KEY (VariantID) REFERENCES ProductVariant(VariantID) ON DELETE SET NULL
);

-- Dữ liệu mẫu
INSERT INTO Roles (RoleID, RoleName) VALUES (1, 'Admin'), (2, 'User');

INSERT INTO ProductCategory (CategoryName) VALUES 
('Váy dạ hội'),
('Váy công sở'),
('Váy cưới'),
('Váy thường ngày'),
('Váy mùa hè'),
('Váy mùa đông'),
('Váy dự tiệc'),
('Đầm maxi'),
('Đầm bodycon'),
('Váy vintage'),
('Đồng phục học sinh');
