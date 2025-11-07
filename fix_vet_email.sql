-- Script để sửa email trong bảng vet cho đồng bộ với user
USE petcaremanagement;

-- Tắt safe update mode tạm thời
SET SQL_SAFE_UPDATES = 0;

-- Cập nhật từng record cụ thể:
UPDATE vet SET email = 'drthanh@gmail.com' WHERE id = 1;
UPDATE vet SET email = 'drlinh@gmail.com' WHERE id = 2;

-- Bật lại safe update mode
SET SQL_SAFE_UPDATES = 1;

-- Kiểm tra kết quả sau khi cập nhật
SELECT 
    v.id as vet_id,
    v.name as vet_name,
    v.email as vet_email,
    u.id as user_id,
    u.email as user_email,
    u.user_name
FROM vet v 
JOIN user u ON v.user_id = u.id 
ORDER BY v.id;

-- Kiểm tra appointments có liên kết đúng không
SELECT 
    a.id,
    a.name,
    a.email,
    a.date,
    a.status,
    v.name as vet_name,
    u.email as vet_user_email
FROM appointment a 
JOIN vet v ON a.vet_id = v.id 
JOIN user u ON v.user_id = u.id 
WHERE u.email IN ('drthanh@gmail.com', 'drlinh@gmail.com')
ORDER BY u.email, a.date;
