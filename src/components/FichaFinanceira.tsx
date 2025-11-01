import { AttachMoney } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, Grid, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ContaReceberApi } from "../api/ContaReceberApi";
import { useApiError } from "../api/useApiError";
import { useConfirm } from "../hooks/useConfirm";
import { ROUTES } from "../Routes";
import type { ContaReceber, Pessoa } from "../types";
import PessoaAutocomplete from "./PessoaAutoComplete";
import { FichaFinanceiraApi } from "../api/FichaFinanceiraApi";
import DownloadIcon from "@mui/icons-material/Download";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import DateInputMui from "./basic/DateInputMUI";

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
  const { PdfGen, PdfUrl } = FichaFinanceiraApi;  
  const [contas, setContas] = useState<ContaReceber[]>([]);  
  const abortController = useRef<AbortController | null>(null);


  const handleVencimentoDeChange = (data: string | null) => {
    if (data) {
      setStatus("parado");
      console.log('vencimento DE:', data);
      setFiltroDe(data);
    }
  };
  
  const handleVencimentoAteChange = (data: string | null) => {
    if (data) {
      setStatus("parado");
      console.log('vencimento ATE:', data);
      setFiltroAte(data);
    }
  };

  const fetchContas = () => {
    getByPessoaId(filtroPessoaId, filtroDe, filtroAte).then((res) => {
      setContas(res.data.contas);
      console.log(res.data.totalItems);
      if (res.data.totalItems > 0)
        setStatus("parado");
      // setTotal(res.data.totalItems);
    });
  }

  const handlePessoaChange = (pessoa: Pessoa | null) => {
    setFiltroPessoaId(pessoa?.id!);
  };

  useEffect(() => {
    if (pessoaIdInicial) {
      setFiltroPessoaId(pessoaIdInicial);
    }
  }, []);

  useEffect(() => {
    setStatus("semFiltro");

    if (filtroPessoaId && filtroDe && filtroAte) {
      fetchContas();
    }
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

  const [status, setStatus] = useState("semFiltro");
  const [pdfUrl, setPdfUrl] = useState(null);

  const gerarCancelavel = async () => {
    try {
      setStatus("processando");
      setPdfUrl(null);

      // cria controller para cancelamento
      abortController.current = new AbortController();

      const response = await PdfGen(
        {
          pessoaId: filtroPessoaId,
          vencimentoInicial: filtroDe,
          vencimentoFinal: filtroAte,
        },
        { signal: abortController.current.signal } // passa o signal para o fetch
      );

      const fileName = response.data.fileName;

      // Polling até o arquivo estar pronto
      let pronto = false;
      while (!pronto) {
        const resp = await PdfUrl(fileName, { signal: abortController.current.signal });
        if (resp.data.status === "pronto") {
          setPdfUrl(resp.data.url);
          setStatus("pronto");
          pronto = true;
        } else {
          await new Promise((r) => setTimeout(r, 2000));
        }
      }
    } catch (err: any) {
      if (err.name === "CanceledError") {
        console.log("Processo cancelado pelo usuário.");
        setStatus("parado");
      } else {
        console.error("Erro ao gerar PDF:", err);
        setStatus("parado");
      }
    }
  };

  const cancelar = () => {
    if (abortController.current) {
      abortController.current.abort();
      abortController.current = null;
    }
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

      <Stack direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 1, sm: 2 }}
        alignItems="center"
        justifyContent={{ xs: "center", sm: "space-between" }}
      >
        <DateInputMui
          label="De"
          value=""
          onChange={handleVencimentoDeChange}
        />
        <DateInputMui
          label="Até"
          value=""
          onChange={handleVencimentoAteChange}
        />
        <Button
          variant="contained"
          color={
            status === "processando" ? "warning" :
            status === "pronto" ? "success" :
            "primary"
          }
          startIcon={
            status === "processando" ? <HourglassTopIcon /> :
            status === "pronto" ? <DownloadIcon /> :
            <PictureAsPdfIcon />
          }
          disabled={status === "semFiltro"}
          onClick={() => {
            if (status === "parado") gerarCancelavel();
            else if (status === "processando") cancelar();
            else if (status === "pronto" && pdfUrl) window.open(pdfUrl, "_blank");
          }}
        >
          {status === "semFiltro" && "Gerar PDF"}
          {status === "parado" && "Gerar PDF"}
          {status === "processando" && "Gerando... (Cancelar)"}
          {status === "pronto" && "Baixar PDF"}
        </Button>
      </Stack>      

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
