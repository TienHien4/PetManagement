# Biểu đồ Use Case Tổng Quát - Hệ Thống Pet Care Management

## Biểu đồ Use Case

```plantuml
@startuml
left to right direction
skinparam packageStyle rectangle

actor "Khách Hàng" as User
actor "Bác Sĩ Thú Y" as Vet
actor "Quản Trị Viên" as Admin

rectangle "Hệ Thống Pet Care Management" {
  
  ' Use Cases cho Khách Hàng
  usecase "Đăng Ký" as UC1
  usecase "Đăng Nhập" as UC2
  usecase "Quản Lý Thú Cưng" as UC3
  usecase "Đặt Lịch Hẹn" as UC4
  usecase "Xem Hồ Sơ Y Tế" as UC5
  usecase "Mua Sắm Sản Phẩm" as UC6
  usecase "Thanh Toán" as UC7
  usecase "Quản Lý Đơn Hàng" as UC8
  usecase "Nhận Tin" as UC9
  
  ' Use Cases cho Bác Sĩ
  usecase "Quản Lý Lịch Hẹn" as UC10
  usecase "Cập Nhật Hồ Sơ Y Tế" as UC11
  usecase "Xem Danh Sách Bệnh Nhân" as UC12
  
  ' Use Cases cho Admin
  usecase "Quản Lý Người Dùng" as UC13
  usecase "Quản Lý Sản Phẩm" as UC14
  usecase "Quản Lý Đơn Hàng (Admin)" as UC15
  usecase "Quản Lý Giao Dịch" as UC16
  usecase "Thống Kê" as UC17
  usecase "Quản Lý Bác Sĩ" as UC18
  
  ' Use Cases phụ (include/extend)
  usecase "Xác Thực Email" as UC19
  usecase "Kiểm Tra Phân Quyền" as UC20
  usecase "Upload Ảnh" as UC21
  usecase "Gửi Email Xác Nhận" as UC22
  usecase "Thêm Vào Giỏ Hàng" as UC23
  usecase "Xử Lý Callback VNPay" as UC24
  usecase "Đăng Nhập OAuth2" as UC25
  usecase "Theo Dõi Tiến Độ" as UC26
  
  ' Quan hệ Khách Hàng
  User --> UC1
  User --> UC2
  User --> UC3
  User --> UC4
  User --> UC5
  User --> UC6
  User --> UC7
  User --> UC8
  User --> UC9
  
  ' Quan hệ Bác Sĩ
  Vet --> UC2
  Vet --> UC10
  Vet --> UC11
  Vet --> UC12
  Vet --> UC9
  
  ' Quan hệ Admin
  Admin --> UC2
  Admin --> UC13
  Admin --> UC14
  Admin --> UC15
  Admin --> UC16
  Admin --> UC17
  Admin --> UC18
  
  ' Include relationships
  UC1 ..> UC19 : <<include>>
  UC3 ..> UC2 : <<include>>
  UC4 ..> UC2 : <<include>>
  UC5 ..> UC2 : <<include>>
  UC6 ..> UC2 : <<include>>
  UC7 ..> UC2 : <<include>>
  UC8 ..> UC2 : <<include>>
  UC10 ..> UC2 : <<include>>
  UC11 ..> UC2 : <<include>>
  UC12 ..> UC2 : <<include>>
  UC13 ..> UC2 : <<include>>
  UC14 ..> UC2 : <<include>>
  UC15 ..> UC2 : <<include>>
  UC16 ..> UC2 : <<include>>
  UC17 ..> UC2 : <<include>>
  UC18 ..> UC2 : <<include>>
  UC3 ..> UC21 : <<include>>
  UC4 ..> UC22 : <<include>>
  UC6 ..> UC23 : <<include>>
  UC7 ..> UC24 : <<include>>
  UC14 ..> UC21 : <<include>>
  
  ' Extend relationships
  UC25 ..> UC2 : <<extend>>
  UC26 ..> UC8 : <<extend>>
}

@enduml
```

## Mô tả các Use Case

### Actor: Khách Hàng (User)

