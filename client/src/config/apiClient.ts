import { useAuthStore } from "@/store/authStore";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const original = error.config as any
    const isAuthRoute = original?.url?.includes("/auth/")

    if (error.response?.status === 401 && !original._retry && !isAuthRoute) {
      original._retry = true;
      try {
        await api.get("/auth/refresh")
        return api(original);
      } catch {
        useAuthStore.getState().clearUser()
        window.location.href = "/login"
      }
    }

    return Promise.reject(error)
  }
)

export default api
