"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import Header from "../../components/home/Header"

const UserInformation = () => {
  const [email, setEmail] = useState("")
  const [userName, setUserName] = useState("")
  const [gender, setGender] = useState("")
  const [dob, setDob] = useState("")
  const [password, setPassword] = useState("")
  const [id, setId] = useState("")
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    const idUser = localStorage.getItem("userId")
    const accessToken = localStorage.getItem("accessToken")

    if (!accessToken || !idUser) {
      window.location.href = "/login"
      return
    }

    setId(idUser)
    fetchUserInfo(accessToken, idUser)
  }, [])

  const fetchUserInfo = async (accessToken, userId) => {
    setLoading(true)
    try {
      const res = await axios.get(`http://localhost:8080/api/user/getInfor/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      console.log(res.data)
      setEmail(res.data.email || "")
      setUserName(res.data.userName || "")
      setPassword(res.data.password || "")
      setGender(res.data.gender || "")

      if (res.data.dob) {
        const date = new Date(res.data.dob)
        const formattedDob = date.toISOString().split("T")[0]
        setDob(formattedDob)
      }
    } catch (error) {
      console.error("Error fetching user info:", error)
      alert("Không thể tải thông tin người dùng!")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()

    if (!userName.trim() || !email.trim()) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!")
      return
    }

    setUpdating(true)
    const accessToken = localStorage.getItem("accessToken")

    try {
      const res = await axios.post(
        `http://localhost:8080/api/user/updateUser/${id}`,
        {
          email: email,
          userName: userName,
          dob: dob,
          password: password,
          gender: gender,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      console.log(res.data)
      alert("Cập nhật thông tin thành công!")

      // Update state with response data
      setEmail(res.data.email || email)
      setUserName(res.data.userName || userName)
      setGender(res.data.gender || gender)

      if (res.data.dob) {
        const date = new Date(res.data.dob)
        const formattedDob = date.toISOString().split("T")[0]
        setDob(formattedDob)
      }
    } catch (error) {
      console.error("Error updating user:", error)
      alert("Cập nhật thất bại! Vui lòng thử lại.")
    } finally {
      setUpdating(false)
    }
  }

  const handleGoBack = () => {
    window.history.back()
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted fs-5">Đang tải thông tin...</p>
        </div>
      </div>
    )
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

        .header-right {
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

        .profile-container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        .profile-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
          pointer-events: none;
        }

        .profile-header {
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
          justify-content: flex-end;
          height: 80px;
          padding: 0 32px;
          position: relative;
        }

        .page-title {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          font-size: 1.8rem;
          font-weight: 700;
          color: #333;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

       

        .content-wrapper {
          padding: 32px;
          position: relative;
          z-index: 1;
        }

        .profile-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
          max-width: 800px;
          margin: 0 auto;
        }

        .profile-card::before {
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
          text-align: center;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        .user-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 3rem;
          font-weight: 700;
          margin: 0 auto 16px auto;
          box-shadow: 0 8px 25px rgba(79, 172, 254, 0.3);
          border: 4px solid white;
        }

        .user-name {
          font-size: 1.8rem;
          font-weight: 700;
          color: #333;
          margin: 0 0 8px 0;
        }

        .user-email {
          color: #666;
          font-size: 1.1rem;
          margin: 0;
        }

        .card-body {
          padding: 40px;
        }

        .form-section {
          margin-bottom: 32px;
        }

        .section-title {
          font-size: 1.3rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 20px;
          padding-bottom: 8px;
          border-bottom: 2px solid #e9ecef;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-label {
          font-weight: 600;
          color: #555;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .form-control {
          border: 2px solid #e9ecef;
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: #f8f9fa;
        }

        .form-control:focus {
          border-color: #4facfe;
          box-shadow: 0 0 0 0.2rem rgba(79, 172, 254, 0.25);
          background: white;
          outline: none;
        }

        .input-group {
          position: relative;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #6c757d;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: color 0.3s ease;
        }

        .password-toggle:hover {
          color: #4facfe;
        }

        .radio-group {
          display: flex;
          gap: 24px;
          margin-top: 8px;
        }

        .radio-option {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          padding: 12px 20px;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          transition: all 0.3s ease;
          background: #f8f9fa;
        }

        .radio-option:hover {
          border-color: #4facfe;
          background: #e3f2fd;
        }

        .radio-option.selected {
          border-color: #4facfe;
          background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
          color: #4facfe;
          font-weight: 600;
        }

        .radio-option input[type="radio"] {
          margin: 0;
          accent-color: #4facfe;
        }

        .update-btn {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          border: none;
          border-radius: 12px;
          padding: 16px 32px;
          color: white;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .update-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
        }

        .update-btn:disabled {
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

          .user-avatar {
            width: 100px;
            height: 100px;
            font-size: 2.5rem;
          }

          .user-name {
            font-size: 1.5rem;
          }

          .radio-group {
            flex-direction: column;
            gap: 12px;
          }

          .page-title {
            font-size: 1.5rem;
          }
        }
      `}</style>

      <div className="profile-container">
        <div className="floating-elements">
          <div className="floating-element"></div>
          <div className="floating-element"></div>
          <div className="floating-element"></div>
        </div>

        {/* Sidebar */}
        <div className={`sidebar ${sidebarCollapsed ? "collapsed" : "expanded"}`}>
          <div className="sidebar-header">
            <div className="logo">
              <span className="logo-icon">User</span>
              {!sidebarCollapsed && <span>User Profile</span>}
            </div>
          </div>
          <ul className="sidebar-menu">
            <li>
              <button
                className={`menu-item ${window.location.pathname === "/user/profile" ? "active" : ""}`}
                onClick={() => (window.location.href = "/user/profile")}
              >
                <i className="bi bi-person-circle menu-icon"></i>
                <span className="menu-text">Thông tin cá nhân</span>
              </button>
            </li>
            <li>
              <button
                className={`menu-item ${window.location.pathname === "/user/orders" ? "active" : ""}`}
                onClick={() => (window.location.href = "/user/orders")}
              >
                <i className="bi bi-bag menu-icon"></i>
                <span className="menu-text">Đơn hàng của tôi</span>
              </button>
            </li>
            <li>
              <button
                className={`menu-item ${window.location.pathname === "/user/pets" ? "active" : ""}`}
                onClick={() => (window.location.href = "/user/pets")}
              >
                <i className="bi bi-heart menu-icon"></i> {/* dùng tạm icon trái tim thay cho pet */}
                <span className="menu-text">Thú cưng của tôi</span>
              </button>
            </li>
            <li>
              <button
                className={`menu-item ${window.location.pathname === "/user/schedule" ? "active" : ""}`}
                onClick={() => (window.location.href = "/user/schedule")}
              >
                <i className="bi bi-calendar-check menu-icon"></i>
                <span className="menu-text">Lịch khám của tôi</span>
              </button>
            </li>
            <li>
              <button
                className={`menu-item ${window.location.pathname === "/user/changePassword" ? "active" : ""}`}
                onClick={() => (window.location.href = "/user/changePassword")}
              >
                <i className="bi bi-key menu-icon"></i> {/* thay icon hợp lệ cho đổi mật khẩu */}
                <span className="menu-text">Đổi mật khẩu</span>
              </button>
            </li>
          </ul>

        </div>

        {/* Header */}
        <div className="profile-header">
          <div className="header-content">
            <h1 className="page-title">
              <i className="bi bi-person-circle"></i>
              Thông tin cá nhân
            </h1>
            <div className="header-right">
              <button className="toggle-btn" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
                <i className={`bi ${sidebarCollapsed ? "bi-list" : "bi-x-lg"}`}></i>
              </button>
              <button className="back-btn btn btn-outline-primary" onClick={() => window.location.href = "/home"}>
                <i className="bi bi-arrow-left"></i>
                Quay lại
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={`content-wrapper ${sidebarCollapsed ? "sidebar-collapsed" : "sidebar-expanded"}`}>
          <div className="profile-card">
            {/* Card Header */}
            <div className="card-header">
              <div className="user-avatar">{userName ? userName.charAt(0).toUpperCase() : "U"}</div>
              <h2 className="user-name">{userName || "Người dùng"}</h2>
              <p className="user-email">{email || "email@example.com"}</p>
            </div>

            {/* Card Body */}
            <div className="card-body">
              <form onSubmit={handleUpdate}>
                {/* Personal Information Section */}
                <div className="form-section">
                  <h3 className="section-title">
                    <i className="bi bi-person"></i>
                    Thông tin cá nhân
                  </h3>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">
                          <i className="bi bi-person-badge"></i>
                          Họ và tên *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          placeholder="Nhập họ và tên"
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">
                          <i className="bi bi-envelope"></i>
                          Email *
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          value={email}
                          readOnly
                          disabled
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Nhập địa chỉ email"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">
                          <i className="bi bi-calendar-date"></i>
                          Ngày sinh
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">
                          <i className="bi bi-gender-ambiguous"></i>
                          Giới tính
                        </label>
                        <div className="radio-group">
                          <label className={`radio-option ${gender === "male" ? "selected" : ""}`}>
                            <input
                              type="radio"
                              name="gender"
                              value="male"
                              checked={gender === "male"}
                              onChange={(e) => setGender(e.target.value)}
                            />
                            <i className="bi bi-person"></i>
                            Nam
                          </label>
                          <label className={`radio-option ${gender === "female" ? "selected" : ""}`}>
                            <input
                              type="radio"
                              name="gender"
                              value="female"
                              checked={gender === "female"}
                              onChange={(e) => setGender(e.target.value)}
                            />
                            <i className="bi bi-person-dress"></i>
                            Nữ
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Section */}
                <div className="form-section">
                  <h3 className="section-title">
                    <i className="bi bi-shield-lock"></i>
                    Bảo mật
                  </h3>

                  <div className="form-group">
                    <label className="form-label">
                      <i className="bi bi-key"></i>
                      Mật khẩu
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        value={password}
                        readOnly
                        disabled
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nhập mật khẩu mới"
                      />
                      <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                        <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Update Button */}
                <button type="submit" className="update-btn" disabled={updating}>
                  {updating ? (
                    <>
                      <span className="loading-spinner"></span>
                      Đang cập nhật...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle"></i>
                      Cập nhật thông tin
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserInformation
