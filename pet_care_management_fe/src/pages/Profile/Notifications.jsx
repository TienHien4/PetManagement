import React from "react";
import Sidebar from "./Sidebar";
import "../../assets/css/profile.css";

function Notifications() {
    return (
        <div className="profile">
            <div style={{ display: "flex" }}>
                <Sidebar />
                <div className="main-content">
                    <div className="notifications">
                        <h1>Thông Báo</h1>
                        <p className="subtitle">Các thông báo từ hệ thống</p>

                        <ul className="notification-list" id="notificationList">
                            <li>Hệ thống: Lịch khám của Dog1 vào ngày 15/04/2025 đã được xác nhận.</li>
                            <li>Hệ thống: Mật khẩu của bạn đã được thay đổi thành công vào 09/04/2025.</li>
                        </ul>
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

export default Notifications;
