import axios from 'axios';
import environments from '../constants/environments';

const API_BASE_URL = environments.apiBaseUrl;

// ✅ Lấy token từ localStorage nếu có
const getAuthHeader = () => {
    const token = localStorage.getItem("access_token");
    if (token) {
        return {
            "Authorization": `Bearer ${token}`,
        };
    }
    return {};
};

const StatisticsService = {
    // ✅ Lấy toàn bộ dữ liệu thống kê cho admin
    getAll: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/statistics`, {
                headers: {
                    Accept: 'application/json',
                    ...getAuthHeader(),
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching statistics:', error);
            throw new Error('Unable to fetch statistics');
        }
    },
};

export default StatisticsService;
