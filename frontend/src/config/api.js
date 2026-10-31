// src/config/api.js
import axios from "axios";

// Base URL configurable via environment or default to localhost
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:9229";

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

// Attach JWT automatically on every request
api.interceptors.request.use(
  (config) => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      config.headers.Authorization = `Bearer ${jwt}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
