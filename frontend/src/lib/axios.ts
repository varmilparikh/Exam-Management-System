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

export default api;
