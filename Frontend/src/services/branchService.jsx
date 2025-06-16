import axios from 'axios';
import environments from '../constants/environments';

const API_BASE_URL = environments.apiBaseUrl;

const getAuthHeader = () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const BranchService = {
    // 📌 Lấy danh sách chi nhánh
    getAll: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/branches`, {
                headers: {
                    Accept: 'application/json',
                    ...getAuthHeader(),
                },
            });
            return response.data;
        } catch (error) {
            console.error('❌ Lỗi lấy danh sách chi nhánh:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể tải danh sách chi nhánh');
        }
    },

    // 📌 Lấy chi tiết chi nhánh theo ID
    getById: async (branchId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/branches/${branchId}`, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            console.error(`❌ Lỗi lấy chi nhánh ID ${branchId}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể lấy chi tiết chi nhánh');
        }
    },

    // 📌 Tạo mới chi nhánh (admin)
    create: async (data) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/branches`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader(),
                },
            });
            return response.data;
        } catch (error) {
            console.error('❌ Lỗi tạo chi nhánh:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể tạo chi nhánh');
        }
    },

    // 📌 Cập nhật chi nhánh (admin)
    update: async (branchId, data) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/branches/${branchId}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader(),
                },
            });
            return response.data;
        } catch (error) {
            console.error(`❌ Lỗi cập nhật chi nhánh ID ${branchId}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể cập nhật chi nhánh');
        }
    },

    // 📌 Xoá chi nhánh (admin)
    delete: async (branchId) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/branches/${branchId}`, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            console.error(`❌ Lỗi xoá chi nhánh ID ${branchId}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể xoá chi nhánh');
        }
    },
};

export default BranchService;
