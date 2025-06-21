import axios from 'axios';
import environments from '../constants/environments';

const API_BASE_URL = environments.apiBaseUrl;

const getAuthHeader = () => {
    const token = localStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const ProductService = {
    // ✅ Lấy danh sách sản phẩm (public)
    getAll: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/products`, {
                headers: {
                    Accept: 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error(' Lỗi lấy danh sách sản phẩm:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể lấy danh sách sản phẩm');
        }
    },

    // ✅ Lấy chi tiết theo ProductID (public)
    getById: async (productId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/products/${productId}`);
            return response.data;
        } catch (error) {
            console.error(` Lỗi lấy sản phẩm ID ${productId}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể lấy thông tin sản phẩm');
        }
    },

    // ✅ Tạo sản phẩm mới (admin)
    create: async (productData) => {
        try {
            const isFormData = productData instanceof FormData;

            const response = await axios.post(`${API_BASE_URL}/products`, productData, {
                headers: {
                    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
                    ...getAuthHeader(),
                },
            });
            return response.data;
        } catch (error) {
            console.error(' Lỗi tạo sản phẩm:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể tạo sản phẩm');
        }
    },

    // ✅ Cập nhật sản phẩm (admin)
    update: async (productId, productData) => {
        try {
            const isFormData = productData instanceof FormData;

            const response = await axios.post(`${API_BASE_URL}/products/${productId}?_method=PUT`, productData, {
                headers: {
                    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
                    ...getAuthHeader(),
                },
            });
            return response.data;
        } catch (error) {
            console.error(` Lỗi cập nhật sản phẩm ID ${productId}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể cập nhật sản phẩm');
        }
    },

    // ✅ Xoá sản phẩm (admin)
    delete: async (productId) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/products/${productId}`, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            console.error(` Lỗi xoá sản phẩm ID ${productId}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể xoá sản phẩm');
        }
    },
};

export default ProductService;
