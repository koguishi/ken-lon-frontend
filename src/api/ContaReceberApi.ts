import api from "./apiClient";

const url = `${import.meta.env.VITE_API_URL}/contasreceber`;

export const ContaReceberApi = {
    getAll: (recebido?: boolean, page: number = 1, pageSize: number = 10, search?: string) =>
        api.get(url, {
            params: { recebido, page, pageSize, search }
        }
    ),
    getById: (id: string) => api.get(`${url}/${id}`),
    getByPessoaId: (
        pessoaId: string,
        vencimentoInicial: string | undefined = undefined,
        vencimentoFinal: string | undefined = undefined,
        recebido: boolean | undefined = undefined,
    ) => {
        const params: Record<string, any> = {};
        if (vencimentoInicial) params.vencimentoInicial = vencimentoInicial;
        if (vencimentoFinal) params.vencimentoFinal = vencimentoFinal;
        if (recebido !== undefined) params.recebido = recebido;
        return api.get(`${url}/by-pessoa/${pessoaId}`, { params });
    },
    create: (data: any) => api.post(url, data),
    update: (id: string, data: any) => api.put(`${url}/${id}`, data),
    remove: (id: string) => api.delete(`${url}/${id}`),
    registrarRecebimento: (id: string, data: any) => api.patch(`${url}/registrar-recebimento/${id}`, data),
    EstornarRecebimento: (id: string, data: any) => api.patch(`${url}/estornar-recebimento/${id}`, data),
};
