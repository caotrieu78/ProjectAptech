import axios from "axios";
import environments from '../constants/environments';

const API_BASE_URL = environments.apiBaseUrl; // Cập nhật đúng địa chỉ API nếu khác

// Đăng ký
export const register = async (formData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/register`, formData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Đăng ký thất bại!" };
    }
};

// Đăng nhập
export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, {
            Username: username,
            Password: password
        });

        const { access_token, user } = response.data;
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("user", JSON.stringify(user));

        return user;
    } catch (error) {
        throw error.response?.data || { message: "Đăng nhập thất bại!" };
    }
};

// Lấy thông tin người dùng hiện tại
export const getUser = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};

// Đăng xuất
export const logout = async () => {
    const token = localStorage.getItem("access_token");

    try {
        await axios.post(`${API_BASE_URL}/logout`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (_) { }

    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
};
