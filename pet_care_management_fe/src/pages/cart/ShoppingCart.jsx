import { useEffect, useState } from "react"
import axios from "../../services/customizeAxios"
import { useNavigate } from "react-router-dom"

const ShoppingCart = () => {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [total, setTotal] = useState(0)
    const [shipping, setShipping] = useState(5)
    const [promo, setPromo] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        fetchCart()
    }, [])

    const fetchCart = async () => {
        setLoading(true)
        try {
            const accessToken = localStorage.getItem("accessToken")
            const userId = localStorage.getItem("userId")
            const res = await axios.get(`/api/shopping-cart/items?userId=${userId}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            })
            console.log(res.data)
            setItems(res.data)
            setTotal(res.data.reduce((sum, item) => sum + item.totalPrice, 0))
            setError(null)
        } catch (err) {
            setError("Không thể tải giỏ hàng.")
        }
        setLoading(false)
    }

    const handleDelete = async (productId) => {
        try {
            const accessToken = localStorage.getItem("accessToken")
            const userId = localStorage.getItem("userId")
            await axios.delete(`/api/shopping-cart/delete?userId=${userId}&productId=${productId}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            })
            const updatedItems = items.filter((item) => item.product.id !== productId)
            setItems(updatedItems)
            setTotal(updatedItems.reduce((sum, item) => sum + item.totalPrice, 0))
        } catch (err) {
            setError("Xóa sản phẩm thất bại.")
        }
    }

    const handleQuantity = async (productId, type) => {
        try {
            const accessToken = localStorage.getItem("accessToken")
            const userId = localStorage.getItem("userId")
            if (type === "add") {
                await axios.post(`/api/shopping-cart/add`, { quantity: 1 }, {
                    params: { userId, productId },
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
            } else {
                await axios.post(`/api/shopping-cart/reduce?userId=${userId}&productId=${productId}`, {}, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
            }
            await fetchCart()
        } catch (err) {
            setError("Cập nhật số lượng thất bại.")
        }
    }

    if (loading) return <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}><div>Đang tải giỏ hàng...</div></div>
    if (error) return <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}><div className="alert alert-danger">{error}</div></div>

    // Hàm checkout gọi API placeOrder (chuẩn hóa theo OrderRequest/OrderResponse)
    const handleCheckout = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const userId = localStorage.getItem("userId");
            // OrderRequest chỉ nhận userId và items (không có shippingFee)
            const orderRequest = {
                userId: Number(userId),
                items: items.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity
                }))
            };
            const res = await axios.post("/api/orders/place", orderRequest, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            // Xử lý OrderResponse trả về
            const order = res.data;
            // Hiển thị thông tin đơn hàng vừa đặt (có thể tuỳ chỉnh UI hoặc chuyển hướng sang trang chi tiết đơn hàng)
            alert(
                `Đặt hàng thành công!\n\nMã đơn: ${order.orderId}\nNgày: ${order.orderDate}\nTổng SL: ${order.totalQuantity}\nTổng tiền: £${order.totalPrice.toLocaleString()}\nSản phẩm: ${order.items.map(i => `${i.productName} x${i.quantity}`).join(", ")}`
            );
            // Sau khi đặt hàng thành công, có thể làm mới giỏ hàng hoặc chuyển hướng
            setItems([]);
            setTotal(0);
        } catch (err) {
            setError("Đặt hàng thất bại. Vui lòng thử lại.");
        }
    }

    // Layout giống ảnh mẫu
    return (
        <div style={{ minHeight: '100vh', background: '#ededf2', padding: 32 }}>
            <div style={{ maxWidth: 1800, margin: '0 auto', display: 'flex', gap: 32, alignItems: 'flex-start' }}>
                {/* Cart Section */}
                <div style={{ flex: 2, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', padding: 36 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', marginBottom: 24, paddingBottom: 16 }}>
                        <h2 style={{ fontWeight: 600, fontSize: 26, margin: 0 }}>Shopping Cart</h2>
                        <span style={{ fontWeight: 500, fontSize: 20 }}>{items.length} Items</span>
                    </div>
                    {/* Table Header */}
                    <div style={{ display: 'flex', color: '#999', fontWeight: 600, fontSize: 13, textTransform: 'uppercase', marginBottom: 16 }}>
                        <div style={{ flex: 3 }}>Product Details</div>
                        <div style={{ flex: 1, textAlign: 'center' }}>Quantity</div>
                        <div style={{ flex: 1, textAlign: 'center' }}>Price</div>
                        <div style={{ flex: 1, textAlign: 'center' }}>Total</div>
                        <div style={{ width: 60 }}></div>
                    </div>
                    {/* Cart Items */}
                    {items.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '48px 0', color: '#888' }}>Your cart is empty.</div>
                    ) : (
                        items.map(item => {
                            // Sử dụng đúng trường dữ liệu từ backend
                            const image = item.imageUrl || "/placeholder.svg?height=60&width=60";
                            return (
                                <div key={item.productId} style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #f0f0f0', padding: '18px 0' }}>
                                    <div style={{ flex: 3, display: 'flex', alignItems: 'center', gap: 18 }}>
                                        <img src={image} alt={item.productName} style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover', background: '#eee' }} onError={e => { e.target.onerror = null; e.target.src = '/placeholder.svg?height=60&width=60' }} />
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: 16 }}>{item.productName}</div>
                                            {/* Nếu backend trả về type, hiển thị ở đây */}
                                            {/* <div style={{ color: '#b36aff', fontSize: 14, margin: '2px 0 6px 0' }}>{item.type}</div> */}
                                            <button style={{ background: 'none', border: 'none', color: '#b36aff', fontSize: 14, cursor: 'pointer', padding: 0, textDecoration: 'underline' }} onClick={() => handleDelete(item.productId)}>Remove</button>
                                        </div>
                                    </div>
                                    <div style={{ flex: 1, textAlign: 'center' }}>
                                        <button style={{ width: 32, height: 32, border: '1px solid #eee', background: '#fff', borderRadius: 6, fontWeight: 600, fontSize: 18, marginRight: 8, cursor: 'pointer' }} onClick={() => handleQuantity(item.productId, 'reduce')} disabled={item.quantity <= 1}>-</button>
                                        <span style={{ fontWeight: 600, fontSize: 16 }}>{item.quantity}</span>
                                        <button style={{ width: 32, height: 32, border: '1px solid #eee', background: '#fff', borderRadius: 6, fontWeight: 600, fontSize: 18, marginLeft: 8, cursor: 'pointer' }} onClick={() => handleQuantity(item.productId, 'add')}>+</button>
                                    </div>
                                    {/* Không có giá từng sản phẩm, chỉ hiển thị tổng nếu backend không trả về price */}
                                    <div style={{ flex: 1, textAlign: 'center', fontWeight: 600, fontSize: 16 }}>-</div>
                                    <div style={{ flex: 1, textAlign: 'center', fontWeight: 600, fontSize: 16 }}>{item.totalPrice.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}</div>
                                    <div style={{ width: 60 }}></div>
                                </div>
                            )
                        })
                    )}
                    {/* Continue Shopping */}
                    <div style={{ marginTop: 18 }}>
                        <button style={{ background: 'none', border: 'none', color: '#7c4dff', fontWeight: 500, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }} onClick={() => navigate('/products')}>
                            <span style={{ fontSize: 18, marginRight: 2 }}>←</span> Continue Shopping
                        </button>
                    </div>
                </div>
                {/* Order Summary */}
                <div style={{ flex: 1, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', padding: 36, minWidth: 320 }}>
                    <h3 style={{ fontWeight: 600, fontSize: 22, margin: 0, marginBottom: 28 }}>Order Summary</h3>
                    <div style={{ borderBottom: '1px solid #eee', marginBottom: 18, paddingBottom: 12, color: '#888', fontWeight: 500, fontSize: 15, display: 'flex', justifyContent: 'space-between' }}>
                        <span>ITEMS {items.length}</span>
                        <span>{total.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}</span>
                    </div>
                    <div style={{ marginBottom: 18 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, color: '#888', display: 'block', marginBottom: 6 }}>SHIPPING</label>
                        <select style={{ width: '100%', padding: 10, border: '1px solid #eee', borderRadius: 6, fontSize: 15, color: '#333' }} value={shipping} onChange={e => setShipping(Number(e.target.value))}>
                            <option value={5}>Standard Delivery - £5.00</option>
                            <option value={10}>Express Delivery - £10.00</option>
                        </select>
                    </div>

                    <div style={{ borderTop: '1px solid #eee', margin: '24px 0 18px 0', paddingTop: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, fontSize: 16, color: '#888' }}>TOTAL COST</span>
                        <span style={{ fontWeight: 700, fontSize: 22, color: '#222' }}>{(total + shipping).toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}</span>
                    </div>
                    <button style={{ width: '100%', padding: '16px 0', background: '#6c5ce7', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 16, letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer' }} disabled={items.length === 0} onClick={handleCheckout}>CHECKOUT</button>
                </div>
            </div>
        </div>
    )
}

export default ShoppingCart
