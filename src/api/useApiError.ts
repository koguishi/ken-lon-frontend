import axios from "axios";
import { toast } from "react-toastify";

export function useApiError() {
  function handleApiError(error: unknown, contexto?: string) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const mensagem = error.response?.data;

      switch (status) {
        case 400:
        case 409:
          toast.error(mensagem ?? "Não foi possível completar a operação.");
          break;

        case 404:
          toast.error("Recurso não encontrado.");
          break;

        case 500:
          toast.error("Erro interno do servidor. Tente novamente mais tarde.");
          break;

        default:
          toast.error("Erro inesperado. Tente novamente.");
      }
    } else {
      console.error(error);
      toast.error(`Erro inesperado${contexto ? ` ao ${contexto}` : ""}.`);
    }
  }

  return { handleApiError };
}
