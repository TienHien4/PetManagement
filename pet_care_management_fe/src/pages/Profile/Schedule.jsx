"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import Header from "../../components/home/Header"
import VetPagination from "../../components/VetPagination"

const Schedule = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [appointmentsPerPage] = useState(6)
  const [vetNames, setVetNames] = useState({})
  const [statusConfig, setStatusConfig] = useState({})

  useEffect(() => {
    const userId = localStorage.getItem("userId")
    const accessToken = localStorage.getItem("accessToken")

    if (!accessToken || !userId) {
      window.location.href = "/login"
      return
    }

    fetchAppointments(accessToken, userId)
  }, [])

  const fetchAppointments = async (accessToken, userId) => {
    setLoading(true)
    try {
      const res = await axios.get(`http://localhost:8080/api/appointment/getAppointmentsByUser/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      console.log(res.data)

      // Tính toán tổng tiền cố định cho mỗi appointment
      const appointmentsWithTotal = res.data.map(appointment => ({
        ...appointment,
        totalPrice: appointment.services && appointment.services.length > 0
          ? appointment.services.reduce((total, service) => total + service.price, 0)
          : 0
      }))

      setAppointments(appointmentsWithTotal || [])

      // Extract và set status configuration từ appointment data
      extractStatusConfig(appointmentsWithTotal || [])

      // Fetch thông tin bác sĩ cho tất cả appointments
      await fetchVetNames(accessToken, appointmentsWithTotal || [])
    } catch (error) {
      console.error("Error fetching appointments:", error)
      alert("Không thể tải danh sách lịch khám!")
    } finally {
      setLoading(false)
    }
  }

  const extractStatusConfig = (appointments) => {
    // Lấy tất cả unique status từ appointments
    const uniqueStatuses = [...new Set(appointments.map(app => app.status))]

    // Tạo status config động dựa trên status có sẵn
    const dynamicStatusConfig = {}

    uniqueStatuses.forEach(status => {
      const statusLower = status?.toLowerCase()
      switch (statusLower) {
        case 'pending':
          dynamicStatusConfig[status] = {
            label: "Chờ xác nhận",
            className: "badge bg-warning text-dark"
          }
          break
        case 'confirmed':
          dynamicStatusConfig[status] = {
            label: "Đã xác nhận",
            className: "badge bg-success"
          }
          break
        case 'completed':
          dynamicStatusConfig[status] = {
            label: "Hoàn thành",
            className: "badge bg-primary"
          }
          break
        case 'cancelled':
          dynamicStatusConfig[status] = {
            label: "Đã hủy",
            className: "badge bg-danger"
          }
          break
        default:
          // Fallback cho status không xác định - vẫn dịch sang tiếng Việt
          const vietnameseStatus = getVietnameseStatus(status)
          dynamicStatusConfig[status] = {
            label: vietnameseStatus,
            className: "badge bg-secondary"
          }
      }
    })

    setStatusConfig(dynamicStatusConfig)
  }

  // Hàm helper để dịch status sang tiếng Việt
  const getVietnameseStatus = (status) => {
    if (!status) return "Không xác định"

    const statusTranslations = {
      'PENDING': 'Chờ xác nhận',
      'CONFIRMED': 'Đã xác nhận',
      'COMPLETED': 'Hoàn thành',
      'CANCELLED': 'Đã hủy',
      'APPROVED': 'Đã duyệt',
      'REJECTED': 'Đã từ chối',
      'IN_PROGRESS': 'Đang tiến hành',
      'SCHEDULED': 'Đã lên lịch'
    }

    const upperStatus = status.toUpperCase()
    return statusTranslations[upperStatus] || status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
  }

  const fetchVetNames = async (accessToken, appointments) => {
    try {
      const vetIds = [...new Set(appointments.map(app => app.vetId))]
      const vetNamesMap = {}

      // Fetch tất cả bác sĩ một lần
      const vetRes = await axios.get("http://localhost:8080/api/vet/getAllVet", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      // Map thông tin bác sĩ theo ID
      const allVets = vetRes.data || []
      vetIds.forEach(vetId => {
        const vet = allVets.find(v => v.id === vetId)
        vetNamesMap[vetId] = vet ? vet.name : `Bác sĩ ${vetId}`
      })

      setVetNames(vetNamesMap)
    } catch (error) {
      console.error("Error fetching vet names:", error)
      // Fallback với tên mặc định
      const vetIds = [...new Set(appointments.map(app => app.vetId))]
      const fallbackVetNames = {}
      vetIds.forEach(vetId => {
        fallbackVetNames[vetId] = `Bác sĩ ${vetId}`
      })
      setVetNames(fallbackVetNames)
    }
  }

  const handleGoBack = () => {
    window.history.back()
  }

  const getStatusBadge = (status) => {
    // Sử dụng statusConfig động từ state
    const config = statusConfig[status] || {
      label: getVietnameseStatus(status),
      className: "badge bg-secondary"
    }
    return <span className={config.className}>{config.label}</span>
  }

  // Pagination logic
  const indexOfLastAppointment = currentPage * appointmentsPerPage
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage
  const currentAppointments = appointments.slice(indexOfFirstAppointment, indexOfLastAppointment)
  const totalPages = Math.ceil(appointments.length / appointmentsPerPage)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted fs-5">Đang tải lịch khám...</p>
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

        .header-ri {
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

        .schedule-container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        .schedule-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
          pointer-events: none;
        }

        .schedule-header {
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

        .content-wrapper {
          padding: 32px;
          position: relative;
          z-index: 1;
        }

        .schedule-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
        }

        .schedule-card::before {
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
        }

        .schedule-title {
          font-size: 2rem;
          font-weight: 700;
          color: #333;
          margin: 0 0 8px 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .schedule-subtitle {
          color: #666;
          font-size: 1.1rem;
          margin: 0;
        }

        .card-body {
          padding: 40px;
          display: flex;
          flex-direction: column;
          min-height: 400px; /* Chiều cao tối thiểu để total-price có chỗ rơi xuống */
        }

        .appointments-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          grid-auto-rows: 1fr; /* Tất cả rows có chiều cao bằng nhau */
          gap: 24px;
          margin-bottom: 32px;
        }

        .appointment-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: all 0.3s ease;
          border: 1px solid #f1f3f4;
          display: flex;
          flex-direction: column;
          height: 100%; /* Chiếm hết chiều cao của grid cell */
        }

        .appointment-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
        }

        .appointment-header {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .appointment-date {
          font-size: 1.2rem;
          font-weight: 700;
          margin: 0;
        }

        .appointment-info {
          padding: 24px;
          display: flex;
          flex-direction: column;
          flex: 1; /* Chiếm hết không gian còn lại */
        }

        .info-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .info-icon {
          color: #4facfe;
          font-size: 1.1rem;
          min-width: 20px;
        }

        .info-label {
          font-weight: 600;
          color: #333;
          min-width: 80px;
        }

        .info-value {
          color: #666;
          flex: 1;
        }

        .services-list {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 16px;
          margin-top: 16px;
          flex-shrink: 0; /* Không co lại */
        }

        .services-title {
          font-weight: 600;
          color: #333;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .service-item {
          display: flex;
          justify-content: between;
          align-items: center;
          padding: 8px 12px;
          background: white;
          border-radius: 8px;
          margin-bottom: 8px;
          border: 1px solid #e9ecef;
        }

        .service-name {
          flex: 1;
          font-weight: 500;
          color: #333;
        }

        .service-price {
          color: #28a745;
          font-weight: 600;
        }

        .total-price {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          color: white;
          padding: 16px;
          border-radius: 12px;
          text-align: center;
          margin-top: auto; /* Tự động đẩy xuống cuối */
          margin-bottom: 0;
          order: 999; /* Đảm bảo luôn ở cuối */
          flex-shrink: 0; /* Không co lại */
        }

        .total-label {
          font-size: 0.9rem;
          opacity: 0.9;
          margin: 0;
        }

        .total-amount {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 4px 0 0 0;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #6c757d;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 16px;
          opacity: 0.5;
        }
        .add-schedule-btn {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          border: none;
          border-radius: 12px;
          padding: 12px 24px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .add-schedule-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
          color: white;
          text-decoration: none;
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

          .appointments-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .schedule-title {
            font-size: 1.5rem;
          }

          .page-title {
            font-size: 1.5rem;
          }

          .appointment-header {
            flex-direction: column;
            gap: 8px;
            text-align: center;
          }
        }
      `}</style>
      <div className="schedule-container">

        <div className="floating-elements">
          <div className="floating-element"></div>
          <div className="floating-element"></div>
          <div className="floating-element"></div>
        </div>

        {/* Sidebar */}
        <div className={`sidebar ${sidebarCollapsed ? "collapsed" : "expanded"}`}>
          <div className="sidebar-header">
            <div className="logo">
              <span className="logo-icon">📅</span>
              {!sidebarCollapsed && <span>Schedule Manager</span>}
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
        <div className="schedule-header">
          <div className="header-content">
            <div className="header-right">
              <button className="toggle-btn" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
                <i className={`bi ${sidebarCollapsed ? "bi-list" : "bi-x-lg"}`}></i>
              </button>
              <button className="back-btn btn btn-outline-primary" onClick={() => window.location.href = "/home"}>
                <i className="bi bi-arrow-left"></i>
                Quay lại
              </button>
            </div>
            <h1 className="page-title">
              <i className="bi bi-calendar-check-fill"></i>
              Lịch khám của tôi
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className={`content-wrapper ${sidebarCollapsed ? "sidebar-collapsed" : "sidebar-expanded"}`}>
          <div className="schedule-card">
            {/* Card Header */}

            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <div className="card-header">
                  <h2 className="schedule-title">📅 Lịch khám thú cưng</h2>
                  <p className="schedule-subtitle">Quản lý và theo dõi lịch khám cho các thú cưng của bạn</p>
                </div>
                <button className="add-schedule-btn" onClick={() => (window.location.href = "/services")}>
                  <i className="bi bi-plus-circle"></i>
                  Đặt lịch
                </button>
              </div>
            </div>





            {/* Card Body */}
            <div className="card-body">
              {currentAppointments && currentAppointments.length > 0 ? (
                <>
                  <div className="appointments-grid">
                    {currentAppointments.map((appointment) => (
                      <div key={appointment.id} className="appointment-card">
                        <div className="appointment-header">
                          <h3 className="appointment-date">
                            📅 {new Date(appointment.date).toLocaleDateString("vi-VN")}
                          </h3>
                          {getStatusBadge(appointment.status)}
                        </div>
                        <div className="appointment-info">
                          <div className="info-row">
                            <i className="bi bi-person-badge info-icon"></i>
                            <span className="info-label">Bác sĩ:</span>
                            <span className="info-value">{vetNames[appointment.vetId] || `Bác sĩ ${appointment.vetId}`}</span>
                          </div>

                          <div className="info-row">
                            <i className="bi bi-clock info-icon"></i>
                            <span className="info-label">Thời gian:</span>
                            <span className="info-value">
                              {new Date(appointment.date).toLocaleTimeString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>

                          {appointment.services && appointment.services.length > 0 && (
                            <div className="services-list">
                              <h4 className="services-title">
                                <i className="bi bi-list-check"></i>
                                Dịch vụ khám
                              </h4>
                              {appointment.services.map((service, index) => (
                                <div key={index} className="service-item">
                                  <span className="service-name">{service.name}</span>
                                  <span className="service-price">{service.price.toLocaleString()} VND</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Chỉ hiển thị số tiền */}
                          <div className="total-price">
                            <h4 className="total-amount">
                              {appointment.totalPrice.toLocaleString()} VND
                            </h4>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  <VetPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={appointments.length}
                    itemsPerPage={appointmentsPerPage}
                    onPageChange={handlePageChange}
                    itemName="lịch khám"
                  />
                </>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📅</div>
                  <h5>Chưa có lịch khám nào</h5>
                  <p>Bạn chưa có lịch khám nào được đặt. Hãy đặt lịch khám cho thú cưng của bạn!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Schedule
