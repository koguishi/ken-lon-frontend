import api from "./apiClient";

const url = `${import.meta.env.VITE_API_URL}/FichaFinanceira`;

export const FichaFinanceiraApi = {
    PdfQueue: (data: any) => api.post(`${url}/pdf-queue`, data),
    PdfGen: (data: any, config?: any) => api.post(`${url}/pdf-gen`, data, config),
    PdfUrl: (jobId: string, config?: any) => api.get(`${url}/pdf-url/${jobId}`, config),
};
