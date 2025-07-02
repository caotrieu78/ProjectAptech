import axios from "axios";
import environments from "../constants/environments";

const API_BASE_URL = environments.apiBaseUrl;

const getAuthHeader = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const BranchService = {
  // Fetch all branches
  getAll: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/branches`, {
        headers: {
          Accept: "application/json"
        }
      });
      return response.data;
    } catch (error) {
      console.error(
        "❌ Error fetching branch list:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Unable to fetch branch list"
      );
    }
  },

  // Fetch a branch by ID
  getById: async (branchId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/branches/${branchId}`,
        {}
      );
      return response.data;
    } catch (error) {
      console.error(
        `❌ Error fetching branch ID ${branchId}:`,
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Unable to fetch branch details"
      );
    }
  },

  // Create a new branch
  create: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/branches`, data, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader()
        }
      });
      return response.data;
    } catch (error) {
      console.error(
        "❌ Error creating branch:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Unable to create branch"
      );
    }
  },

  // Update a branch
  update: async (branchId, data) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/branches/${branchId}`,
        data,
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
        `❌ Error updating branch ID ${branchId}:`,
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Unable to update branch"
      );
    }
  },

  // Delete a branch
  delete: async (branchId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/branches/${branchId}`,
        {
          headers: getAuthHeader()
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        `❌ Error deleting branch ID ${branchId}:`,
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Unable to delete branch"
      );
    }
  }
};

export default BranchService;
