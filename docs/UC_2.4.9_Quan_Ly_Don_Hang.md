# 2.4.9. Mô tả use case Quản lý đơn hàng

| **Mã Use case** | UC_QuanLyDonHang |
|-----------------|------------------|
| **Tên nhân** | Người dùng (User), Admin |
| **Mô tả** | Quản lý đơn hàng từ khi tạo đến khi hoàn thành |
| **Sự kiện kích hoạt chính** | Người dùng đặt hàng hoặc Admin quản lý đơn hàng |
| **Tiền điều kiện** | Người dùng đã đăng nhập và có sản phẩm trong giỏ hàng |

## Luồng sự kiện chính - Tạo đơn hàng

| # | **Thực hiện bởi** | **Hành động** |
|---|-------------------|---------------|
| 1 | Người dùng | Thêm sản phẩm vào giỏ hàng từ trang /products |
| 2 | Hệ thống | Lưu sản phẩm vào giỏ hàng (ShoppingCart), cập nhật số lượng và tổng tiền |
| 3 | Người dùng | Truy cập /shopping-cart, kiểm tra giỏ hàng và click "Đặt hàng & Thanh toán" |
| 4 | Hệ thống | Tạo đơn hàng (Order) với trạng thái "PENDING", tạo các OrderItem và chuyển sang thanh toán VNPay |

## Luồng sự kiện chính - Theo dõi đơn hàng (User)

| # | **Thực hiện bởi** | **Hành động** |
|---|-------------------|---------------|
| 1 | Người dùng | Truy cập trang /user/orders để xem danh sách đơn hàng |
| 2 | Hệ thống | Hiển thị đơn hàng với trạng thái: PENDING, PAID, PROCESSING, COMPLETED, CANCELLED |
| 3 | Người dùng | Click vào đơn hàng để xem chi tiết sản phẩm, tổng tiền, trạng thái thanh toán |
| 4 | Hệ thống | Hiển thị thông tin chi tiết: Danh sách sản phẩm, số lượng, giá, tổng cộng, ngày đặt |

## Luồng sự kiện chính - Quản lý đơn hàng (Admin)

| # | **Thực hiện bởi** | **Hành động** |
|---|-------------------|---------------|
| 1 | Admin | Truy cập trang /admin/orders để xem tất cả đơn hàng |
| 2 | Hệ thống | Hiển thị danh sách đơn hàng của tất cả khách hàng với thông tin: Mã đơn, Khách hàng, Ngày đặt, Tổng tiền, Trạng thái |
| 3 | Admin | Click vào đơn hàng để xem chi tiết |
| 4 | Hệ thống | Hiển thị chi tiết đơn hàng: Danh sách sản phẩm, thông tin khách hàng, trạng thái thanh toán VNPay |

## Luồng sự kiện thay thế

| # | **Thực hiện bởi** | **Hành động** |
|---|-------------------|---------------|
| 5a | Hệ thống | Nếu giỏ hàng trống thì không cho phép đặt hàng và hiển thị "Giỏ hàng trống" |
| 5b | Hệ thống | Nếu sản phẩm hết hàng thì hiển thị "Sản phẩm đã hết hàng" và loại khỏi giỏ |
| 5c | Hệ thống | Nếu thanh toán thất bại thì giữ đơn hàng ở trạng thái "PENDING" để người dùng thanh toán lại |

**Hậu điều kiện**: Đơn hàng được lưu trữ và theo dõi qua các trạng thái cho đến khi hoàn thành

## Biểu đồ Sequence - Luồng đặt hàng và thanh toán

