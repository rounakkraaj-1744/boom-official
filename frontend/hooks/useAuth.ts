"use client"
import { useState, useEffect, SetStateAction } from "react"
import { authApi } from "../app/api/auth"

interface User {
  id: string
  username: string
  email: string
  walletBalance: number
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      authApi.getMe().then((data: { success: any; user: SetStateAction<User | null> }) => {
          if (data.success)
            setUser(data.user)
          else {
            localStorage.removeItem("token");
            setUser(null);
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
          setInitialized(true);
        })
    }
    else {
      setLoading(false);
      setInitialized(true);
    }
  }, [])

  const login = async (token: string, userData: User) => {
    localStorage.setItem("token", token);
    setUser(userData);
    setLoading(false);
  }

  const logout = async () => {
    try {
      await authApi.logout();
    }
    catch (error) {
      console.error("Logout error:", error);
    }
    finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  }
  return { user, loading, initialized, login, logout, setUser };
}