"use client"

import { useEffect, useState } from "react"
import axios from "../../services/customizeAxios"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"

const UserOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [ordersPerPage] = useState(6)
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    const userId = localStorage.getItem("userId")
    const accessToken = localStorage.getItem("accessToken")

    if (!accessToken || !userId) {
      window.location.href = "/login"
      return
    }

    fetchOrders(accessToken, userId)
  }, [])

  const fetchOrders = async (accessToken, userId) => {
    setLoading(true)
    try {
      const res = await axios.get(`/api/orders/user/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      console.log(res.data)
      setOrders(res.data)
    } catch (error) {
      console.error("Error fetching orders:", error)
      setError("Không thể tải danh sách đơn hàng!")
    } finally {
      setLoading(false)
    }
  }

  const handleGoBack = () => {
    window.history.back()
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
      shipped: {
        label: "Đang giao",
        className: "badge bg-primary",
      },
    }
    const config = statusConfig[status] || statusConfig.pending
    return <span className={config.className}>{config.label}</span>
  }

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder)
  const totalPages = Math.ceil(orders.length / ordersPerPage)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null

    const pages = []
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`btn me-1 ${i === currentPage ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>,
      )
    }

    return (
      <div className="d-flex justify-content-center align-items-center mt-4">
        <button
          className="btn btn-outline-primary me-1"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <i className="bi bi-chevron-left"></i>
        </button>
        {pages}
        <button
          className="btn btn-outline-primary"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>
    )
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
        .orders-container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        .orders-container::before {
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

        .content-wrapper.sidebar-collapsed {
          margin-left: 80px;
        }

        .content-wrapper.sidebar-expanded {
          margin-left: 280px;
        }

        .orders-header {
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

        .orders-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
        }

        .orders-card::before {
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

        .orders-title {
          font-size: 2rem;
          font-weight: 700;
          color: #333;
          margin: 0 0 8px 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .orders-subtitle {
          color: #666;
          font-size: 1.1rem;
          margin: 0;
        }

        .card-body {
          padding: 40px;
        }

        .orders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .order-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: all 0.3s ease;
          border: 1px solid #f1f3f4;
          cursor: pointer;
        }

        .order-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
        }

        .order-card.selected {
          border-color: #4facfe;
          box-shadow: 0 12px 35px rgba(79, 172, 254, 0.2);
        }

        .order-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 16px 20px;
          display: flex;
          justify-content: between;
          align-items: center;
        }

        .order-id {
          font-weight: 700;
          font-size: 1.1rem;
        }

        .order-info {
          padding: 20px;
        }

        .order-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 16px;
        }

        .order-detail {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #666;
          font-size: 0.9rem;
        }

        .order-total {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 16px;
          border-radius: 12px;
          text-align: center;
          margin-top: 16px;
        }

        .total-amount {
          font-size: 1.3rem;
          font-weight: 700;
          color: #28a745;
          margin: 0;
        }

        .order-items {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #f1f3f4;
        }

        .order-item {
          display: flex;
          justify-content: between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #f8f9fa;
        }

        .order-item:last-child {
          border-bottom: none;
        }

        .item-name {
          font-weight: 600;
          color: #333;
        }

        .item-details {
          font-size: 0.9rem;
          color: #666;
        }

        .item-price {
          font-weight: 600;
          color: #28a745;
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
          .sidebar {
            transform: translateX(-100%);
          }

          .sidebar.mobile-open {
            transform: translateX(0);
          }

          .content-wrapper {
            margin-left: 0 !important;
            padding: 16px;
          }

          .header-content {
            padding: 0 16px;
          }

          .card-body {
            padding: 24px;
          }

          .card-header {
            padding: 24px;
          }

          .orders-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .orders-title {
            font-size: 1.5rem;
          }

          .page-title {
            font-size: 1.5rem;
          }

          .order-details {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="orders-container">
        <div className="floating-elements">
          <div className="floating-element"></div>
          <div className="floating-element"></div>
          <div className="floating-element"></div>
        </div>

        {/* Sidebar */}
        <div className={`sidebar ${sidebarCollapsed ? "collapsed" : "expanded"}`}>
          <div className="sidebar-header">
            <div className="logo">
              <span className="logo-icon">🛒</span>
              {!sidebarCollapsed && <span>Order Manager</span>}
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
              <button className="menu-item active" onClick={() => (window.location.href = "/user/orders")}>
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
                <i className="bi bi-calendar menu-icon"></i>
                <span className="menu-text">Lịch khám của tôi</span>
              </button>
            </li>
            <li>
              <button className="menu-item" onClick={() => (window.location.href = "/user/changePassword")}>
                <i className="bi bi-gear menu-icon"></i>
                <span className="menu-text">Đổi mật khẩu</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Header */}
        <div className="orders-header position-relative">
          <div className="header-content d-flex align-items-center position-relative py-2">
            <h1 className="page-title m-0 position-absolute top-50 start-50 translate-middle">
              <i className="bi bi-bag-fill me-2"></i>
              Đơn hàng của tôi
            </h1>
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
          <div className="orders-card">
            {/* Card Header */}
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="orders-title">🛍️ Lịch sử đơn hàng</h2>
                  <p className="orders-subtitle">Theo dõi và quản lý các đơn hàng của bạn</p>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span className="badge bg-primary fs-6">{orders.length} đơn hàng</span>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="card-body">
              {currentOrders && currentOrders.length > 0 ? (
                <>
                  <div className="orders-grid">
                    {currentOrders.map((order) => (
                      <div
                        key={order.orderId}
                        className={`order-card ${selectedOrder?.orderId === order.orderId ? "selected" : ""}`}
                        onClick={() => setSelectedOrder(order)}
                      >
                        <div className="order-header">
                          <div className="d-flex justify-content-between align-items-center w-100">
                            <div className="order-id">#{order.orderId}</div>
                            {getStatusBadge(order.status)}
                          </div>
                        </div>

                        <div className="order-info">
                          <div className="order-details">
                            <div className="order-detail">
                              <i className="bi bi-calendar3"></i>
                              <span>
                                {order.orderDate ? new Date(order.orderDate).toLocaleDateString("vi-VN") : "N/A"}
                              </span>
                            </div>
                            <div className="order-detail">
                              <i className="bi bi-clock"></i>
                              <span>
                                {order.orderDate ? new Date(order.orderDate).toLocaleTimeString("vi-VN") : "N/A"}
                              </span>
                            </div>
                            <div className="order-detail">
                              <i className="bi bi-box"></i>
                              <span>{order.orderItems?.length || 0} sản phẩm</span>
                            </div>
                            <div className="order-detail">
                              <i className="bi bi-truck"></i>
                              <span>Giao hàng tiêu chuẩn</span>
                            </div>
                          </div>

                          {/* Order Items */}
                          {order.orderItems && order.orderItems.length > 0 && (
                            <div className="order-items">
                              <h6 className="fw-semibold mb-2">
                                <i className="bi bi-list-ul me-2"></i>
                                Sản phẩm đã đặt:
                              </h6>
                              {order.orderItems.slice(0, 2).map((item) => (
                                <div key={item.orderItemId} className="order-item">
                                  <div>
                                    <div className="item-name">{item.product?.name || "Sản phẩm"}</div>
                                    <div className="item-details">Số lượng: {item.quantity}</div>
                                  </div>
                                  <div className="item-price">{item.price?.toLocaleString("vi-VN")} đ</div>
                                </div>
                              ))}
                              {order.orderItems.length > 2 && (
                                <div className="text-muted small">+{order.orderItems.length - 2} sản phẩm khác...</div>
                              )}
                            </div>
                          )}

                          <div className="order-total">
                            <p className="total-amount">Tổng cộng: {order.totalPrice?.toLocaleString("vi-VN")} đ</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {renderPagination()}
                </>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">🛒</div>
                  <h5>Chưa có đơn hàng nào</h5>
                  <p>Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!</p>
                  <button className="btn btn-primary mt-3" onClick={() => (window.location.href = "/products")}>
                    <i className="bi bi-shop me-2"></i>
                    Bắt đầu mua sắm
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

export default UserOrders
