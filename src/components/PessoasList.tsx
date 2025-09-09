import {
  Container, Box, Typography, Button, TableContainer, Paper,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, TablePagination
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PessoaApi } from "../api/PessoaApi";

interface Pessoa {
  id: number;
  nome: string;
}

export default function PessoasList() {
  const { getAll } = PessoaApi;  
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const rowsPerPage = 5;

  useEffect(() => {
    getAll(page, rowsPerPage).then((res) => {
      setPessoas(res.data.pessoas);
      setTotal(res.data.totalItems);
    });
  }, [page, rowsPerPage]); 

  const apiUrl = import.meta.env.VITE_API_URL;

  // const fetchPessoas = () => {
  //   fetch(`${apiUrl}/pessoas?page=${page + 1}&pageSize=${rowsPerPage}`)
  //     .then(res => res.json())
  //     .then(data => {
  //       setPessoas(data.pessoas ?? []);
  //       setTotal(data.totalItems ?? 0);
  //     });
  // };

  // useEffect(() => {
  //   fetchPessoas();
  // }, [page]);

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja realmente excluir esta pessoa?")) return;
    await fetch(`${apiUrl}/pessoas/${id}`, { method: "DELETE" });
    getAll();
  };

  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" gutterBottom>
          Lista de Pessoas
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
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pessoas.map(pessoa => (
              <TableRow key={pessoa.id}>
                <TableCell>{pessoa.nome}</TableCell>
                <TableCell>

                  <IconButton color="primary" onClick={() => navigate(`/editar/${pessoa.id}`)}>
                    <EditIcon />
                  </IconButton>

                  <IconButton onClick={() => handleDelete(pessoa.id)} color="error">
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
