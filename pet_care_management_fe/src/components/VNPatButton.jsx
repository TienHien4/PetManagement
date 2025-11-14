import React, { useState } from 'react';
import paymentService from '../../services/paymentService';
import './VNPayButton.css';

const VNPayButton = ({ orderId, amount, orderInfo, onSuccess, onError }) => {
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);
        try {
            const response = await paymentService.createVNPayPayment({
                orderId,
                amount,
                orderInfo: orderInfo || `Thanh toán đơn hàng #${orderId}`,
                orderType: 'billpayment'
            });

            if (response.code === '00' && response.paymentUrl) {
                // Redirect to VNPay payment page
                window.location.href = response.paymentUrl;
            } else {
                throw new Error(response.message || 'Không thể tạo thanh toán');
            }
        } catch (error) {
            console.error('Payment error:', error);
            if (onError) {
                onError(error);
            } else {
                alert('Có lỗi xảy ra khi tạo thanh toán. Vui lòng thử lại!');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            className="vnpay-button"
            onClick={handlePayment}
            disabled={loading}
        >
            {loading ? (
                <>
                    <span className="spinner"></span>
                    Đang xử lý...
                </>
            ) : (
                <>
                    <img
                        src="https://vnpay.vn/s1/statics.vnpay.vn/2023/9/06ncktiwd6dc1694418196384.png"
                        alt="VNPay"
                        className="vnpay-logo"
                    />
                    Thanh toán VNPay
                </>
            )}
        </button>
    );
};

export default VNPayButton;