```mermaid
sequenceDiagram
    actor User as Người dùng
    participant UI as Giao diện
    participant Controller as OrderController
    participant Order as Order
    participant OrderItem as OrderItem
    participant DB as Database

    %% Luồng chính
    User->>UI: 1.1. Nhấn "Đặt hàng & Thanh toán"
    UI->>Controller: 1.2. Chuyển hướng đến trang thanh toán VnPay
    Controller->>UI: 1.3. Nhập các thông tin cho việc thanh toán gồm: Số thẻ, tên chủ thẻ, ngày phát hành và nhấn "Tiếp tục"
    UI->>Controller: 1.4. Hiển thị giao diện nhập Otp
    Controller->>UI: 1.5. Nhập Otp và nhấn "Thanh toán"
    UI->>Order: 1.6. Thông báo thanh toán thành công
    Order->>OrderItem: Tạo OrderItem từ giỏ hàng
    Order->>DB: Lưu Order và OrderItems
    DB-->>UI: Trả về kết quả
    UI-->>User: Hiển thị thông báo thành công

    %% Luồng thay thế
    alt Bất kỳ thời điểm nào trong quá trình thực hiện use case, nếu không kết nối được với cơ sở dữ liệu
        Controller-->>UI: Hệ thống sẽ hiển thị thông báo lỗi "Lỗi kết nối"
        UI-->>User: Hiển thị lỗi
    end

    alt Nếu nhập sai thông tin thẻ
        Controller-->>UI: Hệ thống thông báo lỗi
        UI-->>User: Hiển thị lỗi nhập sai
    end

    alt Nếu nhập sai otp
        Controller-->>UI: Hệ thống thông báo lỗi
        UI-->>User: Hiển thị lỗi nhập sai OTP
    end
```

## Biểu đồ trình tự

```mermaid
sequenceDiagram
    actor User
    participant QuanLyDanhSachUI as QuanLyDanhSachUI
    participant QuanLyDanhSachController as QuanLyDanhSachController
    participant Board
    participant List
    participant ICSDL
    participant HTCSDL

    %% Luồng chính - Tạo đơn hàng và thanh toán
    User->>QuanLyDanhSachUI: 1. Click vào "Đặt hàng & Thanh toán"
    QuanLyDanhSachUI->>QuanLyDanhSachController: 2. Gửi yêu cầu tạo đơn hàng
    QuanLyDanhSachController->>Board: 3. Tạo đơn hàng mới
    Board->>ICSDL: 4. Lưu thông tin đơn hàng
    ICSDL->>HTCSDL: 5. Ghi vào database
    HTCSDL-->>ICSDL: 6. Xác nhận lưu thành công
    ICSDL-->>Board: 7. Trả về orderId
    Board->>List: 8. Chuyển sang thanh toán VNPay
    List->>User: 9. Redirect đến VNPay Gateway

    User->>List: 10. Nhập thông tin thẻ và OTP
    List->>Board: 11. Callback kết quả thanh toán
    Board->>ICSDL: 12. Cập nhật trạng thái PAID
    ICSDL->>HTCSDL: 13. Update order status
    HTCSDL-->>ICSDL: 14. Xác nhận cập nhật
    ICSDL-->>Board: 15. Trả về kết quả
    Board-->>QuanLyDanhSachController: 16. Kết quả thanh toán
    QuanLyDanhSachController-->>QuanLyDanhSachUI: 17. Hiển thị thông báo
    QuanLyDanhSachUI-->>User: 18. Xác nhận đơn hàng thành công

    %% Luồng thay thế
    alt Giỏ hàng trống
        QuanLyDanhSachUI-->>User: Thông báo "Giỏ hàng trống"
    end

    alt Sản phẩm hết hàng
        Board-->>QuanLyDanhSachUI: Thông báo "Sản phẩm đã hết hàng"
        QuanLyDanhSachUI-->>User: Hiển thị thông báo lỗi
    end

    alt Thanh toán thất bại
        List-->>Board: Callback failed
        Board->>ICSDL: Giữ trạng thái PENDING
        QuanLyDanhSachUI-->>User: Thông báo "Thanh toán thất bại"
    end

    alt Lỗi database
        HTCSDL-->>ICSDL: Lỗi kết nối
        ICSDL-->>Board: Trả về lỗi
        Board-->>QuanLyDanhSachUI: Thông báo lỗi hệ thống
        QuanLyDanhSachUI-->>User: "Không thể tạo đơn hàng, vui lòng thử lại"
    end
```
