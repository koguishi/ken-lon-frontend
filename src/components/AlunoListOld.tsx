import React, { useEffect, useState } from "react";
import type { Aluno } from "../types";
// import { Aluno } from "../types";

interface PaginatedResponse {
  data: Aluno[];
  totalPages: number;
  currentPage: number;
}

interface Props {
  refreshKey: boolean;
}

const AlunoList: React.FC<Props> = ({ refreshKey }) => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    fetch(`http://localhost:5285/api/alunos`)
      .then(res => res.json())
      .then((data: PaginatedResponse) => {
        console.log("Dados recebidos da API:", data); // 🔍 log dos dados        
        setAlunos(data.data);
        setTotalPages(data.totalPages);
      });
  }, [page, refreshKey]);

  return (
    <div>
      <h2>Lista de Alunos</h2>
      <table border={1} width="100%">
        <thead>
          <tr>
            <th>Nome</th>
            <th>CPF</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {alunos.map(aluno => (
            <tr key={aluno.id}>
              <td>{aluno.nome}</td>
              <td>{aluno.cpf}</td>
              <td>{aluno.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "10px" }}>
        <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>
          Anterior
        </button>
        <span style={{ margin: "0 10px" }}>
          Página {page} de {totalPages}
        </span>
        <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
          Próxima
        </button>
      </div>
    </div>
  );
};

export default AlunoList;
