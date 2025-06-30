import axios from "axios";
import environments from "../constants/environments";

const API_BASE_URL = environments.apiBaseUrl;

const getAuthHeader = () => {
    const token = localStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const CartService = {
    // Lấy giỏ hàng của người dùng
    getAll: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/cart`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi lấy giỏ hàng:", error.response?.data || error.message);
            throw new Error(
                error.response?.data?.message || "Không thể lấy giỏ hàng"
            );
        }
    },

    // Thêm sản phẩm vào giỏ hàng
    addItem: async (variantId, quantity) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/cart`,
                {
                    VariantID: variantId,
                    Quantity: quantity
                },
                {
                    headers: getAuthHeader()
                }
            );
            return response.data;
        } catch (error) {
            console.error(
                "Lỗi thêm vào giỏ hàng:",
                error.response?.data || error.message
            );
            throw new Error(
                error.response?.data?.message || "Không thể thêm sản phẩm vào giỏ hàng"
            );
        }
    },
    // Cập nhật số lượng sản phẩm trong giỏ hàng
    updateItem: async (variantId, quantity) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/cart`,
                {
                    VariantID: variantId,
                    Quantity: quantity
                },
                {
                    headers: getAuthHeader()
                }
            );
            return response.data;
        } catch (error) {
            console.error(
                "Lỗi cập nhật giỏ hàng:",
                error.response?.data || error.message
            );
            throw new Error(
                error.response?.data?.message || "Không thể cập nhật giỏ hàng"
            );
        }
    },
    // Xoá 1 sản phẩm khỏi giỏ hàng
    removeItem: async (variantId) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/cart`, {
                headers: getAuthHeader(),
                data: { VariantID: variantId } // DELETE body
            });
            return response.data;
        } catch (error) {
            console.error(
                "Lỗi xoá sản phẩm khỏi giỏ hàng:",
                error.response?.data || error.message
            );
            throw new Error(
                error.response?.data?.message || "Không thể xoá sản phẩm khỏi giỏ hàng"
            );
        }
    },

    // ✅ Xoá toàn bộ giỏ hàng
    clearCart: async () => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/cart/clear`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error(
                "Lỗi xoá toàn bộ giỏ hàng:",
                error.response?.data || error.message
            );
            throw new Error(
                error.response?.data?.message || "Không thể xoá toàn bộ giỏ hàng"
            );
        }
    }
};

export default CartService;
