import axios from 'axios';
import environments from '../constants/environments';

const API_BASE_URL = environments.apiBaseUrl;

const getAuthHeader = () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const FeedbackService = {
    // 📌 Người dùng gửi phản hồi (public - không cần token)
    create: async (data) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/feedback`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error('❌ Lỗi gửi phản hồi:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể gửi phản hồi');
        }
    },

    // 📌 Admin: xem tất cả phản hồi
    getAll: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/feedback`, {
                headers: {
                    ...getAuthHeader(),
                    Accept: 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error('❌ Lỗi tải danh sách phản hồi:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể tải phản hồi');
        }
    },

    // 📌 Admin: xem chi tiết phản hồi
    getById: async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/feedback/${id}`, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            console.error(`❌ Lỗi lấy phản hồi ID ${id}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể lấy thông tin phản hồi');
        }
    },

    // 📌 Admin: xoá phản hồi
    delete: async (id) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/feedback/${id}`, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            console.error(`❌ Lỗi xoá phản hồi ID ${id}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể xoá phản hồi');
        }
    },
};

export default FeedbackService;
