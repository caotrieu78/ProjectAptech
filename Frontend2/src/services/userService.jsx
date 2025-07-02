import axios from "axios";
import environments from "../constants/environments";

const API_BASE_URL = environments.apiBaseUrl;

const getAuthHeader = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const UserService = {
  getAll: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`, {
        headers: {
          Accept: "application/json",
          ...getAuthHeader()
        }
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching user list:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Unable to fetch user list"
      );
    }
  },

  getById: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching user ID ${userId}:`,
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Unable to fetch user details"
      );
    }
  },

  update: async (userId, userData) => {
    try {
      const isFormData = userData instanceof FormData;

      const response = await axios.post(
        `${API_BASE_URL}/users/${userId}?_method=PUT`,
        userData,
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
        `Error updating user ID ${userId}:`,
        error.response?.data || error.message
      );
      throw new Error(error.response?.data?.message || "Unable to update user");
    }
  },

  delete: async (userId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/users/${userId}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error(
        `❌ Error deleting user ID ${userId}:`,
        error.response?.data || error.message
      );
      throw new Error(error.response?.data?.message || "Unable to delete user");
    }
  },

  updateSelf: async (userData) => {
    try {
      const isFormData = userData instanceof FormData;

      const response = await axios.post(
        `${API_BASE_URL}/users/update-self?_method=PUT`,
        userData,
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
        "Error updating personal profile:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Unable to update profile"
      );
    }
  }
};

export default UserService;
