# 2.4.1. Mô tả use case Đăng Ký

| **Mã Use case** | UC_DangKy |
|-----------------|-----------|
| **Tên nhân** | Người dùng (User) |
| **Mô tả** | Người dùng tạo tài khoản mới để sử dụng hệ thống |
| **Sự kiện kích hoạt chính** | Người dùng nhấn nút "Đăng ký" ở màn hình chính |
| **Tiền điều kiện** | Không có |

## Luồng sự kiện chính

| # | **Thực hiện bởi** | **Hành động** |
|---|-------------------|---------------|
| 1 | Người dùng | Click vào nút "Sign up" để mở màn hình đăng nhập |
| 2 | Hệ thống | Chuyển đến trang đăng ký |
| 3 | Người dùng | Nhập thông tin yêu cầu: tên, email, mật khẩu và nhấn nút "Register" |
| 4 | Hệ thống | Kiểm tra tính hợp lệ của thông tin. Nếu hợp lệ thì chuyển sang luồng thành công, ngược lại chuyển sang luồng thay thế |

## Luồng sự kiện thay thế

| # | **Thực hiện bởi** | **Hành động** |
|---|-------------------|---------------|
| 5a | Hệ thống | Nếu người dùng chưa nhập đầy đủ thông tin hoặc thông tin không hợp lệ thì hiển thị thông báo "Vui lòng nhập đầy đủ thông tin" |
| 5b | Hệ thống | Nếu trùng email người dùng đã đăng ký trước đó thì hiển thị thông báo "Email đã được sử dụng, vui lòng dùng email khác" |
| 5c | Hệ thống | Nếu trùng tên tài khoản người dùng đã đăng ký trước đó thì hiển thị thông báo "Tên tài khoản đã tồn tại, vui lòng chọn tên khác" |

**Hậu điều kiện**: Không có
