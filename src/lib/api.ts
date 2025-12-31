import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Don't attempt refresh for the refresh endpoint itself
    const requestUrl: string = (originalRequest && originalRequest.url) || "";
    if (requestUrl.includes("/api/refresh/")) return Promise.reject(error);

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/refresh/`,
          {},
          { withCredentials: true }
        );
        return api(originalRequest);
      } catch (refreshError) {
        console.error(
          "Refresh token expired, redirecting to login...",
          refreshError
        );
        // Avoid redirecting repeatedly if already on the login page
        if (window.location.pathname !== "/auth/login") {
          // Use replace to avoid creating extra history entries
          window.location.replace("/auth/login");
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
