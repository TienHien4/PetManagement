
-- 1. Thêm dữ liệu Permission
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

-- 2. Thêm dữ liệu Role
INSERT INTO role (name, description) VALUES
('ADMIN', 'Quản trị viên hệ thống'),
('USER', 'Người dùng thông thường'),
('VET', 'Bác sĩ thú y');

-- 3. Thêm dữ liệu Role_Permissions
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

-- 4. Thêm dữ liệu User
INSERT INTO user (id, user_name, email, password, dob, provider, gender) VALUES
(2, 'nguyenvana', 'nguyenvana@gmail.com', '$2a$10$9DHEYDfPyd/2RDI2DM6Cx.rO/4k.gUEwKjSST6/tyB8pviV2Ywfzy', '1992-05-15', 'local', 'Nam'),
(3, 'tranthiha', 'tranthiha@gmail.com', '$2a$10$9DHEYDfPyd/2RDI2DM6Cx.rO/4k.gUEwKjSST6/tyB8pviV2Ywfzy', '1995-08-20', 'local', 'Nữ'),
(4, 'phamtuan', 'phamtuan@gmail.com', '$2a$10$9DHEYDfPyd/2RDI2DM6Cx.rO/4k.gUEwKjSST6/tyB8pviV2Ywfzy', '1988-11-10', 'local', 'Nam'),
(5, 'levananh', 'levananh@gmail.com', '$2a$10$9DHEYDfPyd/2RDI2DM6Cx.rO/4k.gUEwKjSST6/tyB8pviV2Ywfzy', '1993-03-25', 'local', 'Nữ'),
(6, 'drthanh', 'drthanh@petcare.com', '$2a$10$9DHEYDfPyd/2RDI2DM6Cx.rO/4k.gUEwKjSST6/tyB8pviV2Ywfzy', '1985-07-12', 'local', 'Nam'),
(7, 'drlinh', 'drlinh@petcare.com', '$2a$10$9DHEYDfPyd/2RDI2DM6Cx.rO/4k.gUEwKjSST6/tyB8pviV2Ywfzy', '1987-09-05', 'local', 'Nữ'),
(8, 'staffminh', 'minh@petcare.com', '$2a$10$9DHEYDfPyd/2RDI2DM6Cx.rO/4k.gUEwKjSST6/tyB8pviV2Ywfzy', '1998-12-18', 'local', 'Nam');

-- 5. Thêm dữ liệu User_Roles
INSERT INTO user_roles (user_id, roles_name) VALUES
(1, 'ADMIN'),
(2, 'USER'),
(3, 'USER'),
(4, 'USER'),
(5, 'USER'),
(6, 'VET'),
(7, 'VET'),
(8, 'USER');

-- 6. Thêm dữ liệu Pet
INSERT INTO pet (id, name, species, breed, gender, dob, weight, age, image, owner_id) VALUES
(1, 'Max', 'Chó', 'Golden Retriever', 'Đực', '2020-05-15', 32.5, 4, 'golden_retriever.jpg', 2),
(2, 'Luna', 'Mèo', 'Maine Coon', 'Cái', '2021-03-10', 8.2, 3, 'maine_coon.jpg', 2),
(3, 'Rocky', 'Chó', 'Husky', 'Đực', '2019-12-25', 26.8, 5, 'husky.jpg', 3),
(4, 'Bella', 'Chó', 'Poodle', 'Cái', '2022-01-30', 12.3, 2, 'poodle.jpg', 4),
(5, 'Milo', 'Mèo', 'Scottish Fold', 'Đực', '2020-11-05', 5.4, 3, 'scottish_fold.jpg', 3),
(6, 'Coco', 'Chó', 'Chihuahua', 'Cái', '2021-07-12', 3.2, 2, 'chihuahua.jpg', 5),
(7, 'Oliver', 'Mèo', 'Munchkin', 'Đực', '2022-04-18', 4.0, 1, 'munchkin.jpg', 5),
(8, 'Daisy', 'Chó', 'Corgi', 'Cái', '2020-09-01', 13.7, 3, 'corgi.jpg', 4);

