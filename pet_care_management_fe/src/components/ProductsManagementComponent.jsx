"use client"

import { useState, useEffect } from "react"
import { Edit, Trash2, Plus, X } from "lucide-react"
import {
    getAllProducts,
    getProductPagination,
    getProductByKeyword,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../services/productService"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"

const ProductsManagement = () => {
    const [products, setProducts] = useState([])
    const [productSearch, setProductSearch] = useState([])
    const [search, setSearch] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [pageSize] = useState(5)
    const [loading, setLoading] = useState(false)

    // Modal states
    const [showModal, setShowModal] = useState(false)
    const [modalMode, setModalMode] = useState("create") // 'create' or 'edit'
    const [selectedProduct, setSelectedProduct] = useState(null)

    // Form states
    const [formData, setFormData] = useState({
        name: "",
        type: "",
        price: "",
        quantity: "",
        description: "",
    })
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [formErrors, setFormErrors] = useState({})

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken")
        if (!accessToken) {
            window.location.href = "/login"
        } else {
            getProducts(currentPage, pageSize)
        }
    }, [currentPage, pageSize])

    const getProducts = async (pageNo, pageSize) => {
        setLoading(true)
        try {
            // Spring Data JPA uses zero-based page index, so we subtract 1
            const res = await getProductPagination(pageNo - 1, pageSize)
            if (res && res.data) {
                setProductSearch([])
                setProducts(res.data.content)
                setTotalPages(res.data.totalPages)
            }
        } catch (error) {
            console.error("Error fetching product data:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
            return
        }

        try {
            await deleteProduct(id)
            setProducts(products.filter((product) => product.id !== id))
            setProductSearch(productSearch.filter((product) => product.id !== id))
            alert("Xóa sản phẩm thành công!")
        } catch (error) {
            console.error("Error deleting product:", error)
            alert("Có lỗi xảy ra khi xóa sản phẩm!")
        }
    }

    const handleFindProductByKeyword = async (searchTerm) => {
        setLoading(true)

        if (!searchTerm) {
            try {
                const res = await getAllProducts()
                setProductSearch(res.data)
                setProducts([])
            } catch (error) {
                console.error("Error fetching all products:", error)
            }
        } else {
            try {
                const res = await getProductByKeyword(searchTerm)
                setProducts([])
                setProductSearch(res.data)
            } catch (error) {
                console.error("Product not found!", error)
                setProductSearch([])
            }
        }
        setLoading(false)
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const openCreateModal = () => {
        setModalMode("create")
        setSelectedProduct(null)
        setFormData({
            name: "",
            type: "",
            price: "",
            quantity: "",
            description: "",
        })
        setImageFile(null)
        setImagePreview(null)
        setFormErrors({})
        setShowModal(true)
        document.body.style.overflow = 'hidden'
    }

    const openEditModal = async (product) => {
        setModalMode("edit")
        setSelectedProduct(product)
        setFormData({
            name: product.name,
            type: product.type,
            price: product.price,
            quantity: product.quantity,
            description: product.description || "",
        })

        // Convert existing image URL to File object
        if (product.image) {
            try {
                const response = await fetch(product.image)
                const blob = await response.blob()
                const file = new File([blob], "product-image.jpg", { type: blob.type })
                setImageFile(file)
                setImagePreview(product.image)
            } catch (error) {
                console.error("Error loading image:", error)
                setImageFile(null)
                setImagePreview(product.image)
            }
        } else {
            setImageFile(null)
            setImagePreview(null)
        }

        setFormErrors({})
        setShowModal(true)
        document.body.style.overflow = 'hidden'
    }

    const closeModal = () => {
        setShowModal(false)
        setSelectedProduct(null)
        setFormData({
            name: "",
            type: "",
            price: "",
            quantity: "",
            description: "",
        })
        setImageFile(null)
        setImagePreview(null)
        setFormErrors({})
        document.body.style.overflow = 'auto'
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
        // Clear error for this field
        if (formErrors[name]) {
            setFormErrors((prev) => ({
                ...prev,
                [name]: "",
            }))
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            // Validate file type
            if (!file.type.startsWith("image/")) {
                setFormErrors((prev) => ({
                    ...prev,
                    image: "Vui lòng chọn file ảnh hợp lệ",
                }))
                return
            }

            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                setFormErrors((prev) => ({
                    ...prev,
                    image: "Kích thước ảnh không được vượt quá 5MB",
                }))
                return
            }

            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
            setFormErrors((prev) => ({
                ...prev,
                image: "",
            }))
        }
    }

    const validateForm = () => {
        const errors = {}

        if (!formData.name.trim()) {
            errors.name = "Tên sản phẩm không được để trống"
        }

        if (!formData.type.trim()) {
            errors.type = "Danh mục không được để trống"
        }

        if (!formData.price || formData.price <= 0) {
            errors.price = "Giá phải lớn hơn 0"
        }

        if (!formData.quantity || formData.quantity < 0) {
            errors.quantity = "Số lượng không được âm"
        }

        if (!imageFile) {
            errors.image = "Vui lòng chọn ảnh sản phẩm"
        }

        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setLoading(true)

        try {
            const productRequest = {
                name: formData.name,
                type: formData.type,
                price: parseFloat(formData.price),
                quantity: parseInt(formData.quantity),
                description: formData.description,
            }

            console.log('Product Request:', productRequest)
            console.log('Has Image File:', !!imageFile)
            console.log('Modal Mode:', modalMode)

            const formDataToSend = new FormData()
            formDataToSend.append("productRequest", JSON.stringify(productRequest))
            formDataToSend.append("imageFile", imageFile)

            console.log('Image file:', imageFile.name, imageFile.type)

            if (modalMode === "create") {
                await createProduct(formDataToSend)
                alert("Tạo sản phẩm thành công!")
            } else {
                await updateProduct(selectedProduct.id, formDataToSend)
                alert("Cập nhật sản phẩm thành công!")
            }

            closeModal()
            // Refresh the list
            if (productSearch.length > 0) {
                handleFindProductByKeyword(search)
            } else {
                getProducts(currentPage, pageSize)
            }
        } catch (error) {
            console.error("Error saving product:", error)
            console.error("Error response:", error.response?.data)
            alert(`Có lỗi xảy ra khi ${modalMode === "create" ? "tạo" : "cập nhật"} sản phẩm: ${error.response?.data?.message || error.message}`)
        } finally {
            setLoading(false)
        }
    }

    const renderPagination = () => {
        if (totalPages <= 1) return null

        const pages = []
        const maxVisiblePages = 5
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
        const endPage = Math.min(totalPages, startPage + maxVisiblePages + 1)

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

    const displayData = Array.isArray(productSearch) && productSearch.length > 0 ? productSearch : products

    return (
        <>
            <style jsx>{`
        .products-management {
          padding: 0;
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

        .products-table-container {
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          margin-bottom: 24px;
        }

        .products-table {
          margin: 0;
          font-size: 0.95rem;
        }

        .products-table thead th {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-weight: 600;
          padding: 16px 12px;
          border: none;
          text-align: center;
          vertical-align: middle;
        }

        .products-table tbody td {
          padding: 16px 12px;
          vertical-align: middle;
          text-align: center;
          border-bottom: 1px solid #f1f3f4;
        }

        .products-table tbody tr:hover {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .product-image {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 12px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .product-image:hover {
          transform: scale(1.1);
        }

        .action-btn {
          border: none;
          border-radius: 8px;
          padding: 8px 12px;
          margin: 0 4px;
          transition: all 0.3s ease;
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
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
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

        .pagination-container {
          display: flex;
          justify-content: center;
          margin-top: 24px;
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
          -webkit-overflow-scrolling: touch;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .modal-content-custom {
          background: white;
          border-radius: 16px;
          padding: 32px;
          max-width: 600px;
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

        .form-control-custom.is-invalid {
          border-color: #dc3545;
        }

        .invalid-feedback {
          color: #dc3545;
          font-size: 0.875rem;
          margin-top: 4px;
          display: block;
        }

        .image-upload-container {
          border: 2px dashed #e9ecef;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .image-upload-container:hover {
          border-color: #4facfe;
          background: #f8f9fa;
        }

        .image-preview {
          max-width: 100%;
          max-height: 300px;
          border-radius: 8px;
          margin-top: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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

        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .search-section {
            padding: 16px;
          }

          .products-table-container {
            overflow-x: auto;
          }

          .products-table {
            min-width: 900px;
          }

          .search-controls {
            flex-direction: column;
            gap: 12px;
          }

          .search-controls > * {
            width: 100% !important;
            margin: 0 !important;
          }

          .modal-content-custom {
            padding: 20px;
            width: 95%;
          }
        }
      `}</style>

            <div className="products-management">
                {/* Header with Add Button */}
                <div className="header-section">
                    <div></div>
                    <button className="btn-add" onClick={openCreateModal}>
                        <Plus size={18} />
                        Thêm Sản Phẩm
                    </button>
                </div>

                {/* Search Section */}
                <div className="search-section">
                    <div className="d-flex search-controls" style={{ gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm theo tên..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="search-input"
                            style={{ flex: 1, minWidth: "250px" }}
                        />
                        <button className="btn-search" onClick={() => handleFindProductByKeyword(search)} disabled={loading}>
                            <i className="bi bi-search me-2"></i>
                            Tìm kiếm
                        </button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="products-table-container">
                    {loading ? (
                        <div className="loading-spinner">
                            <div className="spinner"></div>
                        </div>
                    ) : displayData && displayData.length > 0 ? (
                        <table className="table products-table">
                            <thead>
                                <tr>
                                    <th style={{ width: "12%" }}>Ảnh</th>
                                    <th style={{ width: "25%" }}>Tên Sản Phẩm</th>
                                    <th style={{ width: "15%" }}>Danh Mục</th>
                                    <th style={{ width: "12%" }}>Giá</th>
                                    <th style={{ width: "10%" }}>Tồn Kho</th>
                                    <th style={{ width: "16%" }}>Mô Tả</th>
                                    <th style={{ width: "10%" }}>Hành Động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayData.map((product) => (
                                    <tr key={product.id}>
                                        <td>
                                            <img
                                                src={product.image || "/placeholder.svg?height=80&width=80"}
                                                alt={product.name}
                                                className="product-image"
                                            />
                                        </td>
                                        <td>
                                            <strong>{product.name}</strong>
                                        </td>
                                        <td>
                                            <span className="badge bg-info">{product.type}</span>
                                        </td>
                                        <td>
                                            <strong>{product.price?.toLocaleString("vi-VN")} ₫</strong>
                                        </td>
                                        <td>
                                            <span className={`badge ${product.quantity > 0 ? "bg-success" : "bg-danger"}`}>
                                                {product.quantity}
                                            </span>
                                        </td>
                                        <td>
                                            <small>{product.description ? product.description.substring(0, 50) + "..." : "N/A"}</small>
                                        </td>
                                        <td>
                                            <button
                                                className="action-btn btn-edit"
                                                onClick={() => openEditModal(product)}
                                                title="Chỉnh sửa"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                className="action-btn btn-delete"
                                                onClick={() => handleDelete(product.id)}
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
                            <h5>Không tìm thấy sản phẩm nào</h5>
                            <p>Hãy thử tìm kiếm với từ khóa khác hoặc thêm sản phẩm mới</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {Array.isArray(products) &&
                    products.length > 0 &&
                    (!Array.isArray(productSearch) || productSearch.length === 0) && (
                        <div className="pagination-container">{renderPagination()}</div>
                    )}

                {/* Modal for Create/Edit */}
                {showModal && (
                    <div className="modal-overlay" style={{ height: 600 }} onClick={(e) => {
                        if (e.target === e.currentTarget) closeModal()
                    }}>
                        <div className="modal-content-custom">
                            <div className="modal-header-custom">
                                <h3 className="modal-title">{modalMode === "create" ? "Thêm Sản Phẩm Mới" : "Chỉnh Sửa Sản Phẩm"}</h3>
                                <button className="btn-close-custom" onClick={closeModal}>
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                {/* Product Name */}
                                <div className="form-group">
                                    <label className="form-label">Tên Sản Phẩm *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={`form-control-custom ${formErrors.name ? "is-invalid" : ""}`}
                                        placeholder="Nhập tên sản phẩm"
                                    />
                                    {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
                                </div>

                                {/* Category */}
                                <div className="form-group">
                                    <label className="form-label">Danh Mục *</label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className={`form-control-custom ${formErrors.type ? "is-invalid" : ""}`}
                                    >
                                        <option value="">Chọn danh mục</option>
                                        <option value="Thức Ăn">Thức Ăn</option>
                                        <option value="Đồ Chơi">Đồ Chơi</option>
                                        <option value="Phụ Kiện">Phụ Kiện</option>
                                        <option value="Thuốc & Vitamin">Thuốc & Vitamin</option>
                                        <option value="Vệ Sinh">Vệ Sinh</option>
                                        <option value="Khác">Khác</option>
                                    </select>
                                    {formErrors.type && <div className="invalid-feedback">{formErrors.type}</div>}
                                </div>

                                {/* Price and Stock Row */}
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Giá (₫) *</label>
                                            <input
                                                type="number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleInputChange}
                                                className={`form-control-custom ${formErrors.price ? "is-invalid" : ""}`}
                                                placeholder="0"
                                                min="0"
                                                step="1000"
                                            />
                                            {formErrors.price && <div className="invalid-feedback">{formErrors.price}</div>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Tồn Kho *</label>
                                            <input
                                                type="number"
                                                name="quantity"
                                                value={formData.quantity}
                                                onChange={handleInputChange}
                                                className={`form-control-custom ${formErrors.quantity ? "is-invalid" : ""}`}
                                                placeholder="0"
                                                min="0"
                                            />
                                            {formErrors.quantity && <div className="invalid-feedback">{formErrors.quantity}</div>}
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="form-group">
                                    <label className="form-label">Mô Tả</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="form-control-custom"
                                        placeholder="Nhập mô tả sản phẩm"
                                        rows="3"
                                    />
                                </div>

                                {/* Image Upload */}
                                <div className="form-group">
                                    <label className="form-label">
                                        Ảnh Sản Phẩm {modalMode === "create" ? "*" : "(Tùy chọn)"}
                                    </label>
                                    <div className="image-upload-container" onClick={() => document.getElementById("imageInput").click()}>
                                        <input
                                            id="imageInput"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            style={{ display: "none" }}
                                        />
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="image-preview" />
                                        ) : (
                                            <div>
                                                <i className="bi bi-cloud-upload" style={{ fontSize: "3rem", color: "#6c757d" }}></i>
                                                <p className="mt-2">Click để chọn ảnh</p>
                                                <small className="text-muted">Kích thước tối đa: 5MB</small>
                                            </div>
                                        )}
                                    </div>
                                    {formErrors.image && <div className="invalid-feedback">{formErrors.image}</div>}
                                </div>

                                {/* Footer Buttons */}
                                <div className="modal-footer-custom">
                                    <button type="button" className="btn-cancel" onClick={closeModal}>
                                        Hủy
                                    </button>
                                    <button type="submit" className="btn-submit" disabled={loading}>
                                        {loading ? "Đang xử lý..." : modalMode === "create" ? "Tạo Sản Phẩm" : "Cập Nhật"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default ProductsManagement
