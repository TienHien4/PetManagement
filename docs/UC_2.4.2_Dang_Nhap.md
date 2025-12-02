# 2.4.2. Mô tả use case Đăng nhập

| **Mã Use case** | UC_DangNhap |
|-----------------|-------------|
| **Tên nhân** | Người dùng (User), Admin, Bác sĩ thú y (Vet) |
| **Mô tả** | Người dùng đăng nhập để sử dụng hệ thống |
| **Sự kiện kích hoạt chính** | Người dùng nhấn nút "Đăng nhập" ở màn hình chính |
| **Tiền điều kiện** | Người dùng đã có tài khoản trong hệ thống |

## Luồng sự kiện chính

| # | **Thực hiện bởi** | **Hành động** |
|---|-------------------|---------------|
| 1 | Người dùng | Click vào nút "Login" để mở màn hình đăng nhập |
| 2 | Hệ thống | Chuyển đến trang đăng nhập |
| 3 | Người dùng | Nhập thông tin email, mật khẩu và nhấn nút "Login" |
| 4 | Hệ thống | Xác thực thông tin đăng nhập. Nếu đúng thì chuyển đến trang chủ theo vai trò (Admin→/admin, Vet→/vet/dashboard, User→/home), ngược lại chuyển sang luồng thay thế |

## Luồng sự kiện thay thế

| # | **Thực hiện bởi** | **Hành động** |
|---|-------------------|---------------|
| 5a | Hệ thống | Nếu email không tồn tại trong hệ thống thì hiển thị thông báo "Email hoặc mật khẩu không đúng" |
| 5b | Hệ thống | Nếu mật khẩu không chính xác thì hiển thị thông báo "Email hoặc mật khẩu không đúng" |
| 5c | Hệ thống | Nếu để trống thông tin thì hiển thị thông báo "Vui lòng nhập đầy đủ thông tin" |

**Hậu điều kiện**: Người dùng được chuyển hướng đến trang tương ứng với vai trò của mình

### Bước 1: Hiển thị form đăng nhập
**Actor**: Người dùng truy cập `/login`  
**System**: 
- Hiển thị form đăng nhập với các trường:
  - Email
  - Mật khẩu
- Hiển thị nút "Đăng nhập với Google"
- Hiển thị nút "Đăng nhập với Facebook"
- Hiển thị link "Chưa có tài khoản? Đăng ký ngay"

### Bước 2: Nhập thông tin đăng nhập
**Actor**: Người dùng nhập email và mật khẩu  
**System**: Validate dữ liệu client-side:
- Email: không được để trống, phải đúng định dạng
- Password: không được để trống

### Bước 3: Gửi yêu cầu đăng nhập
**Actor**: Người dùng nhấn nút "Đăng nhập"  
**System**: 
```javascript
// Frontend: LoginPage.jsx
POST /api/auth/authenticated
Body: {
  email: "user@example.com",
  password: "123456"
}
```

### Bước 4: Xác thực thông tin đăng nhập
**System**: 
```java
// Backend: AuthenticatedService.java
1. Tìm user theo email (UserRepository.findUserByEmail)
2. Kiểm tra user có tồn tại không
3. So sánh mật khẩu:
   - Sử dụng PasswordEncoder.matches(rawPassword, encodedPassword)
   - BCrypt comparison
4. Nếu mật khẩu đúng:
   - Tạo JWT token mới
   - Tạo Refresh token mới
   - Lấy danh sách roles của user
   - Trả về AuthenticationResponse
5. Nếu mật khẩu sai:
   - Throw RuntimeException("Mật khẩu không chính xác")
```

### Bước 5: Lưu thông tin và phân quyền
**System**: 
```javascript
// Frontend xử lý response:
1. Lưu vào localStorage:
   - accessToken
   - refreshToken
   - userId
   - UserName
   - user object (with roles)

2. Xác định vai trò và redirect:
   const roles = new Set(response.data.roles.map(r => r.name));
   
   if (roles.includes("ADMIN")) {
       navigate("/admin");
   } else if (roles.includes("VET")) {
       navigate("/vet/dashboard");
   } else if (roles.includes("USER")) {
       navigate("/home");
   }
```

### Bước 6: Hiển thị trang tương ứng với vai trò
**System**: Render trang dashboard/home theo vai trò  
**Actor**: Truy cập các chức năng theo quyền hạn

## Luồng thay thế (Alternative Flows)

