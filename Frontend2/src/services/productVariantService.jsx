import axios from "axios";
import environments from "../constants/environments";

const API_BASE_URL = environments.apiBaseUrl;

const getAuthHeader = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const ProductVariantService = {
  // ✅ Get all product variants
  getAll: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/product-variants`);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Error fetching variant list:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Unable to fetch variant list"
      );
    }
  },

  // ✅ Get variant details by VariantID
  getById: async (variantId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/product-variants/${variantId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `❌ Error fetching variant ID ${variantId}:`,
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Unable to fetch variant details"
      );
    }
  },

  // ✅ Create new product variant
  create: async (formData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/product-variants`,
        formData,
        {
          headers: {
            ...getAuthHeader()
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "❌ Error creating variant:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Unable to create variant"
      );
    }
  },

  // ✅ Update product variant
  update: async (variantId, formData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/product-variants/${variantId}?_method=PUT`,
        formData,
        {
          headers: {
            ...getAuthHeader()
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        `❌ Error updating variant ID ${variantId}:`,
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Unable to update variant"
      );
    }
  },

  // ✅ Delete product variant
  delete: async (variantId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/product-variants/${variantId}`,
        {
          headers: getAuthHeader()
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        `❌ Error deleting variant ID ${variantId}:`,
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Unable to delete variant"
      );
    }
  }
};

export default ProductVariantService;
