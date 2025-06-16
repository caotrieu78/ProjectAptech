import axios from 'axios';
import environments from '../constants/environments';

const API_BASE_URL = environments.apiBaseUrl;

// ✅ Lấy token từ localStorage nếu có
const getAuthHeader = () => {
    const token = localStorage.getItem("access_token"); // hoặc key bạn đang dùng
    if (token) {
        return {
            "Authorization": `Bearer ${token}`,
        };
    }
    return {};
};

const CategoryService = {
    // Lấy tất cả loại sản phẩm
    getAll: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/categories`, {
                headers: {
                    Accept: 'application/json',
                    ...getAuthHeader(),
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw new Error('Unable to fetch categories');
        }
    },

    // Lấy loại sản phẩm theo ID
    getById: async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/categories/${id}`, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching category with ID ${id}:`, error);
            throw new Error('Unable to fetch category');
        }
    },

    // Thêm mới loại sản phẩm
    create: async (data) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/categories`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader(),
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error creating category:', error);
            throw new Error('Unable to create category');
        }
    },

    // Cập nhật loại sản phẩm
    update: async (id, data) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/categories/${id}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader(),
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error updating category with ID ${id}:`, error);
            throw new Error('Unable to update category');
        }
    },

    // Xoá loại sản phẩm
    delete: async (id) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/categories/${id}`, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            console.error(`Error deleting category with ID ${id}:`, error);
            throw new Error('Unable to delete category');
        }
    },
};

export default CategoryService;
