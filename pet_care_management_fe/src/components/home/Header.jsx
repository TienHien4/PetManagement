"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import logo from '../../assets/img/logo.png';
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [userName, setUserName] = useState("")
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    setUserName(localStorage.getItem("UserName") || "Guest")

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      const token = localStorage.getItem("accessToken")

      if (!token) {
        console.error("Error: accessToken is null or undefined before logout.")
        return
      }

      const response = await axios.post(
        "http://localhost:8080/api/logout",
        { token: token },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      )

      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("UserName")
      localStorage.removeItem("userId")

      window.location.href = "/login"
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message)
      alert("Có lỗi xảy ra khi đăng xuất!")
    } finally {
      setIsLoggingOut(false)
    }
  }

  const navigationItems = [
    { href: "/home", label: "Trang chủ", icon: "bi-house" },
    { href: "/about", label: "Giới thiệu", icon: "bi-info-circle" },
    { href: "/news", label: "Tin tức", icon: "bi-newspaper" },
    { href: "/services", label: "Dịch vụ", icon: "bi-heart-pulse" },
    { href: "/products", label: "Sản phẩm", icon: "bi-box-seam" },
    { href: "/contact", label: "Liên hệ", icon: "bi-telephone" },
  ]

  return (
    <>
      <style jsx>{`
        .modern-header {
          position: relative;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1050;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .header-top {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 14px 0;
          transition: all 0.3s ease;
        }

        .header-top.scrolled {
          padding: 8px 0;
          transform: none;
          opacity: 1;
        }

        .header-main {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.4s ease;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          padding: 16px 0;
        }

        .header-main.scrolled {
          background: rgba(255, 255, 255, 0.98);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
          padding: 8px 0;
        }

        .contact-info {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .contact-item1 {
          display: flex;
          align-items: center;
          gap: 10px;
          color: white;
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .contact-item1:hover {
          color: rgba(255, 255, 255, 0.8);
          transform: translateY(-1px);
        }

        .contact-icon {
          font-size: 18px;
        }

        .social-links {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
        }

        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 50%;
          color: white;
          text-decoration: none;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          font-size: 18px;
        }

        .social-link:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px);
          color: white;
          box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
        }

        .user-dropdown {
          position: relative;
          display: flex;
          justify-content: flex-end;
        }

        .user-trigger {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.15);
          border: none;
          border-radius: 30px;
          padding: 10px 20px;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          font-size: 15px;
          font-weight: 600;
        }

        .user-trigger:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 16px;
        }

        .user-name {
          font-weight: 600;
          font-size: 15px;
        }

        .dropdown-menu-custom {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(0, 0, 0, 0.1);
          min-width: 220px;
          padding: 8px;
          margin-top: 8px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all 0.3s ease;
          z-index: 1000;
        }

        .dropdown-menu-custom.show {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .dropdown-item-custom {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 8px;
          text-decoration: none;
          color: #333;
          transition: all 0.3s ease;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          font-size: 14px;
        }

        .dropdown-item-custom:hover {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          color: #333;
          transform: translateX(4px);
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .logo-img {
          height: 55px;
          width: auto;
          transition: transform 0.3s ease;
        }

        .logo-img:hover {
          transform: scale(1.05);
        }

        .brand-text {
          font-size: 28px;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }

        .main-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
        }

        .nav-item {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 24px;
          text-decoration: none;
          color: #333;
          font-weight: 600;
          font-size: 15px;
          border-radius: 25px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          min-width: 140px;
          text-align: center;
        }

        .nav-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          transition: left 0.3s ease;
          z-index: -1;
        }

        .nav-item:hover::before {
          left: 0;
        }

        .nav-item:hover {
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .nav-icon {
          font-size: 16px;
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          font-size: 28px;
          color: #333;
          cursor: pointer;
          padding: 12px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .mobile-menu-btn:hover {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }

        .mobile-menu {
          position: fixed;
          top: 0;
          right: -100%;
          width: 320px;
          height: 100vh;
          background: white;
          box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
          transition: right 0.4s ease;
          z-index: 1100;
          padding: 24px;
        }

        .mobile-menu.open {
          right: 0;
        }

        .mobile-menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }

        .mobile-close-btn {
          background: none;
          border: none;
          font-size: 28px;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.3s ease;
          color: #666;
        }

        .mobile-close-btn:hover {
          background: rgba(220, 53, 69, 0.1);
          color: #dc3545;
        }

        .mobile-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .mobile-nav-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          text-decoration: none;
          color: #333;
          border-radius: 12px;
          transition: all 0.3s ease;
          font-size: 16px;
          font-weight: 500;
        }

        .mobile-nav-item:hover {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          color: #333;
          transform: translateX(8px);
        }

        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          z-index: 1050;
        }

        .overlay.show {
          opacity: 1;
          visibility: visible;
        }

        .loading-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 991px) {
          .main-nav {
            display: none;
          }
          
          .mobile-menu-btn {
            display: block;
          }
          
          .contact-info {
            gap: 20px;
          }
          
          .contact-item1 {
            font-size: 13px;
          }
          
          .social-links {
            gap: 16px;
          }
          
          .social-link {
            width: 40px;
            height: 40px;
            font-size: 16px;
          }
        }

        @media (max-width: 768px) {
          .header-top {
            padding: 10px 0;
          }
          
          .contact-info {
            flex-direction: column;
            gap: 8px;
            align-items: flex-start;
          }
          
          .brand-text {
            font-size: 22px;
          }
          
          .logo-img {
            height: 45px;
          }
          
          .user-name {
            display: none;
          }
        }

        @media (max-width: 576px) {
          .social-links {
            gap: 12px;
          }
          
          .social-link {
            width: 36px;
            height: 36px;
            font-size: 14px;
          }
          
          .user-trigger {
            padding: 8px 12px;
          }
          
          .user-avatar {
            width: 32px;
            height: 32px;
            font-size: 14px;
          }
        }
      `}</style>

      <header className="modern-header">
        {/* Header Top */}
        <div className={`header-top ${isScrolled ? "scrolled" : ""}`}>
          <div className="container-fluid px-4">
            <div className="row align-items-center">
              <div className="col-lg-5 col-md-6">
                <div className="contact-info">
                  <a href="tel:0382562504" className="contact-item1">
                    <i className="bi bi-telephone contact-icon"></i>
                    <span>0382562504</span>
                  </a>
                  <div className="contact-item1">
                    <i className="bi bi-clock contact-icon"></i>
                    <span>8:00 - 17:00 Thứ 2 - Thứ 7</span>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-3">
                <div className="social-links">
                  <a href="#" className="social-link">
                    <i className="bi bi-facebook"></i>
                  </a>
                  <a href="#" className="social-link">
                    <i className="bi bi-google"></i>
                  </a>
                  <a href="#" className="social-link">
                    <i className="bi bi-instagram"></i>
                  </a>
                </div>
              </div>
              <div className="col-lg-3 col-md-3">
                <div className="user-dropdown">
                  <button className="user-trigger" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    <div className="user-avatar">{userName.charAt(0).toUpperCase()}</div>
                    <span className="user-name">{userName.toUpperCase()}</span>
                    <i className={`bi bi-chevron-${isDropdownOpen ? "up" : "down"}`}></i>
                  </button>

                  <div className={`dropdown-menu-custom ${isDropdownOpen ? "show" : ""}`}>
                    <button className="dropdown-item-custom" onClick={() => (window.location.href = "/user/profile")}>
                      <i className="bi bi-person-circle"></i>
                      <span>Thông tin tài khoản</span>
                    </button>
                    <button className="dropdown-item-custom" onClick={() => (window.location.href = "/user/orders")}>
                      <i className="bi bi-bag"></i>
                      <span>Đơn hàng của tôi</span>
                    </button>
                    <button className="dropdown-item-custom" onClick={() => (window.location.href = "/user/pets")}>
                      <i className="bi bi-heart"></i>
                      <span>Thú cưng của tôi</span>
                    </button>
                    <div style={{ height: "1px", background: "#eee", margin: "8px 0" }}></div>
                    <button className="dropdown-item-custom" onClick={handleLogout} disabled={isLoggingOut}>
                      {isLoggingOut ? (
                        <span className="loading-spinner"></span>
                      ) : (
                        <i className="bi bi-box-arrow-right"></i>
                      )}
                      <span>{isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Header Main */}
        <div className={`header-main ${isScrolled ? "scrolled" : ""}`}>
          <div className="container-fluid px-4">
            <div className="row align-items-center">
              <div className="col-lg-2 col-md-4 col-6">
                <div className="logo-container">
                  <img src={logo} alt="Pet Care Logo" className="logo-img" />
                  <span className="brand-text">PetCare</span>
                </div>
              </div>

              <div className="col-lg-8 col-md-6 col-4" style={{ marginLeft: "80px" }}>
                <nav className="main-nav">
                  {navigationItems.map((item, index) => (
                    <a key={index} href={item.href} className="nav-item">
                      <i className={`bi ${item.icon} nav-icon`}></i>
                      <span>{item.label}</span>
                    </a>
                  ))}
                </nav>
              </div>

              <div className="col-lg-2 col-md-2 col-2">
                <div className="d-flex justify-content-end">
                  <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(true)}>
                    <i className="bi bi-list"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
          <div className="mobile-menu-header">
            <div className="logo-container">
              <img src="/placeholder.svg?height=45&width=45" alt="Pet Care Logo" className="logo-img" />
              <span className="brand-text">PetCare</span>
            </div>
            <button className="mobile-close-btn" onClick={() => setIsMobileMenuOpen(false)}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          <nav className="mobile-nav">
            {navigationItems.map((item, index) => (
              <a key={index} href={item.href} className="mobile-nav-item" onClick={() => setIsMobileMenuOpen(false)}>
                <i className={`bi ${item.icon}`}></i>
                <span>{item.label}</span>
              </a>
            ))}

            <div style={{ height: "1px", background: "#eee", margin: "16px 0" }}></div>

            <button
              className="mobile-nav-item"
              onClick={() => {
                setIsMobileMenuOpen(false)
                window.location.href = "/user/profile"
              }}
            >
              <i className="bi bi-person-circle"></i>
              <span>Thông tin tài khoản</span>
            </button>

            <button
              className="mobile-nav-item"
              onClick={() => {
                setIsMobileMenuOpen(false)
                window.location.href = "/user/orders"
              }}
            >
              <i className="bi bi-bag"></i>
              <span>Đơn hàng của tôi</span>
            </button>

            <button className="mobile-nav-item" onClick={handleLogout} disabled={isLoggingOut}>
              {isLoggingOut ? <span className="loading-spinner"></span> : <i className="bi bi-box-arrow-right"></i>}
              <span>{isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}</span>
            </button>
          </nav>
        </div>

        {/* Overlay */}
        <div className={`overlay ${isMobileMenuOpen ? "show" : ""}`} onClick={() => setIsMobileMenuOpen(false)}></div>
      </header >
    </>
  )
}

export default Header
