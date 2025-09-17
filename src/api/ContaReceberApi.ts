import api from "./apiClient";

const url = `${import.meta.env.VITE_API_URL}/contasreceber`;

export const ContaReceberApi = {
    getAll: (page: number = 1, pageSize: number = 10, search?: string) =>
        api.get(url, {
            params: { page, pageSize, search }
        }
    ),
    getById: (id: string) => api.get(`${url}/${id}`),
    create: (data: any) => api.post(url, data),
    update: (id: string, data: any) => api.put(`${url}/${id}`, data),
    remove: (id: string) => api.delete(`${url}/${id}`),
};
