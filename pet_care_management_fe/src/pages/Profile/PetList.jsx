"use client"

import { useEffect, useState } from "react"
import { Edit, Trash2 } from "lucide-react"
import axios from "axios"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import VetPagination from "../../components/VetPagination"

const PetList = () => {
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [petsPerPage] = useState(6)

  useEffect(() => {
    const userId = localStorage.getItem("userId")
    const accessToken = localStorage.getItem("accessToken")

    if (!accessToken || !userId) {
      window.location.href = "/login"
      return
    }

    fetchPets(accessToken, userId)
  }, [])

  const fetchPets = async (accessToken, userId) => {
    setLoading(true)
    try {
      const res = await axios.get(`http://localhost:8080/api/pet/getPetsByUser/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      console.log(res.data)
      setPets(res.data || [])
    } catch (error) {
      console.error("Error fetching pets:", error)
      alert("Không thể tải danh sách thú cưng!")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa thú cưng này?")) {
      return
    }

    setDeleting(id)
    const accessToken = localStorage.getItem("accessToken")

    try {
      await axios.post(
        `http://localhost:8080/api/pet/delete/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      )

      setPets(pets.filter((pet) => pet.id !== id))
      alert("Xóa thú cưng thành công!")
    } catch (error) {
      console.error("Error deleting pet:", error)
      alert("Có lỗi xảy ra khi xóa thú cưng!")
    } finally {
      setDeleting(null)
    }
  }

  const handleEdit = (petId) => {
    window.location.href = `/pet/edit/${petId}`
  }

  const handleAddPet = () => {
    window.location.href = "/pet/add"
  }

  const handleViewHealth = (petId) => {
    window.location.href = `/pet/health/${petId}`
  }

  const handleGoBack = () => {
    window.history.back()
  }

  const getHealthStatus = (pet) => {
    // Giả lập logic đánh giá sức khỏe dựa trên dữ liệu
    if (!pet.lastCheckup) return { status: 'warning', label: 'Chưa khám', color: '#ffc107' }

    const lastCheckupDate = new Date(pet.lastCheckup)
    const daysSinceCheckup = Math.floor((new Date() - lastCheckupDate) / (1000 * 60 * 60 * 24))

    if (daysSinceCheckup > 365) return { status: 'danger', label: 'Cần khám', color: '#dc3545' }
    if (daysSinceCheckup > 180) return { status: 'warning', label: 'Nên khám', color: '#ffc107' }
    return { status: 'success', label: 'Tốt', color: '#28a745' }
  }

  // Pagination logic
  const indexOfLastPet = currentPage * petsPerPage
  const indexOfFirstPet = indexOfLastPet - petsPerPage
  const currentPets = pets.slice(indexOfFirstPet, indexOfLastPet)
  const totalPages = Math.ceil(pets.length / petsPerPage)

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
          <p className="text-muted fs-5">Đang tải danh sách thú cưng...</p>
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

        .pets-container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        .pets-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
          pointer-events: none;
        }

        .pets-header {
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

        .pets-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
        }

        .pets-card::before {
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

        .pets-title {
          font-size: 2rem;
          font-weight: 700;
          color: #333;
          margin: 0 0 8px 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .pets-subtitle {
          color: #666;
          font-size: 1.1rem;
          margin: 0 0 24px 0;
        }

        .add-pet-btn {
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

        .add-pet-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
          color: white;
          text-decoration: none;
        }

        .card-body {
          padding: 40px;
        }

        .pets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .pet-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: all 0.3s ease;
          border: 1px solid #f1f3f4;
        }

        .pet-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
        }

        .pet-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-bottom: 1px solid #f1f3f4;
        }

        .pet-info {
          padding: 20px;
        }

        .pet-name {
          font-size: 1.3rem;
          font-weight: 700;
          color: #333;
          margin: 0 0 8px 0;
        }

        .pet-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 16px;
        }

        .pet-detail {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #666;
          font-size: 0.9rem;
        }

        .health-status {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .health-actions {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }

        .health-btn {
          border: none;
          border-radius: 8px;
          padding: 6px 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.8rem;
          flex: 1;
          justify-content: center;
        }

        .btn-health-view {
          background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(23, 162, 184, 0.3);
        }

        .btn-health-view:hover {
          transform: translateY(-1px);
          box-shadow: 0 3px 10px rgba(23, 162, 184, 0.4);
          color: white;
        }

        .btn-health-add {
          background: linear-gradient(135deg, #6f42c1 0%, #5a2d91 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(111, 66, 193, 0.3);
        }

        .btn-health-add:hover {
          transform: translateY(-1px);
          box-shadow: 0 3px 10px rgba(111, 66, 193, 0.4);
          color: white;
        }

        .pet-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .action-btn {
          border: none;
          border-radius: 8px;
          padding: 8px 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.9rem;
        }

        .btn-edit {
          background: linear-gradient(135deg, #ffc107 0%, #ff8c00 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(255, 193, 7, 0.3);
        }

        .btn-edit:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 193, 7, 0.4);
          color: white;
        }

        .btn-delete {
          background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
        }

        .btn-delete:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
          color: white;
        }

        .btn-delete:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
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

          .pets-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .pets-title {
            font-size: 1.5rem;
          }

          .page-title {
            font-size: 1.5rem;
          }

          .pet-details {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="pets-container">
        <div className="floating-elements">
          <div className="floating-element"></div>
          <div className="floating-element"></div>
          <div className="floating-element"></div>
        </div>

        {/* Sidebar */}
        <div className={`sidebar ${sidebarCollapsed ? "collapsed" : "expanded"}`}>
          <div className="sidebar-header">
            <div className="logo">
              <span className="logo-icon">🐾</span>
              {!sidebarCollapsed && <span>Pet Manager</span>}
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
        <div className="pets-header position-relative py-2 border-bottom">
          <div className="header-content d-flex align-items-center position-relative px-3">

            {/* Tiêu đề căn giữa tuyệt đối */}
            <h1 className="page-title position-absolute top-50 start-50 translate-middle m-0">
              <i className="bi bi-heart-fill me-2"></i>
              Thú cưng của tôi
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
          <div className="pets-card">
            {/* Card Header */}
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                  <button className="add-pet-btn" onClick={handleAddPet}>
                    <i className="bi bi-plus-circle"></i>
                    Thêm thú cưng
                  </button>
                  <div>
                    <h2 className="pets-title">🐾 Danh sách thú cưng</h2>
                    <p className="pets-subtitle">Quản lý và theo dõi sức khỏe những người bạn nhỏ của bạn</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="card-body">
              {currentPets && currentPets.length > 0 ? (
                <>
                  <div className="pets-grid">
                    {currentPets.map((pet) => {
                      const healthStatus = getHealthStatus(pet)
                      return (
                        <div key={pet.id} className="pet-card">
                          <img
                            src={pet.image || "/placeholder.svg?height=200&width=350"}
                            alt={pet.name}
                            className="pet-image"
                          />
                          <div className="pet-info">
                            <h3 className="pet-name">{pet.name}</h3>

                            {/* Health Status */}
                            <div
                              className="health-status"
                              style={{
                                backgroundColor: `${healthStatus.color}20`,
                                color: healthStatus.color,
                                border: `1px solid ${healthStatus.color}30`
                              }}
                            >
                              <i className="bi bi-heart-pulse"></i>
                              <span>Sức khỏe: {healthStatus.label}</span>
                            </div>

                            {/* Health Actions */}
                            <div className="health-actions">
                              <button
                                className="health-btn btn-health-view"
                                onClick={() => handleViewHealth(pet.id)}
                                title="Xem hồ sơ sức khỏe"
                                style={{ width: '100%' }}
                              >
                                <i className="bi bi-clipboard-data"></i>
                                Xem Hồ Sơ Sức Khỏe
                              </button>
                            </div>

                            <div className="pet-details">
                              <div className="pet-detail">
                                <i className="bi bi-tag"></i>
                                <span>
                                  {pet.species === "Dog" ? "🐕 Chó" : pet.species === "Cat" ? "🐱 Mèo" : pet.species}
                                </span>
                              </div>
                              <div className="pet-detail">
                                <i className="bi bi-award"></i>
                                <span>{pet.breed}</span>
                              </div>
                              <div className="pet-detail">
                                <i className="bi bi-calendar"></i>
                                <span>{pet.age} tuổi</span>
                              </div>
                              <div className="pet-detail">
                                <i className="bi bi-heart-pulse"></i>
                                <span>
                                  {pet.lastCheckup
                                    ? `Khám: ${new Date(pet.lastCheckup).toLocaleDateString('vi-VN')}`
                                    : 'Chưa khám'
                                  }
                                </span>
                              </div>
                            </div>
                            <div className="pet-actions">
                              <button
                                className="action-btn btn-edit"
                                onClick={() => handleEdit(pet.id)}
                                title="Chỉnh sửa"
                              >
                                <Edit size={16} />
                                Sửa
                              </button>
                              <button
                                className="action-btn btn-delete"
                                onClick={() => handleDelete(pet.id)}
                                disabled={deleting === pet.id}
                                title="Xóa"
                              >
                                {deleting === pet.id ? <span className="loading-spinner"></span> : <Trash2 size={16} />}
                                Xóa
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Pagination */}
                  <VetPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={pets.length}
                    itemsPerPage={petsPerPage}
                    onPageChange={handlePageChange}
                    itemName="thú cưng"
                  />
                </>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">🐾</div>
                  <h5>Chưa có thú cưng nào</h5>
                  <p>Hãy thêm thú cưng đầu tiên của bạn để bắt đầu quản lý!</p>
                  <button className="add-pet-btn mt-3" onClick={handleAddPet}>
                    <i className="bi bi-plus-circle"></i>
                    Thêm thú cưng đầu tiên
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PetList
