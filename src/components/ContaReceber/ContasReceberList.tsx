import {
  Container, Box, Typography, Button, TableContainer, Paper,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip
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

  const handleRecebimento = async (id: string, recebido: boolean) => {
    try {
      recebido 
        ? navigate(`${ROUTES.estornarRecebimento.build(id!)}`)
        : navigate(`${ROUTES.registrarRecebimento.build(id!)}`);
    } catch (err) {
      handleApiError(err, "excluir conta a receber");
    }    
  };

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

  const [filtroStatus, setFiltroStatus] = useState("aberto");
  // Função para aplicar filtro
  const getContasFiltradas = () => {
    return contas.filter((c) => {
      // Filtro status
      const statusOk =
        (filtroStatus === "aberto" && !c.excluido && c.recebido === false) ||
        (filtroStatus === "recebido" && !c.excluido && c.recebido === true) ||
        // (filtroStatus === "excluidas" && !!c.excluida) ||
        (filtroStatus === "todas");
      return statusOk;

      // Filtro aluno (nome ou ID)
      // const busca = filtroAluno.toLowerCase();
      // const alunoOk =
      //   c.alunoNome.toLowerCase().includes(busca) ||
      //   String(c.alunoId).includes(busca);

      // return statusOk && alunoOk;
    });
  };

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

        <FormControl size="small">
          <InputLabel>Status</InputLabel>
          <Select
            value={filtroStatus}
            label="Status"
            onChange={(e) => setFiltroStatus(e.target.value)}
            style={{ minWidth: 150 }}
          >
            <MenuItem value="aberto">Aberto</MenuItem>
            <MenuItem value="recebido">Recebido</MenuItem>
            {/* <MenuItem value="excluidas">Excluídas</MenuItem> */}
            <MenuItem value="todas">Todas</MenuItem>
          </Select>
        </FormControl>        
      </Box>
      <TableContainer sx={{ width: 800, height: 450 }} component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Vencimento</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Recebimento</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getContasFiltradas().map(conta => (
              <TableRow key={conta.id}>
                <TableCell>{conta.descricao}</TableCell>
                <TableCell>{new Date(conta.vencimento).toLocaleDateString()}</TableCell>
                <TableCell>
                  R$ {conta.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell>
                  {conta.dataRecebimento 
                    ? new Date(conta.dataRecebimento).toLocaleDateString()
                    : ""
                  }
                </TableCell>

                <TableCell>
                  <Tooltip title={conta.recebido ? "Estornar recebimento" : "Registrar recebimento"}>
                    <IconButton
                      color={conta.recebido ? "error" : "primary"}
                      onClick={() => handleRecebimento(conta.id!, conta.recebido)}
                    >
                      <AttachMoney />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Alterar dados da conta">
                    <IconButton
                      disabled={conta.recebido === true}
                      color="primary"
                      onClick={() => navigate(`${ROUTES.contaReceberDetalhe.build(conta.id!)}`)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Excluir conta">
                    <IconButton onClick={() => handleDelete(conta.id!)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>

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
