import React, { useState } from "react";
import Sidebar from "./Sidebar";
import axios from '../../services/customizeAxios';
import "../../assets/css/ChangePassword.css";
import Header from "../../components/home/Header";
import Footer from "../../components/home/Footer";

function ChangePassword() {
    const idUser = localStorage.getItem("Id");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [errors, setErrors] = useState({});
    const accessToken = localStorage.getItem("accessToken");

    const handleChangePassword = async (e) => {
        e.preventDefault();

        let validationErrors = {};
        if (!oldPassword) validationErrors.oldPassword = "Vui lòng nhập mật khẩu cũ.";
        if (!newPassword) validationErrors.newPassword = "Vui lòng nhập mật khẩu mới.";
        if (newPassword !== confirmPassword) validationErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const res = await axios.post(`api/user/changePassword/${idUser}`, {
                oldPassword,
                newPassword
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            alert("Đổi mật khẩu thành công!");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setErrors({});
        } catch (error) {
            if (error.response?.data?.message) {
                setErrors({ oldPassword: error.response.data.message });
            } else {
                alert("Có lỗi xảy ra khi đổi mật khẩu.");
            }
        }
    };

    return (
        <div className="changepassword">
            <Header />
            <div className="changepassword-container">
                <Sidebar />
                <div className="changepassword-main-content">
                    <div className="changepassword-change-password">
                        <h1>Đổi Mật Khẩu</h1>
                        <p className="changepassword-subtitle">Thay đổi mật khẩu để bảo mật tài khoản</p>

                        <form onSubmit={handleChangePassword}>
                            <div className="changepassword-form-group">
                                <label>Mật khẩu cũ</label>
                                <input
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                />
                                {errors.oldPassword && <div className="input-error">{errors.oldPassword}</div>}
                            </div>

                            <div className="changepassword-form-group">
                                <label>Mật khẩu mới</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                {errors.newPassword && <div className="input-error">{errors.newPassword}</div>}
                            </div>

                            <div className="changepassword-form-group">
                                <label>Xác nhận mật khẩu mới</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                {errors.confirmPassword && <div className="input-error">{errors.confirmPassword}</div>}
                            </div>

                            <button type="submit" className="changepassword-save-btn">
                                Lưu
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default ChangePassword;
