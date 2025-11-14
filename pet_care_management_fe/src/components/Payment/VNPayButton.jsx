import React, { useState } from 'react';
import './VNPayButton.css';
import apiClient from '../../services/customizeAxios';

const VNPayButton = ({ orderId, amount, orderInfo, onSuccess, onError }) => {
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);
        try {
            const response = await apiClient.post('/api/payment/vnpay/create', {
                orderId,
                amount,
                orderInfo: orderInfo || `Thanh toán đơn hàng #${orderId}`,
                orderType: 'billpayment',
                bankCode: ''
            });

            if (response.data.code === '00' && response.data.paymentUrl) {
                if (onSuccess) onSuccess();
                window.location.href = response.data.paymentUrl;
            } else {
                throw new Error(response.data.message || 'Không thể tạo thanh toán');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message
                || error.message
                || 'Có lỗi xảy ra khi tạo thanh toán';

            if (onError) {
                onError(error);
            } else {
                alert(`Lỗi thanh toán: ${errorMessage}`);
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
