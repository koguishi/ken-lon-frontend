import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AlunoForm from "../components/AlunoForm";

interface Aluno {
  id?: string; //UUID
  nome: string;
  cpf: string;
  dataNascimento?: string;
}

export default function AlunoFormPage() {
  const { id } = useParams<{ id: string }>();
  const [aluno, setAluno] = useState<Aluno | undefined>(undefined);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (id) {
      fetch(`${apiUrl}/alunos/${id}`)
        .then(res => res.json())
        .then(data => setAluno({
          ...data,
          dataNascimento: data.dataNascimento?.split("T")[0] || ""
        }));
    }
  }, [id]);

  const handleSave = () => {
    navigate("/"); // volta para listagem após salvar
  };

  return <AlunoForm aluno={aluno} onSave={handleSave} onCancel={() => navigate("/")} />;
}
