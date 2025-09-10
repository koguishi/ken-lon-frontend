import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Pessoa } from "../types";
import PessoaForm from "../components/PessoaForm";
import DashboardLayout from "../components/DashboardLayout";
import { PessoaApi } from "../api/PessoaApi";
import { ROUTES } from "../Routes";

export default function PessoaFormPage() {
  const { id } = useParams<{ id: string }>();
  const [pessoa, setPessoa] = useState<Pessoa | undefined>(undefined);
  const navigate = useNavigate();

  const { getById } = PessoaApi;

  if (id) {
    useEffect(() => {
      getById(id!).then((res) => {
        setPessoa(res.data);
      }).catch(err => console.error(err));
    }, [id]);
  }

  const handleSave = () => {
    navigate(ROUTES.pessoas); // volta para listagem após salvar
  };

  return(
    <DashboardLayout>
      <PessoaForm pessoa={pessoa} onSave={handleSave} onCancel={() => navigate(ROUTES.pessoas)} />
    </DashboardLayout>
  );
}
