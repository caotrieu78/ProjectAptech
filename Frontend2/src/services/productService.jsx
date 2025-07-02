import axios from "axios";
import environments from "../constants/environments";

const API_BASE_URL = environments.apiBaseUrl;

const getAuthHeader = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const ProductService = {
  // ✅ Get product list (public)
  getAll: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`, {
        headers: {
          Accept: "application/json"
        }
      });
      return response.data;
    } catch (error) {
      console.error(
        " Error fetching product list:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Unable to fetch product list"
      );
    }
  },

  // ✅ Get product details by ProductID (public)
  getById: async (productId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error(
        ` Error fetching product ID ${productId}:`,
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Unable to fetch product details"
      );
    }
  },

  // ✅ Create new product (admin)
  create: async (productData) => {
    try {
      const isFormData = productData instanceof FormData;

      const response = await axios.post(
        `${API_BASE_URL}/products`,
        productData,
        {
          headers: {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            ...getAuthHeader()
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        " Error creating product:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Unable to create product"
      );
    }
  },

  // ✅ Update product (admin)
  update: async (productId, productData) => {
    try {
      const isFormData = productData instanceof FormData;

      const response = await axios.post(
        `${API_BASE_URL}/products/${productId}?_method=PUT`,
        productData,
        {
          headers: {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            ...getAuthHeader()
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        ` Error updating product ID ${productId}:`,
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Unable to update product"
      );
    }
  },

  // ✅ Delete product (admin)
  delete: async (productId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/products/${productId}`,
        {
          headers: getAuthHeader()
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        ` Error deleting product ID ${productId}:`,
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Unable to delete product"
      );
    }
  }
};

export default ProductService;
