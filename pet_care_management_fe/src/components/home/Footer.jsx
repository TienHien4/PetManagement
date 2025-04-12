import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/img/logo.png';
import '../../assets/css/style.css';
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer_top">
        <div className="container">
          <div className="row" style={{ width: "1320px" }}>
            <div className="col-xl-3 col-md-6 col-lg-3">
              <div className="footer_widget">
                <h3 className="footer_title">Liên hệ</h3>
                <ul className="address_line">
                  <li>0382562504</li>
                  <li><a href="#">haisesasakilop8@gmail.com</a></li>
                  <li>Thuận Thành - Bắc Ninh</li>
                </ul>
              </div>
            </div>

            <div className="col-xl-3 col-md-6 col-lg-3">
              <div className="footer_widget">
                <h3 className="footer_title">Dịch vụ</h3>
                <ul className="links">
                  <li><Link to="/dich-vu">Bảo hiểm thú cưng</Link></li>
                  <li><Link to="/dich-vu">Phẫu thuật thú y</Link></li>
                  <li><Link to="/dich-vu">Nhận nuôi thú cưng</Link></li>
                  <li><Link to="/dich-vu">Bảo hiểm cho chó</Link></li>
                </ul>
              </div>
            </div>

            <div className="col-xl-3 col-md-6 col-lg-3">
              <div className="footer_widget">
                <h3 className="footer_title">Liên kết nhanh</h3>
                <ul className="links">
                  <li><Link to="/gioi-thieu">Về chúng tôi</Link></li>
                  <li><Link to="/chinh-sach">Chính sách bảo mật</Link></li>
                  <li><Link to="/dieu-khoan">Điều khoản dịch vụ</Link></li>
                  <li><Link to="/dang-nhap">Thông tin đăng nhập</Link></li>
                  <li><Link to="/kien-thuc">Kiến thức thú cưng</Link></li>
                </ul>
              </div>
            </div>

            <div className="col-xl-3 col-md-6 col-lg-3">
              <div className="footer_widget">
                <div className="footer_logo">
                  <Link to="/">
                    <img src={logo} alt="Logo Thú Cưng" />
                  </Link>
                </div>
                <p className="address_text">
                  Thuận Thành - Bắc Ninh
                </p>
                <div className="socail_links">
                  <ul>
                    <li><a href="#"><i className="fab fa-facebook"></i></a></li>
                    <li><a href="#"><i className="fab fa-instagram"></i></a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="copy-right_text">
        <div className="container">
          <div className="bordered_1px"></div>
          <div className="row">
            <div className="col-xl-12">
              <p className="copy_right text-center">
                Bản quyền &copy; {new Date().getFullYear()} |
                Được thiết kế với <i className="ti-heart" aria-hidden="true"></i> bởi
                <a href="https://colorlib.com" target="_blank" rel="noopener noreferrer"> Colorlib</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;