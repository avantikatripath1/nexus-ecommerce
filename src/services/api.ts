import axios from "axios";

const api = axios.create({
  baseURL: "https://nexus-ecommerce-2.onrender.com",
});

api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;