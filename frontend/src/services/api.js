// This file sets up an Axios instance for making API requests to the backend server. It uses an environment variable to determine the base URL for the API, allowing for flexibility between development and production environments. The instance is configured to send JSON data by default.
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
