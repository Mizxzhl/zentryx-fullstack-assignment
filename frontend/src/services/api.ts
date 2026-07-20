import axios from "axios";

// Axios instance for all API requests
const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default api;