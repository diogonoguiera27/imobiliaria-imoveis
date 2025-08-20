// src/service/api.ts
import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3333",
});

// Injeta Authorization: Bearer <token> em TODA request (sem any)
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("@Imobiliaria:token");
  if (!token) return config;

  // Normaliza para AxiosHeaders e seta o Authorization
  const headers = AxiosHeaders.from(config.headers);
  headers.set("Authorization", `Bearer ${token}`);
  config.headers = headers;

  return config;
});

export default api;
