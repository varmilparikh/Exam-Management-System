import axios from "axios";
import env from "@/lib/env";

const api = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't treat "not logged in" as an application error
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      error.config?.url === "/auth/me"
    ) {
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export default api;