-- 7. Thêm dữ liệu Vet
INSERT INTO vet (id, name, email, phone_number, clinic_address, specialty) VALUES
(1, 'Dr. Thanh Nguyễn', 'drthanh@petcare.com', '0901234567', 'Số 15 Nguyễn Trãi, Quận 1, TP.HCM', 'Ngoại khoa'),
(2, 'Dr. Linh Trần', 'drlinh@petcare.com', '0912345678', 'Số 25 Lê Lợi, Quận 1, TP.HCM', 'Da liễu'),
(3, 'Dr. Hùng Phạm', 'drhung@petcare.com', '0923456789', 'Số 10 Đinh Tiên Hoàng, Quận 1, TP.HCM', 'Nội khoa'),
(4, 'Dr. Mai Lê', 'drmai@petcare.com', '0934567890', 'Số 42 Nam Kỳ Khởi Nghĩa, Quận 3, TP.HCM', 'Dinh dưỡng');

-- 8. Thêm dữ liệu ServicesType
INSERT INTO services_type (id, name, description, price) VALUES
(1, 'Khám tổng quát', 'Kiểm tra sức khỏe tổng thể cho thú cưng', 200000),
(2, 'Tiêm phòng', 'Các loại vắc-xin phòng bệnh cho thú cưng', 350000),
(3, 'Phẫu thuật', 'Các dịch vụ phẫu thuật như thiến, triệt sản, ...', 1500000),
(4, 'Nha khoa', 'Vệ sinh răng miệng, nhổ răng, chữa bệnh răng miệng', 500000),
(5, 'Tắm và cắt tỉa lông', 'Dịch vụ làm đẹp cho thú cưng', 300000),
(6, 'Siêu âm', 'Kiểm tra nội tạng bằng siêu âm', 450000),
(7, 'X-quang', 'Chụp X-quang chẩn đoán', 550000),
(8, 'Xét nghiệm máu', 'Xét nghiệm máu cơ bản', 400000);

-- 9. Thêm dữ liệu Appointment
INSERT INTO appointment (id, name, email, date, vet, user) VALUES
(1, 'Khám định kỳ cho Max', 'nguyenvan@gmail.com', '2023-11-15', 1, 2),
(2, 'Tiêm phòng cho Luna', 'nguyenvan@gmail.com', '2023-12-10', 2, 2),
(3, 'Khám chân cho Rocky', 'tranthiha@gmail.com', '2024-01-05', 1, 3),
(4, 'Vệ sinh răng cho Bella', 'phamtuan@gmail.com', '2024-01-20', 4, 4),
(5, 'Khám da cho Milo', 'tranthiha@gmail.com', '2024-02-10', 2, 3),
(6, 'Tiêm phòng cho Coco', 'levananh@gmail.com', '2024-02-25', 3, 5),
(7, 'Khám tổng quát cho Oliver', 'levananh@gmail.com', '2024-03-05', 3, 5),
(8, 'Siêu âm cho Daisy', 'phamtuan@gmail.com', '2024-03-15', 1, 4),
(9, 'Kiểm tra sức khỏe cho Max', 'nguyenvan@gmail.com', '2024-04-20', 4, 2),
(10, 'Vệ sinh tai cho Luna', 'nguyenvan@gmail.com', '2024-05-05', 2, 2);

-- 10. Thêm dữ liệu Appointment_Services
INSERT INTO appointment_services (appointment_id, services_id) VALUES
(1, 1), -- Khám tổng quát cho Max
(2, 2), -- Tiêm phòng cho Luna
(3, 1), -- Khám chân cho Rocky
(3, 7), -- X-quang cho Rocky
(4, 4), -- Vệ sinh răng cho Bella
(5, 1), -- Khám da cho Milo
(6, 2), -- Tiêm phòng cho Coco
(7, 1), -- Khám tổng quát cho Oliver
(7, 8), -- Xét nghiệm máu cho Oliver
(8, 6), -- Siêu âm cho Daisy
(9, 1), -- Kiểm tra sức khỏe cho Max
(10, 1); -- Vệ sinh tai cho Luna

-- 11. Thêm dữ liệu Product
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

-- 12. Thêm dữ liệu ShoppingCart
INSERT INTO shopping_cart (shopping_cart_id, total_items, total_prices, user_id) VALUES
(1, 0, 0, 2),
(2, 0, 0, 3),
(3, 0, 0, 4),
(4, 0, 0, 5);

-- 13. Thêm dữ liệu Cart_Item (Chỉ thêm một số ví dụ)
INSERT INTO cart_item (id, quantity, total_price, product_id, shopping_cart_id) VALUES
(1, 2, 1500000, 1, 1),  -- 2 gói Royal Canin trong giỏ của user 2
(2, 1, 650000, 2, 1),   -- 1 gói Hill's Science Diet trong giỏ của user 2
(3, 1, 450000, 3, 2),   -- 1 gói Pedigree trong giỏ của user 3
(4, 1, 120000, 5, 2),   -- 1 lược chải lông chó trong giỏ của user 3
(5, 2, 760000, 4, 3),   -- 2 gói Whiskas trong giỏ của user 4
(6, 1, 200000, 7, 4);   -- 1 dây dắt chó trong giỏ của user 5

