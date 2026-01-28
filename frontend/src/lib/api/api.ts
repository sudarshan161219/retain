import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  // CRITICAL: This tells the browser to include the 'jwt' cookie in requests
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Global Error Handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 (Unauthorized), it means the cookie is expired or missing.
    // React Query will handle the UI state (redirect to login), 
    // but we can log it here for debugging.
    if (error.response?.status === 401) {
      console.debug("Session expired or unauthorized.");
    }
    return Promise.reject(error);
  }
);

export default api;