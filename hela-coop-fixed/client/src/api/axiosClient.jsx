import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Expired / invalid token -> clear the session and go back to the landing page.
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginCall = error.config?.url?.includes("/auth/login");
    if (error.response?.status === 401 && !isLoginCall && localStorage.getItem("accessToken")) {
      ["accessToken", "refreshToken", "role", "isAdmin"].forEach((k) => localStorage.removeItem(k));
      window.location.assign("/");
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
