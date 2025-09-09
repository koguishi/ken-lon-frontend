import axios from "axios";

// cria a instância do axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// INTERCEPTOR DE REQUEST → adiciona o token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // pega direto do localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// INTERCEPTOR DE RESPONSE → trata erros globais (ex: 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Não autorizado, redirecionando para login...");
      localStorage.removeItem("token"); // limpa token inválido
      window.location.href = "/login"; // manda usuário pro login
    }
    return Promise.reject(error);
  }
);

export default api;
