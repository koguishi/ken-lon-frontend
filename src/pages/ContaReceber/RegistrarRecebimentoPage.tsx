import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { ContaReceber } from "../../types";
import DashboardLayout from "../../components/DashboardLayout";
import { ContaReceberApi } from "../../api/ContaReceberApi";
import { ROUTES } from "../../Routes";
import RegistrarRecebimento from "../../components/ContaReceber/RegistrarRecebimento";

export default function RegistrarRecebimentoPage() {
  const { id } = useParams<{ id: string }>();
  const [contaReceber, setContaReceber] = useState<ContaReceber | undefined>(undefined);
  const navigate = useNavigate();

  const { getById } = ContaReceberApi;

  if (id) {
    useEffect(() => {
      getById(id!).then((res) => {
        setContaReceber(res.data);
      }).catch(err => console.error(err));
    }, [id]);
  }

  const handleSave = () => {
    navigate(ROUTES.contasReceber); // volta para listagem após salvar
  };

  return(
    <DashboardLayout>
      <RegistrarRecebimento contaReceber={contaReceber} onSave={handleSave} onCancel={() => navigate(ROUTES.contasReceber)} />
    </DashboardLayout>
  );
}
