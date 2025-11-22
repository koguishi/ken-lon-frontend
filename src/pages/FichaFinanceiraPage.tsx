import FichaFinanceira from "../components/FichaFinanceira";
import DashboardLayout from "../components/DashboardLayout";
import { useParams } from "react-router-dom";

export default function FichaFinanceiraPage() {
  const { pessoaId } = useParams<{ pessoaId?: string }>();

  return(
    <DashboardLayout>
      <FichaFinanceira pessoaIdInicial={pessoaId} />
    </DashboardLayout>
  );
}