-- Cập nhật tổng số lượng và giá trong shopping_cart sau khi thêm cart_item
UPDATE shopping_cart SET total_items = 3, total_prices = 2150000 WHERE shopping_cart_id = 1; -- User 2
UPDATE shopping_cart SET total_items = 2, total_prices = 570000 WHERE shopping_cart_id = 2; -- User 3
UPDATE shopping_cart SET total_items = 2, total_prices = 760000 WHERE shopping_cart_id = 3; -- User 4
UPDATE shopping_cart SET total_items = 1, total_prices = 200000 WHERE shopping_cart_id = 4; -- User 5

-- 14. Thêm dữ liệu Orders
INSERT INTO orders (order_id, total_quantity, total_price, order_date, user_id) VALUES
(1, 3, 1020000, '2024-01-15 10:30:00', 2),
(2, 2, 570000, '2024-01-20 15:45:00', 3),
(3, 4, 1150000, '2024-02-05 09:15:00', 2),
(4, 2, 680000, '2024-02-15 14:20:00', 4),
(5, 3, 750000, '2024-03-01 11:00:00', 5);

-- 15. Thêm dữ liệu Order_Item
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
(8, 1, 150000, 3, 10),

-- Order 4: User 4
(9, 1, 450000, 4, 3),
(10, 1, 230000, 4, 12),

-- Order 5: User 5
(11, 1, 450000, 5, 3),
(12, 2, 150000, 5, 8);

-- 16. Thêm dữ liệu WeightRecord
INSERT INTO weight_record (id, record_date, weight, pet_id) VALUES
-- Max (pet_id: 1) - Golden Retriever (tăng cân đều đặn)
(1, '2020-07-15', 8.5, 1),
(2, '2021-01-10', 18.7, 1),
(3, '2021-06-20', 25.2, 1),
(4, '2022-01-15', 29.8, 1),
(5, '2022-06-30', 31.5, 1),
(6, '2023-02-10', 32.5, 1),
(7, '2024-01-20', 32.5, 1),

-- Luna (pet_id: 2) - Maine Coon (tăng cân ổn định)
(8, '2021-05-10', 2.8, 2),
(9, '2021-09-15', 4.6, 2),
(10, '2022-03-20', 6.5, 2),
(11, '2022-10-05', 7.8, 2),
(12, '2023-04-15', 8.0, 2),
(13, '2024-02-01', 8.2, 2),

-- Rocky (pet_id: 3) - Husky (dao động cân nặng)
(14, '2020-01-25', 10.2, 3),
(15, '2020-06-15', 18.6, 3),
(16, '2021-02-10', 24.5, 3),
(17, '2021-09-05', 28.0, 3),
(18, '2022-04-20', 25.5, 3), -- Giảm cân
(19, '2022-11-15', 27.5, 3),
(20, '2023-07-01', 26.8, 3),
(21, '2024-03-10', 26.8, 3),

-- Bella (pet_id: 4) - Poodle (cân nặng ổn định)
(22, '2022-03-30', 4.5, 4),
(23, '2022-08-15', 8.7, 4),
(24, '2023-02-20', 11.5, 4),
(25, '2023-09-10', 12.0, 4),
(26, '2024-02-25', 12.3, 4);

-- 17. Thêm dữ liệu Vaccination
INSERT INTO vaccination (id, vaccine_name, vaccination_date, next_due_date, note, pet_id) VALUES
-- Max (pet_id: 1)
(1, 'Vaccine 5 trong 1', '2020-07-01', '2021-07-01', 'Tiêm chủng lần đầu, phản ứng bình thường.', 1),
(2, 'Vaccine 5 trong 1', '2021-07-10', '2022-07-10', 'Tiêm nhắc lại lần 1.', 1),
(3, 'Vaccine 5 trong 1', '2022-07-15', '2023-07-15', 'Tiêm nhắc lại lần 2.', 1),
(4, 'Vaccine 5 trong 1', '2023-07-20', '2024-07-20', 'Tiêm nhắc lại lần 3.', 1),
(5, 'Vaccine Dại', '2020-07-01', '2021-07-01', 'Tiêm chủng lần đầu.', 1),
(6, 'Vaccine Dại', '2021-07-10', '2022-07-10', 'Tiêm nhắc lại hàng năm.', 1),
(7, 'Vaccine Dại', '2022-07-15', '2023-07-15', 'Tiêm nhắc lại hàng năm.', 1),
(8, 'Vaccine Dại', '2023-07-20', '2024-07-20', 'Tiêm nhắc lại hàng năm.', 1),

