-- =====================================================
-- SCRIPT TẠO DATABASE HOÀN CHỈNH CHO HỆ THỐNG PET CARE MANAGEMENT
-- Bao gồm: Tạo database, tạo bảng, thêm dữ liệu test
-- =====================================================

-- ===== PHẦN 1: TẠO DATABASE =====
DROP DATABASE IF EXISTS petcaremanagement;
CREATE DATABASE petcaremanagement CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE petcaremanagement;

-- ===== PHẦN 2: TẠO CÁC BẢNG =====

-- Bảng Permission
CREATE TABLE permission (
    name VARCHAR(255) NOT NULL PRIMARY KEY,
    description VARCHAR(500)
);

-- Bảng Role
CREATE TABLE role (
    name VARCHAR(255) NOT NULL PRIMARY KEY,
    description VARCHAR(500)
);

-- Bảng Role_Permissions (Many-to-Many giữa Role và Permission)
CREATE TABLE role_permissions (
    role_name VARCHAR(255) NOT NULL,
    permissions_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (role_name, permissions_name),
    FOREIGN KEY (role_name) REFERENCES role(name) ON DELETE CASCADE,
    FOREIGN KEY (permissions_name) REFERENCES permission(name) ON DELETE CASCADE
);

-- Bảng User
CREATE TABLE user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    dob DATE,
    provider VARCHAR(100) DEFAULT 'local',
    gender VARCHAR(20)
);

-- Bảng User_Roles (Many-to-Many giữa User và Role)
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    roles_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id, roles_name),
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (roles_name) REFERENCES role(name) ON DELETE CASCADE
);

-- Bảng Pet
CREATE TABLE pet (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    species VARCHAR(100),
    breed VARCHAR(255),
    gender VARCHAR(20),
    dob DATE,
    weight DECIMAL(5,2),
    age INT,
    image VARCHAR(500),
    owner_id BIGINT,
    FOREIGN KEY (owner_id) REFERENCES user(id) ON DELETE CASCADE
);

