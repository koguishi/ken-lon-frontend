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
import type { Pessoa } from "../types";
import { ROUTES } from "../Routes";
import { useApiError } from "../api/useApiError";
import { useConfirm } from "../hooks/useConfirm";
import { toast } from "react-toastify";

export default function PessoasList() {
  const { getAll, remove } = PessoaApi;  
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const rowsPerPage = 5;

  const fetchAlunos = () => {
    getAll(page, rowsPerPage).then((res) => {
      setPessoas(res.data.pessoas);
      setTotal(res.data.totalItems);
    });
  }

  useEffect(() => {
    fetchAlunos();
  }, [page, rowsPerPage]);

  const { confirm } = useConfirm();  
  const { handleApiError } = useApiError();

  const handleDelete = async (id: string) => {
    const ok = await confirm("Deseja realmente excluir esta pessoa?");
    if (!ok) return;    

    try {
      await remove(id);
      toast.success("Aluno excluído com sucesso!");
      // atualizar a lista
      fetchAlunos();
    } catch (err) {
      handleApiError(err, "excluir aluno");
    }    
  };

  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" gutterBottom>
          Pessoas
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate(ROUTES.pessoaNovo)}
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

                  <IconButton color="primary" onClick={() => navigate(`${ROUTES.pessoaDetalhe.build(pessoa.id!)}`)}>
                    <EditIcon />
                  </IconButton>

                  <IconButton onClick={() => handleDelete(pessoa.id!)} color="error">
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
