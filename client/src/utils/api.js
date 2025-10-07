import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors (e.g., unauthorized, server errors)
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/LoginPage";
    }
    return Promise.reject(error);
  }
);

export default api;
