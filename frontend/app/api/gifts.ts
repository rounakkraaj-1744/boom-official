const API_BASE = "http://localhost:8080/api";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const giftApi = {
  async sendGift(videoId: string, amount: number) {
    const response = await fetch(`${API_BASE}/gifts/${videoId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ amount }),
    });
    return response.json();
  },
}