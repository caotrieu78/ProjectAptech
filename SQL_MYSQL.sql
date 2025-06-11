-- Tạo Database
CREATE DATABASE IF NOT EXISTS MaverickDressesDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE MaverickDressesDB;

-- Bảng Roles (quyền người dùng)
CREATE TABLE Roles (
    RoleID INT AUTO_INCREMENT PRIMARY KEY,
    RoleName VARCHAR(50) NOT NULL
);

-- Bảng Users (người dùng)
CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Email VARCHAR(100),
    FullName VARCHAR(100),
    RoleID INT,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    IsActive BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (RoleID) REFERENCES Roles(RoleID)
);

-- Bảng Loại Sản Phẩm
CREATE TABLE ProductCategory (
    CategoryID INT AUTO_INCREMENT PRIMARY KEY,
    CategoryName VARCHAR(100) NOT NULL
);

-- Bảng Sản Phẩm (thêm giới tính và ảnh đại diện)
CREATE TABLE Product (
    ProductID INT AUTO_INCREMENT PRIMARY KEY,
    ProductName VARCHAR(200) NOT NULL,
    Description VARCHAR(500),
    Gender ENUM('Male', 'Female', 'Unisex'),
    CategoryID INT,
    ThumbnailURL VARCHAR(300),
    FOREIGN KEY (CategoryID) REFERENCES ProductCategory(CategoryID)
);

-- Bảng Size (kích cỡ)
CREATE TABLE Size (
    SizeID INT AUTO_INCREMENT PRIMARY KEY,
    SizeName VARCHAR(50) NOT NULL
);

-- Bảng Color (màu sắc)
CREATE TABLE Color (
    ColorID INT AUTO_INCREMENT PRIMARY KEY,
    ColorName VARCHAR(50) NOT NULL
);

-- Bảng biến thể sản phẩm theo size + màu
CREATE TABLE ProductVariant (
    VariantID INT AUTO_INCREMENT PRIMARY KEY,
    ProductID INT,
    SizeID INT,
    ColorID INT,
    Price DECIMAL(10,2),
    StockQuantity INT,
    ImageURL VARCHAR(300),
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID),
    FOREIGN KEY (SizeID) REFERENCES Size(SizeID),
    FOREIGN KEY (ColorID) REFERENCES Color(ColorID)
);

-- Bảng Phản hồi người dùng
CREATE TABLE Feedback (
    FeedbackID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100),
    Email VARCHAR(100),
    Message TEXT,
    SubmittedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Chi nhánh
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

-- Bảng thông tin liên hệ công ty chính
CREATE TABLE ContactInfo (
    ContactID INT AUTO_INCREMENT PRIMARY KEY,
    Address VARCHAR(300),
    City VARCHAR(100),
    Email VARCHAR(100),
    Phone VARCHAR(20),
    Latitude DOUBLE,
    Longitude DOUBLE
);

-- Bảng ghi lại lượt truy cập
CREATE TABLE VisitorLog (
    VisitID INT AUTO_INCREMENT PRIMARY KEY,
    IPAddress VARCHAR(50),
    VisitTime DATETIME DEFAULT CURRENT_TIMESTAMP,
    Location VARCHAR(200)
);





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
