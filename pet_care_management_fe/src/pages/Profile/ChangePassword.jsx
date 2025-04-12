import React from "react";
import Sidebar from "./Sidebar";
import "../../assets/css/profile.css";

function ChangePassword() {
    return (
        <div className="profile">
            <div style={{ display: "flex" }}>
                <Sidebar />
                <div className="profile-main-content">
                    <div className="profile-change-password">
                        <h1>Đổi Mật Khẩu</h1>
                        <p className="profile-subtitle">Thay đổi mật khẩu để bảo mật tài khoản</p>

                        <form>
                            <div className="profile-form-group">
                                <label>Mật khẩu cũ</label>
                                <input type="password" name="oldPassword" required />
                            </div>
                            <div className="profile-form-group">
                                <label>Mật khẩu mới</label>
                                <input type="password" name="newPassword" required />
                            </div>
                            <div className="profile-form-group">
                                <label>Xác nhận mật khẩu mới</label>
                                <input type="password" name="confirmPassword" required />
                            </div>
                            <button type="submit" className="profile-save-btn">
                                Lưu
                            </button>
                        </form>
                    </div>
                </div>
                <div className="profile-image-section">
                    <img
                        src="https://via.placeholder.com/150"
                        alt="User"
                        className="profile-pet-image"
                    />
                    <button className="profile-edit-image-btn">Chọn Ảnh</button>
                </div>
            </div>
        </div>
    );
}

export default ChangePassword;
