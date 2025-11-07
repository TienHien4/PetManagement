import apiClient from './customizeAxios';

const API_BASE = '/api/product';

export const getAllProducts = () => apiClient.get(`${API_BASE}/getAllProduct`);
export const getProductPagination = (pageNo, pageSize = 5) => apiClient.get(`${API_BASE}/getProducts`, { params: { pageNo, pageSize } });
export const getProductById = (id) => apiClient.get(`${API_BASE}/getProductById/${id}`);
export const getProductByKeyword = (keyword) => apiClient.get(`${API_BASE}/getProductByKeyword/${keyword}`);
export const createProduct = (formData) => {
    return apiClient.post(`${API_BASE}/createProduct`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};
export const updateProduct = (id, formData) => {
    return apiClient.post(`${API_BASE}/update/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};
export const deleteProduct = (id) => apiClient.post(`${API_BASE}/delete/${id}`, {});
