import { useEffect, useState } from "react"
import axios from "../../services/customizeAxios"
import { useNavigate } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../../components/home/Header';
import Footer from '../../components/home/Footer';

const ShoppingCart = () => {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [total, setTotal] = useState(0)
    const [shipping, setShipping] = useState(5)
    const [cartImageErrors, setCartImageErrors] = useState(new Map())
    const navigate = useNavigate()

    useEffect(() => {
        fetchCart()
    }, [])

    const fetchCart = async () => {
        setLoading(true)
        // Khai báo biến ngoài try-catch để có thể sử dụng trong cả hai block
        let accessToken = localStorage.getItem("accessToken") || localStorage.getItem("token")
        let userId = localStorage.getItem("userId")

        // Nếu không có userId, thử lấy từ user object
        if (!userId) {
            const user = localStorage.getItem("user")
            if (user) {
                try {
                    const userObj = JSON.parse(user)
                    userId = userObj.id
                } catch (e) {
                    console.error("Error parsing user data:", e)
                }
            }
        }

        console.log("Cart - Token:", accessToken ? "Available" : "Missing")
        console.log("Cart - UserId:", userId ? userId : "Missing")
        console.log("Cart - Request URL:", `/api/shopping-cart/items?userId=${userId}`)

        if (!accessToken || !userId) {
            setError("Vui lòng đăng nhập để xem giỏ hàng.")
            setLoading(false)
            return
        }

        try {
            const res = await axios.get(`/api/shopping-cart/items?userId=${userId}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            })
            console.log("Cart data:", res.data)
            console.log("Cart data length:", res.data?.length || 0)

            // Debug: Xem cấu trúc chi tiết từng item trong giỏ hàng
            console.log("=== CART API RESPONSE ===")
            console.log("Full response data:", res.data)
            console.log("Response type:", typeof res.data)
            console.log("Is array:", Array.isArray(res.data))
            console.log("Length:", res.data?.length)

            if (res.data && res.data.length > 0) {
                console.log("=== CART ITEMS DETAILED STRUCTURE ===")
                res.data.forEach((item, index) => {
                    console.log(`\n--- Cart Item ${index} ---`)
                    console.log("Full item object:", JSON.stringify(item, null, 2))
                    console.log(`productId: ${item.productId}`)
                    console.log(`productName: ${item.productName}`)
                    console.log(`productImage: ${item.productImage}`)
                    console.log(`imageUrl: ${item.imageUrl}`)
                    console.log(`image: ${item.image}`)
                    console.log(`product: ${JSON.stringify(item.product)}`)
                    console.log(`quantity: ${item.quantity}`)
                    console.log(`totalPrice: ${item.totalPrice}`)
                })
            } else {
                console.log("Cart is empty or no data returned")
            }

            setItems(res.data)
            setTotal(res.data.reduce((sum, item) => sum + item.totalPrice, 0))
            setCartImageErrors(new Map())
            setError(null)
        } catch (err) {
            console.error("Cart fetch error:", err)
            console.error("Error response:", err.response?.data)
            console.error("Error status:", err.response?.status)

            // Try alternative endpoint if main one fails
            try {
                console.log("Trying alternative cart endpoint...")
                const altRes = await axios.get(`/api/shopping-cart/${userId}`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                console.log("Alternative cart data:", altRes.data)
                setItems(altRes.data)
                setTotal(altRes.data.reduce((sum, item) => sum + item.totalPrice, 0))
                setError(null)
                setLoading(false)
                return
            } catch (altErr) {
                console.error("Alternative cart fetch also failed:", altErr)
            }

            setError("Không thể tải giỏ hàng.")
        }
        setLoading(false)
    }

    const handleDelete = async (productId) => {
        console.log("handleDelete called with productId:", productId);

        if (!productId) {
            console.error("ProductId is missing!");
            setError("Không thể xác định sản phẩm.");
            return;
        }

        try {
            let accessToken = localStorage.getItem("accessToken") || localStorage.getItem("token")
            let userId = localStorage.getItem("userId")

            if (!userId) {
                const user = localStorage.getItem("user")
                if (user) {
                    try {
                        const userObj = JSON.parse(user)
                        userId = userObj.id
                    } catch (e) {
                        console.error("Error parsing user data:", e)
                    }
                }
            }

            console.log("Delete request params:", { userId, productId });

            await axios.delete(`/api/shopping-cart/delete?userId=${userId}&productId=${productId}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            })

            // Filter by both productId and product.id to be safe
            const updatedItems = items.filter((item) => {
                const itemProductId = item.productId || item.product?.id;
                return itemProductId !== productId;
            })

            setItems(updatedItems)
            setTotal(updatedItems.reduce((sum, item) => sum + item.totalPrice, 0))

            // Trigger cart count update
            window.dispatchEvent(new CustomEvent('cartUpdated'));
        } catch (err) {
            console.error("handleDelete error:", err);
            console.error("Error response:", err.response?.data);
            setError("Xóa sản phẩm thất bại: " + (err.response?.data?.message || err.message));
        }
    }

    const handleQuantity = async (productId, type) => {
        console.log("handleQuantity called with:", { productId, type });

        if (!productId) {
            console.error("ProductId is missing!");
            setError("Không thể xác định sản phẩm.");
            return;
        }

        // Tìm sản phẩm hiện tại để kiểm tra số lượng
        const currentItem = items.find(item => {
            const itemProductId = item.productId || item.product?.id;
            return itemProductId === productId;
        });

        // Nếu là reduce và sau khi trừ sẽ xuống 0, thì xóa sản phẩm khỏi giỏ hàng
        if (type === "reduce" && currentItem && currentItem.quantity <= 1) {
            console.log("Quantity will be 0, removing item from cart...");
            await handleDelete(productId);
            return;
        }

        try {
            let accessToken = localStorage.getItem("accessToken") || localStorage.getItem("token")
            let userId = localStorage.getItem("userId")

            if (!userId) {
                const user = localStorage.getItem("user")
                if (user) {
                    try {
                        const userObj = JSON.parse(user)
                        userId = userObj.id
                    } catch (e) {
                        console.error("Error parsing user data:", e)
                    }
                }
            }

            console.log("Request params:", { userId, productId, type });

            if (type === "add") {
                console.log("Making add request...");
                await axios.post(`/api/shopping-cart/add`, { quantity: 1 }, {
                    params: { userId, productId },
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
            } else {
                console.log("Making reduce request...");
                await axios.post(`/api/shopping-cart/reduce?userId=${userId}&productId=${productId}`, {}, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
            }

            console.log("Request successful, fetching cart...");
            await fetchCart()

            // Trigger cart count update
            window.dispatchEvent(new CustomEvent('cartUpdated'));
        } catch (err) {
            console.error("handleQuantity error:", err);
            console.error("Error response:", err.response?.data);
            setError("Cập nhật số lượng thất bại: " + (err.response?.data?.message || err.message));
        }
    }

    if (loading) return (
        <>
            <Header />
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
                <div className="d-flex align-items-center">
                    <div className="spinner-border text-primary me-3" role="status"></div>
                    <span className="fs-5">Đang tải giỏ hàng...</span>
                </div>
            </div>
            <Footer />
        </>
    )

    if (error) return (
        <>
            <Header />
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
                <div className="alert alert-danger fs-5">{error}</div>
            </div>
            <Footer />
        </>
    )

    // Hàm checkout gọi API placeOrder (chuẩn hóa theo OrderRequest/OrderResponse)
    const handleCheckout = async () => {
        try {
            let accessToken = localStorage.getItem("accessToken") || localStorage.getItem("token")
            let userId = localStorage.getItem("userId")

            if (!userId) {
                const user = localStorage.getItem("user")
                if (user) {
                    try {
                        const userObj = JSON.parse(user)
                        userId = userObj.id
                    } catch (e) {
                        console.error("Error parsing user data:", e)
                    }
                }
            }

            console.log("Checkout - Token:", accessToken ? "Available" : "Missing")
            console.log("Checkout - UserId:", userId ? userId : "Missing")
            console.log("Checkout - Items:", items)

            // Debug: Check items structure
            console.log("Items structure:")
            items.forEach((item, index) => {
                console.log(`Item ${index}:`, {
                    productId: item.productId || item.product?.id,
                    quantity: item.quantity,
                    fullItem: item
                })
            })

            // Map items đúng cấu trúc (có thể productId nằm trong item.product.id)
            const mappedItems = items.map(item => ({
                productId: item.productId || item.product?.id,
                quantity: item.quantity
            }))

            console.log("Mapped items for order:", mappedItems)

            // OrderRequest chỉ nhận userId và items
            const orderRequest = {
                userId: Number(userId),
                items: mappedItems
            };

            console.log("Final order request:", orderRequest)

            // Validation: Check if we have valid items
            if (!mappedItems || mappedItems.length === 0) {
                throw new Error("Giỏ hàng trống hoặc không có sản phẩm hợp lệ")
            }

            // Check if all items have valid productId
            const invalidItems = mappedItems.filter(item => !item.productId || !item.quantity)
            if (invalidItems.length > 0) {
                console.error("Invalid items found:", invalidItems)
                throw new Error("Có sản phẩm không hợp lệ trong giỏ hàng")
            }

            const res = await axios.post("/api/orders/place", orderRequest, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            const order = res.data;

            // Xóa giỏ hàng ngay
            setItems([]);
            setTotal(0);
            window.dispatchEvent(new CustomEvent('cartUpdated'));

            // Chuyển sang thanh toán VNPay ngay lập tức
            const paymentResponse = await axios.get('/api/payment/pay', {
                params: {
                    orderId: order.orderId || order.id
                },
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            console.log("=== VNPay Payment Data ===");
            console.log("Payment URL:", paymentResponse.data);
            console.log("========================");

            if (paymentResponse.data) {
                // Redirect to VNPay
                window.location.href = paymentResponse.data;

            } else {
                // Nếu không tạo được payment, vẫn cho xem đơn hàng
                alert(`Đơn hàng đã tạo nhưng không thể chuyển sang thanh toán. Mã đơn: ${order.orderId || order.id}`);
                setTimeout(() => {
                    navigate('/user/orders');
                }, 2000);
            }
        } catch (err) {
            console.error("Checkout error:", err);
            console.error("Error response:", err.response?.data);
            setError("Đặt hàng thất bại. Vui lòng thử lại.");
        }
    }

    // Layout giống ảnh mẫu với Header và Footer
    return (
        <>
            <Header />
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                paddingTop: '20px',
                paddingBottom: '20px'
            }}>
                <div className="container-fluid px-3">
                    <div className="row justify-content-center">
                        <div className="col-12">
                            {/* Header Section */}
                            <div className="text-center mb-3">
                                <h1 className="display-5 fw-bold text-white mb-2">🛒 Giỏ Hàng Của Bạn</h1>
                                <p className="text-white-50 fs-6">Quản lý sản phẩm và tiến hành thanh toán</p>
                            </div>

                            <div className="row g-3">
                                {/* Cart Section */}
                                <div className="col-lg-9 col-xl-10">
                                    <div className="card shadow-lg border-0 rounded-4 overflow-hidden"
                                        style={{
                                            minHeight: '70vh',
                                            maxHeight: '85vh',
                                            height: 'auto',
                                            width: '100%'
                                        }}>
                                        <div className="card-header bg-white py-5 px-5 border-0">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h2 className="fw-bold mb-0 text-primary display-6" style={{ whiteSpace: 'nowrap' }}>
                                                    <i className="bi bi-cart3 me-3"></i>Shopping Cart
                                                </h2>
                                                <span className="badge bg-primary fs-4 px-4 py-3" style={{ whiteSpace: 'nowrap', marginLeft: '100px' }}>{items.length} sản phẩm</span>
                                            </div>
                                        </div>
                                        <div className="card-body p-0"
                                            style={{
                                                maxHeight: '75vh',
                                                overflowY: 'auto',
                                                overflowX: 'hidden'
                                            }}>
                                            {/* Table Header */}
                                            <div className="d-none d-md-flex bg-light py-6 px-6 text-muted fw-bold fs-3 text-uppercase" style={{ fontSize: '1.5rem' }}>
                                                <div style={{ flex: '4', whiteSpace: 'nowrap' }}>Chi tiết sản phẩm</div>

                                            </div>

                                            {/* Cart Items */}
                                            {items.length === 0 ? (
                                                <div className="text-center py-5">
                                                    <i className="bi bi-cart-x display-1 text-muted mb-3"></i>
                                                    <h4 className="text-muted">Giỏ hàng của bạn đang trống</h4>
                                                    <p className="text-muted">Hãy thêm một số sản phẩm để bắt đầu mua sắm!</p>
                                                    <button
                                                        className="btn btn-primary btn-lg px-4"
                                                        onClick={() => navigate('/products')}
                                                    >
                                                        <i className="bi bi-shop me-2"></i>Mua sắm ngay
                                                    </button>
                                                </div>
                                            ) : (
                                                items.map((item, index) => {
                                                    const productId = item.productId || item.product?.id;
                                                    // Lấy image từ productImage field mới của CartItemResponse
                                                    const productImage = item.productImage || item.product?.image || item.image || item.imageUrl;
                                                    const displayImage = cartImageErrors.has(productId) ? '/placeholder.svg?height=160&width=160' : productImage;

                                                    console.log(`\n=== RENDERING CART ITEM ${index} ===`);
                                                    console.log("productId:", productId);
                                                    console.log("item.productImage:", item.productImage);
                                                    console.log("item.product?.image:", item.product?.image);
                                                    console.log("item.image:", item.image);
                                                    console.log("item.imageUrl:", item.imageUrl);
                                                    console.log("Calculated productImage:", productImage);
                                                    console.log("Final displayImage:", displayImage);
                                                    console.log("Has error:", cartImageErrors.has(productId));

                                                    const handleImageError = () => {
                                                        console.log(`Image error for productId: ${productId}`);
                                                        setCartImageErrors(prev => {
                                                            if (!prev.has(productId)) {
                                                                const newMap = new Map(prev);
                                                                newMap.set(productId, true);
                                                                console.log("Added to error map:", productId);
                                                                return newMap;
                                                            }
                                                            return prev;
                                                        });
                                                    };

                                                    return (
                                                        <div key={productId} className={`p-6 ${index !== items.length - 1 ? 'border-bottom' : ''}`} style={{ minHeight: '180px' }}>
                                                            <div className="row align-items-center g-5">
                                                                {/* Product Info */}
                                                                <div className="col-md-6">
                                                                    <div className="d-flex align-items-center gap-5">
                                                                        <img
                                                                            src={displayImage}
                                                                            alt={item.productName}
                                                                            className="rounded-3 border"
                                                                            style={{ width: '160px', height: '160px', objectFit: 'cover', background: '#f8f9fa' }}
                                                                            onError={handleImageError}
                                                                        />
                                                                        <div style={{ width: '350px', minWidth: '350px', maxWidth: '350px' }}>
                                                                            <h2 className="fw-bold mb-3 display-6"
                                                                                style={{
                                                                                    wordWrap: 'break-word',
                                                                                    overflowWrap: 'break-word',
                                                                                    hyphens: 'auto',
                                                                                    lineHeight: '1',
                                                                                    fontSize: '1.5rem',
                                                                                    marginRight: '50px'
                                                                                }}>
                                                                                {item.productName}
                                                                            </h2>

                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Quantity Controls */}
                                                                <div className="col-md-2 text-center">
                                                                    <div className="d-flex align-items-center justify-content-center gap-2">
                                                                        <button
                                                                            className="btn btn-primary shadow-sm d-flex align-items-center justify-content-center"
                                                                            style={{
                                                                                width: '80px',
                                                                                height: '80px',
                                                                                borderRadius: '16px',
                                                                                fontSize: '28px',
                                                                                fontWeight: 'bold',
                                                                                border: 'none',
                                                                                cursor: 'pointer',
                                                                                transition: 'all 0.2s ease',
                                                                                minWidth: '80px'
                                                                            }}
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                                console.log("Reduce clicked for productId:", productId, "quantity:", item.quantity);
                                                                                handleQuantity(productId, 'reduce');
                                                                            }}
                                                                            onMouseOver={(e) => {
                                                                                e.target.style.transform = 'scale(1.05)';
                                                                                e.target.style.boxShadow = '0 4px 12px rgba(0,123,255,0.3)';
                                                                            }}
                                                                            onMouseOut={(e) => {
                                                                                e.target.style.transform = 'scale(1)';
                                                                                e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                                                                            }}
                                                                            title={item.quantity <= 1 ? "Trừ xuống 0 sẽ xóa sản phẩm" : "Giảm số lượng"}
                                                                        >
                                                                            <i className="bi bi-dash"></i>
                                                                        </button>

                                                                        <div className="d-flex align-items-center justify-content-center mx-4"
                                                                            style={{
                                                                                minWidth: '80px',
                                                                                height: '70px',
                                                                                backgroundColor: '#f8f9fa',
                                                                                borderRadius: '12px',
                                                                                border: '3px solid #e9ecef'
                                                                            }}>
                                                                            <span className="fw-bold display-5" style={{ fontSize: '2.5rem' }}>{item.quantity}</span>
                                                                        </div>

                                                                        <button
                                                                            className="btn btn-success shadow-sm d-flex align-items-center justify-content-center"
                                                                            style={{
                                                                                width: '80px',
                                                                                height: '80px',
                                                                                borderRadius: '16px',
                                                                                fontSize: '28px',
                                                                                fontWeight: 'bold',
                                                                                border: 'none',
                                                                                cursor: 'pointer',
                                                                                transition: 'all 0.2s ease',
                                                                                minWidth: '80px'
                                                                            }}
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                                console.log("Add clicked for productId:", productId);
                                                                                handleQuantity(productId, 'add');
                                                                            }}
                                                                            onMouseOver={(e) => {
                                                                                e.target.style.transform = 'scale(1.05)';
                                                                                e.target.style.boxShadow = '0 4px 12px rgba(40,167,69,0.3)';
                                                                            }}
                                                                            onMouseOut={(e) => {
                                                                                e.target.style.transform = 'scale(1)';
                                                                                e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                                                                            }}
                                                                        >
                                                                            <i className="bi bi-plus"></i>
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                {/* Price */}
                                                                <div className="col-md-2 text-center">
                                                                    <span className="fw-semibold text-muted fs-4" style={{ whiteSpace: 'nowrap' }}>-</span>
                                                                </div>

                                                                {/* Total */}
                                                                <div className="col-md-2 text-center">
                                                                    <span className="fw-bold fs-3 text-success" style={{ whiteSpace: 'nowrap' }}>
                                                                        {item.totalPrice.toLocaleString()} đ
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            )}

                                            {/* Continue Shopping */}
                                            {items.length > 0 && (
                                                <div className="p-5 bg-light">
                                                    <button
                                                        className="btn btn-outline-primary btn-lg fs-5 px-4 py-3"
                                                        onClick={() => navigate('/products')}
                                                    >
                                                        <i className="bi bi-arrow-left me-3"></i>Tiếp tục mua sắm
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Order Summary */}
                                <div className="col-lg-3 col-xl-2">
                                    <div className="card shadow-lg border-0 rounded-4 overflow-hidden sticky-top" style={{ top: '20px' }}>
                                        <div className="card-header text-white py-3" style={{ backgroundColor: 'rgba(241, 249, 20, 0.2)' }}>
                                            <h5 className="fw-bold mb-0 text-center">
                                                <i className="bi bi-receipt me-2" style={{ backgroundColor: 'rgba(241, 249, 20, 0.2)' }}></i>Tóm tắt đơn hàng
                                            </h5>
                                        </div>
                                        <div className="card-body p-3">
                                            <div className="d-flex justify-content-between py-2 border-bottom">
                                                <span className="text-muted">Sản phẩm ({items.length})</span>
                                                <span className="fw-semibold">{total.toLocaleString()} đ</span>
                                            </div>



                                            <div className="border-top pt-3 mb-4">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <span className="fw-bold fs-5" style={{ marginRight: '50px' }}>TỔNG CỘNG</span>
                                                    <span className="fw-bold fs-4 text-success">
                                                        {(total + shipping).toLocaleString()} đ
                                                    </span>
                                                </div>
                                            </div>

                                            <button
                                                className="btn btn-success w-100 py-3 fw-bold fs-5 text-uppercase letter-spacing-1"
                                                disabled={items.length === 0}
                                                onClick={handleCheckout}
                                                style={{ letterSpacing: '1px' }}
                                            >
                                                <i className="bi bi-credit-card me-2"></i>
                                                Đặt hàng & Thanh toán
                                            </button>

                                            {items.length === 0 && (
                                                <small className="text-muted d-block text-center mt-2">
                                                    Thêm sản phẩm để tiếp tục
                                                </small>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
export default ShoppingCart;
