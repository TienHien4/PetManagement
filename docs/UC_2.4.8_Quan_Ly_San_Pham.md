# 2.4.8. Mô tả use case Quản lý sản phẩm

| **Mã Use case** | UC_QuanLySanPham |
|-----------------|------------------|
| **Tên nhân** | Admin |
| **Mô tả** | Admin quản lý sản phẩm thú cưng trong hệ thống (thêm, sửa, xóa) |
| **Sự kiện kích hoạt chính** | Admin truy cập trang quản lý sản phẩm |
| **Tiền điều kiện** | Người dùng đã đăng nhập với vai trò ADMIN |

## Luồng sự kiện chính - Thêm sản phẩm

| # | **Thực hiện bởi** | **Hành động** |
|---|-------------------|---------------|
| 1 | Admin | Truy cập trang /admin/productmanagement và click "Thêm sản phẩm mới" |
| 2 | Hệ thống | Hiển thị form nhập thông tin sản phẩm (tên, loại, giá, số lượng, mô tả, ảnh) |
| 3 | Admin | Nhập thông tin sản phẩm, upload ảnh và nhấn "Lưu" |
| 4 | Hệ thống | Upload ảnh lên Cloudinary, lưu thông tin sản phẩm vào database và hiển thị trong danh sách |

## Luồng sự kiện chính - Sửa sản phẩm

| # | **Thực hiện bởi** | **Hành động** |
|---|-------------------|---------------|
| 1 | Admin | Click nút "Chỉnh sửa" trên sản phẩm cần cập nhật |
| 2 | Hệ thống | Hiển thị form với thông tin hiện tại của sản phẩm |
| 3 | Admin | Cập nhật thông tin (giá, số lượng, mô tả, ảnh mới) và nhấn "Cập nhật" |
| 4 | Hệ thống | Cập nhật thông tin vào database (upload ảnh mới nếu có) và hiển thị thông báo |

## Luồng sự kiện chính - Xóa sản phẩm

| # | **Thực hiện bởi** | **Hành động** |
|---|-------------------|---------------|
| 1 | Admin | Click nút "Xóa" trên sản phẩm cần xóa |
| 2 | Hệ thống | Hiển thị hộp thoại xác nhận "Bạn có chắc muốn xóa sản phẩm này?" |
| 3 | Admin | Xác nhận xóa |
| 4 | Hệ thống | Xóa sản phẩm khỏi database và cập nhật danh sách |

## Luồng sự kiện thay thế

| # | **Thực hiện bởi** | **Hành động** |
|---|-------------------|---------------|
| 5a | Hệ thống | Nếu thông tin bắt buộc (tên, giá, số lượng) chưa nhập thì hiển thị "Vui lòng nhập đầy đủ thông tin" |
| 5b | Hệ thống | Nếu giá hoặc số lượng < 0 thì hiển thị "Giá và số lượng phải là số dương" |
| 5c | Hệ thống | Nếu xóa sản phẩm có trong đơn hàng thì hiển thị "Không thể xóa sản phẩm đang có trong đơn hàng" |

**Hậu điều kiện**: Sản phẩm được cập nhật trong hệ thống và hiển thị cho người mua

## Biểu đồ Sequence - Quản lý sản phẩm

```mermaid
sequenceDiagram
    actor Admin as Admin
    participant UI as Giao diện
    participant Controller as ProductController
    participant Product as Product
    participant DB as Database

    %% Luồng thêm sản phẩm
    Admin->>UI: 1. Click "Thêm sản phẩm mới"
    UI->>Admin: 2. Hiển thị form nhập thông tin
    Admin->>UI: 3. Nhập thông tin và nhấn "Lưu"
    UI->>Controller: 4. POST /api/products
    Controller->>Product: 5. Tạo Product mới
    Product->>DB: 6. Lưu sản phẩm vào database
    DB-->>Controller: 7. Trả về kết quả
    Controller-->>UI: 8. Thông báo thành công
    UI-->>Admin: 9. Hiển thị sản phẩm trong danh sách

    %% Luồng sửa sản phẩm
    Admin->>UI: 10. Click "Chỉnh sửa" sản phẩm
    UI->>Controller: 11. GET /api/products/{id}
    Controller->>DB: 12. Lấy thông tin Product
    DB-->>UI: 13. Hiển thị form với thông tin hiện tại
    Admin->>UI: 14. Cập nhật thông tin và nhấn "Cập nhật"
    UI->>Controller: 15. PUT /api/products/{id}
    Controller->>Product: 16. Cập nhật Product
    Product->>DB: 17. Lưu thay đổi
    DB-->>Controller: 18. Xác nhận cập nhật
    Controller-->>UI: 19. Thông báo cập nhật thành công
    UI-->>Admin: 20. Hiển thị thông tin đã cập nhật

    %% Luồng xóa sản phẩm
    Admin->>UI: 21. Click "Xóa" sản phẩm
    UI->>Admin: 22. Hiển thị hộp thoại xác nhận
    Admin->>UI: 23. Xác nhận xóa
    UI->>Controller: 24. DELETE /api/products/{id}
    Controller->>DB: 25. Xóa Product
    DB-->>Controller: 26. Xác nhận xóa
    Controller-->>UI: 27. Thông báo xóa thành công
    UI-->>Admin: 28. Cập nhật danh sách

    %% Luồng thay thế
    alt Thông tin bắt buộc chưa nhập
        Controller-->>UI: Trả về lỗi 400
        UI-->>Admin: "Vui lòng nhập đầy đủ thông tin"
    end

    alt Giá hoặc số lượng không hợp lệ
        Controller-->>UI: Trả về lỗi 400
        UI-->>Admin: "Giá và số lượng phải là số dương"
    end

    alt Sản phẩm đang trong đơn hàng
        Controller-->>UI: Trả về lỗi 409
        UI-->>Admin: "Không thể xóa sản phẩm đang có trong đơn hàng"
    end
```
