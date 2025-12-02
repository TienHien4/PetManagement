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
