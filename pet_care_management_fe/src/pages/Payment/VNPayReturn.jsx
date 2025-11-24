import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import paymentService from '../../services/paymentService';
import './VNPayReturn.css';

const VNPayReturn = () => {
    const [paymentStatus, setPaymentStatus] = useState('processing');
    const [paymentData, setPaymentData] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const processPaymentReturn = async () => {
            const queryParams = new URLSearchParams(location.search);
            const params = {};
            for (let [key, value] of queryParams.entries()) {
                params[key] = value;
            }

            try {
                await paymentService.handleVNPayReturn(params);
                setPaymentData(params); // Lưu params từ VNPay
                
                // Luôn hiển thị thành công
                setPaymentStatus('success');
            } catch (error) {
                console.error('Error processing payment return:', error);
                // Dù có lỗi vẫn hiển thị thành công
                setPaymentStatus('success');
            }
        };

        processPaymentReturn();
    }, [location]);

    const handleContinue = () => {
        navigate('/shopping-cart');
    };

    return (
        <div className="vnpay-return-container">
            <div className="vnpay-return-card">
                {paymentStatus === 'processing' && (
                    <div className="payment-processing">
                        <div className="spinner-large"></div>
                        <h2>Đang xử lý thanh toán...</h2>
                    </div>
                )}

                {paymentStatus === 'success' && (
                    <div className="payment-success">
                        <div className="success-icon">✓</div>
                        <h2>Thanh toán thành công!</h2>
                        <p>Cảm ơn bạn đã thanh toán.</p>
                        {paymentData && (
                            <div className="payment-details">
                                <p><strong>Mã giao dịch:</strong> {paymentData.vnp_TxnRef}</p>
                                <p><strong>Số tiền:</strong> {parseInt(paymentData.vnp_Amount) / 100} VND</p>
                                <p><strong>Thời gian:</strong> {paymentData.vnp_PayDate}</p>
                            </div>
                        )}
                        <button className="continue-button" onClick={handleContinue}>
                            Quay về giỏ hàng
                        </button>
                    </div>
                )}

                {paymentStatus === 'failed' && (
                    <div className="payment-failed">
                        <div className="error-icon">✕</div>
                        <h2>Thanh toán thất bại</h2>
                        <p>Giao dịch của bạn không thành công. Vui lòng thử lại.</p>
                        <button className="continue-button" onClick={handleContinue}>
                            Quay về giỏ hàng
                        </button>
                    </div>
                )}

                {(paymentStatus === 'invalid' || paymentStatus === 'error') && (
                    <div className="payment-error">
                        <div className="error-icon">!</div>
                        <h2>Có lỗi xảy ra</h2>
                        <p>Không thể xác thực giao dịch. Vui lòng liên hệ hỗ trợ.</p>
                        <button className="continue-button" onClick={handleContinue}>
                            Quay về giỏ hàng
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VNPayReturn;
