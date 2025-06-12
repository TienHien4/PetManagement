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

                        </ul>
                    </div>
                </div>

            </div>
            <Footer></Footer>
        </div>
    );
}

export default Notifications;
