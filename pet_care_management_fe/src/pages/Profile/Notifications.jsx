import React from "react";
import Sidebar from "./Sidebar";
import "../../assets/css/profile.css";
import Header from "../../components/home/Header";
import { Footer } from "antd/es/layout/layout";

function Notifications() {
    return (
        <div className="profile">
            <Header></Header>
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

            </div>
            <Footer></Footer>
        </div>
    );
}

export default Notifications;