| **Mã UC** | **Tên Use Case** | **Mô tả** |
|-----------|------------------|-----------|
| UC_2.4.1 | Đăng Ký | Người dùng tạo tài khoản mới trong hệ thống |
| UC_2.4.2 | Đăng Nhập | Đăng nhập bằng tài khoản hoặc OAuth2 (Google/Facebook) |
| UC_2.4.4 | Quản Lý Thú Cưng | Thêm, sửa, xóa thông tin thú cưng, quản lý hồ sơ |
| UC_2.4.3 | Đặt Lịch Hẹn | Đặt lịch khám với bác sĩ thú y |
| - | Xem Hồ Sơ Y Tế | Xem lịch sử khám bệnh, tiêm chủng của thú cưng |
| UC_2.4.8 | Mua Sắm Sản Phẩm | Duyệt và mua sản phẩm chăm sóc thú cưng |
| UC_2.4.7 | Thanh Toán VNPay | Thanh toán đơn hàng qua cổng VNPay |
| UC_2.4.9 | Quản Lý Đơn Hàng | Xem và theo dõi trạng thái đơn hàng |
| - | Nhận Tin | Nhận email thông báo và nhắc nhở |

### Actor: Bác Sĩ Thú Y (Vet)

| **Mã UC** | **Tên Use Case** | **Mô tả** |
|-----------|------------------|-----------|
| UC_2.4.2 | Đăng Nhập | Đăng nhập với tài khoản bác sĩ |
| UC_2.4.3 | Quản Lý Lịch Hẹn | Xem, xác nhận, hủy lịch hẹn |
| - | Cập Nhật Hồ Sơ Y Tế | Ghi nhận chẩn đoán, kê đơn thuốc sau khám |
| - | Xem Danh Sách Bệnh Nhân | Xem danh sách thú cưng đã/sẽ khám |
| - | Nhận Tin | Nhận thông báo về lịch hẹn mới |

### Actor: Quản Trị Viên (Admin)

| **Mã UC** | **Tên Use Case** | **Mô tả** |
|-----------|------------------|-----------|
| UC_2.4.2 | Đăng Nhập | Đăng nhập với quyền admin |
| UC_2.4.6 | Quản Lý Người Dùng | CRUD người dùng, phân quyền vai trò |
| UC_2.4.8 | Quản Lý Sản Phẩm | CRUD sản phẩm, quản lý tồn kho |
| UC_2.4.9 | Quản Lý Đơn Hàng | Xem và cập nhật trạng thái đơn hàng |
| UC_2.4.7 | Quản Lý Giao Dịch | Theo dõi giao dịch thanh toán VNPay |
| UC_2.4.5 | Thống Kê | Xem báo cáo doanh thu, sản phẩm, lịch hẹn |
| - | Quản Lý Bác Sĩ | CRUD thông tin bác sĩ thú y |

## Mối quan hệ Use Case

### Include (bao gồm)
- **Đăng Ký** ←include→ Xác Thực Email
- **Quản Lý Thú Cưng** ←include→ Đăng Nhập
- **Đặt Lịch Hẹn** ←include→ Đăng Nhập
- **Xem Hồ Sơ Y Tế** ←include→ Đăng Nhập
- **Mua Sắm Sản Phẩm** ←include→ Đăng Nhập
- **Thanh Toán** ←include→ Đăng Nhập
- **Quản Lý Đơn Hàng** ←include→ Đăng Nhập
- **Quản Lý Lịch Hẹn (Vet)** ←include→ Đăng Nhập
- **Cập Nhật Hồ Sơ Y Tế** ←include→ Đăng Nhập
- **Xem Danh Sách Bệnh Nhân** ←include→ Đăng Nhập
- **Quản Lý Người Dùng** ←include→ Đăng Nhập
- **Quản Lý Sản Phẩm** ←include→ Đăng Nhập
- **Quản Lý Đơn Hàng (Admin)** ←include→ Đăng Nhập
- **Quản Lý Giao Dịch** ←include→ Đăng Nhập
- **Thống Kê** ←include→ Đăng Nhập
- **Quản Lý Bác Sĩ** ←include→ Đăng Nhập
- **Quản Lý Thú Cưng** ←include→ Upload Ảnh
- **Đặt Lịch Hẹn** ←include→ Gửi Email Xác Nhận
- **Mua Sắm Sản Phẩm** ←include→ Thêm Vào Giỏ Hàng
- **Thanh Toán** ←include→ Xử Lý Callback VNPay
- **Quản Lý Sản Phẩm** ←include→ Upload Ảnh

### Extend (mở rộng)
- **Đăng Nhập** ←extend→ Đăng Nhập OAuth2 (Google/Facebook)
- **Quản Lý Đơn Hàng** ←extend→ Theo Dõi Tiến Độ

## Ghi chú
- Hệ thống hỗ trợ 3 loại người dùng: Khách hàng, Bác sĩ thú y, Admin
- Tất cả actor đều phải đăng nhập để sử dụng các chức năng
- Email thông báo được gửi tự động qua Apache Kafka
- Thanh toán tích hợp VNPay Gateway
- Hình ảnh lưu trữ trên Cloudinary
