"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"

// Mock data for demonstration
const mockOrders = [
  {
    orderId: "ORD001",
    user: { name: "Nguyễn Văn A", username: "nguyenvana" },
    orderDate: "2024-01-15T10:30:00Z",
    totalPrice: 1250000,
    status: "completed",
    orderItems: [
      { orderItemId: 1, product: { name: "iPhone 15 Pro" }, quantity: 1, price: 1000000 },
      { orderItemId: 2, product: { name: "Ốp lưng iPhone" }, quantity: 1, price: 250000 },
    ],
  },
  {
    orderId: "ORD002",
    user: { name: "Trần Thị B", username: "tranthib" },
    orderDate: "2024-01-14T14:20:00Z",
    totalPrice: 850000,
    status: "pending",
    orderItems: [{ orderItemId: 3, product: { name: "Samsung Galaxy S24" }, quantity: 1, price: 850000 }],
  },
  {
    orderId: "ORD003",
    user: { name: "Lê Văn C", username: "levanc" },
    orderDate: "2024-01-13T09:15:00Z",
    totalPrice: 2100000,
    status: "processing",
    orderItems: [
      { orderItemId: 4, product: { name: "MacBook Air M2" }, quantity: 1, price: 2000000 },
      { orderItemId: 5, product: { name: "Chuột Magic Mouse" }, quantity: 1, price: 100000 },
    ],
  },
]

