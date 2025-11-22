import { useEffect, useState } from "react";
import {
  Container, Typography, Table, TableHead, TableRow, TableCell,
  TableBody, Paper, TableContainer, TablePagination, IconButton,
  Button,
  Box
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
// import AlunoForm from "./AlunoForm";

import { useNavigate } from "react-router-dom";

interface Aluno {
  id: number;
  nome: string;
  cpf: string;
  dataNascimento?: string; // novo campo, formato ISO "YYYY-MM-DD"
}

export default function AlunoListMUI() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  // const [editAluno, setEditAluno] = useState<Aluno | null>(null);
  const rowsPerPage = 5;

  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchAlunos = () => {
    fetch(`${apiUrl}/alunos?page=${page + 1}&pageSize=${rowsPerPage}`)
      .then(res => res.json())
      .then(data => {
        setAlunos(data.data ?? []);
        setTotal(data.totalItems ?? 0);
      });
  };

  useEffect(() => {
    fetchAlunos();
  }, [page]);

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja realmente excluir este aluno?")) return;
    await fetch(`${apiUrl}/alunos/${id}`, { method: "DELETE" });
    fetchAlunos();
  };

  // const handleSave = () => {
  //   setEditAluno(null);
  //   fetchAlunos();
  // };

  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" gutterBottom>
          Lista de Alunos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate(`/novo`)}
        >
          Novo
        </Button>
      </Box>
      <TableContainer sx={{ width: 800, height: 450 }} component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Nascimento</TableCell>
              <TableCell>CPF</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alunos.map(aluno => (
              <TableRow key={aluno.id}>
                <TableCell>{aluno.nome}</TableCell>
                <TableCell>{aluno.dataNascimento
                  ? new Date(aluno.dataNascimento).toLocaleDateString("pt-BR")
                  : ""}
                </TableCell>
                <TableCell>{aluno.cpf}</TableCell>
                <TableCell>
                  {/* <IconButton onClick={() => setEditAluno(aluno)} color="primary">
                    <EditIcon />
                  </IconButton> */}

                  <IconButton color="primary" onClick={() => navigate(`/editar/${aluno.id}`)}>
                    <EditIcon />
                  </IconButton>

                  <IconButton onClick={() => handleDelete(aluno.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[rowsPerPage]}
      />
    </Container>
  );
}
