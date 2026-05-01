import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditUser = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [userInfo, setUserInfo] = useState({
        userName: "",
        email: "",
        gender: "",
        dob: "",
        password: "",
        roles: [] // Keep roles for backend compatibility, but don't show to user
    });

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            window.location.href = "/login";
            return;
        }
        fetchUserDetails(accessToken);
    }, []);

    const fetchUserDetails = async (accessToken) => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:8080/api/user/getInfor/${userId}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (res.data) {
                setUserInfo({
                    userName: res.data.userName || "",
                    email: res.data.email || "",
                    gender: res.data.gender || "",
                    dob: res.data.dob ? new Date(res.data.dob).toISOString().split("T")[0] : "",
                    password: "",
                    roles: res.data.roles ? res.data.roles.map(r => r.name) : []
                });
            }
        } catch (error) {
            console.error("Error fetching user detail:", error);
            alert("Không tìm thấy người dùng");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo({ ...userInfo, [name]: value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!userInfo.userName || !userInfo.email) {
            alert("Vui lòng điền đủ thông tin!");
            return;
        }

        const accessToken = localStorage.getItem("accessToken");
        try {
            const payload = { ...userInfo };
            if (!payload.password) {
                delete payload.password; // backend uses old password if empty
            }

            const res = await axios.post(`http://localhost:8080/api/user/admin/updateUser/${userId}`, payload, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            alert("Cập nhật thành công!");
            navigate("/admin/usermanagement");
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Cập nhật thất bại. Vui lòng thử lại.");
        }
    };

    const handleBack = () => navigate("/admin/usermanagement");

    return (
        <>
            <style jsx>{`
                .edit-container {
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                    min-height: 100vh;
                    padding: 40px 20px;
                    display: flex;
                    align-items: flex-start;
                    justify-content: center;
                }

                .edit-card {
                    background: white;
                    border-radius: 24px;
                    border: none;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
                    width: 100%;
                    max-width: 800px;
                    overflow: hidden;
                }

                .edit-header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                    position: relative;
                }

                .edit-title {
                    font-weight: 700;
                    font-size: 1.75rem;
                    margin: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                }

                .btn-back-header {
                    position: absolute;
                    left: 24px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    border-radius: 12px;
                    padding: 8px 16px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                }

                .btn-back-header:hover {
                    background: rgba(255, 255, 255, 0.3);
                    color: white;
                }

                .edit-body {
                    padding: 40px;
                }

                .avatar-container {
                    width: 120px;
                    height: 120px;
                    background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: -80px auto 30px;
                    border: 6px solid white;
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
                    position: relative;
                    z-index: 10;
                }

                .avatar-icon {
                    font-size: 4rem;
                    color: #667eea;
                }

                .form-label {
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 8px;
                }

                .input-group-custom {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .input-icon {
                    position: absolute;
                    left: 16px;
                    color: #667eea;
                    z-index: 10;
                }

                .form-control-custom, .form-select-custom {
                    border-radius: 12px;
                    border: 2px solid #e0e0e0;
                    padding: 14px 16px 14px 45px;
                    transition: all 0.3s ease;
                    width: 100%;
                    background: white;
                    font-size: 1rem;
                }

                .form-select-custom {
                    padding: 14px 45px 14px 45px;
                    appearance: none;
                }

                .form-control-custom:focus, .form-select-custom:focus {
                    border-color: #667eea;
                    box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
                    outline: none;
                }

                .select-arrow {
                    position: absolute;
                    right: 16px;
                    color: #667eea;
                    pointer-events: none;
                }

                .btn-action {
                    border-radius: 12px;
                    padding: 14px 28px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    border: none;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .btn-save {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                }

                .btn-save:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
                    color: white;
                }

                .btn-cancel {
                    background: white;
                    color: #6c757d;
                    border: 2px solid #e0e0e0;
                }

                .btn-cancel:hover {
                    background: #f8f9fa;
                    color: #495057;
                    border-color: #d3d3d3;
                }

                .loading-spinner {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 200px;
                }

                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #667eea;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
            <div className="edit-container">
                <div className="edit-card">
                    <div className="edit-header">
                        <button type="button" className="btn-back-header" onClick={handleBack}>
                            <i className="bi bi-arrow-left me-2"></i>Quay lại
                        </button>
                        <h3 className="edit-title">
                            <i className="bi bi-person-lines-fill"></i>
                            Chỉnh Sửa Người Dùng
                        </h3>
                    </div>

                    <div className="edit-body">
                        {loading ? (
                            <div className="loading-spinner">
                                <div className="spinner"></div>
                            </div>
                        ) : (
                            <form onSubmit={handleUpdate}>
                                <div className="avatar-container">
                                    <i className="bi bi-person-circle avatar-icon"></i>
                                </div>
                                <div className="text-center mb-4">
                                    <h4 className="fw-bold mb-1">{userInfo.userName || "Người dùng"}</h4>
                                    <p className="text-muted">{userInfo.email}</p>
                                </div>

                                <div className="row g-4">
                                    {/* UserName */}
                                    <div className="col-md-6">
                                        <label className="form-label">
                                            Họ và tên <span className="text-danger">*</span>
                                        </label>
                                        <div className="input-group-custom">
                                            <i className="bi bi-person input-icon"></i>
                                            <input
                                                type="text"
                                                className="form-control-custom"
                                                name="userName"
                                                value={userInfo.userName}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Nhập họ và tên"
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="col-md-6">
                                        <label className="form-label">
                                            Email <span className="text-danger">*</span>
                                        </label>
                                        <div className="input-group-custom">
                                            <i className="bi bi-envelope input-icon"></i>
                                            <input
                                                type="email"
                                                className="form-control-custom"
                                                name="email"
                                                value={userInfo.email}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Địa chỉ email"
                                            />
                                        </div>
                                    </div>

                                    {/* Gender */}
                                    <div className="col-md-6">
                                        <label className="form-label">Giới tính</label>
                                        <div className="input-group-custom">
                                            <i className="bi bi-gender-ambiguous input-icon"></i>
                                            <select
                                                className="form-select-custom"
                                                name="gender"
                                                value={userInfo.gender}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Chọn giới tính</option>
                                                <option value="Male">Nam</option>
                                                <option value="Female">Nữ</option>
                                                <option value="Other">Khác</option>
                                            </select>
                                            <i className="bi bi-chevron-down select-arrow"></i>
                                        </div>
                                    </div>

                                    {/* DOB */}
                                    <div className="col-md-6">
                                        <label className="form-label">Ngày sinh</label>
                                        <div className="input-group-custom">
                                            <i className="bi bi-calendar-event input-icon"></i>
                                            <input
                                                type="date"
                                                className="form-control-custom"
                                                name="dob"
                                                value={userInfo.dob}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div className="col-12">
                                        <label className="form-label">Đổi mật khẩu</label>
                                        <div className="input-group-custom">
                                            <i className="bi bi-lock input-icon"></i>
                                            <input
                                                type="password"
                                                className="form-control-custom"
                                                name="password"
                                                value={userInfo.password}
                                                onChange={handleInputChange}
                                                placeholder="Để trống nếu không muốn thay đổi mật khẩu"
                                            />
                                        </div>
                                        <div className="form-text mt-2 ms-1">
                                            <i className="bi bi-info-circle me-1 text-primary"></i>
                                            Nhập mật khẩu mới nếu bạn muốn thay đổi. Hãy dùng mật khẩu mạnh.
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="col-12 mt-5">
                                        <div className="d-flex justify-content-end gap-3">
                                            <button
                                                type="button"
                                                className="btn-action btn-cancel"
                                                onClick={handleBack}
                                            >
                                                <i className="bi bi-x-lg"></i>
                                                Hủy Bỏ
                                            </button>
                                            <button type="submit" className="btn-action btn-save">
                                                <i className="bi bi-check2-circle"></i>
                                                Lưu Thay Đổi
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditUser;
