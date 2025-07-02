import axios from "axios";
import environments from "../constants/environments";

const API_BASE_URL = environments.apiBaseUrl;

const getAuthHeader = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const ColorService = {
  // Fetch all colors
  getAll: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/colors`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error(
        "❌ Error fetching color list:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Unable to fetch color list"
      );
    }
  },

  // Fetch a color by ID
  getById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/colors/${id}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error(
        `❌ Error fetching color ID ${id}:`,
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Unable to fetch color details"
      );
    }
  },

  // Create a new color
  create: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/colors`, data, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader()
        }
      });
      return response.data;
    } catch (error) {
      console.error(
        "❌ Error creating color:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Unable to create color"
      );
    }
  },

  // Update a color
  update: async (id, data) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/colors/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader()
        }
      });
      return response.data;
    } catch (error) {
      console.error(
        `❌ Error updating color ID ${id}:`,
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Unable to update color"
      );
    }
  },

  // Delete a color
  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/colors/${id}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error(
        `❌ Error deleting color ID ${id}:`,
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Unable to delete color"
      );
    }
  }
};

export default ColorService;
