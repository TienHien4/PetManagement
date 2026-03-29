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

## 3.2.2.1. Kiểm thử chức năng đăng ký

### Bảng 3.1 Danh sách test case chức năng đăng ký

| Tên test case | Các bước thực hiện | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---------------|-------------------|------------------|-----------------|------------|
| Đăng ký thành công với thông tin hợp lệ | Nhập tên "John Doe", email "john@example.com", mật khẩu "password123" → nhấn nút "Register" | Hiển thị thông báo "Đăng ký thành công!" và chuyển hướng đến trang đăng nhập | Hiển thị thông báo "Đăng ký thành công!" và chuyển hướng đến trang đăng nhập | PASS |
| Đăng ký với email đã tồn tại | Nhập tên "Jane Smith", email "existing@example.com" (đã tồn tại), mật khẩu "password123" → nhấn nút "Register" | Hiển thị thông báo "Email đã được sử dụng, vui lòng dùng email khác" | Hiển thị thông báo "Email đã được sử dụng, vui lòng dùng email khác" | PASS |
| Đăng ký với thông tin chưa đầy đủ | Nhập email "test@example.com", để trống tên và mật khẩu → nhấn nút "Register" | Hiển thị thông báo "Vui lòng nhập đầy đủ thông tin" | Hiển thị thông báo "Vui lòng nhập đầy đủ thông tin" | PASS |
| Đăng ký với email không hợp lệ | Nhập tên "Test User", email "invalidemail", mật khẩu "password123" → nhấn nút "Register" | Hiển thị thông báo "Email không hợp lệ" | Hiển thị thông báo "Email không hợp lệ" | PASS |
| Đăng ký với mật khẩu quá ngắn | Nhập tên "Test User", email "test@example.com", mật khẩu "123" → nhấn nút "Register" | Hiển thị thông báo "Mật khẩu phải có ít nhất 6 ký tự" | Hiển thị thông báo "Mật khẩu phải có ít nhất 6 ký tự" | PASS |