### AF-1: Email không tồn tại
**Điều kiện**: Email chưa được đăng ký trong hệ thống  
**Xử lý**:
```
Bước 4a: UserRepository.findUserByEmail trả về null
Bước 4b: Throw RuntimeException("User not found")
Bước 4c: Trả về HTTP 401 Unauthorized
Bước 4d: Hiển thị "Email hoặc mật khẩu không đúng"
Bước 4e: Quay lại Bước 2
```

### AF-2: Mật khẩu không chính xác
**Điều kiện**: Mật khẩu nhập vào không khớp với mật khẩu đã hash  
**Xử lý**:
```
Bước 4a: PasswordEncoder.matches() trả về false
Bước 4b: Throw RuntimeException("Mật khẩu không chính xác")
Bước 4c: Trả về HTTP 401 Unauthorized
Bước 4d: Hiển thị "Email hoặc mật khẩu không đúng"
Bước 4e: Quay lại Bước 2
```

### AF-3: Token hết hạn
**Điều kiện**: Người dùng đang sử dụng hệ thống và token hết hạn  
**Xử lý**:
```
Bước 1: API request trả về 401 Unauthorized
Bước 2: Frontend catch error
Bước 3: Thử refresh token:
   POST /api/auth/refresh
   Body: { refreshToken: "..." }
Bước 4a: Nếu refresh thành công:
   - Lưu accessToken mới
   - Retry request ban đầu
Bước 4b: Nếu refresh thất bại:
   - Xóa localStorage
   - Redirect về /login
   - Hiển thị "Phiên đăng nhập hết hạn"
```

### AF-4: Lỗi server
**Điều kiện**: Lỗi kết nối database hoặc lỗi hệ thống  
**Xử lý**:
```
Bước 4a: Catch exception và log error
Bước 4b: Trả về HTTP 500 Internal Server Error
Bước 4c: Hiển thị "Đăng nhập thất bại. Vui lòng thử lại"
Bước 4d: Cho phép người dùng thử lại
```

## Luồng đăng nhập bằng OAuth2

### Bước 1: Chọn phương thức OAuth2
**Actor**: Click "Đăng nhập với Google" hoặc "Đăng nhập với Facebook"  
**System**: 
```javascript
// Frontend redirect đến OAuth2 endpoint
window.location.href = "/oauth2/authorization/google"
// hoặc
window.location.href = "/oauth2/authorization/facebook"
```

### Bước 2: Xác thực với OAuth2 provider
**Actor**: Đăng nhập với tài khoản Google/Facebook  
**System**: 
```java
// Backend: CustomOAuth2UserService.loadUser()
1. Nhận thông tin từ OAuth2 provider (email, name, picture)
2. Tìm user theo email (userRepository.findUserByEmail)
3. Nếu user đã tồn tại:
   - Sử dụng user hiện có
   - Cập nhật thông tin nếu cần
4. Nếu user chưa tồn tại:
   - Tạo user mới với provider="google"/"facebook"
   - Gán vai trò "USER"
   - Lưu vào database
5. Tạo JWT token và Refresh token
6. Redirect về /oauth2/redirect với token trong URL
```

### Bước 3: Xử lý callback và lưu token
**System**: 
```javascript
// Frontend: OAuthRedirect.jsx
1. Parse token từ URL parameters
2. Lưu vào localStorage:
   - accessToken
   - refreshToken
   - userId
   - UserName
3. Decode token để lấy roles
4. Redirect theo vai trò
```

## Quy tắc nghiệp vụ (Business Rules)

1. **BR-001**: Mật khẩu phải được so sánh bằng BCrypt, không so sánh plain text
2. **BR-002**: Token có thời gian hết hạn (access token: 1 giờ, refresh token: 7 ngày)
3. **BR-003**: Một user có thể có nhiều vai trò (ADMIN + VET, ADMIN + USER, ...)
4. **BR-004**: Redirect ưu tiên vai trò cao nhất: ADMIN > VET > USER
5. **BR-005**: Không hiển thị chi tiết lỗi về email hay password (security)
6. **BR-006**: OAuth2 user không cần password, sử dụng provider để xác thực
7. **BR-007**: Failed login attempts không bị giới hạn (có thể thêm rate limiting)

## Yêu cầu phi chức năng (Non-functional Requirements)

- **Performance**: Thời gian đăng nhập < 1 giây
- **Security**: 
  - Sử dụng HTTPS cho production
  - Token được lưu trong localStorage (có thể chuyển sang httpOnly cookie)
  - Password không được log hoặc hiển thị
  - Implement CORS policy đúng
