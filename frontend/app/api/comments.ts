const API_BASE = "http://localhost:8080/api";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const commentApi = {
  async getComments(videoId: string, page = 1, limit = 20) {
    const response = await fetch(`${API_BASE}/comments/${videoId}?page=${page}&limit=${limit}`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  async addComment(videoId: string, content: string) {
    const response = await fetch(`${API_BASE}/comments/${videoId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ content }),
    });
    return response.json();
  },
}