-- Bảng Vet
CREATE TABLE vet (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone_number VARCHAR(20),
    clinic_address TEXT,
    specialty VARCHAR(255),
    user_id BIGINT UNIQUE,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- Bảng ServicesType
CREATE TABLE services_type (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(12,2)
);

-- Bảng Appointment
CREATE TABLE appointment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    date DATETIME,
    status VARCHAR(50) DEFAULT 'PENDING',
    vet_id BIGINT,
    user_id BIGINT,
    FOREIGN KEY (vet_id) REFERENCES vet(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- Bảng Appointment_Services (Many-to-Many giữa Appointment và ServicesType)
CREATE TABLE appointment_services (
    appointment_id BIGINT NOT NULL,
    services_id BIGINT NOT NULL,
    PRIMARY KEY (appointment_id, services_id),
    FOREIGN KEY (appointment_id) REFERENCES appointment(id) ON DELETE CASCADE,
    FOREIGN KEY (services_id) REFERENCES services_type(id) ON DELETE CASCADE
);

-- Bảng Product
CREATE TABLE product (
    product_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(100),
    quantity INT DEFAULT 0,
    price DECIMAL(12,2),
    sale_percent INT DEFAULT 0,
    image VARCHAR(500)
);

-- Bảng ShoppingCart
CREATE TABLE shopping_cart (
    shopping_cart_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    total_items INT DEFAULT 0,
    total_prices DECIMAL(15,2) DEFAULT 0,
    user_id BIGINT UNIQUE,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- Bảng CartItem
CREATE TABLE cart_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quantity INT NOT NULL,
    total_price DECIMAL(12,2),
    product_id BIGINT,
    shopping_cart_id BIGINT,
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE,
    FOREIGN KEY (shopping_cart_id) REFERENCES shopping_cart(shopping_cart_id) ON DELETE CASCADE
);

-- Bảng Orders
CREATE TABLE orders (
    order_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    total_quantity INT,
    total_price DECIMAL(15,2),
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- Bảng OrderItem
CREATE TABLE order_item (
    order_item_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quantity INT NOT NULL,
    price DECIMAL(12,2),
    order_id BIGINT,
    product_id BIGINT,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE
);

-- Bảng WeightRecord
CREATE TABLE weight_record (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    record_date DATE NOT NULL,
    weight DECIMAL(5,2) NOT NULL,
    pet_id BIGINT,
    FOREIGN KEY (pet_id) REFERENCES pet(id) ON DELETE CASCADE
);

-- Bảng Vaccination
CREATE TABLE vaccination (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vaccine_name VARCHAR(255) NOT NULL,
    vaccination_date DATE NOT NULL,
    next_due_date DATE,
    note TEXT,
    pet_id BIGINT,
    FOREIGN KEY (pet_id) REFERENCES pet(id) ON DELETE CASCADE
);

-- Bảng MedicalRecord
CREATE TABLE medical_record (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    visit_date DATE NOT NULL,
    diagnosis TEXT,
    treatment TEXT,
    notes TEXT,
    pet_id BIGINT,
    FOREIGN KEY (pet_id) REFERENCES pet(id) ON DELETE CASCADE
);

-- Bảng InvalidatedToken (cho JWT blacklist)
CREATE TABLE invalidated_token (
    id VARCHAR(255) PRIMARY KEY,
    expiry_time DATETIME
);

-- ===== PHẦN 3: THÊM DỮ LIỆU =====

-- 1. Thêm Permissions
INSERT INTO permission (name, description) VALUES
('READ_USER', 'Quyền xem thông tin người dùng'),
('WRITE_USER', 'Quyền chỉnh sửa thông tin người dùng'),
('READ_PET', 'Quyền xem thông tin thú cưng'),
('WRITE_PET', 'Quyền chỉnh sửa thông tin thú cưng'),
('READ_VET', 'Quyền xem thông tin bác sĩ thú y'),
('WRITE_VET', 'Quyền chỉnh sửa thông tin bác sĩ thú y'),
('READ_APPOINTMENT', 'Quyền xem lịch hẹn'),
('WRITE_APPOINTMENT', 'Quyền đặt và chỉnh sửa lịch hẹn'),
('READ_PRODUCT', 'Quyền xem sản phẩm'),
('WRITE_PRODUCT', 'Quyền chỉnh sửa sản phẩm'),
('READ_ORDER', 'Quyền xem đơn hàng'),
('WRITE_ORDER', 'Quyền chỉnh sửa đơn hàng'),
('ADMIN', 'Quyền quản trị hệ thống');

-- 2. Thêm Roles
INSERT INTO role (name, description) VALUES
('ADMIN', 'Quản trị viên hệ thống'),
('USER', 'Người dùng thông thường'),
('VET', 'Bác sĩ thú y');

-- 3. Thêm Role Permissions
INSERT INTO role_permissions (role_name, permissions_name) VALUES
-- Admin có tất cả quyền
('ADMIN', 'READ_USER'),
('ADMIN', 'WRITE_USER'),
('ADMIN', 'READ_PET'),
('ADMIN', 'WRITE_PET'),
('ADMIN', 'READ_VET'),
('ADMIN', 'WRITE_VET'),
('ADMIN', 'READ_APPOINTMENT'),
('ADMIN', 'WRITE_APPOINTMENT'),
('ADMIN', 'READ_PRODUCT'),
('ADMIN', 'WRITE_PRODUCT'),
('ADMIN', 'READ_ORDER'),
('ADMIN', 'WRITE_ORDER'),
('ADMIN', 'ADMIN'),

-- User có quyền đọc thông tin và đặt lịch
('USER', 'READ_USER'),
('USER', 'READ_PET'),
('USER', 'WRITE_PET'),
('USER', 'READ_VET'),
('USER', 'READ_APPOINTMENT'),
('USER', 'WRITE_APPOINTMENT'),
('USER', 'READ_PRODUCT'),
('USER', 'READ_ORDER'),
('USER', 'WRITE_ORDER'),

-- Vet có quyền về y tế
('VET', 'READ_USER'),
('VET', 'READ_PET'),
('VET', 'WRITE_PET'),
('VET', 'READ_APPOINTMENT'),
('VET', 'WRITE_APPOINTMENT');

-- 4. Thêm Users (password đã được hash: 123456)
INSERT INTO user (id, user_name, email, password, dob, provider, gender) VALUES
(1, 'admin', 'admin@petcare.com', '$2a$10$9DHEYDfPyd/2RDI2DM6Cx.rO/4k.gUEwKjSST6/tyB8pviV2Ywfzy', '1990-01-01', 'local', 'Nam'),
(2, 'nguyenvana', 'nguyenvana@gmail.com', '$2a$10$9DHEYDfPyd/2RDI2DM6Cx.rO/4k.gUEwKjSST6/tyB8pviV2Ywfzy', '1992-05-15', 'local', 'Nam'),
(3, 'tranthiha', 'tranthiha@gmail.com', '$2a$10$9DHEYDfPyd/2RDI2DM6Cx.rO/4k.gUEwKjSST6/tyB8pviV2Ywfzy', '1995-08-20', 'local', 'Nữ'),
(4, 'phamtuan', 'phamtuan@gmail.com', '$2a$10$9DHEYDfPyd/2RDI2DM6Cx.rO/4k.gUEwKjSST6/tyB8pviV2Ywfzy', '1988-11-10', 'local', 'Nam'),
(5, 'levananh', 'levananh@gmail.com', '$2a$10$9DHEYDfPyd/2RDI2DM6Cx.rO/4k.gUEwKjSST6/tyB8pviV2Ywfzy', '1993-03-25', 'local', 'Nữ'),
(6, 'drthanh', 'drthanh@gmail.com', '$2a$10$9DHEYDfPyd/2RDI2DM6Cx.rO/4k.gUEwKjSST6/tyB8pviV2Ywfzy', '1985-07-12', 'local', 'Nam'),
(7, 'drlinh', 'drlinh@gmail.com', '$2a$10$9DHEYDfPyd/2RDI2DM6Cx.rO/4k.gUEwKjSST6/tyB8pviV2Ywfzy', '1987-09-05', 'local', 'Nữ'),
(8, 'staffminh', 'minh@petcare.com', '$2a$10$9DHEYDfPyd/2RDI2DM6Cx.rO/4k.gUEwKjSST6/tyB8pviV2Ywfzy', '1998-12-18', 'local', 'Nam');

-- 5. Thêm User Roles
INSERT INTO user_roles (user_id, roles_name) VALUES
(1, 'ADMIN'),
(2, 'USER'),
(3, 'USER'),
(4, 'USER'),
(5, 'USER'),
(6, 'VET'),
(7, 'VET'),
(8, 'USER');

-- 6. Thêm Pets
INSERT INTO pet (id, name, species, breed, gender, dob, weight, age, image, owner_id) VALUES
(1, 'Max', 'Chó', 'Golden Retriever', 'Đực', '2020-05-15', 32.5, 4, 'golden_retriever.jpg', 2),
(2, 'Luna', 'Mèo', 'Maine Coon', 'Cái', '2021-03-10', 8.2, 3, 'maine_coon.jpg', 2),
(3, 'Rocky', 'Chó', 'Husky', 'Đực', '2019-12-25', 26.8, 5, 'husky.jpg', 3),
(4, 'Bella', 'Chó', 'Poodle', 'Cái', '2022-01-30', 12.3, 2, 'poodle.jpg', 4),
(5, 'Milo', 'Mèo', 'Scottish Fold', 'Đực', '2020-11-05', 5.4, 3, 'scottish_fold.jpg', 3),
(6, 'Coco', 'Chó', 'Chihuahua', 'Cái', '2021-07-12', 3.2, 2, 'chihuahua.jpg', 5),
(7, 'Oliver', 'Mèo', 'Munchkin', 'Đực', '2022-04-18', 4.0, 1, 'munchkin.jpg', 5),
(8, 'Daisy', 'Chó', 'Corgi', 'Cái', '2020-09-01', 13.7, 3, 'corgi.jpg', 4);

-- 7. Thêm Vets (liên kết với User)
INSERT INTO vet (id, name, email, phone_number, clinic_address, specialty, user_id) VALUES
(1, 'Dr. Thanh Nguyễn', 'drthanh@petcare.com', '0901234567', 'Số 15 Nguyễn Trãi, Quận 1, TP.HCM', 'Ngoại khoa', 6),
(2, 'Dr. Linh Trần', 'drlinh@petcare.com', '0912345678', 'Số 25 Lê Lợi, Quận 1, TP.HCM', 'Da liễu', 7);

-- 8. Thêm Services
INSERT INTO services_type (id, name, description, price) VALUES
(1, 'Khám tổng quát', 'Kiểm tra sức khỏe tổng thể cho thú cưng', 200000),
(2, 'Tiêm phòng', 'Các loại vắc-xin phòng bệnh cho thú cưng', 350000),
(3, 'Phẫu thuật', 'Các dịch vụ phẫu thuật như thiến, triệt sản, ...', 1500000),
(4, 'Nha khoa', 'Vệ sinh răng miệng, nhổ răng, chữa bệnh răng miệng', 500000),
(5, 'Tắm và cắt tỉa lông', 'Dịch vụ làm đẹp cho thú cưng', 300000),
(6, 'Siêu âm', 'Kiểm tra nội tạng bằng siêu âm', 450000),
(7, 'X-quang', 'Chụp X-quang chẩn đoán', 550000),
(8, 'Xét nghiệm máu', 'Xét nghiệm máu cơ bản', 400000);

-- 9. Thêm Appointments cho Dr. Thanh (user_id = 6)
INSERT INTO appointment (id, name, email, date, status, vet_id, user_id) VALUES
(1, 'Khám định kỳ cho Max', 'nguyenvana@gmail.com', '2024-09-06 09:00:00', 'PENDING', 1, 2),
(2, 'Tiêm phòng cho Luna', 'nguyenvana@gmail.com', '2024-09-07 10:30:00', 'PENDING', 1, 2),
(3, 'Khám chân cho Rocky', 'tranthiha@gmail.com', '2024-09-08 14:00:00', 'PENDING', 1, 3),
(4, 'Siêu âm cho Bella', 'phamtuan@gmail.com', '2024-09-09 16:30:00', 'CONFIRMED', 1, 4),
(5, 'Khám tổng quát cho Max', 'nguyenvana@gmail.com', '2024-09-05 08:30:00', 'COMPLETED', 1, 2),
(6, 'Tiêm phòng cho Rocky', 'tranthiha@gmail.com', '2024-09-04 11:00:00', 'COMPLETED', 1, 3),
(7, 'X-quang cho Milo', 'tranthiha@gmail.com', '2024-08-25 11:00:00', 'COMPLETED', 1, 3),
(8, 'Phẫu thuật thiến cho Max', 'nguyenvana@gmail.com', '2024-08-15 09:00:00', 'COMPLETED', 1, 2);

-- 10. Thêm Appointments cho Dr. Linh (user_id = 7)
INSERT INTO appointment (id, name, email, date, status, vet_id, user_id) VALUES
(9, 'Khám da cho Luna', 'nguyenvana@gmail.com', '2024-09-10 09:30:00', 'PENDING', 2, 2),
(10, 'Kiểm tra da cho Rocky', 'tranthiha@gmail.com', '2024-09-11 15:00:00', 'CONFIRMED', 2, 3),
(11, 'Điều trị viêm da cho Coco', 'levananh@gmail.com', '2024-08-20 10:00:00', 'COMPLETED', 2, 5);

-- 11. Thêm Appointment Services
INSERT INTO appointment_services (appointment_id, services_id) VALUES
(1, 1), -- Khám tổng quát cho Max
(2, 2), -- Tiêm phòng cho Luna
(3, 1), -- Khám chân cho Rocky
(4, 6), -- Siêu âm cho Bella
(5, 1), -- Khám tổng quát cho Max (đã hoàn thành)
(6, 2), -- Tiêm phòng cho Rocky (đã hoàn thành)
(7, 7), -- X-quang cho Milo (đã hoàn thành)
(8, 3), -- Phẫu thuật thiến cho Max (đã hoàn thành)
(9, 1), -- Khám da cho Luna
(10, 1), -- Kiểm tra da cho Rocky
(11, 1); -- Điều trị viêm da cho Coco (đã hoàn thành)

-- 12. Thêm Products
INSERT INTO product (product_id, name, description, type, quantity, price, sale_percent, image) VALUES
(1, 'Royal Canin Medium Adult', 'Thức ăn cho chó trưởng thành cỡ vừa', 'Thức ăn', 50, 750000, 0, 'royal_canin_medium.jpg'),
(2, 'Hill''s Science Diet Adult', 'Thức ăn cho mèo trưởng thành', 'Thức ăn', 40, 650000, 5, 'hills_cat.jpg'),
(3, 'Pedigree Adult', 'Thức ăn cho chó trưởng thành', 'Thức ăn', 60, 450000, 0, 'pedigree_adult.jpg'),
(4, 'Whiskas Adult', 'Thức ăn cho mèo trưởng thành', 'Thức ăn', 55, 380000, 0, 'whiskas_adult.jpg'),
(5, 'Lược chải lông cho chó', 'Lược chải lông chuyên dụng cho chó', 'Phụ kiện', 30, 120000, 0, 'dog_brush.jpg'),
(6, 'Lược chải lông cho mèo', 'Lược chải lông chuyên dụng cho mèo', 'Phụ kiện', 25, 150000, 10, 'cat_brush.jpg'),
(7, 'Dây dắt chó', 'Dây dắt chó cao cấp', 'Phụ kiện', 40, 200000, 0, 'dog_leash.jpg'),
(8, 'Vòng cổ cho mèo', 'Vòng cổ có chuông cho mèo', 'Phụ kiện', 35, 80000, 0, 'cat_collar.jpg'),
(9, 'Thuốc xổ giun cho chó', 'Thuốc xổ giun dạng viên cho chó', 'Thuốc', 45, 180000, 0, 'dog_dewormer.jpg'),
(10, 'Thuốc xổ giun cho mèo', 'Thuốc xổ giun dạng viên cho mèo', 'Thuốc', 40, 150000, 5, 'cat_dewormer.jpg'),
(11, 'Thuốc nhỏ gáy trị ve rận cho chó', 'Thuốc nhỏ gáy diệt ve, rận, bọ chét cho chó', 'Thuốc', 30, 250000, 0, 'dog_flea_treatment.jpg'),
(12, 'Thuốc nhỏ gáy trị ve rận cho mèo', 'Thuốc nhỏ gáy diệt ve, rận, bọ chét cho mèo', 'Thuốc', 28, 220000, 0, 'cat_flea_treatment.jpg'),
(13, 'Đồ chơi cho chó', 'Đồ chơi cao su phát tiếng kêu cho chó', 'Phụ kiện', 50, 90000, 10, 'dog_toy.jpg'),
(14, 'Đồ chơi cho mèo', 'Đồ chơi cần câu cho mèo', 'Phụ kiện', 45, 110000, 0, 'cat_toy.jpg'),
(15, 'Nệm cho chó', 'Nệm êm ái cho chó cỡ trung', 'Phụ kiện', 20, 450000, 15, 'dog_bed.jpg');

-- 13. Thêm Shopping Carts
INSERT INTO shopping_cart (shopping_cart_id, total_items, total_prices, user_id) VALUES
(1, 3, 2150000, 2),
(2, 2, 570000, 3),
(3, 2, 760000, 4),
(4, 1, 200000, 5);

-- 14. Thêm Cart Items
INSERT INTO cart_item (id, quantity, total_price, product_id, shopping_cart_id) VALUES
(1, 2, 1500000, 1, 1),  -- 2 gói Royal Canin trong giỏ của user 2
(2, 1, 650000, 2, 1),   -- 1 gói Hill's Science Diet trong giỏ của user 2
(3, 1, 450000, 3, 2),   -- 1 gói Pedigree trong giỏ của user 3
(4, 1, 120000, 5, 2),   -- 1 lược chải lông chó trong giỏ của user 3
(5, 2, 760000, 4, 3),   -- 2 gói Whiskas trong giỏ của user 4
(6, 1, 200000, 7, 4);   -- 1 dây dắt chó trong giỏ của user 5

-- 15. Thêm Orders
INSERT INTO orders (order_id, total_quantity, total_price, order_date, user_id) VALUES
(1, 3, 1020000, '2024-08-15 10:30:00', 2),
(2, 2, 570000, '2024-08-20 15:45:00', 3),
(3, 4, 1150000, '2024-09-05 09:15:00', 2);

-- 16. Thêm Order Items
INSERT INTO order_item (order_item_id, quantity, price, order_id, product_id) VALUES
-- Order 1: User 2
(1, 1, 450000, 1, 3),
(2, 1, 150000, 1, 6),
(3, 1, 420000, 1, 4),
-- Order 2: User 3
(4, 1, 450000, 2, 3),
(5, 1, 120000, 2, 5),
-- Order 3: User 2
(6, 2, 750000, 3, 1),
(7, 1, 200000, 3, 7),
(8, 1, 200000, 3, 9);

-- 17. Thêm Weight Records
INSERT INTO weight_record (id, record_date, weight, pet_id) VALUES
-- Max (pet_id: 1)
(1, '2020-07-15', 8.5, 1),
(2, '2021-01-10', 18.7, 1),
(3, '2022-01-15', 29.8, 1),
(4, '2023-02-10', 32.5, 1),
(5, '2024-01-20', 32.5, 1),
-- Luna (pet_id: 2)
(6, '2021-05-10', 2.8, 2),
(7, '2022-03-20', 6.5, 2),
(8, '2023-04-15', 8.0, 2),
(9, '2024-02-01', 8.2, 2),
-- Rocky (pet_id: 3)
(10, '2020-01-25', 10.2, 3),
(11, '2021-02-10', 24.5, 3),
(12, '2022-04-20', 25.5, 3),
(13, '2023-07-01', 26.8, 3),
(14, '2024-03-10', 26.8, 3);

-- 18. Thêm Vaccination Records
INSERT INTO vaccination (id, vaccine_name, vaccination_date, next_due_date, note, pet_id) VALUES
-- Max (pet_id: 1)
(1, 'Vaccine 5 trong 1', '2020-07-01', '2021-07-01', 'Tiêm chủng lần đầu', 1),
(2, 'Vaccine Dại', '2020-07-01', '2021-07-01', 'Tiêm chủng lần đầu', 1),
(3, 'Vaccine 5 trong 1', '2021-07-10', '2022-07-10', 'Tiêm nhắc lại', 1),
(4, 'Vaccine Dại', '2021-07-10', '2022-07-10', 'Tiêm nhắc lại', 1),
-- Luna (pet_id: 2)
(5, 'Vaccine 3 trong 1 cho mèo', '2021-04-15', '2022-04-15', 'Tiêm chủng lần đầu', 2),
(6, 'Vaccine Dại cho mèo', '2021-04-15', '2022-04-15', 'Tiêm chủng lần đầu', 2),
(7, 'Vaccine 3 trong 1 cho mèo', '2022-04-20', '2023-04-20', 'Tiêm nhắc lại', 2),
-- Rocky (pet_id: 3)
(8, 'Vaccine 5 trong 1', '2020-01-15', '2021-01-15', 'Tiêm chủng lần đầu', 3),
(9, 'Vaccine Dại', '2020-01-15', '2021-01-15', 'Tiêm chủng lần đầu', 3);

-- 19. Thêm Medical Records
INSERT INTO medical_record (id, visit_date, diagnosis, treatment, notes, pet_id) VALUES
-- Max (pet_id: 1)
(1, '2021-03-10', 'Nhiễm khuẩn da nhẹ', 'Kê đơn thuốc kháng sinh Cephalexin 500mg', 'Cần theo dõi và tái khám sau 10 ngày', 1),
(2, '2022-06-15', 'Viêm tai ngoài', 'Vệ sinh tai và kê thuốc nhỏ tai Otibiotic', 'Tai có tiết dịch màu vàng và mùi hôi', 1),
(3, '2024-08-15', 'Phẫu thuật thiến', 'Phẫu thuật thiến thành công', 'Hồi phục tốt, cần theo dõi vết mổ', 1),
-- Luna (pet_id: 2)
(4, '2021-08-20', 'Tiêu chảy cấp tính', 'Nhịn ăn 12 giờ, thuốc Metronidazole', 'Nghi ngờ do ăn thức ăn lạ', 2),
(5, '2022-04-15', 'Viêm lợi', 'Làm sạch răng dưới gây mê', 'Cần vệ sinh răng miệng hàng ngày', 2),
-- Rocky (pet_id: 3)
(6, '2020-05-30', 'Gãy xương chân trước', 'Phẫu thuật đặt nẹp vít', 'Cần hạn chế vận động trong 4 tuần', 3),
(7, '2022-09-05', 'Nhiễm ký sinh trùng ruột', 'Thuốc tẩy giun Pyrantel pamoate', 'Cần tẩy giun định kỳ 3 tháng/lần', 3);

-- ===== PHẦN 4: KIỂM TRA DỮ LIỆU =====
SELECT '======= KIỂM TRA DỮ LIỆU =======' as 'STATUS';

SELECT 'Danh sách Users và Roles:' as 'Check';
SELECT u.id, u.user_name, u.email, ur.roles_name 
FROM user u 
LEFT JOIN user_roles ur ON u.id = ur.user_id 
ORDER BY u.id;

SELECT 'Danh sách Vets và liên kết User:' as 'Check';
SELECT v.id, v.name, v.email as vet_email, u.email as user_email, v.specialty 
FROM vet v 
JOIN user u ON v.user_id = u.id 
ORDER BY v.id;

SELECT 'Appointments của Dr. Thanh (drthanh@gmail.com):' as 'Check';
SELECT a.id, a.name, a.email, a.date, a.status, 
       v.name as vet_name, u.email as vet_user_email
FROM appointment a 
JOIN vet v ON a.vet_id = v.id 
JOIN user u ON v.user_id = u.id 
WHERE u.email = 'drthanh@gmail.com'
ORDER BY a.date;

SELECT 'Appointments của Dr. Linh (drlinh@gmail.com):' as 'Check';
SELECT a.id, a.name, a.email, a.date, a.status, 
       v.name as vet_name, u.email as vet_user_email
FROM appointment a 
JOIN vet v ON a.vet_id = v.id 
JOIN user u ON v.user_id = u.id 
WHERE u.email = 'drlinh@gmail.com'
ORDER BY a.date;

SELECT 'Thống kê Appointments theo VET:' as 'Check';
SELECT v.name as vet_name, u.email as vet_user_email, 
       COUNT(a.id) as total_appointments,
       SUM(CASE WHEN a.status = 'COMPLETED' THEN 1 ELSE 0 END) as completed,
       SUM(CASE WHEN a.status = 'PENDING' THEN 1 ELSE 0 END) as pending,
       SUM(CASE WHEN a.status = 'CONFIRMED' THEN 1 ELSE 0 END) as confirmed
FROM vet v 
JOIN user u ON v.user_id = u.id 
LEFT JOIN appointment a ON v.id = a.vet_id 
GROUP BY v.id, v.name, u.email
ORDER BY v.id;

SELECT 'Thông tin đăng nhập:' as 'Info';
SELECT 'admin@petcare.com / 123456 (ADMIN)' as login_info
UNION ALL
SELECT 'drthanh@gmail.com / 123456 (Dr. Thanh - VET - 6 appointments)' as login_info
UNION ALL
SELECT 'drlinh@gmail.com / 123456 (Dr. Linh - VET - 3 appointments)' as login_info
UNION ALL
SELECT 'nguyenvana@gmail.com / 123456 (User thông thường)' as login_info;

SELECT '======= DATABASE SETUP COMPLETE =======' as 'FINAL_STATUS';