-- Luna (pet_id: 2)
(9, 'Vaccine 3 trong 1 cho mèo', '2021-04-15', '2022-04-15', 'Tiêm chủng lần đầu.', 2),
(10, 'Vaccine 3 trong 1 cho mèo', '2022-04-20', '2023-04-20', 'Tiêm nhắc lại lần 1.', 2),
(11, 'Vaccine 3 trong 1 cho mèo', '2023-04-25', '2024-04-25', 'Tiêm nhắc lại lần 2.', 2),
(12, 'Vaccine Dại cho mèo', '2021-04-15', '2022-04-15', 'Tiêm chủng lần đầu.', 2),
(13, 'Vaccine Dại cho mèo', '2022-04-20', '2023-04-20', 'Tiêm nhắc lại hàng năm.', 2),
(14, 'Vaccine Dại cho mèo', '2023-04-25', '2024-04-25', 'Tiêm nhắc lại hàng năm.', 2),

-- Rocky (pet_id: 3)
(15, 'Vaccine 5 trong 1', '2020-01-15', '2021-01-15', 'Tiêm chủng lần đầu.', 3),
(16, 'Vaccine 5 trong 1', '2021-01-20', '2022-01-20', 'Tiêm nhắc lại lần 1.', 3),
(17, 'Vaccine 5 trong 1', '2022-02-01', '2023-02-01', 'Tiêm nhắc lại lần 2. Trễ 10 ngày so với lịch.', 3),
(18, 'Vaccine 5 trong 1', '2023-02-05', '2024-02-05', 'Tiêm nhắc lại lần 3.', 3),
(19, 'Vaccine Dại', '2020-01-15', '2021-01-15', 'Tiêm chủng lần đầu.', 3),
(20, 'Vaccine Dại', '2021-01-20', '2022-01-20', 'Tiêm nhắc lại hàng năm.', 3),
(21, 'Vaccine Dại', '2022-02-01', '2023-02-01', 'Tiêm nhắc lại hàng năm.', 3),
(22, 'Vaccine Dại', '2023-02-05', '2024-02-05', 'Tiêm nhắc lại hàng năm.', 3),

-- Bella (pet_id: 4)
(23, 'Vaccine 5 trong 1', '2022-03-01', '2023-03-01', 'Tiêm chủng lần đầu.', 4),
(24, 'Vaccine 5 trong 1', '2023-03-05', '2024-03-05', 'Tiêm nhắc lại lần 1.', 4),
(25, 'Vaccine Dại', '2022-03-01', '2023-03-01', 'Tiêm chủng lần đầu.', 4),
(26, 'Vaccine Dại', '2023-03-05', '2024-03-05', 'Tiêm nhắc lại hàng năm.', 4);

-- 18. Thêm dữ liệu MedicalRecord
INSERT INTO medical_record (id, visit_date, diagnosis, treatment, notes, pet_id) VALUES
-- Max (pet_id: 1)
(1, '2021-03-10', 'Nhiễm khuẩn da nhẹ', 'Kê đơn thuốc kháng sinh Cephalexin 500mg, uống 2 lần/ngày trong 7 ngày. Tắm bằng sữa tắm dược liệu 2 lần/tuần.', 'Cần theo dõi và tái khám sau 10 ngày nếu tình trạng không cải thiện.', 1),
(2, '2022-06-15', 'Viêm tai ngoài', 'Vệ sinh tai và kê thuốc nhỏ tai Otibiotic, nhỏ 2 giọt/tai, 2 lần/ngày trong 14 ngày.', 'Tai có tiết dịch màu vàng và mùi hôi. Thú cưng hay gãi tai và lắc đầu.', 1),
(3, '2023-02-20', 'Đau khớp nhẹ', 'Glucosamine 500mg, uống 1 lần/ngày với thức ăn. Tập thể dục nhẹ nhàng.', 'Có dấu hiệu khó đứng dậy sau khi nằm lâu. Xem xét thay đổi chế độ ăn trong tương lai.', 1),
(4, '2023-11-05', 'Khám sức khỏe định kỳ', 'Không cần điều trị. Tiếp tục chế độ ăn và vận động hiện tại.', 'Các chỉ số sức khỏe đều trong ngưỡng bình thường. Răng có cao răng nhẹ, cân nhắc làm sạch răng trong 6 tháng tới.', 1),

