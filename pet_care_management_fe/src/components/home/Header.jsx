
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/img/logo.png';
import axios from "axios";


const Header = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      let token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("Error: accessToken is null or undefined before logout.");
        return;
      }

      console.log("Logging out with accessToken:", token);

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

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("UserName");

      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
    }
  };

  return (
    <header>
      <div className="header-area">
        <div className="header-top_area">
          <div className="container">
            <div className="row" style={{ width: "1300px" }}>
              <div className="col-lg-5 col-md-8">
                <div className="short_contact_list">
                  <ul>
                    <li><a style={{ fontSize: "20px" }} href="#">0382562504</a></li>
                    <li><a style={{ fontSize: "20px" }} href="#">8:00 - 17:00 Thứ 2 - Thứ 7</a></li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-4 col-md-4">
                <div className="social_media_links">
                  <a href="#"><i style={{ fontSize: "30px", marginTop: "5px" }} className="fab fa-facebook"></i></a>
                  <a href="#"><i style={{ fontSize: "30px", marginTop: "5px" }} className="fab fa-google-plus"></i></a>
                </div>
              </div>
              <div className="col-lg-3 col-md-1">
                <button onClick={handleLogout} style={{ backgroundColor: 'white', cursor: 'pointer', display: "flex", alignItems: "center", border: "none", background: "none" }}>
                  <h5 style={{ color: "black", marginTop: "3px", color: "white" }}> <i style={{ fontSize: "30px" }} class="fa-solid fa-circle-user"></i> {localStorage.getItem("UserName") ? localStorage.getItem("UserName").toUpperCase() : "Guest"}</h5>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div id="sticky-header" className="main-header-area">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-xl-3 col-lg-3">
                <div className="logo">
                  <Link to="/">
                    <img src={logo} alt="Animal Logo" />
                  </Link>
                </div>
              </div>
              <div className="col-xl-9 col-lg-9">
                <div className="main-menu d-none d-lg-block">
                  <nav>
                    <ul id="navigation">
                      <li><Link to="/home">Trang chủ</Link></li>
                      <li><Link to="/about">Giới thiệu</Link></li>
                      <li><Link to="/blog">Tin tức</Link></li>



                      <li><Link to="/services">Dịch vụ</Link></li>
                      <li><Link to="/contact">Liên hệ</Link></li>
                    </ul>
                  </nav>
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