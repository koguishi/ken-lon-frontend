import { AttachMoney } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import type { PickerValue } from "@mui/x-date-pickers/internals";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ContaReceberApi } from "../api/ContaReceberApi";
import { useApiError } from "../api/useApiError";
import { useConfirm } from "../hooks/useConfirm";
import { ROUTES } from "../Routes";
import type { ContaReceber, Pessoa } from "../types";
import PessoaAutocomplete from "./PessoaAutoComplete";
import { FichaFinanceiraApi } from "../api/FichaFinanceiraApi";

interface Props {
    pessoaIdInicial: string | undefined;
}

export default function FichaFinanceira({ pessoaIdInicial }: Props) {
  const navigate = useNavigate();
  const { confirm } = useConfirm();
  const { handleApiError } = useApiError();

  const [filtroPessoaId, setFiltroPessoaId] = useState("");
  const [filtroDe, setFiltroDe] = useState("");
  const [filtroAte, setFiltroAte] = useState("");
  const { getByPessoaId, remove } = ContaReceberApi;
  const { PdfQueue, PdfUrl } = FichaFinanceiraApi;  
  const [contas, setContas] = useState<ContaReceber[]>([]);  
  // const [total, setTotal] = useState(0);
  
  const fetchContas = () => {
    if (filtroPessoaId) {
      getByPessoaId(filtroPessoaId, filtroDe, filtroAte).then((res) => {
        setContas(res.data.contas);
        // setTotal(res.data.totalItems);
      });
    }
  }

  const handlePessoaChange = (pessoa: Pessoa | null) => {
    setFiltroPessoaId(pessoa?.id!);
  };

  const handleFiltroVencimentoDeChange = (e: PickerValue) => {
    const vcto = e ? e.format("YYYY-MM-DD") : "";
    setFiltroDe(vcto);
  };

  const handleFiltroVencimentoAteChange = (e: PickerValue) => {
    const vcto = e ? e.format("YYYY-MM-DD") : "";
    setFiltroAte(vcto);
  };

  useEffect(() => {
    if (pessoaIdInicial) {
      setFiltroPessoaId(pessoaIdInicial);
    }
  }, []);

  useEffect(() => {
    fetchContas();
  }, [filtroPessoaId, filtroDe, filtroAte]);

  const handleRecebimento = async (id: string, recebido?: boolean) => {
    recebido
      ? navigate(
        `${ROUTES.estornarRecebimento.build(id!)}`,
        { state: { from: "FichaFinanceira", filtroPessoaId } }
      )
      : navigate(
        `${ROUTES.registrarRecebimento.build(id!)}`,
        { state: { from: "FichaFinanceira", filtroPessoaId } }
      );
  };

  const handleEdit = async (id: string) => {
    navigate(
      `${ROUTES.contaReceberDetalhe.build(id)}`,
      { state: { from: "FichaFinanceira", filtroPessoaId } }
    )
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm("Deseja realmente excluir esta conta?");
    if (!ok) return;

    try {
      await remove(id);
      toast.success("Conta excluída com sucesso!");
      // atualizar a lista
      fetchContas();
    } catch (err) {
      handleApiError(err, "excluir conta a receber");
    }
  };

  const [status, setStatus] = useState("");
  const [pdfUrl, setPdfUrl] = useState(null);
  const gerar = async () => {
    const response = await PdfQueue({ pessoaId: filtroPessoaId, vencimentoInicial: filtroDe, vencimentoFinal: filtroAte });
    setStatus("processando");

    const interval = setInterval(async () => {
      const resp = await PdfUrl(response.data.jobId);
      setStatus(resp.data.status);
      if (resp.data.status === "pronto") {
        setPdfUrl(resp.data.url);
        clearInterval(interval);
      }      
    }, 3000);
  };
  
  return (
    <Box sx={{
      mb: 4, backgroundColor: "background.paper", padding: 2, borderRadius: 2,
    }}>
      <Typography variant="h5" gutterBottom>
        Ficha Financeira
      </Typography>

      <Grid container>
        <Grid size={12}>
          <PessoaAutocomplete autoFocus
              idInicial={pessoaIdInicial}
              onChange={handlePessoaChange}
          />
        </Grid>
      </Grid>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker 
          label="de"
          value={filtroDe ? dayjs(filtroDe) : null}
          onChange={handleFiltroVencimentoDeChange}
          format="DD/MM/YYYY"
          slotProps={{ textField: { 
            required: true, 
            margin: "dense" 
          } }}
        />
        <DatePicker 
          label="até"
          value={filtroAte ? dayjs(filtroAte) : null}
          onChange={handleFiltroVencimentoAteChange}
          format="DD/MM/YYYY"
          slotProps={{ textField: { 
            required: true, 
            margin: "dense" 
          } }}
        />
      </LocalizationProvider>
      <Button onClick={gerar}>Gerar PDF</Button>
      {status === "processando" && <p>⏳ Aguarde... seu PDF está sendo gerado.</p>}
      {status === "pronto" && pdfUrl && (
        <p>
          ✅ Seu PDF está pronto!{" "}
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
            Baixar
          </a>
        </p>
      )}      

      <TableContainer sx={{ width: 800, height: 450 }} component={Paper}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Descrição</TableCell>
              <TableCell>Vencimento</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Liquidação</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          {contas.map(conta => (
            <TableRow key={conta.id}>
              <TableCell
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 200, // define a largura máxima
                }}
              >
                {conta.descricao}
              </TableCell>
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
                    onClick={() => handleEdit(conta.id!)}
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
          <TableBody>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