const OrderManagement = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
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
      window.location.href = "/login"
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message)
    }
  }

  const handleNavigation = (path) => {
    window.location.href = path
  }


  // Fetch orders from API
  const getOrders = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem("accessToken")
      const response = await axios.get("http://localhost:8080/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log(response.data)
      setOrders(response.data)
    } catch (err) {
      setError("Không thể tải danh sách đơn hàng.")
    }
    setLoading(false)
  }

  useEffect(() => {
    getOrders()
  }, [])

  const handleSelectOrder = (order) => {
    setSelectedOrder(order)
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: {
        label: "Hoàn thành",
        className: "badge bg-success",
      },
      pending: {
        label: "Chờ xử lý",
        className: "badge bg-warning text-dark",
      },
      processing: {
        label: "Đang xử lý",
        className: "badge bg-info",
      },
      cancelled: {
        label: "Đã hủy",
        className: "badge bg-danger",
      },
    }
    const config = statusConfig[status] || statusConfig.pending
    return <span className={config.className}>{config.label}</span>
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted fs-5">Đang tải danh sách đơn hàng...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="card border-danger" style={{ maxWidth: "400px" }}>
          <div className="card-body text-center">
            <i className="bi bi-exclamation-triangle text-danger fs-1 mb-3"></i>
            <p className="text-danger fs-5">{error}</p>
            <button className="btn btn-outline-primary" onClick={() => window.location.reload()}>
              Thử lại
            </button>
          </div>
        </div>
      </div>
    )
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

        .orders-content {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          padding: 40px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
        }

        .orders-content::before {
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

        .order-card {
          transition: all 0.3s ease;
          border-left: 4px solid transparent;
          border-radius: 12px;
          margin-bottom: 8px;
        }

        .order-card:hover {
          background-color: #f8f9fa;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          border-left-color: #4facfe;
        }

        .order-card.selected {
          background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
          border-left-color: #2196f3;
          box-shadow: 0 8px 25px rgba(33, 150, 243, 0.2);
        }

        .gradient-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 12px 12px 0 0;
        }

        .gradient-header-green {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
          border-radius: 12px 12px 0 0;
        }

        .price-highlight {
          color: #28a745;
          font-weight: bold;
          font-size: 1.1rem;
        }

        .order-item {
          border: 1px solid #e9ecef;
          border-radius: 12px;
          transition: all 0.2s ease;
          background: #f8f9fa;
        }

        .order-item:hover {
          border-color: #007bff;
          box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
          background: white;
        }

        .scroll-area {
          max-height: 600px;
          overflow-y: auto;
        }

        .empty-state {
          min-height: 400px;
        }

        .cursor-pointer {
          cursor: pointer;
        }

        .scroll-area::-webkit-scrollbar {
          width: 8px;
        }

        .scroll-area::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .scroll-area::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          border-radius: 10px;
        }

        .scroll-area::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .card {
          animation: fadeIn 0.5s ease-out;
          border: none;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border-radius: 16px;
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

          .orders-content {
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
              <span className="logo-icon">🐾</span>
              {!collapsed && <span>Order Management</span>}
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
              <i className="bi bi-box-seam"></i>
              Quản lý đơn hàng
            </h1>
            <p className="page-subtitle">Theo dõi và quản lý tất cả đơn hàng của khách hàng</p>
          </div>

          {/* Content */}
          <div className="content-wrapper">
            <div className="orders-content">
              <div className="row g-4">
                {/* Orders List */}
                <div className="col-lg-6">
                  <div className="card shadow-lg h-100">
                    <div className="card-header gradient-header">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="card-title mb-0 d-flex align-items-center">
                          <i className="bi bi-file-text me-2"></i>
                          Danh sách đơn hàng
                        </h5>
                        <span className="badge bg-light text-dark">{orders.length} đơn hàng</span>
                      </div>
                    </div>
                    <div className="card-body p-0">
                      <div className="scroll-area">
                        {orders.map((order) => (
                          <div
                            key={order.orderId}
                            className={`order-card p-3 cursor-pointer ${selectedOrder?.orderId === order.orderId ? "selected" : ""}`}
                            onClick={() => handleSelectOrder(order)}
                          >
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <div className="d-flex align-items-center">
                                <i className="bi bi-cart3 text-muted me-2"></i>
                                <span className="fw-bold text-dark">#{order.orderId}</span>
                              </div>

                            </div>
                            <div className="row g-2 small">
                              <div className="col-12">
                                <div className="d-flex align-items-center text-muted">
                                  <i className="bi bi-person me-2"></i>
                                  <span>{order.userId || order.userId || "N/A"}</span>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="d-flex align-items-center text-muted">
                                  <i className="bi bi-calendar3 me-2"></i>
                                  <span>
                                    {order.orderDate ? new Date(order.orderDate).toLocaleDateString("vi-VN") : "N/A"}
                                  </span>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div className="d-flex align-items-center">
                                    <i className="bi bi-currency-dollar me-2 text-muted"></i>
                                    <span className="price-highlight">
                                      {order.totalPrice?.toLocaleString("vi-VN")} đ
                                    </span>
                                  </div>
                                  <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleSelectOrder(order)
                                    }}
                                  >
                                    <i className="bi bi-eye me-1"></i>
                                    Xem chi tiết
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="col-lg-6">
                  <div className="card shadow-lg h-100">
                    <div className="card-header gradient-header-green">
                      <h5 className="card-title mb-0 d-flex align-items-center">
                        <i className="bi bi-box me-2"></i>
                        Chi tiết đơn hàng
                      </h5>
                    </div>
                    <div className="card-body">
                      {selectedOrder ? (
                        <div>
                          {/* Order Header */}
                          <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="fw-bold text-dark">Đơn hàng #{selectedOrder.orderId}</h4>

                          </div>
                          <hr />
                          {/* Customer Info */}
                          <div className="mb-4">
                            <h6 className="fw-semibold text-dark d-flex align-items-center mb-3">
                              <i className="bi bi-person me-2"></i>
                              Thông tin khách hàng
                            </h6>
                            <div className="bg-light p-3 rounded">
                              <p className="mb-2">
                                <strong>Tên:</strong>{" "}
                                {selectedOrder.user?.name || selectedOrder.user?.username || "N/A"}
                              </p>
                              <p className="mb-0">
                                <strong>Ngày đặt:</strong>{" "}
                                {selectedOrder.orderDate
                                  ? new Date(selectedOrder.orderDate).toLocaleString("vi-VN")
                                  : "N/A"}
                              </p>
                            </div>
                          </div>
                          {/* Order Items */}
                          <div className="mb-4">
                            <h6 className="fw-semibold text-dark d-flex align-items-center mb-3">
                              <i className="bi bi-cart3 me-2"></i>
                              Sản phẩm đã đặt
                            </h6>
                            <div className="d-flex flex-column gap-3">
                              {selectedOrder.orderItems?.map((item) => (
                                <div key={item.orderItemId} className="order-item p-3">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                      <p className="fw-medium text-dark mb-1">{item.product?.name}</p>
                                      <small className="text-muted">Số lượng: {item.quantity}</small>
                                    </div>
                                    <div className="text-end">
                                      <p className="price-highlight mb-0">{item.price?.toLocaleString("vi-VN")} đ</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <hr />
                          {/* Total */}
                          <div className="bg-success bg-opacity-10 p-4 rounded">
                            <div className="d-flex justify-content-between align-items-center">
                              <span className="fs-5 fw-semibold text-dark">Tổng cộng:</span>
                              <span className="fs-4 fw-bold text-success">
                                {selectedOrder.totalPrice?.toLocaleString("vi-VN")} đ
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="d-flex flex-column justify-content-center align-items-center empty-state text-muted">
                          <i className="bi bi-box display-1 mb-4 text-black-50"></i>
                          <h5 className="fw-medium">Chọn đơn hàng để xem chi tiết</h5>
                          <p className="text-center">Nhấp vào một đơn hàng bên trái để xem thông tin chi tiết</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Overlay */}
        <div className={`overlay ${!collapsed ? "show" : ""} d-md-none`} onClick={() => setCollapsed(true)}></div>
      </div>
    </>
  )
}

export default OrderManagement
