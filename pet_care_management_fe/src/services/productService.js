import axios from 'axios';

const API_BASE = '/api/product';

function getAuthHeaders() {
    const accessToken = localStorage.getItem('accessToken');
    return accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {};
}

export const getAllProducts = () => axios.get(`${API_BASE}/getAllProduct`, getAuthHeaders());
export const getProductPagination = (pageNo, pageSize = 5) => axios.get(`${API_BASE}/getProducts`, { params: { pageNo, pageSize }, ...getAuthHeaders() });
export const getProductById = (id) => axios.get(`${API_BASE}/getProductById/${id}`, getAuthHeaders());
export const getProductByKeyword = (keyword) => axios.get(`${API_BASE}/getProductByKeyword/${keyword}`, getAuthHeaders());
export const createProduct = (formData) => axios.post(`${API_BASE}/createProduct`, formData, getAuthHeaders());
export const updateProduct = (id, formData) => axios.post(`${API_BASE}/update/${id}`, formData, getAuthHeaders());
export const deleteProduct = (id) => axios.post(`${API_BASE}/delete/${id}`, {}, getAuthHeaders());
