import api from "./apiClient";

const url = `${import.meta.env.VITE_API_URL}/auth`;

export const AuthApi = {
    trocarSenha: (data: any) => api.put(`${url}/trocar-senha`, data),
};
