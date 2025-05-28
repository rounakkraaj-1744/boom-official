const API_BASE = "http://localhost:8080/api"

export const authApi = {
  async register(userData: { username: string; email: string; password: string }) {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
    return response.json()
  },

  async login(credentials: { email: string; password: string }) {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    })
    return response.json()
  },

  async getMe() {
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.json()
  },

  async logout() {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` 
      },
    });
    return response.json();
  },
}