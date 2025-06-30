import axios from 'axios';
import environments from '../constants/environments';

const API_BASE_URL = environments.apiBaseUrl;

const getAuthHeader = () => {
    const token = localStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const StatisticsService = {
    // ✅ Tổng quan thống kê (có thể lọc theo tháng/năm)
    getOverview: async (params = {}) => {
        const res = await axios.get(`${API_BASE_URL}/admin/statistics/overview`, {
            headers: {
                Accept: 'application/json',
                ...getAuthHeader(),
            },
            params,
        });
        return res.data;
    },

    // ✅ Thống kê theo tháng (doanh thu, số đơn hàng)
    getMonthly: async (year) => {
        const res = await axios.get(`${API_BASE_URL}/admin/statistics/monthly`, {
            headers: {
                Accept: 'application/json',
                ...getAuthHeader(),
            },
            params: year ? { year } : {},
        });
        return res.data;
    },

    // ✅ Top sản phẩm bán chạy
    getTopProducts: async (limit = 5) => {
        const res = await axios.get(`${API_BASE_URL}/admin/statistics/top-products`, {
            headers: {
                Accept: 'application/json',
                ...getAuthHeader(),
            },
            params: { limit },
        });
        return res.data;
    },

    // ✅ Top khách hàng chi tiêu nhiều nhất
    getTopCustomers: async (limit = 5) => {
        const res = await axios.get(`${API_BASE_URL}/admin/statistics/top-customers`, {
            headers: {
                Accept: 'application/json',
                ...getAuthHeader(),
            },
            params: { limit },
        });
        return res.data;
    },
};

export default StatisticsService;
