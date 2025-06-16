import axios from 'axios';
import environments from '../constants/environments';

const API_BASE_URL = environments.apiBaseUrl;

const getAuthHeader = () => {
    const token = localStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const ColorService = {
    getAll: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/colors`, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            console.error('❌ Lỗi lấy danh sách màu sắc:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể lấy danh sách màu sắc');
        }
    },

    getById: async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/colors/${id}`, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            console.error(`❌ Lỗi lấy màu ID ${id}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể lấy thông tin màu sắc');
        }
    },

    create: async (data) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/colors`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader(),
                },
            });
            return response.data;
        } catch (error) {
            console.error('❌ Lỗi tạo màu sắc:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể tạo màu sắc');
        }
    },


    update: async (id, data) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/colors/${id}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader(),
                },
            });
            return response.data;
        } catch (error) {
            console.error(`❌ Lỗi cập nhật màu ID ${id}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể cập nhật màu sắc');
        }
    },


    delete: async (id) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/colors/${id}`, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            console.error(`❌ Lỗi xoá màu ID ${id}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể xoá màu sắc');
        }
    },
};

export default ColorService;
