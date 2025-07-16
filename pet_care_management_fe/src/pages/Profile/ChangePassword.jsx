"use client"

import { useState } from "react"
import axios from "axios"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const idUser = localStorage.getItem("userId")
  const accessToken = localStorage.getItem("accessToken")

  const handleChangePassword = async (e) => {
    e.preventDefault()
    const validationErrors = {}

    if (!oldPassword) validationErrors.oldPassword = "Vui lòng nhập mật khẩu cũ."
    if (!newPassword) validationErrors.newPassword = "Vui lòng nhập mật khẩu mới."
    if (newPassword.length < 6) validationErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự."
    if (newPassword !== confirmPassword) validationErrors.confirmPassword = "Mật khẩu xác nhận không khớp."

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const res = await axios.post(
        `http://localhost:8080/api/user/changePassword/${idUser}`,
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      alert("Đổi mật khẩu thành công!")
      setOldPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setErrors({})
    } catch (error) {
      if (error.response?.data?.message) {
        setErrors({ oldPassword: error.response.data.message })
      } else {
        alert("Có lỗi xảy ra khi đổi mật khẩu.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoBack = () => {
    window.history.back()
  }

  return (
    <>
      <style jsx>{`
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

        .content-wrapper.sidebar-collapsed {
          margin-left: 80px;
        }

        .content-wrapper.sidebar-expanded {
          margin-left: 280px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .toggle-btn {
          border: none;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-size: 16px;
          padding: 12px;
          cursor: pointer;
          border-radius: 12px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .toggle-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
          }

          .sidebar.mobile-open {
            transform: translateX(0);
          }

          .content-wrapper {
            margin-left: 0 !important;
          }
        }

        .password-container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        .password-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
          pointer-events: none;
        }

        .password-header {
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

        .back-btn {
          border: none;
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
          font-size: 16px;
          padding: 12px 24px;
          cursor: pointer;
          border-radius: 12px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .back-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(79, 172, 254, 0.4);
          color: white;
          text-decoration: none;
        }

        .page-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #333;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .content-wrapper {
          padding: 32px;
          position: relative;
          z-index: 1;
        }

        .password-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
          max-width: 600px;
          margin: 0 auto;
        }

        .password-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #4facfe 0%, #00f2fe 50%, #667eea 100%);
        }

        .card-header {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 32px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          text-align: center;
        }

        .password-title {
          font-size: 2rem;
          font-weight: 700;
          color: #333;
          margin: 0 0 8px 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .password-subtitle {
          color: #666;
          font-size: 1.1rem;
          margin: 0;
        }

        .card-body {
          padding: 40px;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-label {
          display: block;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
          font-size: 1rem;
        }

        .form-control {
          width: 100%;
          padding: 16px 20px;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .form-control:focus {
          outline: none;
          border-color: #4facfe;
          box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
          transform: translateY(-1px);
        }

        .form-control.error {
          border-color: #dc3545;
          box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
        }

        .input-error {
          color: #dc3545;
          font-size: 0.875rem;
          margin-top: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .input-error::before {
          content: '⚠️';
          font-size: 0.75rem;
        }

        .save-btn {
          width: 100%;
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          border: none;
          border-radius: 12px;
          padding: 16px 24px;
          color: white;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 32px;
        }

        .save-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
          color: white;
          text-decoration: none;
        }

        .save-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .loading-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .security-tips {
          background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
          border-radius: 16px;
          padding: 24px;
          margin-top: 32px;
          border: 1px solid rgba(79, 172, 254, 0.2);
        }

        .security-title {
          font-weight: 600;
          color: #333;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .security-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .security-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 12px;
          color: #666;
          font-size: 0.95rem;
        }

        .security-item::before {
          content: '✓';
          color: #28a745;
          font-weight: bold;
          font-size: 1rem;
          margin-top: 2px;
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

        @media (max-width: 768px) {
          .header-content {
            padding: 0 16px;
          }

          .content-wrapper {
            padding: 16px;
          }

          .card-body {
            padding: 24px;
          }

          .card-header {
            padding: 24px;
          }

          .password-title {
            font-size: 1.5rem;
          }

          .page-title {
            font-size: 1.5rem;
          }

          .form-control {
            padding: 14px 16px;
          }

          .save-btn {
            padding: 14px 20px;
            font-size: 1rem;
          }
        }
      `}</style>

      <div className="password-container">
        <div className="floating-elements">
          <div className="floating-element"></div>
          <div className="floating-element"></div>
          <div className="floating-element"></div>
        </div>

        {/* Sidebar */}
        <div className={`sidebar ${sidebarCollapsed ? "collapsed" : "expanded"}`}>
          <div className="sidebar-header">
            <div className="logo">
              <span className="logo-icon">🔐</span>
              {!sidebarCollapsed && <span>Security Manager</span>}
            </div>
          </div>
          <ul className="sidebar-menu">
            <li>
              <button className="menu-item" onClick={() => (window.location.href = "/user/profile")}>
                <i className="bi bi-person-circle menu-icon"></i>
                <span className="menu-text">Thông tin cá nhân</span>
              </button>
            </li>
            <li>
              <button className="menu-item" onClick={() => (window.location.href = "/user/orders")}>
                <i className="bi bi-bag menu-icon"></i>
                <span className="menu-text">Đơn hàng của tôi</span>
              </button>
            </li>
            <li>
              <button className="menu-item" onClick={() => (window.location.href = "/user/pets")}>
                <i className="bi bi-heart menu-icon"></i>
                <span className="menu-text">Thú cưng của tôi</span>
              </button>
            </li>
            <li>
              <button className="menu-item" onClick={() => (window.location.href = "/user/schedule")}>
                <i className="bi bi-calendar-check menu-icon"></i>
                <span className="menu-text">Lịch khám của tôi</span>
              </button>
            </li>
            <li>
              <button className="menu-item active" onClick={() => (window.location.href = "/user/changePassword")}>
                <i className="bi bi-key menu-icon"></i>
                <span className="menu-text">Đổi mật khẩu</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Header */}
        <div className="password-header position-relative py-2 border-bottom">
          <div className="header-content d-flex align-items-center position-relative px-3">

            {/* Tiêu đề căn giữa tuyệt đối */}
            <h1 className="page-title position-absolute top-50 start-50 translate-middle m-0">
              <i className="bi bi-shield-lock-fill me-2"></i>
              Đổi mật khẩu
            </h1>

            {/* Nút bên phải */}
            <div className="header-right ms-auto d-flex gap-2">
              <button className="toggle-btn btn btn-outline-secondary" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
                <i className={`bi ${sidebarCollapsed ? "bi-list" : "bi-x-lg"}`}></i>
              </button>
              <button className="back-btn btn btn-outline-primary" onClick={() => window.location.href = "/home"}>
                <i className="bi bi-arrow-left me-1"></i>
                Quay lại
              </button>
            </div>

          </div>
        </div>


        {/* Content */}
        <div className={`content-wrapper ${sidebarCollapsed ? "sidebar-collapsed" : "sidebar-expanded"}`}>
          <div className="password-card">
            {/* Card Header */}
            <div className="card-header">
              <h2 className="password-title">🔐 Đổi mật khẩu</h2>
              <p className="password-subtitle">Thay đổi mật khẩu để bảo mật tài khoản của bạn</p>
            </div>

            {/* Card Body */}
            <div className="card-body">
              <form onSubmit={handleChangePassword}>
                <div className="form-group">
                  <label className="form-label">
                    <i className="bi bi-lock me-2"></i>
                    Mật khẩu cũ
                  </label>
                  <input
                    type="password"
                    className={`form-control ${errors.oldPassword ? "error" : ""}`}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                  {errors.oldPassword && <div className="input-error">{errors.oldPassword}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <i className="bi bi-key me-2"></i>
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    className={`form-control ${errors.newPassword ? "error" : ""}`}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                  />
                  {errors.newPassword && <div className="input-error">{errors.newPassword}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <i className="bi bi-check-circle me-2"></i>
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    type="password"
                    className={`form-control ${errors.confirmPassword ? "error" : ""}`}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                  />
                  {errors.confirmPassword && <div className="input-error">{errors.confirmPassword}</div>}
                </div>

                <button type="submit" className="save-btn" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="loading-spinner"></span>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle"></i>
                      Lưu thay đổi
                    </>
                  )}
                </button>
              </form>

              {/* Security Tips */}
              <div className="security-tips">
                <h4 className="security-title">
                  <i className="bi bi-info-circle"></i>
                  Lời khuyên bảo mật
                </h4>
                <ul className="security-list">
                  <li className="security-item">Sử dụng mật khẩu có ít nhất 8 ký tự</li>
                  <li className="security-item">Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</li>
                  <li className="security-item">Không sử dụng thông tin cá nhân dễ đoán</li>
                  <li className="security-item">Thay đổi mật khẩu định kỳ để tăng cường bảo mật</li>
                  <li className="security-item">Không chia sẻ mật khẩu với người khác</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ChangePassword
