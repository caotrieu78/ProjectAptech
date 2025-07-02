import axios from "axios";
import environments from "../constants/environments";

const API_BASE_URL = environments.apiBaseUrl;

const getAuthHeader = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const CartService = {
  // Get user's cart
  getAll: async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      return []; // Return empty array if no token
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/cart`, {
        headers: getAuthHeader()
      });
      return response.data || [];
    } catch (error) {
      console.error(
        "Error fetching cart:",
        error.response?.data || error.message
      );
      throw new Error(error.response?.data?.message || "Unable to fetch cart");
    }
  },

  // Add item to cart
  addItem: async (variantId, quantity) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Please log in to add to cart.");
    }

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
        "Error adding to cart:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Unable to add product to cart"
      );
    }
  },

  // Update item quantity in cart
  updateItem: async (variantId, quantity) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Please log in to update cart.");
    }

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
        "Error updating cart:",
        error.response?.data || error.message
      );
      throw new Error(error.response?.data?.message || "Unable to update cart");
    }
  },

  // Remove an item from cart
  removeItem: async (variantId) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Please log in to remove product.");
    }

    try {
      const response = await axios.delete(`${API_BASE_URL}/cart`, {
        headers: getAuthHeader(),
        data: { VariantID: variantId } // DELETE body
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error removing product from cart:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Unable to remove product from cart"
      );
    }
  },

  // Clear entire cart
  clearCart: async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Please log in to clear cart.");
    }

    try {
      const response = await axios.delete(`${API_BASE_URL}/cart/clear`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error clearing entire cart:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Unable to clear entire cart"
      );
    }
  }
};

export default CartService;
