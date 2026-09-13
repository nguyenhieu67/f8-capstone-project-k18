import axios from "axios";

import env from "@/config/environment";
import { ROUTE_PATHS } from "@/constants/routePaths";

const baseURL = env.API_ROOT;
const api = axios.create({
  baseURL: baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

let refreshTokenPromise: Promise<void> | null = null;

const SKIP_REFRESH_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh-token",
  "/auth/logout",
];

const SILENT_CHECK_PATHS = ["/auth/me"];

function matchesPath(url: string | undefined, paths: string[]) {
  if (!url) return false;
  return paths.some((path) => url.includes(path));
}

function redirectToLogin() {
  if (window.location.pathname !== ROUTE_PATHS.LOGIN) {
    window.location.href = ROUTE_PATHS.LOGIN;
  }
}

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

    const requestUrl = originalRequest?.url as string | undefined;
    const shouldSkipRefresh = matchesPath(requestUrl, SKIP_REFRESH_PATHS);
    const isSilentCheck = matchesPath(requestUrl, SILENT_CHECK_PATHS);

    if (
      isTokenExpired &&
      !shouldSkipRefresh &&
      originalRequest &&
      !originalRequest._retry
    ) {
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
        if (!isSilentCheck) {
          redirectToLogin();
        }
        return Promise.reject(refreshError);
      }
    }

    const serverMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Đã xảy ra lỗi, vui lòng thử lại!";

    return Promise.reject(new Error(serverMessage));
  },
);

export default api;
