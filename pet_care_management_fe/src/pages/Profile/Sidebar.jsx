import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "antd";

function Sidebar() {
    const location = useLocation();

    const getKeyFromPath = (path) => {
        switch (path) {
            case "/user/profile":
                return "1";
            case "/user/pets":
                return "2";
            case "/user/schedule":
                return "3";
            case "/user/changePassword":
                return "4";
            case "/user/notifications":
                return "5";
            default:
                return "";
        }
    };

    return (
        <div className="sidebar" style={{ position: "relative", padding: "0" }}>


            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[getKeyFromPath(location.pathname)]}
                items={[
                    {
                        key: "1",
                        icon: <span className="icon" role="img" aria-label="profile">📋</span>,
                        label: <Link to="/user/profile">Hồ Sơ</Link>,
                    },
                    {
                        key: "2",
                        icon: <span className="icon" role="img" aria-label="pets">🐾</span>,
                        label: <Link to="/user/pets">Danh Sách Thú Cưng</Link>,
                    },
                    {
                        key: "3",
                        icon: <span className="icon" role="img" aria-label="schedule">📅</span>,
                        label: <Link to="/user/schedule">Lịch Khám</Link>,
                    },
                    {
                        key: "4",
                        icon: <span className="icon" role="img" aria-label="password">🔑</span>,
                        label: <Link to="/user/changePassword">Đổi Mật Khẩu</Link>,
                    },
                    {
                        key: "5",
                        icon: <span className="icon" role="img" aria-label="notifications">🔔</span>,
                        label: <Link to="/user/notifications">Thông Báo</Link>,
                    },
                ]}
            />
        </div>
    );
}

export default Sidebar;
