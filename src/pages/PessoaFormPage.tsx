import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Pessoa } from "../types";
import PessoaForm from "../components/PessoaForm";
import DashboardLayout from "../components/DashboardLayout";

export default function PessoaFormPage() {
  const { id } = useParams<{ id: string }>();
  const [pessoa, setPessoa] = useState<Pessoa | undefined>(undefined);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (id) {
      fetch(`${apiUrl}/pessoas/${id}`)
        .then(res => res.json())
        .then(data => setPessoa({
          ...data,
        }));
    }
  }, [id]);

  const handleSave = () => {
    navigate("/"); // volta para listagem após salvar
  };

  return(
    <DashboardLayout>
      <PessoaForm pessoa={pessoa} onSave={handleSave} onCancel={() => navigate("/")} />
    </DashboardLayout>
  );
}
