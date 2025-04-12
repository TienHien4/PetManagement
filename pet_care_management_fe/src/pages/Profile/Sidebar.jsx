import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.css";

function Sidebar() {
    const location = useLocation();

    return (
        <div className={styles.sidebar}>
            <div className={styles.header}>
                <span className={styles.projectName}>Pet Management</span>
            </div>
            <ul className={styles.navMenu}>
                <li className={location.pathname === "/" ? styles.active : ""}>
                    <span className={styles.icon}>📋</span>
                    <Link to="/user/profile">Hồ Sơ</Link>
                </li>
                <li className={location.pathname === "/pets" ? styles.active : ""}>
                    <span className={styles.icon}>🐾</span>
                    <Link to="/user/pets">Danh Sách Thú Cưng</Link>
                </li>
                <li className={location.pathname === "/schedule" ? styles.active : ""}>
                    <span className={styles.icon}>📅</span>
                    <Link to="/user/schedule">Lịch Khám</Link>
                </li>
                <li className={location.pathname === "/change-password" ? styles.active : ""}>
                    <span className={styles.icon}>🔑</span>
                    <Link to="/user/changePassword">Đổi Mật Khẩu</Link>
                </li>
                <li className={location.pathname === "/notifications" ? styles.active : ""}>
                    <span className={styles.icon}>🔔</span>
                    <Link to="/user/notifications">Thông Báo</Link>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;