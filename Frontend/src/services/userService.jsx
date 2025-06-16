import axios from 'axios';
import environments from '../constants/environments';

const API_BASE_URL = environments.apiBaseUrl;

const getAuthHeader = () => {
    const token = localStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const UserService = {

    getAll: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/users`, {
                headers: {
                    Accept: 'application/json',
                    ...getAuthHeader(),
                },
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi lấy danh sách người dùng:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể lấy danh sách người dùng');
        }
    },

    getById: async (userId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            console.error(`Lỗi lấy người dùng ID ${userId}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể lấy thông tin người dùng');
        }
    },

    update: async (userId, userData) => {
        try {
            const isFormData = userData instanceof FormData;

            const response = await axios.post(`${API_BASE_URL}/users/${userId}?_method=PUT`, userData, {
                headers: {
                    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
                    ...getAuthHeader(),
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Lỗi cập nhật người dùng ID ${userId}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể cập nhật người dùng');
        }
    },

    delete: async (userId) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/users/${userId}`, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            console.error(`❌ Lỗi xoá người dùng ID ${userId}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể xoá người dùng');
        }
    },

    updateSelf: async (userData) => {
        try {
            const isFormData = userData instanceof FormData;

            const response = await axios.post(`${API_BASE_URL}/users/update-self?_method=PUT`, userData, {
                headers: {
                    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
                    ...getAuthHeader(),
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Lỗi cập nhật hồ sơ cá nhân:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể cập nhật hồ sơ');
        }
    },
};

export default UserService;
