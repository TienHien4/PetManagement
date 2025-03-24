import React from 'react';
import axios from "axios";
import {
    UserOutlined,
  } from '@ant-design/icons';
  import { Avatar } from 'antd';
import { useNavigate } from "react-router-dom";
import '../assets/css/header.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/owl.carousel.min.css';
import '../assets/css/slicknav.css';
import '../assets/css/flaticon.css';
import '../assets/css/animate.min.css';
import '../assets/css/magnific-popup.css';
import '../assets/css/fontawesome-all.min.css';
import '../assets/css/themify-icons.css';
import '../assets/css/slick.css';
import '../assets/css/nice-select.css';
import '../assets/css/style.css';

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
  
            let token = localStorage.getItem("accessToken");
    
            if (!token) {
                console.error("Error: accessToken is null or undefined before logout.");
                return;
            }
    
            console.log("Logging out with accessToken:", token);
    
            // Gửi yêu cầu logout đến backend
            const response = await axios.post("http://localhost:8080/api/logout", 
                { token: token }, 
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json" 
                    }
                }
            );
    
            console.log("Logout response:", response.data);
    
            // Xóa token khỏi localStorage sau khi logout thành công
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("UserName");
            localStorage.removeItem("user");
    
            // Điều hướng về trang đăng nhập
            navigate("/login");
    
        } catch (error) {
            console.error("Logout error:", error.response?.data || error.message);
        }
    };

    return (
        <header>
            <div className="header-area header-transparent">
                <div className="main-header header-sticky">
                    <div className="container-fluid">
                        <div className="row align-items-center">
                            <div className="col-xl-2 col-lg-2 col-md-1">
                                <div className="logo">
                                    <a href="index.html"><img src="assets/img/logo/logo.png" alt=""/></a>
                                </div>
                            </div>
                            <div className="col-xl-10 col-lg-10 col-md-10">
                                <div className="menu-main d-flex align-items-center justify-content-end">
                                    <div className="main-menu f-right d-none d-lg-block">
                                        <nav>
                                            <ul id="navigation">
                                                <li><a href="index.html">Home</a></li>
                                                <li><a href="about.html">About</a></li>
                                                <li><a href="services.html">Services</a></li>
                                                <li><a href="blog.html">Blog</a>
                                                    <ul className="submenu">
                                                        <li><a href="blog.html">Blog</a></li>
                                                        <li><a href="blog_details.html">Blog Details</a></li>
                                                        <li><a href="elements.html">Element</a></li>
                                                    </ul>
                                                </li>
                                                <li><a href="contact.html">Contact</a></li>
                                            </ul>
                                        </nav>
                                    </div>
                                    <button onClick={handleLogout} style={{cursor: 'pointer'}}>
                        <Avatar style={{marginRight: 10}} size='default' icon={<UserOutlined/>} ></Avatar>
                          {localStorage.getItem("UserName").toUpperCase()}
                    </button>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="mobile_menu d-block d-lg-none"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;