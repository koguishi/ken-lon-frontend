import FichaFinanceira from "../components/FichaFinanceira";
import DashboardLayout from "../components/DashboardLayout";

export default function FichaFinanceiraPage() {
  return(
    <DashboardLayout>
      <FichaFinanceira pessoaIdInicial={undefined} />
    </DashboardLayout>
  );
}