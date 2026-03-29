# 2.4.3. Mô tả use case Quản lý cuộc hẹn

| **Mã Use case** | UC_QuanLyCuocHen |
|-----------------|------------------|
| **Tên nhân** | Người dùng (User), Bác sĩ thú y (Vet), Admin |
| **Mô tả** | Quản lý các cuộc hẹn khám bệnh cho thú cưng |
| **Sự kiện kích hoạt chính** | Người dùng muốn đặt lịch khám hoặc bác sĩ quản lý lịch hẹn |
| **Tiền điều kiện** | Người dùng đã đăng nhập và có thú cưng trong hệ thống |

## Luồng sự kiện chính - Đặt lịch hẹn (User)

| # | **Thực hiện bởi** | **Hành động** |
|---|-------------------|---------------|
| 1 | Người dùng | Truy cập trang đặt lịch khám thú cưng |
| 2 | Hệ thống | Hiển thị form đặt lịch với danh sách thú cưng, dịch vụ, bác sĩ |
| 3 | Người dùng | Chọn thú cưng, dịch vụ khám, bác sĩ, ngày giờ hẹn và nhập thông tin liên hệ |
| 4 | Hệ thống | Tạo cuộc hẹn với trạng thái "PENDING", lưu vào database và hiển thị thông báo thành công |

## Luồng sự kiện chính - Quản lý lịch hẹn (Vet)

| # | **Thực hiện bởi** | **Hành động** |
|---|-------------------|---------------|
| 1 | Bác sĩ thú y | Truy cập trang /vet/appointments để xem danh sách lịch hẹn |
| 2 | Hệ thống | Hiển thị danh sách cuộc hẹn được phân cho bác sĩ với trạng thái (PENDING, CONFIRMED, COMPLETED, CANCELLED) |
| 3 | Bác sĩ thú y | Chọn cuộc hẹn và cập nhật trạng thái (Xác nhận, Hoàn thành, Hủy) |
| 4 | Hệ thống | Cập nhật trạng thái cuộc hẹn trong database và thông báo cho người dùng |

## Luồng sự kiện thay thế

| # | **Thực hiện bởi** | **Hành động** |
|---|-------------------|---------------|
| 5a | Hệ thống | Nếu người dùng chưa có thú cưng thì hiển thị thông báo "Vui lòng thêm thú cưng trước khi đặt lịch" |
| 5b | Hệ thống | Nếu thông tin không đầy đủ thì hiển thị thông báo "Vui lòng nhập đầy đủ thông tin" |
| 5c | Hệ thống | Nếu bác sĩ không có lịch trống thì hiển thị "Bác sĩ không có lịch trống, vui lòng chọn thời gian khác" |

**Hậu điều kiện**: Cuộc hẹn được lưu trữ và có thể theo dõi qua hệ thống

## 3.2.2.3. Kiểm thử chức năng quản lý cuộc hẹn

### Bảng 3.3 Danh sách test case chức năng quản lý cuộc hẹn

| Tên test case | Các bước thực hiện | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---------------|-------------------|------------------|-----------------|------------|
| Đặt lịch hẹn thành công | Chọn thú cưng, dịch vụ, bác sĩ, ngày giờ hợp lệ → nhập thông tin liên hệ → nhấn "Đặt lịch" | Hiển thị thông báo "Đặt lịch thành công!" và cuộc hẹn có trạng thái "PENDING" | Hiển thị thông báo "Đặt lịch thành công!" và cuộc hẹn có trạng thái "PENDING" | PASS |
| Đặt lịch khi chưa có thú cưng | Người dùng chưa có thú cưng → truy cập trang đặt lịch | Hiển thị thông báo "Vui lòng thêm thú cưng trước khi đặt lịch" | Hiển thị thông báo "Vui lòng thêm thú cưng trước khi đặt lịch" | PASS |
| Đặt lịch với thông tin không đầy đủ | Chọn thú cưng, dịch vụ nhưng không chọn bác sĩ → nhấn "Đặt lịch" | Hiển thị thông báo "Vui lòng nhập đầy đủ thông tin" | Hiển thị thông báo "Vui lòng nhập đầy đủ thông tin" | PASS |
| Đặt lịch khi bác sĩ không có lịch trống | Chọn thú cưng, dịch vụ, bác sĩ, thời gian bác sĩ đã đầy lịch → nhấn "Đặt lịch" | Hiển thị "Bác sĩ không có lịch trống, vui lòng chọn thời gian khác" | Hiển thị "Bác sĩ không có lịch trống, vui lòng chọn thời gian khác" | PASS |
| Bác sĩ xác nhận cuộc hẹn | Bác sĩ chọn cuộc hẹn "PENDING" → click "Xác nhận" | Trạng thái cuộc hẹn chuyển thành "CONFIRMED" và thông báo cho người dùng | Trạng thái cuộc hẹn chuyển thành "CONFIRMED" và thông báo cho người dùng | PASS |
| Bác sĩ hoàn thành cuộc hẹn | Bác sĩ chọn cuộc hẹn "CONFIRMED" → click "Hoàn thành" | Trạng thái cuộc hẹn chuyển thành "COMPLETED" | Trạng thái cuộc hẹn chuyển thành "COMPLETED" | PASS |
| Bác sĩ hủy cuộc hẹn | Bác sĩ chọn cuộc hẹn → click "Hủy" | Trạng thái cuộc hẹn chuyển thành "CANCELLED" và thông báo cho người dùng | Trạng thái cuộc hẹn chuyển thành "CANCELLED" và thông báo cho người dùng | PASS |
