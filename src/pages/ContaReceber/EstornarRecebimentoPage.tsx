import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ContaReceberApi } from "../../api/ContaReceberApi";
import EstornarRecebimento from "../../components/ContaReceber/EstornarRecebimento";
import DashboardLayout from "../../components/DashboardLayout";
import { ROUTES } from "../../Routes";
import type { ContaReceber } from "../../types";

export default function EstornarRecebimentoPage() {
  const { id } = useParams<{ id: string }>();
  const [contaReceber, setContaReceber] = useState<ContaReceber | undefined>(undefined);
  const navigate = useNavigate();
  const location = useLocation();

  const { getById } = ContaReceberApi;

  if (id) {
    useEffect(() => {
      getById(id!).then((res) => {
        setContaReceber(res.data);
      }).catch(err => console.error(err));
    }, [id]);
  }

  const voltar = () => {
    const state = location.state;
    if (state && state.from === "FichaFinanceira") {
      navigate(ROUTES.fichaFinanceira.build(state.filtroPessoaId));
      return;
    }
    navigate(ROUTES.contasReceber);
  };

  const handleCancel = () => {
    voltar();
  };

  const handleSave = () => {
    voltar();
  };

  return(
    <DashboardLayout>
      <EstornarRecebimento contaReceber={contaReceber} onSave={handleSave} onCancel={handleCancel} />
    </DashboardLayout>
  );
}
