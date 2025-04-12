import React from "react";
import Sidebar from "./Sidebar";
import "../../assets/css/profile.css";

function Schedule() {
    return (
        <div className="profile">
            <div style={{ display: "flex" }}>
                <Sidebar />
                <div className="main-content">
                    <div className="schedule">
                        <h1>Lịch Khám Thú Cưng</h1>
                        <p className="subtitle">Quản lý lịch khám cho các thú cưng của bạn</p>

                        <table className="schedule-table">
                            <thead>
                                <tr>
                                    <th>Thú cưng</th>
                                    <th>Ngày khám</th>
                                    <th>Bác sĩ</th>
                                    <th>Ghi chú</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Dog1</td>
                                    <td>2025-04-15</td>
                                    <td>BS. Nguyễn Văn B</td>
                                    <td>Kiểm tra sức khỏe định kỳ</td>
                                </tr>
                                <tr>
                                    <td>Cat1</td>
                                    <td>2025-04-20</td>
                                    <td>BS. Trần Thị C</td>
                                    <td>Tiêm phòng</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="image-section">
                    <img
                        src="https://via.placeholder.com/150"
                        alt="User Image"
                        className="pet-image"
                    />
                    <button className="edit-image-btn">Chọn Ảnh</button>
                </div>
            </div>
        </div>
    );
}

export default Schedule;
