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

## 3.2.2.4. Kiểm thử chức năng quản lý thú cưng

### Bảng 3.4 Danh sách test case chức năng quản lý thú cưng

| Tên test case | Các bước thực hiện | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---------------|-------------------|------------------|-----------------|------------|
| Thêm thú cưng thành công | Nhập tên "Max", loài "Chó", giống "Golden Retriever", ngày sinh, upload ảnh → nhấn "Lưu" | Hiển thị thông báo "Thêm thú cưng thành công!" và thú cưng xuất hiện trong danh sách | Hiển thị thông báo "Thêm thú cưng thành công!" và thú cưng xuất hiện trong danh sách | PASS |
| Thêm thú cưng với thông tin không đầy đủ | Nhập tên "Milo" nhưng không chọn loài → nhấn "Lưu" | Hiển thị "Vui lòng nhập đầy đủ thông tin" | Hiển thị "Vui lòng nhập đầy đủ thông tin" | PASS |
| Thêm thú cưng với định dạng ảnh không hợp lệ | Nhập đầy đủ thông tin, upload file PDF → nhấn "Lưu" | Hiển thị "Chỉ chấp nhận file ảnh JPG, PNG hoặc GIF" | Hiển thị "Chỉ chấp nhận file ảnh JPG, PNG hoặc GIF" | PASS |
| Sửa thông tin thú cưng thành công | Chọn thú cưng → click "Chỉnh sửa" → cập nhật cân nặng mới → nhấn "Cập nhật" | Hiển thị thông báo "Cập nhật thành công!" và thông tin mới được lưu | Hiển thị thông báo "Cập nhật thành công!" và thông tin mới được lưu | PASS |
| Xem hồ sơ sức khỏe | Click "Hồ sơ sức khỏe" của thú cưng | Hiển thị lịch sử khám bệnh, tiêm chủng, theo dõi cân nặng | Hiển thị lịch sử khám bệnh, tiêm chủng, theo dõi cân nặng | PASS |
| Thêm hồ sơ tiêm chủng | Vào hồ sơ sức khỏe → click "Thêm tiêm chủng" → nhập loại vắc-xin, ngày tiêm → nhấn "Lưu" | Hồ sơ tiêm chủng được lưu và hiển thị trong lịch sử | Hồ sơ tiêm chủng được lưu và hiển thị trong lịch sử | PASS |
| Xóa thú cưng có lịch hẹn đang hoạt động | Chọn thú cưng có lịch hẹn "CONFIRMED" → click "Xóa" | Hiển thị "Không thể xóa thú cưng có lịch hẹn đang hoạt động" | Hiển thị "Không thể xóa thú cưng có lịch hẹn đang hoạt động" | PASS |
