# 2.4.5. Mô tả use case Thống kê

| **Mã Use case** | UC_ThongKe |
|-----------------|------------|
| **Tên nhân** | Admin, Bác sĩ thú y (Vet) |
| **Mô tả** | Xem các báo cáo thống kê về doanh thu, đơn hàng, cuộc hẹn, khách hàng |
| **Sự kiện kích hoạt chính** | Admin/Vet truy cập trang thống kê |
| **Tiền điều kiện** | Người dùng đã đăng nhập với vai trò ADMIN hoặc VET |

## Luồng sự kiện chính - Thống kê Admin

| # | **Thực hiện bởi** | **Hành động** |
|---|-------------------|---------------|
| 1 | Admin | Truy cập trang /admin (Dashboard) |
| 2 | Hệ thống | Hiển thị các thẻ thống kê tổng quan: Tổng đơn hàng, Tổng doanh thu, Tổng khách hàng, Tổng sản phẩm |
| 3 | Hệ thống | Hiển thị biểu đồ doanh thu theo tháng (Line chart) |
| 4 | Hệ thống | Hiển thị biểu đồ doanh thu theo năm (Bar chart) |

## Luồng sự kiện chính - Thống kê Bác sĩ

| # | **Thực hiện bởi** | **Hành động** |
|---|-------------------|---------------|
| 1 | Bác sĩ thú y | Truy cập trang /vet/dashboard |
| 2 | Hệ thống | Hiển thị thống kê: Tổng khách hàng, Tổng thú cưng đã khám, Cuộc hẹn hoàn thành, Doanh thu |
| 3 | Hệ thống | Hiển thị danh sách khách hàng đã hoàn thành điều trị với lịch sử khám |
| 4 | Hệ thống | Hiển thị thống kê cuộc hẹn theo trạng thái (Pending, Confirmed, Completed) |

## Luồng sự kiện thay thế

| # | **Thực hiện bởi** | **Hành động** |
|---|-------------------|---------------|
| 5a | Hệ thống | Nếu chưa có dữ liệu thống kê thì hiển thị "Chưa có dữ liệu" |
| 5b | Hệ thống | Nếu lỗi khi tải dữ liệu thì hiển thị "Không thể tải dữ liệu thống kê" |

**Hậu điều kiện**: Admin/Vet có cái nhìn tổng quan về hoạt động kinh doanh

## 3.2.2.5. Kiểm thử chức năng thống kê

### Bảng 3.5 Danh sách test case chức năng thống kê

| Tên test case | Các bước thực hiện | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---------------|-------------------|------------------|-----------------|------------|
| Xem thống kê Admin | Admin đăng nhập → truy cập trang /admin | Hiển thị các thẻ: Tổng đơn hàng, Tổng doanh thu, Tổng khách hàng, Tổng sản phẩm | Hiển thị các thẻ: Tổng đơn hàng, Tổng doanh thu, Tổng khách hàng, Tổng sản phẩm | PASS |
| Xem biểu đồ doanh thu theo tháng | Admin truy cập Dashboard | Hiển thị biểu đồ Line chart doanh thu theo từng tháng trong năm | Hiển thị biểu đồ Line chart doanh thu theo từng tháng trong năm | PASS |
| Xem biểu đồ doanh thu theo năm | Admin truy cập Dashboard | Hiển thị biểu đồ Bar chart so sánh doanh thu các năm | Hiển thị biểu đồ Bar chart so sánh doanh thu các năm | PASS |
| Xem thống kê Bác sĩ | Bác sĩ đăng nhập → truy cập /vet/dashboard | Hiển thị: Tổng khách hàng, Tổng thú cưng đã khám, Cuộc hẹn hoàn thành, Doanh thu | Hiển thị: Tổng khách hàng, Tổng thú cưng đã khám, Cuộc hẹn hoàn thành, Doanh thu | PASS |
| Xem danh sách khách hàng đã hoàn thành điều trị | Bác sĩ truy cập /vet/dashboard → xem danh sách | Hiển thị danh sách khách hàng với lịch sử khám của bác sĩ | Hiển thị danh sách khách hàng với lịch sử khám của bác sĩ | PASS |
| Xem thống kê khi chưa có dữ liệu | Admin/Vet truy cập Dashboard hệ thống mới | Hiển thị "Chưa có dữ liệu" | Hiển thị "Chưa có dữ liệu" | PASS |
| Lỗi khi tải dữ liệu thống kê | Truy cập Dashboard khi server lỗi | Hiển thị "Không thể tải dữ liệu thống kê" | Hiển thị "Không thể tải dữ liệu thống kê" | PASS |
