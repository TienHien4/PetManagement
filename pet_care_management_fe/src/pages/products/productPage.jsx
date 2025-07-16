import React, { useState, useEffect } from 'react';
import axios from '../../services/customizeAxios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../../components/home/Header';
import Footer from '../../components/home/Footer';

const ProductPage = () => {


    const [activeTab, setActiveTab] = useState('tab-1');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        getAllProducts(accessToken);
        // eslint-disable-next-line
    }, [navigate]);

    const getAllProducts = async (accessToken) => {
        setLoading(true);
        try {
            const res = await axios.get('/api/product/getAllProduct', {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            // Chuyển đổi imageUrl thành image để đồng bộ với phần render bên dưới
            const products = res.data.map(product => ({
                ...product,
                image: product.imageUrl // FE dùng product.image để hiển thị
            }));
            setProducts(products);
            setLoading(false);
        } catch (err) {
            setError('Không thể tải sản phẩm.');
            setLoading(false);
        }
    };


    const handleTabChange = (tab) => setActiveTab(tab);


    // Điều hướng đến trang chi tiết sản phẩm
    const handleViewDetail = (productId) => {
        navigate(`/products/${productId}`);
    };

    // Thêm sản phẩm vào giỏ hàng (theo chuẩn BE mới: trả về CartItemResponse, xử lý lỗi rõ ràng)
    const handleAddToCart = async (product) => {
        const accessToken = localStorage.getItem('accessToken');
        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert('Bạn cần đăng nhập để thêm vào giỏ hàng!');
            navigate('/login');
            return;
        }
        try {
            // BE mới: trả về CartItemResponse, không cần check lại dữ liệu trả về ở đây
            await axios.post(
                '/api/shopping-cart/add',
                { quantity: 1 },
                {
                    params: { userId, productId: product.id },
                    headers: { Authorization: `Bearer ${accessToken}` }
                }
            );
            alert('Đã thêm vào giỏ hàng!');
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
                    {/* Tabs and product list always rendered, filter in .map */}
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
                                            const filtered = products.filter(product => {
                                                if (activeTab === 'tab-2') return product.type && product.type.trim() === 'Food';
                                                if (activeTab === 'tab-3') return product.type && product.type.trim() === 'Phụ kiện cho chó';
                                                return true;
                                            });
                                            // Đảm bảo luôn render đủ 4 cột (dù thiếu sản phẩm)
                                            const colCount = 4;
                                            const rows = [];
                                            // Đảm bảo luôn có ít nhất 2 hàng (8 slot) để layout không bị co lại khi ít sản phẩm
                                            const minRows = 2;
                                            const totalSlots = Math.max(filtered.length, colCount * minRows);
                                            for (let i = 0; i < totalSlots; i += colCount) {
                                                const rowItems = filtered.slice(i, i + colCount);
                                                while (rowItems.length < colCount) {
                                                    rowItems.push(null);
                                                }
                                                rows.push(rowItems);
                                            }
                                            if (filtered.length === 0) {
                                                return <div className="col-12 text-center">Không có sản phẩm nào.</div>;
                                            }
                                            return rows.map((row, rowIdx) => (
                                                <React.Fragment key={rowIdx}>
                                                    {row.map((product, idx) => product ? (
                                                        <div key={product.id} className="col-xl-3 col-lg-4 col-md-6 d-flex align-items-stretch">
                                                            <div className="card shadow-sm h-100 w-100 product-card border-0 d-flex flex-column" style={{ minHeight: 390, maxHeight: 390, height: 390 }}>
                                                                <div className="position-relative bg-light overflow-hidden" style={{ height: 180, minHeight: 180, maxHeight: 180 }}>
                                                                    <img
                                                                        className="img-fluid w-100 h-100 object-fit-cover product-img"
                                                                        src={product.image}
                                                                        alt={product.name}
                                                                        style={{ objectFit: 'cover', height: 180, width: '100%', minHeight: 180, maxHeight: 180, aspectRatio: '1/1', background: '#f8f9fa' }}
                                                                        onError={e => { e.target.onerror = null; e.target.src = '/placeholder.svg?height=180&width=180'; }}
                                                                    />
                                                                    {product.salePercent > 0 && (
                                                                        <span className="badge bg-danger position-absolute top-0 end-0 m-2">-{product.salePercent}%</span>
                                                                    )}
                                                                </div>
                                                                <div className="card-body text-center flex-grow-1 d-flex flex-column justify-content-between p-2" style={{ minHeight: 120, maxHeight: 120, height: 120 }}>
                                                                    <div className="d-block h5 mb-2 text-dark text-decoration-none text-truncate" style={{ minHeight: 32, maxHeight: 32, overflow: 'hidden' }}>
                                                                        {product.name}
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-success fw-bold me-1">{product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                                                                        {product.salePercent > 0 && (
                                                                            <span className="text-muted text-decoration-line-through ms-2">{(product.price / (1 - product.salePercent / 100)).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="card-footer d-flex p-0 border-top bg-white gap-2" style={{ minHeight: 48, maxHeight: 48, height: 48 }}>
                                                                    <button className="btn d-flex align-items-center justify-content-center px-3 py-2 btn-outline-primary rounded-start-3 fw-semibold gap-1" style={{ fontSize: 15, height: 40, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', transition: 'background 0.2s' }} onClick={() => handleViewDetail(product.id)}>
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
            <Footer />
        </div>
    );
};

export default ProductPage;
