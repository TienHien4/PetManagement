# 2.4.7. Mô tả use case Quản lý giao dịch

| **Mã Use case** | UC_QuanLyGiaoDich |
|-----------------|-------------------|
| **Tên nhân** | Người dùng (User), Admin |
| **Mô tả** | Quản lý các giao dịch thanh toán qua VNPay |
| **Sự kiện kích hoạt chính** | Người dùng thanh toán đơn hàng |
| **Tiền điều kiện** | Người dùng đã đăng nhập và có đơn hàng cần thanh toán |

## Luồng sự kiện chính - Thanh toán VNPay

| # | **Thực hiện bởi** | **Hành động** |
|---|-------------------|---------------|
| 1 | Người dùng | Thêm sản phẩm vào giỏ hàng và click "Đặt hàng & Thanh toán" |
| 2 | Hệ thống | Tạo đơn hàng với trạng thái "PENDING", tính tổng tiền và chuyển đến trang thanh toán VNPay |
| 3 | Người dùng | Chọn phương thức thanh toán trên VNPay và xác nhận giao dịch |
| 4 | Hệ thống | Nhận callback từ VNPay, xác minh chữ ký và cập nhật trạng thái đơn hàng thành "PAID" hoặc "FAILED" |

## Luồng sự kiện chính - Xem lịch sử giao dịch

| # | **Thực hiện bởi** | **Hành động** |
|---|-------------------|---------------|
| 1 | Người dùng | Truy cập trang /user/orders để xem lịch sử đơn hàng |
| 2 | Hệ thống | Hiển thị danh sách đơn hàng với trạng thái (PENDING, PAID, PROCESSING, COMPLETED, CANCELLED) |
| 3 | Người dùng | Click vào đơn hàng để xem chi tiết giao dịch (mã giao dịch VNPay, số tiền, thời gian) |
| 4 | Hệ thống | Hiển thị chi tiết sản phẩm, tổng tiền, thông tin thanh toán VNPay |

## Luồng sự kiện chính - Quản lý giao dịch (Admin)

| # | **Thực hiện bởi** | **Hành động** |
|---|-------------------|---------------|
| 1 | Admin | Truy cập trang /admin/orders để xem tất cả đơn hàng |
| 2 | Hệ thống | Hiển thị danh sách đơn hàng của tất cả khách hàng với trạng thái thanh toán |
| 3 | Admin | Chọn đơn hàng để xem chi tiết giao dịch VNPay |
| 4 | Hệ thống | Hiển thị thông tin: Mã giao dịch VNPay (vnp_TxnRef), số tiền, thời gian, trạng thái |

## Luồng sự kiện thay thế

| # | **Thực hiện bởi** | **Hành động** |
|---|-------------------|---------------|
| 5a | Hệ thống | Nếu thanh toán thất bại thì giữ đơn hàng ở trạng thái "PENDING" và thông báo "Thanh toán thất bại" |
| 5b | Hệ thống | Nếu người dùng hủy giao dịch thì hiển thị "Bạn đã hủy thanh toán" và quay về giỏ hàng |
| 5c | Hệ thống | Nếu timeout từ VNPay thì hiển thị "Giao dịch hết hạn, vui lòng thử lại" |

**Hậu điều kiện**: Giao dịch được ghi nhận và trạng thái đơn hàng được cập nhật

## 3.2.2.7. Kiểm thử chức năng quản lý giao dịch

### Bảng 3.7 Danh sách test case chức năng quản lý giao dịch

| Tên test case | Các bước thực hiện | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---------------|-------------------|------------------|-----------------|------------|
| Thanh toán VNPay thành công | Thêm sản phẩm vào giỏ → click "Đặt hàng & Thanh toán" → chọn phương thức VNPay → xác nhận | Trạng thái đơn hàng chuyển thành "PAID", hiển thị mã giao dịch VNPay | Trạng thái đơn hàng chuyển thành "PAID", hiển thị mã giao dịch VNPay | PASS |
| Thanh toán thất bại | Đặt hàng → chọn VNPay → nhập thông tin thẻ sai → xác nhận | Đơn hàng giữ trạng thái "PENDING", hiển thị "Thanh toán thất bại" | Đơn hàng giữ trạng thái "PENDING", hiển thị "Thanh toán thất bại" | PASS |
| Hủy giao dịch VNPay | Đặt hàng → chuyển sang VNPay → click "Hủy giao dịch" | Hiển thị "Bạn đã hủy thanh toán" và quay về giỏ hàng | Hiển thị "Bạn đã hủy thanh toán" và quay về giỏ hàng | PASS |
| Timeout giao dịch VNPay | Đặt hàng → chuyển sang VNPay → để quá thời gian cho phép | Hiển thị "Giao dịch hết hạn, vui lòng thử lại" | Hiển thị "Giao dịch hết hạn, vui lòng thử lại" | PASS |
| Xem lịch sử giao dịch (User) | User đăng nhập → truy cập /user/orders | Hiển thị danh sách đơn hàng với trạng thái thanh toán | Hiển thị danh sách đơn hàng với trạng thái thanh toán | PASS |
| Xem chi tiết giao dịch | User click vào đơn hàng trong lịch sử | Hiển thị chi tiết: mã giao dịch VNPay, số tiền, thời gian, sản phẩm | Hiển thị chi tiết: mã giao dịch VNPay, số tiền, thời gian, sản phẩm | PASS |
| Admin xem tất cả giao dịch | Admin truy cập /admin/orders | Hiển thị danh sách đơn hàng của tất cả khách hàng với trạng thái thanh toán | Hiển thị danh sách đơn hàng của tất cả khách hàng với trạng thái thanh toán | PASS |
| Admin xem chi tiết giao dịch VNPay | Admin click vào đơn hàng | Hiển thị mã giao dịch VNPay (vnp_TxnRef), số tiền, thời gian, trạng thái | Hiển thị mã giao dịch VNPay (vnp_TxnRef), số tiền, thời gian, trạng thái | PASS |
