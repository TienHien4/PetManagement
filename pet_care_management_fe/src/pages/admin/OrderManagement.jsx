"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Edit, Trash2, Eye, X } from "lucide-react"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"

const OrderManagement = () => {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [collapsed, setCollapsed] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [pageSize] = useState(10)

  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [editStatus, setEditStatus] = useState("")

  const handleNavigation = (path) => {
    window.location.href = path
  }

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        console.error("Error: accessToken is null or undefined before logout.")
        return
      }

      await axios.post(
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

  // Fetch orders from API
  const getOrders = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        window.location.href = "/login"
        return
      }
      const response = await axios.get("http://localhost:8080/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setOrders(response.data)
      setFilteredOrders(response.data)
    } catch (err) {
      console.error("Error fetching orders:", err)
      alert("Không thể tải danh sách đơn hàng!")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getOrders()
  }, [])

  // Filter orders based on search
  useEffect(() => {
    let result = orders

    // Filter by search
    if (search) {
      result = result.filter(order =>
        order.orderId?.toLowerCase().includes(search.toLowerCase()) ||
        order.userId?.toString().includes(search)
      )
    }

    setFilteredOrders(result)
    // Calculate total pages based on filtered results
    setTotalPages(Math.ceil(result.length / pageSize))
  }, [search, orders, pageSize])

  const handleSearch = () => {
    // Trigger search filter
    const filtered = orders.filter(order =>
      order.orderId?.toLowerCase().includes(search.toLowerCase()) ||
      order.userId?.toString().includes(search)
    )
    setFilteredOrders(filtered)
    setTotalPages(Math.ceil(filtered.length / pageSize))
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // Get paginated orders for current page
  const getPaginatedOrders = () => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return filteredOrders.slice(startIndex, endIndex)
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null

    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        className="btn btn-outline-primary me-1"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <i className="bi bi-chevron-left"></i>
      </button>,
    )

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
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

    // Next button
    pages.push(
      <button
        key="next"
        className="btn btn-outline-primary"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <i className="bi bi-chevron-right"></i>
      </button>,
    )

    return <div className="d-flex justify-content-center align-items-center">{pages}</div>
  }

  const openDetailModal = (order) => {
    setSelectedOrder(order)
    setShowDetailModal(true)
    document.body.style.overflow = 'hidden'
  }

  const closeDetailModal = () => {
    setShowDetailModal(false)
    setSelectedOrder(null)
    document.body.style.overflow = 'auto'
  }

  const openEditModal = (order) => {
    setSelectedOrder(order)
    setEditStatus(order.status || "PENDING")
    setShowEditModal(true)
    document.body.style.overflow = 'hidden'
  }

  const closeEditModal = () => {
    setShowEditModal(false)
    setSelectedOrder(null)
    document.body.style.overflow = 'auto'
  }

  const handleUpdateStatus = async (e) => {
    e.preventDefault()
    if (!selectedOrder) return

    try {
      const token = localStorage.getItem("accessToken")
      await axios.put(
        `http://localhost:8080/api/orders/${selectedOrder.orderId}/status`,
        { status: editStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )

      alert("Cập nhật trạng thái đơn hàng thành công!")
      closeEditModal()
      getOrders()
    } catch (error) {
      console.error("Error updating order:", error)
      alert("Không thể cập nhật đơn hàng. Vui lòng thử lại!")
    }
  }

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) {
      return
    }

    try {
      const token = localStorage.getItem("accessToken")
      await axios.delete(`http://localhost:8080/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      alert("Xóa đơn hàng thành công!")
      getOrders()
    } catch (error) {
      console.error("Error deleting order:", error)
      alert("Không thể xóa đơn hàng. Vui lòng thử lại!")
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      COMPLETED: { label: "Hoàn thành", className: "bg-success" },
      PENDING: { label: "Chờ xử lý", className: "bg-warning text-dark" },
      PROCESSING: { label: "Đang xử lý", className: "bg-info" },
      PAID: { label: "Đã thanh toán", className: "bg-primary" },
      CANCELLED: { label: "Đã hủy", className: "bg-danger" },
    }
    const config = statusConfig[status] || statusConfig.PENDING
    return <span className={`badge ${config.className}`}>{config.label}</span>
  }

  return (
    <>
      <style jsx>{`
        .dashboard-container {
          min-height: 100vh;
          background: #f5f7fa;
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
        }

        .main-layout.sidebar-collapsed {
          margin-left: 80px;
        }

        .main-layout.sidebar-expanded {
          margin-left: 280px;
        }

        .header {
          background: white;
          border-bottom: 1px solid #e9ecef;
          position: sticky;
          top: 0;
          z-index: 999;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 70px;
          padding: 0 32px;
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

        .user-info {
          display: flex;
          align-items: center;
          cursor: pointer;
          padding: 8px 16px;
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
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-right: 10px;
          font-size: 16px;
        }

        .user-name {
          font-weight: 600;
          color: white;
          margin: 0;
          font-size: 14px;
        }

        .content-wrapper {
          padding: 32px;
        }

        .orders-management {
          padding: 0;
        }

        .page-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          padding: 32px;
          margin-bottom: 24px;
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        .page-title {
          font-size: 2rem;
          font-weight: 700;
          color: white;
          margin: 0 0 8px 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .page-subtitle {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.9);
          margin: 0;
        }

        .header-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .btn-add {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          border: none;
          border-radius: 12px;
          padding: 12px 24px;
          color: white;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-add:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
          color: white;
        }

        .search-section {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }

        .search-input {
          border: 2px solid #e9ecef;
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
        }

        .search-input:focus {
          border-color: #4facfe;
          box-shadow: 0 0 0 0.2rem rgba(79, 172, 254, 0.25);
          outline: none;
        }

        .btn-search {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          border: none;
          border-radius: 12px;
          padding: 12px 24px;
          color: white;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3);
        }

        .btn-search:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(79, 172, 254, 0.4);
          color: white;
        }

        .orders-table-container {
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          margin-bottom: 24px;
        }

        .orders-table {
          margin: 0;
          font-size: 0.95rem;
        }

        .orders-table thead th {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-weight: 600;
          padding: 16px 12px;
          border: none;
          text-align: center;
          vertical-align: middle;
        }

        .orders-table tbody td {
          padding: 16px 12px;
          vertical-align: middle;
          text-align: center;
          border-bottom: 1px solid #f1f3f4;
        }

        .orders-table tbody tr:hover {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .action-btn {
          border: none;
          border-radius: 8px;
          padding: 8px 12px;
          margin: 0 4px;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }

        .btn-view {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(79, 172, 254, 0.3);
        }

        .btn-view:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(79, 172, 254, 0.4);
          color: white;
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

        .loading-spinner {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #4facfe;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
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

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1055;
          overflow-y: scroll;
          overflow-x: hidden;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content-custom {
          background: white;
          border-radius: 16px;
          padding: 32px;
          max-width: 700px;
          width: 90%;
          margin: 60px auto 60px auto;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          animation: slideUp 0.3s ease;
          position: relative;
        }

        @keyframes slideUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .modal-header-custom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid #e9ecef;
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #333;
          margin: 0;
        }

        .btn-close-custom {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #6c757d;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .btn-close-custom:hover {
          background: #f1f3f4;
          color: #dc3545;
        }

        .order-detail-section {
          margin-bottom: 24px;
        }

        .section-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #495057;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .detail-card {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 16px;
        }

        .order-item-card {
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 12px;
          background: white;
          transition: all 0.2s ease;
        }

        .order-item-card:hover {
          border-color: #4facfe;
          box-shadow: 0 2px 8px rgba(79, 172, 254, 0.15);
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          font-weight: 600;
          color: #495057;
          margin-bottom: 8px;
          display: block;
        }

        .form-control-custom {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .form-control-custom:focus {
          border-color: #4facfe;
          outline: none;
          box-shadow: 0 0 0 0.2rem rgba(79, 172, 254, 0.25);
        }

        .modal-footer-custom {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
          padding-top: 16px;
          border-top: 2px solid #e9ecef;
        }

        .btn-cancel {
          background: #6c757d;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 12px 24px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-cancel:hover {
          background: #5a6268;
          transform: translateY(-2px);
        }

        .btn-submit {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 12px 24px;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
        }

        .btn-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(40, 167, 69, 0.4);
        }

        .pagination-container {
          display: flex;
          justify-content: center;
          margin-top: 24px;
        }

        @media (max-width: 768px) {
          .orders-table-container {
            overflow-x: auto;
          }

          .orders-table {
            min-width: 900px;
          }

          .search-controls {
            flex-direction: column;
            gap: 12px;
          }

          .search-controls > * {
            width: 100% !important;
          }

          .modal-content-custom {
            padding: 20px;
            width: 95%;
          }
        }
      `}</style>

      <div className="dashboard-container">
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
                className={`menu-item ${window.location.pathname === "/admin/productmanagement" ? "active" : ""}`}
                onClick={() => handleNavigation("/admin/productmanagement")}
              >
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
              <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
                <i className={`bi ${collapsed ? "bi-list" : "bi-x-lg"}`}></i>
              </button>
              <button className="user-info" onClick={handleLogout}>
                <div className="user-avatar">
                  <i className="bi bi-person"></i>
                </div>
                <div>
                  <h6 className="user-name">
                    {localStorage.getItem("UserName") ? localStorage.getItem("UserName").toUpperCase() : "ADMIN"}
                  </h6>
                </div>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="content-wrapper">
            <div className="orders-management">
              {/* Page Header */}
              <div className="page-header">
                <h1 className="page-title">
                  <i className="bi bi-box-seam"></i>
                  Quản lý đơn hàng
                </h1>
                <p className="page-subtitle">Quản lý thông tin và kho sản phẩm trong hệ thống</p>
              </div>



              {/* Search Section */}
              <div className="search-section">
                <div className="d-flex search-controls" style={{ gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo mã đơn hàng hoặc ID khách hàng..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                    style={{ flex: 1, minWidth: "250px" }}
                  />
                  <button className="btn-search" onClick={handleSearch} disabled={loading}>
                    <i className="bi bi-search me-2"></i>
                    Tìm kiếm
                  </button>
                </div>
              </div>

              {/* Table Section */}
              <div className="orders-table-container">
                {loading ? (
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                  </div>
                ) : filteredOrders.length > 0 ? (
                  <table className="table orders-table">
                    <thead>
                      <tr>
                        <th style={{ width: "15%" }}>Mã đơn hàng</th>
                        <th style={{ width: "15%" }}>Khách hàng</th>
                        <th style={{ width: "15%" }}>Ngày đặt</th>
                        <th style={{ width: "20%" }}>Tổng tiền</th>
                        <th style={{ width: "15%" }}>Trạng thái</th>
                        <th style={{ width: "20%" }}>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getPaginatedOrders().map((order) => (
                        <tr key={order.orderId}>
                          <td>
                            <strong>#{order.orderId}</strong>
                          </td>
                          <td>{order.userId || "N/A"}</td>
                          <td>
                            {order.orderDate
                              ? new Date(order.orderDate).toLocaleDateString("vi-VN")
                              : "N/A"}
                          </td>
                          <td>
                            <strong className="text-success">
                              {order.totalPrice?.toLocaleString("vi-VN")} ₫
                            </strong>
                          </td>
                          <td>{getStatusBadge(order.status)}</td>
                          <td>
                            <button
                              className="action-btn btn-view"
                              onClick={() => openDetailModal(order)}
                              title="Xem chi tiết"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              className="action-btn btn-edit"
                              onClick={() => openEditModal(order)}
                              title="Chỉnh sửa"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              className="action-btn btn-delete"
                              onClick={() => handleDeleteOrder(order.orderId)}
                              title="Xóa"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">📦</div>
                    <h5>Không tìm thấy đơn hàng nào</h5>
                    <p>Hãy thử tìm kiếm với từ khóa khác hoặc thay đổi bộ lọc</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {filteredOrders.length > 0 && (
                <div className="pagination-container">{renderPagination()}</div>
              )}

              {/* Detail Modal */}
              {showDetailModal && selectedOrder && (
                <div className="modal-overlay" onClick={(e) => {
                  if (e.target === e.currentTarget) closeDetailModal()
                }}>
                  <div className="modal-content-custom">
                    <div className="modal-header-custom">
                      <h3 className="modal-title">Chi tiết đơn hàng #{selectedOrder.orderId}</h3>
                      <button className="btn-close-custom" onClick={closeDetailModal}>
                        <X size={24} />
                      </button>
                    </div>

                    {/* Customer Info */}
                    <div className="order-detail-section">
                      <div className="section-title">
                        <i className="bi bi-person-circle"></i>
                        Thông tin khách hàng
                      </div>
                      <div className="detail-card">
                        <p className="mb-2">
                          <strong>ID khách hàng:</strong> {selectedOrder.userId || "N/A"}
                        </p>
                        <p className="mb-2">
                          <strong>Ngày đặt:</strong>{" "}
                          {selectedOrder.orderDate
                            ? new Date(selectedOrder.orderDate).toLocaleString("vi-VN")
                            : "N/A"}
                        </p>
                        <p className="mb-0">
                          <strong>Trạng thái:</strong> {getStatusBadge(selectedOrder.status)}
                        </p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="order-detail-section">
                      <div className="section-title">
                        <i className="bi bi-cart3"></i>
                        Sản phẩm đã đặt
                      </div>
                      {selectedOrder.orderItems && selectedOrder.orderItems.length > 0 ? (
                        selectedOrder.orderItems.map((item) => (
                          <div key={item.orderItemId} className="order-item-card">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <p className="fw-medium text-dark mb-1">
                                  {item.product?.name || "N/A"}
                                </p>
                                <small className="text-muted">Số lượng: {item.quantity}</small>
                              </div>
                              <div className="text-end">
                                <p className="text-success fw-bold mb-0">
                                  {item.price?.toLocaleString("vi-VN")} ₫
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted">Không có sản phẩm</p>
                      )}
                    </div>

                    {/* Total */}
                    <div className="detail-card">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fs-5 fw-semibold">Tổng cộng:</span>
                        <span className="fs-4 fw-bold text-success">
                          {selectedOrder.totalPrice?.toLocaleString("vi-VN")} ₫
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Edit Modal */}
              {showEditModal && selectedOrder && (
                <div className="modal-overlay" onClick={(e) => {
                  if (e.target === e.currentTarget) closeEditModal()
                }}>
                  <div className="modal-content-custom">
                    <div className="modal-header-custom">
                      <h3 className="modal-title">Chỉnh sửa đơn hàng #{selectedOrder.orderId}</h3>
                      <button className="btn-close-custom" onClick={closeEditModal}>
                        <X size={24} />
                      </button>
                    </div>

                    <form onSubmit={handleUpdateStatus}>
                      <div className="form-group">
                        <label className="form-label">Trạng thái đơn hàng</label>
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                          className="form-control-custom"
                          required
                        >
                          <option value="PENDING">Chờ xử lý</option>
                          <option value="PAID">Đã thanh toán</option>
                          <option value="PROCESSING">Đang xử lý</option>
                          <option value="COMPLETED">Hoàn thành</option>
                          <option value="CANCELLED">Đã hủy</option>
                        </select>
                      </div>

                      <div className="modal-footer-custom">
                        <button type="button" className="btn-cancel" onClick={closeEditModal}>
                          Hủy
                        </button>
                        <button type="submit" className="btn-submit">
                          Cập nhật
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default OrderManagement
