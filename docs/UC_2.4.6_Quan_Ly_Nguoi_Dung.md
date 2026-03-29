# 2.4.6. Mô tả use case Quản lý người dùng

| **Mã Use case** | UC_QuanLyNguoiDung |
|-----------------|---------------------|
| **Tên nhân** | Admin |
| **Mô tả** | Admin quản lý tài khoản người dùng trong hệ thống |
| **Sự kiện kích hoạt chính** | Admin truy cập trang quản lý người dùng |
| **Tiền điều kiện** | Người dùng đã đăng nhập với vai trò ADMIN |

## Luồng sự kiện chính - Xem danh sách người dùng

| # | **Thực hiện bởi** | **Hành động** |
|---|-------------------|---------------|
| 1 | Admin | Truy cập trang /admin/usermanagement |
| 2 | Hệ thống | Hiển thị danh sách người dùng với thông tin: Avatar, Tên, Email, Vai trò (USER/ADMIN/VET) |
| 3 | Hệ thống | Hỗ trợ phân trang và tìm kiếm người dùng theo từ khóa |
| 4 | Admin | Có thể xem, chỉnh sửa hoặc xóa người dùng |

## Luồng sự kiện chính - Chỉnh sửa người dùng

| # | **Thực hiện bởi** | **Hành động** |
|---|-------------------|---------------|
| 1 | Admin | Click nút "Chỉnh sửa" trên người dùng cần cập nhật |
| 2 | Hệ thống | Hiển thị form chỉnh sửa với thông tin hiện tại |
| 3 | Admin | Cập nhật thông tin (tên, email, vai trò) và nhấn "Lưu" |
| 4 | Hệ thống | Cập nhật thông tin vào database và hiển thị thông báo thành công |

## Luồng sự kiện chính - Phân quyền người dùng

| # | **Thực hiện bởi** | **Hành động** |
|---|-------------------|---------------|
| 1 | Admin | Chọn người dùng và thay đổi vai trò (USER, VET, ADMIN) |
| 2 | Hệ thống | Cập nhật vai trò của người dùng trong bảng user_roles |
| 3 | Hệ thống | Hiển thị badge vai trò mới trên danh sách người dùng |

## Luồng sự kiện thay thế

| # | **Thực hiện bởi** | **Hành động** |
|---|-------------------|---------------|
| 5a | Hệ thống | Nếu email đã tồn tại khi cập nhật thì hiển thị "Email đã được sử dụng" |
| 5b | Hệ thống | Nếu xóa người dùng thất bại (do có ràng buộc dữ liệu) thì hiển thị "Không thể xóa người dùng" |
| 5c | Hệ thống | Nếu tìm kiếm không có kết quả thì hiển thị "Không tìm thấy người dùng" |

**Hậu điều kiện**: Thông tin người dùng được cập nhật và quyền hạn được quản lý

## 3.2.2.6. Kiểm thử chức năng quản lý người dùng

### Bảng 3.6 Danh sách test case chức năng quản lý người dùng

| Tên test case | Các bước thực hiện | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---------------|-------------------|------------------|-----------------|------------|
| Xem danh sách người dùng | Admin truy cập /admin/usermanagement | Hiển thị danh sách người dùng với: Avatar, Tên, Email, Vai trò | Hiển thị danh sách người dùng với: Avatar, Tên, Email, Vai trò | PASS |
| Tìm kiếm người dùng theo email | Admin nhập "test@example.com" vào ô tìm kiếm → Enter | Hiển thị người dùng có email khớp với từ khóa | Hiển thị người dùng có email khớp với từ khóa | PASS |
| Chỉnh sửa thông tin người dùng thành công | Admin click "Chỉnh sửa" → cập nhật tên → nhấn "Lưu" | Hiển thị thông báo "Cập nhật thành công!" và thông tin được cập nhật | Hiển thị thông báo "Cập nhật thành công!" và thông tin được cập nhật | PASS |
| Cập nhật email đã tồn tại | Admin chỉnh sửa người dùng → đổi email thành email đã có → nhấn "Lưu" | Hiển thị "Email đã được sử dụng" | Hiển thị "Email đã được sử dụng" | PASS |
| Phân quyền người dùng thành VET | Admin chọn người dùng → thay đổi vai trò từ USER sang VET → lưu | Vai trò được cập nhật thành VET và badge hiển thị "VET" | Vai trò được cập nhật thành VET và badge hiển thị "VET" | PASS |
| Phân quyền người dùng thành ADMIN | Admin chọn người dùng → thay đổi vai trò từ USER sang ADMIN → lưu | Vai trò được cập nhật thành ADMIN và badge hiển thị "ADMIN" | Vai trò được cập nhật thành ADMIN và badge hiển thị "ADMIN" | PASS |
| Xóa người dùng có ràng buộc dữ liệu | Admin chọn người dùng có đơn hàng → click "Xóa" | Hiển thị "Không thể xóa người dùng" | Hiển thị "Không thể xóa người dùng" | PASS |
| Tìm kiếm không có kết quả | Admin nhập "nonexistent@test.com" vào ô tìm kiếm | Hiển thị "Không tìm thấy người dùng" | Hiển thị "Không tìm thấy người dùng" | PASS |
