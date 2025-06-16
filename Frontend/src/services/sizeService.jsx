import axios from 'axios';
import environments from '../constants/environments';

const API_BASE_URL = environments.apiBaseUrl;

const getAuthHeader = () => {
    const token = localStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const SizeService = {

    getAll: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/sizes`, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            console.error('❌ Lỗi lấy danh sách size:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể lấy danh sách kích cỡ');
        }
    },

    getById: async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/sizes/${id}`, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            console.error(`❌ Lỗi lấy size ID ${id}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể lấy thông tin kích cỡ');
        }
    },


    create: async (data) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/sizes`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader(),
                },
            });
            return response.data;
        } catch (error) {
            console.error('❌ Lỗi tạo size:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể tạo kích cỡ');
        }
    },


    update: async (id, data) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/sizes/${id}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader(),
                },
            });
            return response.data;
        } catch (error) {
            console.error(`❌ Lỗi cập nhật size ID ${id}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể cập nhật kích cỡ');
        }
    },


    delete: async (id) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/sizes/${id}`, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            console.error(`❌ Lỗi xoá size ID ${id}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể xoá kích cỡ');
        }
    },
};

export default SizeService;
