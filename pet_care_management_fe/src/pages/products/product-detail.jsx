"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "../../services/customizeAxios"
import Header from "../../components/home/Header"
import Footer from "../../components/home/Footer"
import "bootstrap/dist/css/bootstrap.min.css"
import "./ProductDetail.css"

const ProductDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [activeTab, setActiveTab] = useState("description")
    const [imageError, setImageError] = useState(false)

    useEffect(() => {
        let isMounted = true;
        setLoading(false); // Always render layout immediately
        const fetchProduct = async () => {
            try {
                const accessToken = localStorage.getItem("accessToken");
                const res = await axios.get(`/api/product/getProductById/${id}`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                if (isMounted) {
                    setProduct(res.data);
                }
            } catch (err) {
                if (isMounted) setError("Không tìm thấy sản phẩm.");
            }
        };
        fetchProduct();
        return () => {
            isMounted = false;
        };
    }, [id]);

    const handleQuantityChange = (change) => {
        setQuantity((prev) => Math.max(1, prev + change))
    }

    const handleAddToCart = () => {
        // Logic thêm vào giỏ hàng
        console.log(`Thêm ${quantity} sản phẩm ${product.name} vào giỏ hàng`)
    }

    // Prevent image error infinite loop
    const handleImageError = useCallback((e) => {
        if (!imageError) {
            setImageError(true)
            e.target.src = "/placeholder.svg?height=500&width=500"
        }
    }, [imageError])

    // Do not return early on error; always render the layout

    // Nếu chưa có product, chỉ render layout với placeholder, không nháy
    const displayProduct = product || {
        image: "/placeholder.svg?height=500&width=500",
        name: error ? "Không tìm thấy sản phẩm" : "Đang tải...",
        price: 0,
        salePercent: 0,
        type: "",
        quantity: 0,
        description: error ? "Sản phẩm không tồn tại hoặc đã bị xóa." : "",
        rating: 0,
        reviews: 0,
        features: [],
    };
    let mainImage = displayProduct.image;
    if (product && product.images && Array.isArray(product.images) && product.images.length > 0) {
        mainImage = product.images[0] || "/placeholder.svg?height=500&width=500";
    }

    // Reset image error when product changes
    useEffect(() => {
        setImageError(false)
    }, [product])

    // Nếu lỗi, vẫn render layout nhưng hiển thị thông báo lỗi trong phần info

    const originalPrice =
        displayProduct.salePercent > 0
            ? Math.round(displayProduct.price / (1 - displayProduct.salePercent / 100))
            : displayProduct.price;
    const savings = originalPrice - displayProduct.price;

    return (
        <>
            <Header />

            {/* Breadcrumb */}
            <div className="bg-light py-3">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item">
                                <a href="/" className="text-decoration-none">
                                    <i className="fas fa-home me-1"></i>Trang chủ
                                </a>
                            </li>
                            <li className="breadcrumb-item">
                                <a href="/products" className="text-decoration-none">
                                    Sản phẩm
                                </a>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                {displayProduct.name || "Chi tiết sản phẩm"}
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container-fluid py-5 bg-gradient-light">
                <div className="container">
                    <div className="row justify-content-center" style={{ width: 1500, margin: '0 auto' }}>
                        <div className="col-12">
                            <div className="product-detail-card w-100" >
                                <div className="row g-0 align-items-stretch" style={{ minHeight: '600px', width: '1500px' }}>
                                    {/* Product Images */}
                                    <div className="col-lg-6 d-flex align-items-center justify-content-center" style={{ padding: '2rem' }}>
                                        <div className="product-images-section w-100" style={{ maxWidth: '500px' }}>
                                            {/* Main Image */}
                                            <div className="main-image-container" style={{ width: '100%', aspectRatio: '1/1', background: '#f8f9fa', borderRadius: '1.5rem', boxShadow: '0 2px 16px #0001', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                                <div className="image-badges">
                                                    {displayProduct.salePercent > 0 && (
                                                        <span className="badge-sale">
                                                            <i className="fas fa-fire me-1"></i>-{displayProduct.salePercent}%
                                                        </span>
                                                    )}
                                                    <span className="badge-new">
                                                        <i className="fas fa-star me-1"></i>
                                                        Mới
                                                    </span>
                                                </div>
                                                <img
                                                    src={imageError ? "/placeholder.svg?height=500&width=500" : mainImage}
                                                    alt={displayProduct.name}
                                                    className="main-product-image"
                                                    onError={handleImageError}
                                                />
                                                <div className="image-zoom-hint">
                                                    <i className="fas fa-search-plus"></i>
                                                    Hover để phóng to
                                                </div>
                                            </div>

                                            {/* Thumbnail Images */}
                                            {/* Không render thumbnail, chỉ hiển thị ảnh chính */}
                                        </div>
                                    </div>

                                    {/* Product Info */}
                                    <div className="col-lg-6 d-flex align-items-center" style={{ padding: '2rem' }}>
                                        <div className="product-info-section w-100" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.25rem' }}>
                                            {/* Show error message in info section if error exists */}
                                            {error ? (
                                                <div className="alert alert-danger text-center shadow-sm mb-4">
                                                    <i className="fas fa-exclamation-triangle fa-2x mb-3"></i>
                                                    <h4>Oops! Có lỗi xảy ra</h4>
                                                    <p>{error}</p>
                                                    <button className="btn btn-primary" onClick={() => navigate(-1)}>
                                                        <i className="fas fa-arrow-left me-2"></i>Quay lại
                                                    </button>
                                                </div>
                                            ) : null}
                                            {/* Product Category */}
                                            <div className="product-category">
                                                <span className="category-badge">
                                                    <i className="fas fa-tag me-1"></i>
                                                    {displayProduct.type}
                                                </span>
                                            </div>

                                            {/* Product Title */}
                                            <h1 className="product-title">{displayProduct.name}</h1>

                                            {/* Rating */}
                                            <div className="product-rating">
                                                <div className="stars">
                                                    {[...Array(5)].map((_, i) => (
                                                        <i
                                                            key={i}
                                                            className={`fas fa-star ${i < Math.floor(displayProduct.rating || 0) ? "text-warning" : "text-muted"}`}
                                                        ></i>
                                                    ))}
                                                </div>
                                                <span className="rating-text">
                                                    {displayProduct.rating} ({displayProduct.reviews} đánh giá)
                                                </span>
                                            </div>

                                            {/* Price */}
                                            <div className="product-price">
                                                <div className="price-main">
                                                    <span className="current-price">
                                                        {displayProduct.price.toLocaleString("vi-VN", {
                                                            style: "currency",
                                                            currency: "VND",
                                                        })}
                                                    </span>
                                                    {displayProduct.salePercent > 0 && (
                                                        <span className="original-price">
                                                            {originalPrice.toLocaleString("vi-VN", {
                                                                style: "currency",
                                                                currency: "VND",
                                                            })}
                                                        </span>
                                                    )}
                                                </div>
                                                {displayProduct.salePercent > 0 && (
                                                    <div className="savings-info">
                                                        <i className="fas fa-piggy-bank me-1"></i>
                                                        Tiết kiệm{" "}
                                                        {savings.toLocaleString("vi-VN", {
                                                            style: "currency",
                                                            currency: "VND",
                                                        })}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Stock Status */}
                                            <div className="stock-status">
                                                <div className="stock-info">
                                                    <i className="fas fa-box me-2"></i>
                                                    <span className="stock-text">
                                                        Còn lại: <strong>{displayProduct.quantity}</strong> sản phẩm
                                                    </span>
                                                </div>
                                                <div className="stock-bar">
                                                    <div className="stock-progress" style={{ width: "70%" }}></div>
                                                </div>
                                            </div>

                                            {/* Quantity Selector */}
                                            <div className="quantity-section">
                                                <label className="quantity-label">Số lượng:</label>
                                                <div className="quantity-controls">
                                                    <button
                                                        className="quantity-btn"
                                                        onClick={() => handleQuantityChange(-1)}
                                                        disabled={quantity <= 1}
                                                    >
                                                        <i className="fas fa-minus"></i>
                                                    </button>
                                                    <input
                                                        type="number"
                                                        className="quantity-input"
                                                        value={quantity}
                                                        onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                                                        min="1"
                                                        max={displayProduct.quantity}
                                                    />
                                                    <button
                                                        className="quantity-btn"
                                                        onClick={() => handleQuantityChange(1)}
                                                        disabled={quantity >= displayProduct.quantity}
                                                    >
                                                        <i className="fas fa-plus"></i>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Total Price */}
                                            <div className="total-price">
                                                <span className="total-label">Tổng cộng:</span>
                                                <span className="total-amount">
                                                    {(displayProduct.price * quantity).toLocaleString("vi-VN", {
                                                        style: "currency",
                                                        currency: "VND",
                                                    })}
                                                </span>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="action-buttons">
                                                <button className="btn btn-add-cart" onClick={handleAddToCart}>
                                                    <i className="fas fa-shopping-cart me-2"></i>
                                                    Thêm vào giỏ hàng
                                                </button>
                                                <button className="btn btn-buy-now">
                                                    <i className="fas fa-bolt me-2"></i>
                                                    Mua ngay
                                                </button>
                                                <button className="btn btn-wishlist">
                                                    <i className="far fa-heart"></i>
                                                </button>
                                            </div>

                                            {/* Trust Badges */}
                                            <div className="trust-badges">
                                                <div className="trust-item">
                                                    <i className="fas fa-shipping-fast"></i>
                                                    <span>Miễn phí vận chuyển</span>
                                                </div>
                                                <div className="trust-item">
                                                    <i className="fas fa-shield-alt"></i>
                                                    <span>Bảo hành 12 tháng</span>
                                                </div>
                                                <div className="trust-item">
                                                    <i className="fas fa-undo"></i>
                                                    <span>Đổi trả 7 ngày</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Product Details Tabs */}
                            <div className="product-tabs-section mt-5">
                                <div className="custom-tabs">
                                    <ul className="nav nav-tabs" role="tablist">
                                        <li className="nav-item">
                                            <button
                                                className={`nav-link ${activeTab === "description" ? "active" : ""}`}
                                                onClick={() => setActiveTab("description")}
                                            >
                                                <i className="fas fa-info-circle me-2"></i>
                                                Mô tả chi tiết
                                            </button>
                                        </li>
                                        <li className="nav-item">
                                            <button
                                                className={`nav-link ${activeTab === "specifications" ? "active" : ""}`}
                                                onClick={() => setActiveTab("specifications")}
                                            >
                                                <i className="fas fa-list-ul me-2"></i>
                                                Thông số kỹ thuật
                                            </button>
                                        </li>
                                        <li className="nav-item">
                                            <button
                                                className={`nav-link ${activeTab === "reviews" ? "active" : ""}`}
                                                onClick={() => setActiveTab("reviews")}
                                            >
                                                <i className="fas fa-star me-2"></i>
                                                Đánh giá ({displayProduct.reviews})
                                            </button>
                                        </li>
                                    </ul>

                                    <div className="tab-content">
                                        {activeTab === "description" && (
                                            <div className="tab-pane active">
                                                <div className="description-content">
                                                    <h4>Mô tả sản phẩm</h4>
                                                    <p>{displayProduct.description}</p>

                                                    <h5>Đặc điểm nổi bật:</h5>
                                                    <ul className="feature-list">
                                                        {displayProduct.features?.map((feature, index) => (
                                                            <li key={index}>
                                                                <i className="fas fa-check-circle text-success me-2"></i>
                                                                {feature}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === "specifications" && (
                                            <div className="tab-pane active">
                                                <div className="specifications-content">
                                                    <h4>Thông số kỹ thuật</h4>
                                                    <div className="spec-table">
                                                        <div className="spec-row">
                                                            <span className="spec-label">Loại sản phẩm:</span>
                                                            <span className="spec-value">{displayProduct.type}</span>
                                                        </div>
                                                        <div className="spec-row">
                                                            <span className="spec-label">Trọng lượng:</span>
                                                            <span className="spec-value">2.5kg</span>
                                                        </div>
                                                        <div className="spec-row">
                                                            <span className="spec-label">Xuất xứ:</span>
                                                            <span className="spec-value">Pháp</span>
                                                        </div>
                                                        <div className="spec-row">
                                                            <span className="spec-label">Hạn sử dụng:</span>
                                                            <span className="spec-value">24 tháng</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === "reviews" && (
                                            <div className="tab-pane active">
                                                <div className="reviews-content">
                                                    <div className="reviews-summary">
                                                        <div className="rating-overview">
                                                            <div className="rating-score">
                                                                <span className="score">{displayProduct.rating}</span>
                                                                <div className="stars">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <i
                                                                            key={i}
                                                                            className={`fas fa-star ${i < Math.floor(displayProduct.rating || 0) ? "text-warning" : "text-muted"}`}
                                                                        ></i>
                                                                    ))}
                                                                </div>
                                                                <span className="review-count">({displayProduct.reviews} đánh giá)</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="reviews-list">
                                                        {/* Sample reviews */}
                                                        <div className="review-item">
                                                            <div className="reviewer-info">
                                                                <div className="reviewer-avatar">
                                                                    <i className="fas fa-user-circle"></i>
                                                                </div>
                                                                <div className="reviewer-details">
                                                                    <h6>Nguyễn Văn A</h6>
                                                                    <div className="review-rating">
                                                                        {[...Array(5)].map((_, i) => (
                                                                            <i key={i} className="fas fa-star text-warning"></i>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <p className="review-text">
                                                                Sản phẩm rất tốt, chất lượng như mô tả. Thú cưng của tôi rất thích!
                                                            </p>
                                                        </div>

                                                        <div className="review-item">
                                                            <div className="reviewer-info">
                                                                <div className="reviewer-avatar">
                                                                    <i className="fas fa-user-circle"></i>
                                                                </div>
                                                                <div className="reviewer-details">
                                                                    <h6>Trần Thị B</h6>
                                                                    <div className="review-rating">
                                                                        {[...Array(4)].map((_, i) => (
                                                                            <i key={i} className="fas fa-star text-warning"></i>
                                                                        ))}
                                                                        <i className="fas fa-star text-muted"></i>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <p className="review-text">Giao hàng nhanh, đóng gói cẩn thận. Sẽ mua lại lần sau.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Back Button */}
                            <div className="text-center mt-4">
                                <button className="btn btn-outline-secondary btn-lg" onClick={() => navigate(-1)}>
                                    <i className="fas fa-arrow-left me-2"></i>
                                    Quay lại danh sách sản phẩm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
}

export default ProductDetail
