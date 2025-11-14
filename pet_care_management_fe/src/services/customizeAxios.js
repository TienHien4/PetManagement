import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080", // Đặt baseURL của API
  headers: {
    "Content-Type": "application/json",
  },
});
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error.config;

    // Check if error response exists
    if (!error.response) {
      console.error("Network error or no response:", error);
      return Promise.reject(error);
    }

    console.log("API Error:", error.response.status, error.response.data);

    // Handle 401 Unauthorized - Token expired
    if (error.response.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true; // Prevent infinite retry loop

      const refreshToken = localStorage.getItem("refreshToken");

      // If no refresh token, redirect to login immediately
      if (!refreshToken) {
        console.log("No refresh token found, redirecting to login...");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        console.log("Attempting to refresh token...");
        const result = await axios.post("http://localhost:8080/refreshToken", {
          token: localStorage.getItem("accessToken"),
          refreshToken: refreshToken
        });

        console.log("Token refreshed successfully");
        const newAccessToken = result.data.token;
        localStorage.setItem("accessToken", newAccessToken);

        // Update authorization header and retry original request
        originalConfig.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return apiClient(originalConfig);

      } catch (refreshError) {
        // Refresh token failed - clear storage and redirect to login
        console.error("Refresh token failed:", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden - Invalid credentials or permissions
    if (error.response.status === 403) {
      console.log("403 Forbidden - Clearing session and redirecting to login");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default apiClient;