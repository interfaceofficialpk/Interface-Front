import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://localhost:8080/api",
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403) {
      window.location.href = "/dashboard/forbidden";
      return Promise.reject(error);
    }

    // If it's a 401 and not the refresh token request itself
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If a refresh is already in progress, queue the original request
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true; // Mark this request as retried
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        // No refresh token available, redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/auth/login";
        return Promise.reject(error);
      }

      try {
        // Attempt to get a new access token using the refresh token
        const response = await axios.post(
          `${api.defaults.baseURL}/v1/auth/refresh-token`, // Ensure this matches your backend endpoint
          { refreshToken: refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        // Update the authorization header for the original failed request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        isRefreshing = false;
        processQueue(null, accessToken); // Resolve all queued requests with the new token

        // Retry the original request with the new access token
        return axios(originalRequest);
      } catch (refreshError) {
        // Refresh token failed (e.g., refresh token expired or invalid)
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/auth/session-expired";
        isRefreshing = false;
        processQueue(refreshError); // Reject all queued requests
        return Promise.reject(refreshError);
      }
    }

    // For any other error, or if 401 is from the refresh token request itself (after initial _retry)
    return Promise.reject(error);
  }
);

export default api;
