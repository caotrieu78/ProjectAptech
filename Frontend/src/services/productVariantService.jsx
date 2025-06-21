import axios from 'axios';
import environments from '../constants/environments';

const API_BASE_URL = environments.apiBaseUrl;

const getAuthHeader = () => {
    const token = localStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const ProductVariantService = {

    getAll: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/product-variants`);
            return response.data;
        } catch (error) {
            console.error('❌ Lỗi lấy danh sách biến thể:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể lấy danh sách biến thể');
        }
    },


    getById: async (variantId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/product-variants/${variantId}`);
            return response.data;
        } catch (error) {
            console.error(`❌ Lỗi lấy biến thể ID ${variantId}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể lấy thông tin biến thể');
        }
    },


    create: async (formData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/product-variants`, formData, {
                headers: {
                    ...getAuthHeader(),
                },
            });
            return response.data;
        } catch (error) {
            console.error('❌ Lỗi tạo biến thể:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể tạo biến thể');
        }
    },


    update: async (variantId, formData) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/product-variants/${variantId}?_method=PUT`,
                formData,
                {
                    headers: {
                        ...getAuthHeader(),
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error(`❌ Lỗi cập nhật biến thể ID ${variantId}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể cập nhật biến thể');
        }
    },

    delete: async (variantId) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/product-variants/${variantId}`, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            console.error(`❌ Lỗi xoá biến thể ID ${variantId}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể xoá biến thể');
        }
    },
};

export default ProductVariantService;
