# Cập nhật hệ thống Pet Care Management cho VET Role

## Tổng quan thay đổi

Dự án đã được cập nhật để hỗ trợ hệ thống 3 quyền theo cấu trúc database của bạn:
- **ADMIN**: Tất cả quyền quản trị
- **USER**: Quyền đọc/ghi thông tin cá nhân, pets, appointments, products, orders
- **VET**: Quyền về y tế và quản lý appointments

## Các thay đổi chính

### 1. Entity Updates

#### Vet Entity
```java
// Đã thêm relationship với User
@OneToOne
@JoinColumn(name = "user_id")
private User user;
```

#### User Entity  
```java
// Đã thêm bidirectional relationship với Vet
@OneToOne(mappedBy = "user")
private Vet vet;
```

#### Appointment Entity
```java
// Đã thêm trường status để tracking
private String status = "PENDING"; // PENDING, CONFIRMED, COMPLETED, CANCELLED
```

### 2. Repository Updates

#### AppointmentRepository
Đã thêm các methods cho VET role:
- `findByVetEmail()` - Tìm appointments theo email của vet
- `findByVetEmailAndStatus()` - Tìm appointments theo email và status
- `countByVetEmail()` - Đếm số appointments của vet
- `countByVetEmailAndStatus()` - Đếm số appointments theo status
- `countByVetEmailAndToday()` - Đếm appointments hôm nay
- `findByVetEmailAndDate()` - Tìm appointments theo ngày

### 3. Service Updates

#### AppointmentService Interface
Đã thêm các methods cho VET role:
- `getAppointmentsByVetEmail()`
- `getCompletedAppointmentsByVetEmail()`
- `updateAppointmentStatusByVet()`
- `countAppointmentsByVetEmail()`
- `getMonthlyStatisticsByVetEmail()`
- và nhiều methods khác...

#### VetService Interface
Đã thêm:
- `getVetByEmail()` - Lấy thông tin vet theo email

### 4. New Controller

#### VetAppointmentController
Endpoint mới `/api/vet-dashboard/` cho VET role:

```java
@GetMapping("/appointments")
@PreAuthorize("hasRole('VET')")
public ResponseEntity<List<AppointmentResponse>> getMyAppointments()

@GetMapping("/statistics") 
@PreAuthorize("hasRole('VET')")
public ResponseEntity<String> getStatistics()
```

### 5. Security Configuration

Đã cập nhật SecurityConfig để:
- Cho phép VET role truy cập `/api/vet-dashboard/**`
- Maintain existing JWT-based authentication với permissions
- Token generation đã bao gồm roles và permissions

## Cấu trúc Database theo db.sql

### Roles được support:
1. **ADMIN** - Tất cả permissions
2. **USER** - Read/Write pets, appointments, products, orders  
3. **VET** - Medical permissions (READ_USER, READ_PET, WRITE_PET, READ_APPOINTMENT, WRITE_APPOINTMENT)

### Permission mapping:
- VET role có thể:
  - Xem thông tin users và pets
  - Chỉnh sửa thông tin pets
  - Xem và quản lý appointments
  - Không thể manage products/orders/users

## Các features cho VET role

### Dashboard Features:
1. **Xem appointments của mình**: VET có thể xem tất cả appointments được assign
2. **Thống kê cơ bản**: Hiển thị số liệu appointments
3. **Filter appointments**: Theo status (pending, completed, etc.)
4. **Update appointment status**: Có thể cập nhật trạng thái cuộc hẹn

### Security Features:
- JWT token bao gồm role VET và permissions tương ứng
- Method-level security với `@PreAuthorize`
- Restricted access chỉ cho VET endpoints

## Cách sử dụng

### 1. Tạo VET user trong database:
```sql
-- User với VET role đã có trong db.sql
INSERT INTO user_roles (user_id, roles_name) VALUES (6, 'VET');
```

### 2. Login với VET account:
- VET user sẽ receive JWT token với VET role và permissions
- Token sẽ chứa: ROLE_VET, READ_USER, READ_PET, WRITE_PET, READ_APPOINTMENT, WRITE_APPOINTMENT

### 3. Access VET endpoints:
```javascript
// VET dashboard appointments
GET /api/vet-dashboard/appointments
Headers: Authorization: Bearer <jwt-token>

// VET statistics  
GET /api/vet-dashboard/statistics
Headers: Authorization: Bearer <jwt-token>
```

## Next Steps

Để hoàn thiện hệ thống VET role, cần:

1. **Implement service methods**: Hoàn thành AppointmentServiceImpl với các methods mới
2. **Frontend integration**: Tạo VET dashboard UI
3. **Data filtering**: Đảm bảo VET chỉ xem appointments của mình
4. **Statistics implementation**: Tạo real statistics cho VET dashboard
5. **Testing**: Test security và permissions

## Files đã thay đổi:

- `Vet.java` - Added User relationship
- `User.java` - Added Vet relationship  
- `Appointment.java` - Added status field
- `AppointmentRepository.java` - Added VET queries
- `AppointmentService.java` - Added VET methods
- `VetService.java` - Added getVetByEmail
- `VetAppointmentController.java` - New VET controller
- `SecurityConfig.java` - Updated for VET role
