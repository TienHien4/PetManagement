import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/customizeAxios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../../components/home/Header';
import Footer from '../../components/home/Footer';

const ProductPage = () => {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('tab-1');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalImageError, setModalImageError] = useState(false);
    const [productImageErrors, setProductImageErrors] = useState(new Map());

    // Phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8; // 8 sản phẩm mỗi trang (2 hàng x 4 cột)

    useEffect(() => {
        // Thử lấy từ cả hai cách lưu token  
        const accessToken = localStorage.getItem('accessToken') || localStorage.getItem('token')
        console.log("ProductPage - Token:", accessToken ? "Available" : "Missing")
        getAllProducts(accessToken);
        // eslint-disable-next-line
    }, [navigate]);

    const getAllProducts = async (accessToken) => {
        setLoading(true);
        try {
            const res = await axios.get('/api/product/getAllProduct', {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            console.log('=== ALL PRODUCTS FROM API ===');
            console.log('Total products:', res.data.length);
            setProducts(res.data);
            setLoading(false);
            setProductImageErrors(new Map());
        } catch (err) {
            console.error('Error loading products:', err);
            setError('Không thể tải sản phẩm.');
            setLoading(false);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1); // Reset về trang 1 khi đổi danh mục
    };

    // Hiển thị modal chi tiết sản phẩm
    const handleViewDetail = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
        setModalImageError(false); // Reset image error when opening modal
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
        setModalImageError(false); // Reset image error when closing modal
    };

    // Prevent modal image error infinite loop
    const handleModalImageError = useCallback((e) => {
        if (!modalImageError) {
            setModalImageError(true);
            e.target.src = '/placeholder.svg?height=300&width=300';
        }
    }, [modalImageError]);

    // Prevent product list image error infinite loop
    const handleProductImageError = useCallback((productId) => {
        setProductImageErrors(prev => {
            if (!prev.has(productId)) {
                const newMap = new Map(prev);
                newMap.set(productId, true);
                return newMap;
            }
            return prev;
        });
    }, []);

    // Thêm sản phẩm vào giỏ hàng
    const handleAddToCart = async (product) => {
        let accessToken = localStorage.getItem('accessToken') || localStorage.getItem('token')
        let userId = localStorage.getItem('userId')

        if (!userId) {
            const user = localStorage.getItem('user')
            if (user) {
                try {
                    const userObj = JSON.parse(user)
                    userId = userObj.id
                } catch (e) {
                    console.error("Error parsing user data:", e)
                }
            }
        }

        if (!userId) {
            alert('Bạn cần đăng nhập để thêm vào giỏ hàng!');
            navigate('/login');
            return;
        }

        if (!accessToken) {
            alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
            navigate('/login');
            return;
        }

        try {
            await axios.post(
                '/api/shopping-cart/add',
                { quantity: 1 },
                {
                    params: { userId, productId: product.id },
                    headers: { Authorization: `Bearer ${accessToken}` }
                }
            );
            window.dispatchEvent(new CustomEvent('cartUpdated'));
            window.confirm(`Đã thêm "${product.name}" vào giỏ hàng!`);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                alert('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!');
                navigate('/login');
            } else if (err.response && err.response.data && err.response.data.message) {
                alert('Lỗi: ' + err.response.data.message);
            } else {
                alert('Thêm vào giỏ hàng thất bại!');
            }
        }
    };

    // --- Xử lý lọc danh mục & phân trang ---
    const filteredProducts = products.filter(product => {
        if (!product.type) return activeTab === 'tab-1';
        const normalizedType = product.type.trim().toLowerCase();
        if (activeTab === 'tab-2') return normalizedType === 'thức ăn';
        // Hỗ trợ cả phụ kiện và vật dụng ở tab Phụ kiện
        if (activeTab === 'tab-3') return normalizedType === 'phụ kiện' || normalizedType === 'vật dụng';
        return true;
    });

    const totalPages = Math.ceil(filteredProducts.length / pageSize);
    const safeCurrentPage = Math.min(currentPage, Math.max(totalPages, 1));

    // Cắt danh sách sản phẩm hiển thị riêng trang hiện tại
    const paginatedProducts = filteredProducts.slice(
        (safeCurrentPage - 1) * pageSize,
        safeCurrentPage * pageSize
    );

    return (
        <div>
            <Header />
            <div className="container-xxl py-5" >
                <div className="row mb-4" style={{ height: 120, minHeight: 120, maxHeight: 120, overflow: 'hidden' }}>
                    <div className="col-12 d-flex flex-column justify-content-center align-items-center text-center" style={{ height: 120, minHeight: 120, maxHeight: 120, overflow: 'hidden' }}>
                        <h1 className="display-5 fw-bold mb-2" style={{ height: 48, minHeight: 48, maxHeight: 48, marginBottom: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>Sản phẩm của chúng tôi</h1>
                        <p className="text-muted mb-0" style={{ height: 32, minHeight: 32, maxHeight: 32, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                            Khám phá các sản phẩm thú cưng chất lượng cao, giá tốt và nhiều ưu đãi hấp dẫn.
                        </p>
                    </div>
                </div>
                <div className="container">
                    <div className="tab-content" style={{ minHeight: 600 }}>
                        <div className="tab-pane fade show active" style={{ minHeight: 600 }}>
                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-success" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="alert alert-danger text-center">{error}</div>
                            ) : (
                                <>
                                    <div className="row g-4 justify-content-center align-items-stretch" style={{ minHeight: 500 }}>
                                        {(() => {
                                            const colCount = 4;
                                            const rows = [];
                                            const minRows = 2;
                                            const totalSlots = Math.max(paginatedProducts.length, colCount * minRows);
                                            for (let i = 0; i < totalSlots; i += colCount) {
                                                const rowItems = paginatedProducts.slice(i, i + colCount);
                                                while (rowItems.length < colCount) {
                                                    rowItems.push(null);
                                                }
                                                rows.push(rowItems);
                                            }
                                            if (filteredProducts.length === 0) {
                                                return <div className="col-12 text-center">Không có sản phẩm nào.</div>;
                                            }
                                            return rows.map((row, rowIdx) => (
                                                <React.Fragment key={rowIdx}>
                                                    {row.map((product, idx) => product ? (
                                                        <div key={product.id} className="col-xl-3 col-lg-4 col-md-6 d-flex align-items-stretch">
                                                            <div className="card shadow-sm h-100 w-100 product-card border-0 d-flex flex-column" style={{ minHeight: 390, maxHeight: 390, height: 390, overflow: 'hidden' }}>
                                                                <div className="position-relative bg-light overflow-hidden" style={{ height: 180, minHeight: 180, maxHeight: 180 }}>
                                                                    <img
                                                                        className="img-fluid w-100 h-100 object-fit-cover product-img"
                                                                        src={productImageErrors.has(product.id) ? '/placeholder.svg?height=180&width=180' : product.image}
                                                                        alt={product.name}
                                                                        style={{ objectFit: 'cover', height: 180, width: '100%', minHeight: 180, maxHeight: 180, aspectRatio: '1/1', background: '#f8f9fa' }}
                                                                        onError={() => handleProductImageError(product.id)}
                                                                    />
                                                                    {product.salePercent > 0 && (
                                                                        <span className="badge bg-danger position-absolute top-0 end-0 m-2">-{product.salePercent}%</span>
                                                                    )}
                                                                </div>
                                                                <div className="card-body text-center flex-grow-1 d-flex flex-column justify-content-between p-2" style={{ minHeight: 120, maxHeight: 120, height: 120, overflow: 'hidden' }}>
                                                                    <div
                                                                        className="h6 mb-2 text-dark text-decoration-none fw-semibold"
                                                                        title={product.name}
                                                                        style={{
                                                                            display: '-webkit-box',
                                                                            WebkitLineClamp: 2,
                                                                            WebkitBoxOrient: 'vertical',
                                                                            overflow: 'hidden',
                                                                            textOverflow: 'ellipsis',
                                                                            height: '40px',
                                                                            minHeight: '40px',
                                                                            maxHeight: '40px',
                                                                            lineHeight: '20px',
                                                                            cursor: 'pointer'
                                                                        }}
                                                                    >
                                                                        {product.name}
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-success fw-bold me-1">{product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                                                                        {product.salePercent > 0 && (
                                                                            <span className="text-muted text-decoration-line-through ms-2" style={{ fontSize: '0.85rem' }}>{(product.price / (1 - product.salePercent / 100)).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="card-footer d-flex p-0 border-top bg-white gap-2" style={{ minHeight: 48, maxHeight: 48, height: 48 }}>
                                                                    <button className="btn d-flex align-items-center justify-content-center px-3 py-2 btn-outline-primary rounded-start-3 fw-semibold gap-1" style={{ fontSize: 15, height: 40, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', transition: 'background 0.2s' }} onClick={() => handleViewDetail(product)}>
                                                                        <i className="fa fa-eye text-primary"></i>
                                                                        <span className="d-none d-md-inline">Xem chi tiết</span>
                                                                        <span className="d-inline d-md-none">Chi tiết</span>
                                                                    </button>
                                                                    <button className="btn d-flex align-items-center justify-content-center px-3 py-2 btn-primary rounded-end-3 fw-semibold gap-1 text-white" style={{ fontSize: 15, height: 40, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', transition: 'background 0.2s' }} onClick={() => handleAddToCart(product)}>
                                                                        <i className="fa fa-shopping-bag"></i>
                                                                        <span className="d-none d-md-inline">Thêm vào giỏ</span>
                                                                        <span className="d-inline d-md-none">Thêm</span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div key={idx} className="col-xl-3 col-lg-4 col-md-6 d-flex align-items-stretch" style={{ visibility: 'hidden' }} />
                                                    ))}
                                                </React.Fragment>
                                            ));
                                        })()}
                                    </div>

                                    {/* Hộp phân trang (Pagination) */}
                                    {totalPages > 1 && (
                                        <div className="d-flex justify-content-center align-items-center mt-5 mb-3 gap-2">
                                            <button
                                                className="btn btn-outline-success d-flex align-items-center justify-content-center"
                                                style={{ width: '40px', height: '40px', borderRadius: '50%', fontWeight: '600' }}
                                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                disabled={safeCurrentPage === 1}
                                                title="Trang trước"
                                            >
                                                <i className="fa fa-chevron-left" style={{ fontSize: '12px' }}></i>
                                            </button>

                                            {Array.from({ length: totalPages }, (_, index) => {
                                                const pageNum = index + 1;
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        className={`btn d-flex align-items-center justify-content-center ${safeCurrentPage === pageNum ? 'btn-success text-white' : 'btn-outline-success'}`}
                                                        style={{ width: '40px', height: '40px', borderRadius: '50%', fontWeight: '600', transition: 'all 0.2s' }}
                                                        onClick={() => setCurrentPage(pageNum)}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}

                                            <button
                                                className="btn btn-outline-success d-flex align-items-center justify-content-center"
                                                style={{ width: '40px', height: '40px', borderRadius: '50%', fontWeight: '600' }}
                                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                disabled={safeCurrentPage === totalPages}
                                                title="Trang sau"
                                            >
                                                <i className="fa fa-chevron-right" style={{ fontSize: '12px' }}></i>
                                            </button>
                                        </div>
                                    )}

                                    <div className="d-flex justify-content-center mt-4">
                                        <ul className="nav nav-pills">
                                            <li className="nav-item">
                                                <button
                                                    className={`btn btn-sm me-2 ${activeTab === 'tab-1' ? 'btn-success' : 'btn-outline-success'}`}
                                                    onClick={() => handleTabChange('tab-1')}
                                                >
                                                    Tất cả
                                                </button>
                                            </li>
                                            <li className="nav-item">
                                                <button
                                                    className={`btn btn-sm me-2 ${activeTab === 'tab-2' ? 'btn-success' : 'btn-outline-success'}`}
                                                    onClick={() => handleTabChange('tab-2')}
                                                >
                                                    Thức ăn cho chó
                                                </button>
                                            </li>
                                            <li className="nav-item">
                                                <button
                                                    className={`btn btn-sm ${activeTab === 'tab-3' ? 'btn-success' : 'btn-outline-success'}`}
                                                    onClick={() => handleTabChange('tab-3')}
                                                >
                                                    Phụ kiện cho chó
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal chi tiết sản phẩm */}
            {showModal && selectedProduct && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Chi tiết sản phẩm</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <img
                                            src={modalImageError ? '/placeholder.svg?height=300&width=300' : selectedProduct.image}
                                            alt={selectedProduct.name}
                                            className="img-fluid rounded"
                                            style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                                            onError={handleModalImageError}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <h4 className="fw-bold mb-3">{selectedProduct.name}</h4>

                                        <div className="mb-3">
                                            <span className="badge bg-secondary me-2">
                                                {selectedProduct.type || 'Chưa phân loại'}
                                            </span>
                                            {selectedProduct.salePercent > 0 && (
                                                <span className="badge bg-danger">Giảm {selectedProduct.salePercent}%</span>
                                            )}
                                        </div>

                                        <div className="mb-3">
                                            <h5 className="text-success fw-bold">
                                                {selectedProduct.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                            </h5>
                                            {selectedProduct.salePercent > 0 && (
                                                <span className="text-muted text-decoration-line-through">
                                                    {(selectedProduct.price / (1 - selectedProduct.salePercent / 100)).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                                </span>
                                            )}
                                        </div>

                                        <div className="mb-3">
                                            <strong>Mô tả:</strong>
                                            <p className="mt-2">{selectedProduct.description || 'Chưa có mô tả chi tiết.'}</p>
                                        </div>

                                        <div className="mb-3">
                                            <strong>Tình trạng:</strong>
                                            <span className="ms-2 badge bg-success">Còn hàng</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                    Đóng
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => {
                                        handleAddToCart(selectedProduct);
                                        handleCloseModal();
                                    }}
                                >
                                    <i className="fa fa-shopping-bag me-2"></i>
                                    Thêm vào giỏ hàng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default ProductPage;
