-- Tạo Database
CREATE DATABASE MaverickDressesDB;
GO

USE MaverickDressesDB;
GO

-- Bảng Roles (quyền người dùng)
CREATE TABLE Roles (
    RoleID INT PRIMARY KEY IDENTITY(1,1),
    RoleName NVARCHAR(50) NOT NULL
);

-- Bảng Users (người dùng)
CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(100) UNIQUE NOT NULL,
    Password NVARCHAR(255) NOT NULL,
    Email NVARCHAR(100),
    FullName NVARCHAR(100),
    RoleID INT FOREIGN KEY REFERENCES Roles(RoleID),
    CreatedAt DATETIME DEFAULT GETDATE(),
    IsActive BIT DEFAULT 1
);

-- Bảng Loại Sản Phẩm
CREATE TABLE ProductCategory (
    CategoryID INT PRIMARY KEY IDENTITY(1,1),
    CategoryName NVARCHAR(100) NOT NULL
);

-- Bảng Sản Phẩm (thêm giới tính và ảnh đại diện)
CREATE TABLE Product (
    ProductID INT PRIMARY KEY IDENTITY(1,1),
    ProductName NVARCHAR(200) NOT NULL,
    Description NVARCHAR(500),
    Gender NVARCHAR(20) CHECK (Gender IN ('Male', 'Female', 'Unisex')),
    CategoryID INT FOREIGN KEY REFERENCES ProductCategory(CategoryID),
    ThumbnailURL NVARCHAR(300) -- ảnh đại diện chính
);

-- Bảng Size (kích cỡ)
CREATE TABLE Size (
    SizeID INT PRIMARY KEY IDENTITY(1,1),
    SizeName NVARCHAR(50) NOT NULL -- S, M, L, XL...
);

-- Bảng Color (màu sắc)
CREATE TABLE Color (
    ColorID INT PRIMARY KEY IDENTITY(1,1),
    ColorName NVARCHAR(50) NOT NULL -- Red, Blue...
);

-- Bảng biến thể sản phẩm theo size + màu (chứa ảnh + giá + tồn kho)
CREATE TABLE ProductVariant (
    VariantID INT PRIMARY KEY IDENTITY(1,1),
    ProductID INT FOREIGN KEY REFERENCES Product(ProductID),
    SizeID INT FOREIGN KEY REFERENCES Size(SizeID),
    ColorID INT FOREIGN KEY REFERENCES Color(ColorID),
    Price DECIMAL(10,2),
    StockQuantity INT,
    ImageURL NVARCHAR(300) -- ảnh biến thể (khác màu, khác kiểu)
);

-- Bảng Phản hồi người dùng
CREATE TABLE Feedback (
    FeedbackID INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100),
    Email NVARCHAR(100),
    Message NVARCHAR(MAX),
    SubmittedAt DATETIME DEFAULT GETDATE()
);

-- Bảng Chi nhánh
CREATE TABLE Branch (
    BranchID INT PRIMARY KEY IDENTITY(1,1),
    BranchName NVARCHAR(100),
    Address NVARCHAR(300),
    City NVARCHAR(100),
    Latitude FLOAT,
    Longitude FLOAT,
    Phone NVARCHAR(20),
    Email NVARCHAR(100)
);

-- Bảng thông tin liên hệ công ty chính
CREATE TABLE ContactInfo (
    ContactID INT PRIMARY KEY IDENTITY(1,1),
    Address NVARCHAR(300),
    City NVARCHAR(100),
    Email NVARCHAR(100),
    Phone NVARCHAR(20),
    Latitude FLOAT,
    Longitude FLOAT
);

-- Bảng ghi lại lượt truy cập
CREATE TABLE VisitorLog (
    VisitID INT PRIMARY KEY IDENTITY(1,1),
    IPAddress NVARCHAR(50),
    VisitTime DATETIME DEFAULT GETDATE(),
    Location NVARCHAR(200)
);
