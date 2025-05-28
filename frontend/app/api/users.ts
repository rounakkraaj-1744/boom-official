const API_BASE = "http://localhost:8080/api";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const userApi = {
  async getProfile() {
    const response = await fetch(`${API_BASE}/user/profile`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  async getUserVideos() {
    const response = await fetch(`${API_BASE}/user/videos`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  async getTransactions() {
    const response = await fetch(`${API_BASE}/user/transactions`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },
}