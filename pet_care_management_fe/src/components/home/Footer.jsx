"use client"
import { Link } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import logo from '../../assets/img/logo.png';
import "bootstrap-icons/font/bootstrap-icons.css"

const Footer = () => {
  return (
    <>
      <style jsx>{`
        .modern-footer {
          background: #f4f4f4;
          color: #212529;
          position: relative;
          overflow: hidden;
        }
        .modern-footer::before {
          display: none;
        }

        .footer-bottom {
          background: #e9ecef;
          padding: 25px 0;
          border-top: 1px solid #ccc;
          color: #212529;
        }

        .footer-content {
          position: relative;
          z-index: 2;
          padding: 80px 0 40px;
        }

        .footer-title,
        .brand-text-footer,
        .newsletter-title {
          color: #111;
          font-weight: 700;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          margin-bottom: 12px;
          transition: all 0.3s ease;
        }

        .footer-links li:hover {
          transform: translateX(8px);
        }

        .footer-links a {
          color: #444;
          text-decoration: none;
          font-size: 15px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .footer-links a:hover {
          color: #000;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #444;
          margin-bottom: 15px;
        }

        .contact-item:hover {
          color: #000;
        }

        .contact-icon {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #dee2e6;
          border-radius: 50%;
          font-size: 12px;
        }

        .footer-logo-section {
          text-align: center;
          margin-bottom: 30px;
        }

        .footer-logo img {
          height: 60px;
          filter: none;
        }

        .brand-text-footer {
          font-size: 24px;
          margin: 15px 0;
        }

        .footer-description {
          color: #555;
          font-size: 15px;
          line-height: 1.6;
        }

        .newsletter-section {
          background: #fff;
          border-radius: 15px;
          padding: 30px;
          border: 1px solid #ddd;
        }

        .newsletter-form {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .newsletter-input {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid #ccc;
          border-radius: 25px;
          background: #fff;
          font-size: 14px;
          color: #212529;
        }

        .newsletter-btn {
          padding: 12px 24px;
          background: #007bff;
          border: none;
          border-radius: 25px;
          color: white;
          font-weight: 600;
        }

        .newsletter-btn:hover {
          background: #0056b3;
        }

        .social-links-footer {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-top: 20px;
        }

        .social-link-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 45px;
          height: 45px;
          background: #ddd;
          border-radius: 50%;
          color: #333;
          font-size: 18px;
          border: 1px solid #ccc;
        }

        .social-link-footer:hover {
          background: #bbb;
          color: #000;
        }

        .copyright-text {
          color: #6c757d;
          font-size: 14px;
          text-align: center;
        }

        .copyright-text a {
          color: #007bff;
          font-weight: 600;
          text-decoration: none;
        }

        .heart-icon {
          color: #dc3545;
          animation: heartbeat 1.5s ease-in-out infinite;
          margin: 0 5px;
        }

        @keyframes heartbeat {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        @media (max-width: 768px) {
          .footer-content {
            padding: 60px 0 30px;
          }

          .footer-widget {
            margin-bottom: 30px;
            text-align: center;
          }

          .newsletter-form {
            flex-direction: column;
          }

          .newsletter-btn {
            width: fit-content;
            align-self: center;
          }
        }
      `}</style>


      <footer className="modern-footer">
        <div className="footer-content">
          <div className="container">
            <div className="row">
              {/* Contact Section */}
              <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                <div className="footer-widget">
                  <h3 className="footer-title">Liên hệ</h3>
                  <div className="contact-item">
                    <div className="contact-icon">
                      <i className="bi bi-telephone"></i>
                    </div>
                    <a href="tel:0382562504" style={{ color: "inherit", textDecoration: "none" }}>
                      0382562504
                    </a>
                  </div>
                  <div className="contact-item">
                    <div className="contact-icon">
                      <i className="bi bi-envelope"></i>
                    </div>
                    <a href="mailto:haisesasakilop8@gmail.com" style={{ color: "inherit", textDecoration: "none" }}>
                      haisesasakilop8@gmail.com
                    </a>
                  </div>
                  <div className="contact-item">
                    <div className="contact-icon">
                      <i className="bi bi-geo-alt"></i>
                    </div>
                    <span>Thuận Thành - Bắc Ninh</span>
                  </div>
                  <div className="contact-item">
                    <div className="contact-icon">
                      <i className="bi bi-clock"></i>
                    </div>
                    <span>8:00 - 17:00 (Thứ 2 - Thứ 7)</span>
                  </div>
                </div>
              </div>

              {/* Services Section */}
              <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                <div className="footer-widget">
                  <h3 className="footer-title">Dịch vụ</h3>
                  <ul className="footer-links">
                    <li>
                      <Link to="/dich-vu/bao-hiem">
                        <i className="bi bi-shield-check"></i>
                        Bảo hiểm thú cưng
                      </Link>
                    </li>
                    <li>
                      <Link to="/dich-vu/phau-thuat">
                        <i className="bi bi-heart-pulse"></i>
                        Phẫu thuật thú y
                      </Link>
                    </li>
                    <li>
                      <Link to="/dich-vu/nhan-nuoi">
                        <i className="bi bi-house-heart"></i>
                        Nhận nuôi thú cưng
                      </Link>
                    </li>
                    <li>
                      <Link to="/dich-vu/kham-benh">
                        <i className="bi bi-hospital"></i>
                        Khám bệnh tổng quát
                      </Link>
                    </li>
                    <li>
                      <Link to="/dich-vu/spa">
                        <i className="bi bi-scissors"></i>
                        Spa & Grooming
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Quick Links Section */}
              <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                <div className="footer-widget">
                  <h3 className="footer-title">Liên kết nhanh</h3>
                  <ul className="footer-links">
                    <li>
                      <Link to="/gioi-thieu">
                        <i className="bi bi-info-circle"></i>
                        Về chúng tôi
                      </Link>
                    </li>
                    <li>
                      <Link to="/tin-tuc">
                        <i className="bi bi-newspaper"></i>
                        Tin tức & Blog
                      </Link>
                    </li>
                    <li>
                      <Link to="/chinh-sach">
                        <i className="bi bi-shield-lock"></i>
                        Chính sách bảo mật
                      </Link>
                    </li>
                    <li>
                      <Link to="/dieu-khoan">
                        <i className="bi bi-file-text"></i>
                        Điều khoản dịch vụ
                      </Link>
                    </li>
                    <li>
                      <Link to="/ho-tro">
                        <i className="bi bi-question-circle"></i>
                        Hỗ trợ khách hàng
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Brand & Newsletter Section */}
              <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                <div className="footer-widget">
                  <div className="footer-logo-section">
                    <Link to="/" className="footer-logo">
                      <img src={logo} alt="PetCare Logo" />
                    </Link>
                    <h4 className="brand-text-footer">PetCare</h4>
                    <p className="footer-description">
                      Chăm sóc thú cưng với tình yêu và chuyên nghiệp. Đồng hành cùng bạn trong hành trình nuôi dưỡng
                      những người bạn bốn chân.
                    </p>
                  </div>

                  <div className="newsletter-section">
                    <h5 className="newsletter-title">
                      <i className="bi bi-envelope-heart me-2"></i>
                      Đăng ký nhận tin
                    </h5>
                    <p
                      style={{
                        color: "rgba(255,255,255,0.8)",
                        fontSize: "14px",
                        textAlign: "center",
                        margin: "10px 0",
                      }}
                    >
                      Nhận thông tin mới nhất về chăm sóc thú cưng
                    </p>
                    <div className="newsletter-form">
                      <input type="email" className="newsletter-input" placeholder="Email của bạn..." />
                      <button className="newsletter-btn">
                        <i className="bi bi-send"></i>
                      </button>
                    </div>
                  </div>

                  <div className="social-links-footer">
                    <a href="#" className="social-link-footer" title="Facebook">
                      <i className="bi bi-facebook"></i>
                    </a>
                    <a href="#" className="social-link-footer" title="Instagram">
                      <i className="bi bi-instagram"></i>
                    </a>
                    <a href="#" className="social-link-footer" title="YouTube">
                      <i className="bi bi-youtube"></i>
                    </a>
                    <a href="#" className="social-link-footer" title="TikTok">
                      <i className="bi bi-tiktok"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <p className="copyright-text">
                  Bản quyền &copy; {new Date().getFullYear()} PetCare. Tất cả quyền được bảo lưu. | Được thiết kế với{" "}
                  <i className="bi bi-heart-fill heart-icon"></i> bởi
                  <a href="https://colorlib.com" target="_blank" rel="noopener noreferrer">
                    {" "}
                    Colorlib
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
