import {
  Container, Box, Typography, Button, TableContainer, Paper,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, TablePagination
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ContaReceberApi } from "../../api/ContaReceberApi";
import type { ContaReceber } from "../../types";
import { ROUTES } from "../../Routes";
import { useApiError } from "../../api/useApiError";
import { useConfirm } from "../../hooks/useConfirm";
import { toast } from "react-toastify";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { AttachMoney } from "@mui/icons-material";

export default function ContasReceberList() {
  const { getAll, remove } = ContaReceberApi;  
  const [contas, setContas] = useState<ContaReceber[]>([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const rowsPerPage = 5;

  const abrirNovo = () => navigate(ROUTES.contaReceberNovo);
  useKeyboardShortcuts({
    "Alt+N": abrirNovo,
    // "Alt+E": editarSelecionado,
    // "Alt+D": deletarSelecionado,
  });  

  const fetchContasReceber = () => {
    getAll(page, rowsPerPage).then((res) => {
      setContas(res.data.contas);
      setTotal(res.data.totalItems);
    });
  }

  useEffect(() => {
    fetchContasReceber();
  }, [page, rowsPerPage]);

  const { confirm } = useConfirm();  
  const { handleApiError } = useApiError();

  const handleDelete = async (id: string) => {
    const ok = await confirm("Deseja realmente excluir esta conta?");
    if (!ok) return;    

    try {
      await remove(id);
      toast.success("Conta excluída com sucesso!");
      // atualizar a lista
      fetchContasReceber();
    } catch (err) {
      handleApiError(err, "excluir conta a receber");
    }    
  };

  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" gutterBottom>
          Contas a Receber
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate(ROUTES.contaReceberNovo)}
        >
          Novo
        </Button>
      </Box>
      <TableContainer sx={{ width: 800, height: 450 }} component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Vencimento</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contas.map(conta => (
              <TableRow key={conta.id}>
                <TableCell>{conta.descricao}</TableCell>
                <TableCell>{new Date(conta.vencimento).toLocaleDateString()}</TableCell>
                <TableCell>
                  R$ {conta.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>

                <TableCell>
                  <IconButton color="primary" onClick={() => navigate(`${ROUTES.registrarRecebimento.build(conta.id!)}`)}>
                    <AttachMoney />
                  </IconButton>

                  <IconButton color="primary" onClick={() => navigate(`${ROUTES.contaReceberDetalhe.build(conta.id!)}`)}>
                    <EditIcon />
                  </IconButton>

                  <IconButton onClick={() => handleDelete(conta.id!)} color="error">
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
