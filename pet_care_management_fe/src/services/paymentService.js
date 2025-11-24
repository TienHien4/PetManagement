import customizeAxios from "./customizeAxios";

const paymentService = {
    // Tạo thanh toán VNPay
    createPayment: async (orderId) => {
        try {
            const response = await customizeAxios.get(`/api/payment/pay`, {
                params: { orderId }
            });
            return response.data; // URL thanh toán từ VNPay
        } catch (error) {
            console.error('Error creating payment:', error);
            throw error;
        }
    },

    // Xử lý callback từ VNPay
    handleVNPayReturn: async (params) => {
        try {
            const response = await customizeAxios.get('/api/payment/vnpay-return', {
                params: params
            });
            return response.data;
        } catch (error) {
            console.error('Error handling VNPay return:', error);
            throw error;
        }
    }
};

export default paymentService;
