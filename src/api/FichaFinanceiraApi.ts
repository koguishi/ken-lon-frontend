import api from "./apiClient";

const url = `${import.meta.env.VITE_API_URL}/FichaFinanceira`;

export const FichaFinanceiraApi = {
    PdfQueue: (data: any) => api.post(`${url}/pdf-queue`, data),
    PdfUrl: (jobId: string) => api.get(`${url}/pdf-url/${jobId}`),
};