-- Luna (pet_id: 2)
(5, '2021-08-20', 'Tiêu chảy cấp tính', 'Nhịn ăn 12 giờ, sau đó cho ăn thức ăn dễ tiêu (gà luộc, cơm trắng). Uống Metronidazole 250mg, 1/2 viên, 2 lần/ngày trong 5 ngày.', 'Nghi ngờ do ăn thức ăn lạ. Cần bổ sung probiotics sau khi kết thúc đợt kháng sinh.', 2),
(6, '2022-04-15', 'Viêm lợi', 'Làm sạch răng dưới gây mê. Kê đơn thuốc kháng sinh Clindamycin 75mg, 1 viên/ngày trong 7 ngày.', 'Cần theo dõi việc ăn uống trong 24 giờ đầu sau gây mê. Chú ý vệ sinh răng miệng hàng ngày.', 2),
(7, '2023-10-10', 'Viêm da dị ứng', 'Kê đơn Prednisolone 5mg, 1 viên/ngày trong 5 ngày, sau đó giảm liều dần. Sữa tắm dành cho da nhạy cảm.', 'Nghi ngờ dị ứng với chất tẩy rửa mới. Tránh tiếp xúc với các hóa chất gia dụng.', 2),

-- Rocky (pet_id: 3)
(8, '2020-05-30', 'Gãy xương chân trước bên phải', 'Phẫu thuật đặt nẹp vít. Kê thuốc giảm đau Tramadol 50mg, 1/2 viên, 3 lần/ngày trong 7 ngày. Kháng sinh Cefazolin 500mg, 1 viên, 2 lần/ngày trong 14 ngày.', 'Cần giữ vết thương khô ráo. Hạn chế vận động trong 4 tuần. Tái khám sau 2 tuần để kiểm tra vết mổ.', 3),
(9, '2021-03-15', 'Tháo nẹp vít', 'Phẫu thuật nhỏ để tháo nẹp vít sau khi xương liền hoàn toàn.', 'Xương đã liền tốt. Có thể bắt đầu vận động bình thường sau 2 tuần.', 3),
(10, '2022-09-05', 'Nhiễm ký sinh trùng đường ruột (giun tròn)', 'Thuốc tẩy giun Pyrantel pamoate, liều duy nhất. Lặp lại sau 2 tuần.', 'Phát hiện trứng giun trong phân. Cần tẩy giun định kỳ 3 tháng/lần.', 3),
(11, '2023-12-20', 'Ho kéo dài', 'Doxycycline 100mg, 1 viên/ngày trong 10 ngày. Thuốc ho Bromhexine 8mg, 1/2 viên, 2 lần/ngày trong 7 ngày.', 'Nghi ngờ viêm phế quản. X-quang phổi không thấy bất thường nghiêm trọng.', 3),

-- Bella (pet_id: 4)
(12, '2022-05-10', 'Kiểm tra sức khỏe sau khi nhận nuôi', 'Tẩy giun với Milbemax, liều theo cân nặng. Bổ sung vitamin tổng hợp trong 1 tháng.', 'Sức khỏe tổng thể tốt. Cần tiêm phòng đầy đủ theo lịch.', 4),
(13, '2023-01-20', 'Viêm kết mạc', 'Thuốc nhỏ mắt kháng sinh Tobramycin, 1 giọt/mắt, 3 lần/ngày trong 7 ngày.', 'Mắt đỏ và tiết dịch. Tránh để thú cưng cào gãi mắt.', 4),
(14, '2023-08-15', 'Viêm da do nấm', 'Thuốc uống Itraconazole 100mg, 1/4 viên/ngày trong 21 ngày. Sữa tắm chứa Ketoconazole, tắm 2 lần/tuần.', 'Vùng da bị ảnh hưởng ở lưng và bụng. Có thể lây sang người, cần đeo găng tay khi tiếp xúc.', 4),
(15, '2024-02-28', 'Khám sức khỏe định kỳ và vệ sinh răng', 'Vệ sinh răng dưới gây mê. Không phát hiện vấn đề khác cần điều trị.', 'Răng và nướu khỏe mạnh sau khi làm sạch. Lịch tái khám định kỳ 6 tháng/lần.', 4);


-- Hoàn tất
SELECT 'Dữ liệu đã được nhập thành công!' AS 'Kết quả';