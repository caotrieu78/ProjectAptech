import axios from 'axios';
import environments from '../constants/environments';

const API_BASE_URL = environments.apiBaseUrl;

const getAuthHeader = () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const OrderService = {
    // 📌 Lấy danh sách đơn hàng của người dùng hiện tại
    getAll: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/orders`, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            console.error('❌ Lỗi lấy danh sách đơn hàng:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể tải đơn hàng');
        }
    },

    // 📌 Lấy chi tiết đơn hàng theo ID
    getById: async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/orders/${id}`, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            console.error(`❌ Lỗi lấy đơn hàng ID ${id}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể lấy chi tiết đơn hàng');
        }
    },

    // 📌 Tạo mới đơn hàng
    create: async (orderData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/orders`, orderData, {
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader(),
                },
            });
            return response.data;
        } catch (error) {
            console.error('❌ Lỗi đặt hàng:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể đặt hàng');
        }
    },

    // ✅ Lấy danh sách tất cả đơn hàng (chỉ Admin)
    getAllForAdmin: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/orders`, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            console.error('❌ Lỗi lấy danh sách đơn hàng cho admin:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể tải danh sách đơn hàng (Admin)');
        }
    },

    // ✅ Cập nhật đơn hàng (Admin)
    update: async (orderId, updateData) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/orders/${orderId}`, updateData, {
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader(),
                },
            });
            return response.data;
        } catch (error) {
            console.error(`❌ Lỗi cập nhật đơn hàng ${orderId}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể cập nhật đơn hàng');
        }
    },

    // ✅ Xoá đơn hàng (Admin)
    remove: async (orderId) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/orders/${orderId}`, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            console.error(`❌ Lỗi xoá đơn hàng ${orderId}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể xoá đơn hàng');
        }
    },
};

export default OrderService;
