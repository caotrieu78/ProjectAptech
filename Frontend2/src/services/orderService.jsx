import axios from "axios";
import environments from "../constants/environments";

const API_BASE_URL = environments.apiBaseUrl;

const getAuthHeader = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const OrderService = {
  // 📌 Get current user's order list
  getAll: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error(
        "❌ Error fetching order list:",
        error.response?.data || error.message
      );
      throw new Error(error.response?.data?.message || "Unable to load orders");
    }
  },

  // 📌 Get order details by ID
  getById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders/${id}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error(
        `❌ Error fetching order ID ${id}:`,
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Unable to fetch order details"
      );
    }
  },

  // 📌 Create new order
  create: async (orderData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/orders`, orderData, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader()
        }
      });
      return response.data;
    } catch (error) {
      console.error(
        "❌ Error placing order:",
        error.response?.data || error.message
      );
      throw new Error(error.response?.data?.message || "Unable to place order");
    }
  },

  // ✅ Get all orders list (Admin only)
  getAllForAdmin: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/orders`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error(
        "❌ Error fetching order list for admin:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Unable to load order list (Admin)"
      );
    }
  },

  // ✅ Update order (Admin)
  update: async (orderId, updateData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/orders/${orderId}`,
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader()
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        `❌ Error updating order ${orderId}:`,
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Unable to update order"
      );
    }
  },

  // ✅ Delete order (Admin)
  remove: async (orderId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/orders/${orderId}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error(
        `❌ Error deleting order ${orderId}:`,
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Unable to delete order"
      );
    }
  }
};

export default OrderService;
