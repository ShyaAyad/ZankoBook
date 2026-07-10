import axios from "axios";
import { useUserStore } from "@/store/userStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Automatically attach token on each request
api.interceptors.request.use(
  (config) => {
    const token = useUserStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Catch 401 (token expired or invalid) and redirect to login
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const token = useUserStore.getState().token;
      const clearAuth = useUserStore.getState().clearAuth;

      // only react if we had tha token but it was no longer valid
      if (token) {
        clearAuth();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