- **Usability**: 
  - Form đơn giản, rõ ràng
  - Thông báo lỗi thân thiện, không tiết lộ chi tiết bảo mật
  - Hỗ trợ remember me (optional)
- **Availability**: Chức năng đăng nhập phải hoạt động 99.9% thời gian

## Giao diện liên quan

### LoginPage.jsx
- Form đăng nhập với email và password
- Nút đăng nhập
- Nút OAuth2 (Google, Facebook)
- Link đến trang đăng ký
- Gradient background animation
- Error message display

## API Endpoints

### POST /api/auth/authenticated
**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

**Response Success (200)**:
```json
{
  "id": 1,
  "userName": "john_doe",
  "email": "john@example.com",
  "roles": [
    {
      "name": "USER",
      "description": "User role",
      "permissions": []
    }
  ],
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response Error (401)**:
```json
{
  "error": "Mật khẩu không chính xác"
}
```

### POST /api/auth/refresh
**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response Success (200)**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### OAuth2 Endpoints
- **GET /oauth2/authorization/google**: Redirect đến Google login
- **GET /oauth2/authorization/facebook**: Redirect đến Facebook login
- **GET /oauth2/redirect**: Callback URL nhận token từ backend

## Protected Routes

### Frontend Route Protection
```javascript
// ProtectedRoute.jsx
- Kiểm tra token trong localStorage
- Kiểm tra vai trò của user
- Nếu không có quyền: redirect về /login
- Nếu có quyền: render component
```

### Backend Endpoint Protection
```java
// SecurityConfig.java
- @PreAuthorize("hasRole('ADMIN')") - chỉ ADMIN
- @PreAuthorize("hasRole('VET')") - chỉ VET
- @PreAuthorize("hasAnyRole('USER', 'ADMIN')") - USER hoặc ADMIN
```

## Test Cases

### TC-001: Đăng nhập thành công với USER
- **Input**: email="user@gmail.com", password="123456", role=USER
- **Expected**: Token được tạo, redirect về /home

### TC-002: Đăng nhập thành công với ADMIN
- **Input**: email="admin@gmail.com", password="123456", role=ADMIN
- **Expected**: Token được tạo, redirect về /admin

### TC-003: Đăng nhập thành công với VET
- **Input**: email="vet@gmail.com", password="123456", role=VET
- **Expected**: Token được tạo, redirect về /vet/dashboard

### TC-004: Đăng nhập với email không tồn tại
- **Input**: email="notexist@gmail.com", password="123456"
- **Expected**: Hiển thị lỗi "Email hoặc mật khẩu không đúng"

### TC-005: Đăng nhập với mật khẩu sai
- **Input**: email (đúng), password (sai)
- **Expected**: Hiển thị lỗi "Email hoặc mật khẩu không đúng"

### TC-006: Đăng nhập bằng Google OAuth2
- **Input**: Click "Login with Google", xác thực thành công
- **Expected**: Token được tạo, redirect theo role

### TC-007: Đăng nhập bằng Facebook OAuth2
- **Input**: Click "Login with Facebook", xác thực thành công
- **Expected**: Token được tạo, redirect theo role

### TC-008: Token hết hạn trong khi sử dụng
- **Input**: Gửi request với expired token
- **Expected**: Auto refresh token, retry request

### TC-009: Refresh token hết hạn
- **Input**: Refresh token đã expire
- **Expected**: Logout, redirect về /login

## Lưu ý triển khai

1. **Security**: 
   - Không log password
   - Sử dụng BCrypt với salt rounds >= 10
   - Implement rate limiting cho login endpoint
   - Xem xét thêm CAPTCHA nếu cần

2. **Token Management**:
   - Access token ngắn hạn (1 giờ)
   - Refresh token dài hạn (7 ngày)
   - Implement token blacklist khi logout

3. **OAuth2 Configuration**:
   - Đăng ký app với Google Cloud Console
   - Đăng ký app với Facebook Developer
   - Cấu hình redirect URI chính xác
   - Lưu client secret an toàn

4. **Error Handling**:
   - Thông báo lỗi không tiết lộ thông tin nhạy cảm
   - Log chi tiết lỗi ở backend để debug
   - Friendly error messages cho user

5. **User Experience**:
   - Remember me functionality
   - Password visibility toggle
   - Auto-focus vào email field
   - Loading state khi đang xác thực
