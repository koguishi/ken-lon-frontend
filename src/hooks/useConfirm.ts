import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export function useConfirm() {
  async function confirm(
    message: string,
    title = "Tem certeza?"
  ): Promise<boolean> {
    const result = await MySwal.fire({
      title,
      text: message,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    return result.isConfirmed;
  }

  return { confirm };
}
