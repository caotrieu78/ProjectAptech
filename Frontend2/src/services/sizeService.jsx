import axios from "axios";
import environments from "../constants/environments";

const API_BASE_URL = environments.apiBaseUrl;

const getAuthHeader = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const SizeService = {
  // ✅ Get all sizes
  getAll: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/sizes`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error(
        "❌ Error fetching size list:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Unable to fetch size list"
      );
    }
  },

  // ✅ Get size details by ID
  getById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/sizes/${id}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error(
        `❌ Error fetching size ID ${id}:`,
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Unable to fetch size details"
      );
    }
  },

  // ✅ Create new size
  create: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/sizes`, data, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader()
        }
      });
      return response.data;
    } catch (error) {
      console.error(
        "❌ Error creating size:",
        error.response?.data || error.message
      );
      throw new Error(error.response?.data?.message || "Unable to create size");
    }
  },

  // ✅ Update size
  update: async (id, data) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/sizes/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader()
        }
      });
      return response.data;
    } catch (error) {
      console.error(
        `❌ Error updating size ID ${id}:`,
        error.response?.data || error.message
      );
      throw new Error(error.response?.data?.message || "Unable to update size");
    }
  },

  // ✅ Delete size
  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/sizes/${id}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error(
        `❌ Error deleting size ID ${id}:`,
        error.response?.data || error.message
      );
      throw new Error(error.response?.data?.message || "Unable to delete size");
    }
  }
};

export default SizeService;
