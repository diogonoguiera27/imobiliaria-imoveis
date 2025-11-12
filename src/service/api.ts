import axios, {
  AxiosHeaders,
  type AxiosRequestHeaders,
  type InternalAxiosRequestConfig,
} from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3333",
  withCredentials: false, // JWT via header, não cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔒 Interceptor para incluir token JWT automaticamente
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("@Imobiliaria:token");

  if (token) {
    // ✅ Checa se é instância de AxiosHeaders (versões novas do Axios)
    if (config.headers instanceof AxiosHeaders) {
      config.headers.set("Authorization", `Bearer ${token}`);
    } else {
      // ✅ Fallback tipado sem usar "any"
      const headers = config.headers as AxiosRequestHeaders;
      headers["Authorization"] = `Bearer ${token}`;
      config.headers = headers;
    }
  }

  return config;
});

export default api;
