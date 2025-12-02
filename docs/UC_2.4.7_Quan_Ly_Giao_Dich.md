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
