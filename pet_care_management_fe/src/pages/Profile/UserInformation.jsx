import React from "react";
import Sidebar from "./Sidebar";
import "../../assets/css/profile.css";
import Header from "../../components/home/Header";


function UserInformation() {
    return (

        <div className="profile">
            <Header></Header>
            <div style={{ display: "flex" }}>
                <Sidebar />
                <div className="main-content">
                    <div className="user-information">
                        <h1>Thông tin tài khoản</h1>

                        <form className="user-form">
                            <div className="form-group">
                                <label>Họ tên</label>
                                <input type="text" value="Nguyen Tien Hien" readOnly />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <div className="email-wrapper">
                                    <input type="email" value="kurunmlop8@gmail.com" readOnly />

                                </div>
                            </div>
                            <div className="form-group">
                                <label>Số điện thoại</label>
                                <input type="text" placeholder="" />
                            </div>
                            <div className="form-group">
                                <label>Ngày sinh</label>
                                <div className="date-wrapper">
                                    <input type="text" placeholder="mm/dd/yyyy" />
                                    <span className="calendar-icon">📅</span>
                                </div>
                            </div>
                            <div >
                                <label>Giới tính</label>
                                <div className="radio-group" st>
                                    <label>
                                        <input type="radio" name="gender" value="Nam" defaultChecked />
                                        Nam
                                    </label>
                                    <label>
                                        <input type="radio" name="gender" value="Nữ" />
                                        Nữ
                                    </label>
                                    <label>
                                        <input type="radio" name="gender" value="Khác" />
                                        Khác
                                    </label>
                                </div>
                            </div>
                            <button type="submit" className="update-btn">
                                Cập nhật
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserInformation;