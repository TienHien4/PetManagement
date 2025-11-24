"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import ProductsManagement from "../../components/ProductsManagementComponent"

const ProductManagementPage = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        console.error("Error: accessToken is null or undefined before logout.")
        return
      }

      console.log("Logging out with accessToken:", token)

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

      console.log("Logout response:", response.data)

      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("UserName")
      window.location.href = "/login"
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message)
    }
  }

  const handleNavigation = (path) => {
    window.location.href = path
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <>
      <style jsx>{`
        .dashboard-container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        .dashboard-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
          pointer-events: none;
        }

        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          background: linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1000;
          overflow-y: auto;
          box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
        }

        .sidebar.collapsed {
          width: 80px;
        }

        .sidebar.expanded {
          width: 280px;
        }

        .sidebar-header {
          padding: 24px 20px;
          text-align: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
        }

        .logo {
          color: white;
          font-size: 24px;
          font-weight: 700;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .logo-icon {
          font-size: 32px;
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
        }

        .sidebar-menu {
          list-style: none;
          padding: 20px 0;
          margin: 0;
        }

        .menu-item {
          display: flex;
          align-items: center;
          padding: 16px 24px;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          transition: all 0.3s ease;
          cursor: pointer;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          margin: 4px 0;
          border-radius: 0 25px 25px 0;
          position: relative;
          overflow: hidden;
        }

        .menu-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 100%;
          background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
          transition: width 0.3s ease;
          z-index: -1;
        }

        .menu-item:hover::before,
        .menu-item.active::before {
          width: 100%;
        }

        .menu-item:hover,
        .menu-item.active {
          color: white;
          transform: translateX(8px);
          box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3);
        }

        .menu-icon {
          font-size: 20px;
          margin-right: 16px;
          min-width: 20px;
          transition: transform 0.3s ease;
        }

        .menu-item:hover .menu-icon {
          transform: scale(1.1);
        }

        .menu-text {
          white-space: nowrap;
          overflow: hidden;
          transition: opacity 0.3s ease;
          font-weight: 500;
          font-size: 15px;
        }

        .collapsed .menu-text {
          opacity: 0;
          width: 0;
        }

        .main-layout {
          transition: margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          min-height: 100vh;
          position: relative;
          z-index: 1;
        }

        .main-layout.sidebar-collapsed {
          margin-left: 80px;
        }

        .main-layout.sidebar-expanded {
          margin-left: 280px;
        }

        .header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          position: sticky;
          top: 0;
          z-index: 999;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 80px;
          padding: 0 32px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .toggle-btn {
          border: none;
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
          font-size: 18px;
          padding: 12px;
          cursor: pointer;
          border-radius: 12px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3);
        }

        .toggle-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(79, 172, 254, 0.4);
        }

        .header-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .current-time {
          font-size: 24px;
          font-weight: 700;
          color: #333;
          margin: 0;
        }

        .current-date {
          font-size: 14px;
          color: #666;
          margin: 0;
          text-transform: capitalize;
        }

        .user-info {
          display: flex;
          align-items: center;
          cursor: pointer;
          padding: 12px 20px;
          border-radius: 50px;
          transition: all 0.3s ease;
          border: none;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .user-info:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-right: 12px;
          font-size: 18px;
        }

        .user-name {
          font-weight: 600;
          color: white;
          margin: 0;
          font-size: 14px;
        }

        .page-header {
          padding: 32px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
          backdrop-filter: blur(20px);
          margin: 24px 32px 0 32px;
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .page-subtitle {
          font-size: 1.1rem;
          color: #666;
          margin: 8px 0 0 0;
          font-weight: 400;
        }

        .content-wrapper {
          padding: 32px;
          position: relative;
        }

        .products-content {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          padding: 40px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
        }

        .products-content::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #4facfe 0%, #00f2fe 50%, #667eea 100%);
        }

        .floating-elements {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .floating-element {
          position: absolute;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }

        .floating-element:nth-child(1) {
          width: 80px;
          height: 80px;
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }

        .floating-element:nth-child(2) {
          width: 120px;
          height: 120px;
          top: 60%;
          right: 10%;
          animation-delay: 2s;
        }

        .floating-element:nth-child(3) {
          width: 60px;
          height: 60px;
          bottom: 20%;
          left: 20%;
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.8;
          }
        }

        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
          display: none;
          backdrop-filter: blur(4px);
        }

        .overlay.show {
          display: block;
        }

        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
          }

          .sidebar.mobile-open {
            transform: translateX(0);
          }

          .main-layout {
            margin-left: 0 !important;
          }

          .header-content {
            padding: 0 16px;
          }

          .content-wrapper {
            padding: 16px;
          }

          .page-header {
            margin: 16px;
            padding: 24px;
          }

          .page-title {
            font-size: 2rem;
          }

          .products-content {
            padding: 24px;
          }

          .header-info {
            display: none;
          }
        }
      `}</style>

      <div className="dashboard-container">
        <div className="floating-elements">
          <div className="floating-element"></div>
          <div className="floating-element"></div>
          <div className="floating-element"></div>
        </div>

        {/* Sidebar */}
        <div className={`sidebar ${collapsed ? "collapsed" : "expanded"}`}>
          <div className="sidebar-header">
            <div className="logo">
              <span className="logo-icon">📦</span>
              {!collapsed && <span>Product Management</span>}
            </div>
          </div>
          <ul className="sidebar-menu">
            <li>
              <button
                className={`menu-item ${window.location.pathname === "/admin" ? "active" : ""}`}
                onClick={() => handleNavigation("/admin")}
              >
                <i className="bi bi-bar-chart menu-icon"></i>
                <span className="menu-text">Thống kê</span>
              </button>
            </li>
            <li>
              <button
                className={`menu-item ${window.location.pathname === "/admin/petmanagement" ? "active" : ""}`}
                onClick={() => handleNavigation("/admin/petmanagement")}
              >
                <span className="menu-icon">🐾</span>
                <span className="menu-text">Thú cưng</span>
              </button>
            </li>
            <li>
              <button className="menu-item active">
                <i className="bi bi-box-seam menu-icon"></i>
                <span className="menu-text">Sản phẩm</span>
              </button>
            </li>
            <li>
              <button
                className={`menu-item ${window.location.pathname === "/admin/usermanagement" ? "active" : ""}`}
                onClick={() => handleNavigation("/admin/usermanagement")}
              >
                <i className="bi bi-person menu-icon"></i>
                <span className="menu-text">Tài khoản</span>
              </button>
            </li>
            <li>
              <button
                className={`menu-item ${window.location.pathname === "/admin/orders" ? "active" : ""}`}
                onClick={() => handleNavigation("/admin/orders")}
              >
                <i className="bi bi-bag menu-icon"></i>
                <span className="menu-text">Đơn hàng</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Main Layout */}
        <div className={`main-layout ${collapsed ? "sidebar-collapsed" : "sidebar-expanded"}`}>
          {/* Header */}
          <div className="header">
            <div className="header-content">
              <div className="header-left">
                <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
                  <i className={`bi ${collapsed ? "bi-list" : "bi-x-lg"}`}></i>
                </button>
                <div className="header-info">
                  <h2 className="current-time">{formatTime(currentTime)}</h2>
                  <p className="current-date">{formatDate(currentTime)}</p>
                </div>
              </div>
              <button className="user-info" onClick={handleLogout}>
                <div className="user-avatar">
                  <i className="bi bi-person"></i>
                </div>
                <div>
                  <h6 className="user-name">
                    {localStorage.getItem("UserName") ? localStorage.getItem("UserName").toUpperCase() : "GUEST"}
                  </h6>
                </div>
              </button>
            </div>
          </div>

          {/* Page Header */}
          <div className="page-header">
            <h1 className="page-title">
              <span>📦</span>
              <span>Quản lý sản phẩm</span>
            </h1>
            <p className="page-subtitle">Quản lý thông tin và kho sản phẩm trong hệ thống</p>
          </div>

          {/* Content */}
          <div className="content-wrapper">
            <div className="products-content">
              <ProductsManagement />
            </div>
          </div>
        </div>

        {/* Mobile Overlay */}
        <div className={`overlay ${!collapsed ? "show" : ""} d-md-none`} onClick={() => setCollapsed(true)}></div>
      </div>
    </>
  )
}

export default ProductManagementPage
