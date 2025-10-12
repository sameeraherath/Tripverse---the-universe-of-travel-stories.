import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Create a separate instance for multipart uploads
export const apiMultipart = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // Don't set Content-Type for multipart, let axios set it automatically
});

// Request interceptor for regular API
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Request interceptor for multipart API
apiMultipart.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for regular API
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

// Response interceptor for multipart API
apiMultipart.interceptors.response.use(
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
