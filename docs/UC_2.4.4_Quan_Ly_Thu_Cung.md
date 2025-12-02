# 2.4.4. Mô tả use case Quản lý thú cưng

| **Mã Use case** | UC_QuanLyThuCung |
|-----------------|------------------|
| **Tên nhân** | Người dùng (User), Admin |
| **Mô tả** | Quản lý thông tin thú cưng bao gồm thêm, sửa, xóa, xem hồ sơ sức khỏe |
| **Sự kiện kích hoạt chính** | Người dùng muốn quản lý thông tin thú cưng của mình |
| **Tiền điều kiện** | Người dùng đã đăng nhập vào hệ thống |

## Luồng sự kiện chính - Thêm thú cưng

| # | **Thực hiện bởi** | **Hành động** |
|---|-------------------|---------------|
| 1 | Người dùng | Truy cập trang /pet/add và click nút "Thêm thú cưng mới" |
| 2 | Hệ thống | Hiển thị form nhập thông tin thú cưng (tên, loài, giống, ngày sinh, giới tính, cân nặng, ảnh) |
| 3 | Người dùng | Nhập thông tin thú cưng và upload ảnh, sau đó nhấn "Lưu" |
| 4 | Hệ thống | Upload ảnh lên Cloudinary, lưu thông tin thú cưng vào database và hiển thị thông báo thành công |

## Luồng sự kiện chính - Sửa thông tin thú cưng

| # | **Thực hiện bởi** | **Hành động** |
|---|-------------------|---------------|
| 1 | Người dùng | Chọn thú cưng từ danh sách và click nút "Chỉnh sửa" |
| 2 | Hệ thống | Hiển thị form với thông tin hiện tại của thú cưng |
| 3 | Người dùng | Cập nhật thông tin cần thiết và nhấn "Cập nhật" |
| 4 | Hệ thống | Cập nhật thông tin vào database (bao gồm upload ảnh mới nếu có) và hiển thị thông báo |

## Luồng sự kiện chính - Quản lý hồ sơ sức khỏe

| # | **Thực hiện bởi** | **Hành động** |
|---|-------------------|---------------|
| 1 | Người dùng | Click vào "Hồ sơ sức khỏe" của thú cưng |
| 2 | Hệ thống | Hiển thị lịch sử khám bệnh, tiêm chủng, theo dõi cân nặng |
| 3 | Người dùng | Thêm mới hồ sơ khám bệnh/tiêm chủng/cân nặng |
| 4 | Hệ thống | Lưu hồ sơ sức khỏe vào database và cập nhật dashboard |

## Luồng sự kiện thay thế

| # | **Thực hiện bởi** | **Hành động** |
|---|-------------------|---------------|
| 5a | Hệ thống | Nếu thông tin bắt buộc (tên, loài) chưa nhập thì hiển thị "Vui lòng nhập đầy đủ thông tin" |
| 5b | Hệ thống | Nếu định dạng ảnh không hợp lệ thì hiển thị "Chỉ chấp nhận file ảnh JPG, PNG hoặc GIF" |
| 5c | Hệ thống | Nếu xóa thú cưng thất bại thì hiển thị "Không thể xóa thú cưng có lịch hẹn đang hoạt động" |

**Hậu điều kiện**: Thông tin thú cưng được cập nhật và lưu trữ trong hệ thống
