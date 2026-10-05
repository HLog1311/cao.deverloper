CREATE DATABASE IF NOT EXISTS QL_SinhVien
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE QL_SinhVien;

DROP TABLE IF EXISTS Diem;
DROP TABLE IF EXISTS SinhVien;
DROP TABLE IF EXISTS Lop;

-- Bảng Lớp
CREATE TABLE Lop (
    MaLop INT AUTO_INCREMENT PRIMARY KEY,
    TenLop VARCHAR(100) NOT NULL,
    KhoaHoc VARCHAR(50) NOT NULL
) ENGINE=InnoDB;

-- Bảng Sinh viên
CREATE TABLE SinhVien (
    MaSV INT AUTO_INCREMENT PRIMARY KEY,
    HoTen VARCHAR(100) NOT NULL,
    NgaySinh DATE NULL,
    GioiTinh VARCHAR(10) NOT NULL,
    MaLop INT NOT NULL,

    CONSTRAINT CK_SinhVien_GioiTinh
        CHECK (GioiTinh IN ('Nam', 'Nữ')),

    CONSTRAINT FK_SinhVien_Lop
        FOREIGN KEY (MaLop)
        REFERENCES Lop(MaLop)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Bảng Điểm
CREATE TABLE Diem (
    MaDiem INT AUTO_INCREMENT PRIMARY KEY,
    MaSV INT NOT NULL,
    DiemLyThuyet FLOAT NOT NULL,
    DiemThucHanh FLOAT NOT NULL,

    CONSTRAINT FK_Diem_SinhVien
        FOREIGN KEY (MaSV)
        REFERENCES SinhVien(MaSV)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT CK_Diem_LyThuyet
        CHECK (DiemLyThuyet >= 0 AND DiemLyThuyet <= 10),

    CONSTRAINT CK_Diem_ThucHanh
        CHECK (DiemThucHanh >= 0 AND DiemThucHanh <= 10)
) ENGINE=InnoDB;

-- Thêm 3 lớp
INSERT INTO Lop (TenLop, KhoaHoc) VALUES
('CNTT01', 'K11 - 2023-2026'),
('CNTT02', 'K11 - 2023-2026'),
('CNTT03', 'K11 - 2023-2026');

-- Thêm 5 sinh viên
INSERT INTO SinhVien (HoTen, NgaySinh, GioiTinh, MaLop) VALUES
('Nguyễn Văn An', '2005-03-15', 'Nam', 1),
('Trần Thị Bình', '2005-07-20', 'Nữ', 1),
('Lê Hoàng Nam', '2005-01-10', 'Nam', 2),
('Phạm Thu Hà', '2005-09-05', 'Nữ', 2),
('Đỗ Minh Quân', '2005-11-25', 'Nam', 3);

-- Thêm 5 bản ghi điểm
INSERT INTO Diem (MaSV, DiemLyThuyet, DiemThucHanh) VALUES
(1, 8.5, 9.0),
(2, 7.0, 8.0),
(3, 6.0, 5.5),
(4, 9.0, 9.5),
(5, 4.5, 5.0);