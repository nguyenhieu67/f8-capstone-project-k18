import axios from "axios";

import env from "@/config/environment";

const baseURL = env.API_ROOT;
const api = axios.create({
  baseURL: baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

let refreshTokenPromise: Promise<void> | null = null;

api.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response.data.data,
  async (error) => {
    const originalRequest = error.config;

    const isTokenExpired =
      error.response?.status === 401 ||
      error.response?.data?.message === "Need to refresh token!";

    if (isTokenExpired && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (!refreshTokenPromise) {
          refreshTokenPromise = axios
            .post(
              `${baseURL}/auth/refresh-token`,
              {},
              { withCredentials: true },
            )
            .then(() => undefined)
            .finally(() => {
              refreshTokenPromise = null;
            });
        }

        await refreshTokenPromise;
        return api(originalRequest);
      } catch (refreshError) {
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
