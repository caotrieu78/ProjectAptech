import axios from "axios";
import environments from "../constants/environments";

const API_BASE_URL = environments.apiBaseUrl;

const getAuthHeader = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const FeedbackService = {
  // 📌 User submits feedback (public - no token required)
  create: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/feedback`, data, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      return response.data;
    } catch (error) {
      console.error(
        "❌ Error submitting feedback:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Unable to submit feedback"
      );
    }
  },

  // 📌 Admin: view all feedback
  getAll: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/feedback`, {
        headers: {
          ...getAuthHeader(),
          Accept: "application/json"
        }
      });
      return response.data;
    } catch (error) {
      console.error(
        "❌ Error loading feedback list:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Unable to load feedback"
      );
    }
  },

  // 📌 Admin: view feedback details
  getById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/feedback/${id}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error(
        `❌ Error fetching feedback ID ${id}:`,
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Unable to fetch feedback details"
      );
    }
  },

  // 📌 Admin: delete feedback
  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/feedback/${id}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error(
        `❌ Error deleting feedback ID ${id}:`,
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Unable to delete feedback"
      );
    }
  }
};

export default FeedbackService;
