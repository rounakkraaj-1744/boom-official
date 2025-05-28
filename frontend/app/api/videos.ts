const API_BASE = "http://localhost:8080/api";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const videoApi = {
  async getVideos(page = 1, limit = 10) {
    const response = await fetch(`${API_BASE}/videos?page=${page}&limit=${limit}`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  async searchVideos(params: { q: string; type?: string; price?: string; page?: number; limit?: number }) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value.toString())
    });

    const response = await fetch(`${API_BASE}/videos/search?${searchParams}`, {
      headers: getAuthHeaders(),
    })
    return response.json();
  },

  async getVideoById(id: string) {
    const response = await fetch(`${API_BASE}/videos/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  async uploadVideo(formData: FormData) {
    const response = await fetch(`${API_BASE}/videos/upload`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    });
    return response.json();
  },

  async purchaseVideo(videoId: string) {
    const response = await fetch(`${API_BASE}/videos/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ videoId }),
    });
    return response.json();
  },
}