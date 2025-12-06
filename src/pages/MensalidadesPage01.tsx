import { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Typography, Dialog, DialogTitle, DialogContent,
  TextField, MenuItem, Select, FormControl, InputLabel
} from "@mui/material";

type Mensalidade = {
  id: number;
  alunoId: number;
  alunoNome: string;
  valor: number;
  dataVencimento: string;
  dataPagamento?: string;
  meioPagamento?: string;
  observacao?: string;
  excluida?: boolean;
  motivoExclusao?: string;
  dataExclusao?: string;
};

export default function MensalidadesPage01() {
  const [mensalidades, setMensalidades] = useState<Mensalidade[]>([]);
  const [filtroStatus, setFiltroStatus] = useState("aberto");
  const [filtroAlunoInput, setFiltroAlunoInput] = useState("");
  const [filtroAluno, setFiltroAluno] = useState("");

  const [openNova, setOpenNova] = useState(false);
  const [openPagamento, setOpenPagamento] = useState(false);
  const [openExclusao, setOpenExclusao] = useState(false);

  const [form, setForm] = useState<Partial<Mensalidade>>({});
  const [mensalidadeSelecionada, setMensalidadeSelecionada] = useState<Mensalidade | null>(null);
  const [motivoExclusao, setMotivoExclusao] = useState("");

  // Mock inicial
  useEffect(() => {
    setMensalidades([
      { id: 1, alunoId: 101, alunoNome: "João Silva", valor: 120, dataVencimento: "2025-09-10" },
      { id: 2, alunoId: 102, alunoNome: "Maria Souza", valor: 150, dataVencimento: "2025-09-15", dataPagamento: "2025-09-01", meioPagamento: "Pix", observacao: "Pago antecipado" },
      { id: 3, alunoId: 103, alunoNome: "Pedro Santos", valor: 100, dataVencimento: "2025-09-20", excluida: true, motivoExclusao: "Cancelado pelo aluno", dataExclusao: "2025-09-02" }
    ]);
  }, []);

  // Função para aplicar filtro
  const getMensalidadesFiltradas = () => {
    return mensalidades.filter((m) => {
      // Filtro status
      const statusOk =
        (filtroStatus === "aberto" && !m.excluida && !m.dataPagamento) ||
        (filtroStatus === "pagas" && !!m.dataPagamento && !m.excluida) ||
        (filtroStatus === "excluidas" && !!m.excluida) ||
        (filtroStatus === "todas");

      // Filtro aluno (nome ou ID)
      const busca = filtroAluno.toLowerCase();
      const alunoOk =
        m.alunoNome.toLowerCase().includes(busca) ||
        String(m.alunoId).includes(busca);

      return statusOk && alunoOk;
    });
  };

  // Nova mensalidade
  const handleSave = () => {
    const nova: Mensalidade = {
      id: mensalidades.length + 1,
      alunoId: form.alunoId || 0,
      alunoNome: form.alunoNome || "Aluno Exemplo",
      valor: form.valor || 0,
      dataVencimento: form.dataVencimento || new Date().toISOString().split("T")[0],
      excluida: false
    };

    setMensalidades([...mensalidades, nova]);
    setOpenNova(false);
  };

  // Registrar pagamento
  const handleRegistrarPagamento = () => {
    if (!mensalidadeSelecionada) return;
    setMensalidades(mensalidades.map(m =>
      m.id === mensalidadeSelecionada.id
        ? {
            ...m,
            dataPagamento: new Date().toISOString().split("T")[0],
            meioPagamento: form.meioPagamento,
            observacao: form.observacao
          }
        : m
    ));
    setOpenPagamento(false);
    setForm({});
    setMensalidadeSelecionada(null);
  };

  // Exclusão lógica
  const handleConfirmarExclusao = () => {
    if (!mensalidadeSelecionada) return;

    setMensalidades(mensalidades.map(m =>
      m.id === mensalidadeSelecionada.id
        ? {
            ...m,
            excluida: true,
            motivoExclusao,
            dataExclusao: new Date().toISOString().split("T")[0]
          }
        : m
    ));

    setOpenExclusao(false);
    setMotivoExclusao("");
    setMensalidadeSelecionada(null);
  };

  // Aplicar filtro de aluno
  const aplicarFiltroAluno = () => {
    setFiltroAluno(filtroAlunoInput);
  };

  // Enter no campo busca
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      aplicarFiltroAluno();
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>Controle de Mensalidades</Typography>

      <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
        <Button variant="contained" color="primary" onClick={() => setOpenNova(true)}>
          Nova Mensalidade
        </Button>

        <FormControl size="small">
          <InputLabel>Status</InputLabel>
          <Select
            value={filtroStatus}
            label="Status"
            onChange={(e) => setFiltroStatus(e.target.value)}
            style={{ minWidth: 150 }}
          >
            <MenuItem value="aberto">Abertas</MenuItem>
            <MenuItem value="pagas">Pagas</MenuItem>
            <MenuItem value="excluidas">Excluídas</MenuItem>
            <MenuItem value="todas">Todas</MenuItem>
          </Select>
        </FormControl>

        <TextField
          size="small"
          label="Buscar aluno"
          variant="outlined"
          value={filtroAlunoInput}
          onChange={(e) => setFiltroAlunoInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <Button variant="outlined" onClick={aplicarFiltroAluno}>
          Buscar
        </Button>

        <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              setFiltroAlunoInput("");
              setFiltroAluno("");
              setFiltroStatus("aberto");
            }}
          >
            Limpar Filtros
          </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Aluno</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Vencimento</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Pagamento</TableCell>
              <TableCell>Exclusão</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getMensalidadesFiltradas().map((m) => (
              <TableRow
                key={m.id}
                style={m.excluida ? { backgroundColor: "#fdd" } : {}}
              >
                <TableCell>{m.alunoNome} (ID {m.alunoId})</TableCell>
                <TableCell>R$ {m.valor}</TableCell>
                <TableCell>{new Date(m.dataVencimento).toLocaleDateString()}</TableCell>
                <TableCell>
                  {m.excluida
                    ? "Excluída"
                    : m.dataPagamento
                      ? "Paga"
                      : "Em Aberto"}
                </TableCell>
                <TableCell>
                  {m.dataPagamento
                    ? `${m.meioPagamento} (${m.observacao || "-"})`
                    : "-"}
                </TableCell>
                <TableCell>
                  {m.excluida
                    ? `${m.motivoExclusao} (${m.dataExclusao})`
                    : "-"}
                </TableCell>
                <TableCell>
                  {!m.excluida && !m.dataPagamento && (
                    <Button
                      variant="outlined"
                      color="success"
                      size="small"
                      style={{ marginRight: 8 }}
                      onClick={() => {
                        setMensalidadeSelecionada(m);
                        setForm({});
                        setOpenPagamento(true);
                      }}
                    >
                      Registrar Pagamento
                    </Button>
                  )}
                  {!m.excluida && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => {
                        setMensalidadeSelecionada(m);
                        setOpenExclusao(true);
                      }}
                    >
                      Excluir
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modais continuam iguais */}

      {/* Modal nova mensalidade */}
      <Dialog open={openNova} onClose={() => setOpenNova(false)}>
        <DialogTitle>Nova Mensalidade</DialogTitle>
        <DialogContent>
          <TextField
            label="Aluno ID"
            fullWidth
            margin="dense"
            value={form.alunoId || ""}
            onChange={(e) => setForm({ ...form, alunoId: Number(e.target.value) })}
          />
          <TextField
            label="Aluno Nome"
            fullWidth
            margin="dense"
            value={form.alunoNome || ""}
            onChange={(e) => setForm({ ...form, alunoNome: e.target.value })}
          />
          <TextField
            label="Valor"
            type="number"
            fullWidth
            margin="dense"
            value={form.valor || ""}
            onChange={(e) => setForm({ ...form, valor: Number(e.target.value) })}
          />
          <TextField
            label="Data de Vencimento"
            type="date"
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
            value={form.dataVencimento || ""}
            onChange={(e) => setForm({ ...form, dataVencimento: e.target.value })}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            style={{ marginTop: 20 }}
          >
            Salvar
          </Button>
        </DialogContent>
      </Dialog>

      {/* Modal registrar pagamento */}
      <Dialog open={openPagamento} onClose={() => setOpenPagamento(false)}>
        <DialogTitle>Registrar Pagamento</DialogTitle>
        <DialogContent>
          <TextField
            label="Meio de Pagamento"
            select
            fullWidth
            margin="dense"
            value={form.meioPagamento || ""}
            onChange={(e) => setForm({ ...form, meioPagamento: e.target.value })}
          >
            <MenuItem value="Pix">Pix</MenuItem>
            <MenuItem value="Dinheiro">Dinheiro</MenuItem>
            <MenuItem value="Cartão">Cartão</MenuItem>
            <MenuItem value="Boleto">Boleto</MenuItem>
          </TextField>
          <TextField
            label="Observação"
            fullWidth
            margin="dense"
            value={form.observacao || ""}
            onChange={(e) => setForm({ ...form, observacao: e.target.value })}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleRegistrarPagamento}
            style={{ marginTop: 20 }}
          >
            Confirmar
          </Button>
        </DialogContent>
      </Dialog>

      {/* Modal exclusão lógica */}
      <Dialog open={openExclusao} onClose={() => setOpenExclusao(false)}>
        <DialogTitle>Excluir Mensalidade</DialogTitle>
        <DialogContent>
          <Typography>Informe o motivo da exclusão:</Typography>
          <TextField
            fullWidth
            margin="dense"
            value={motivoExclusao}
            onChange={(e) => setMotivoExclusao(e.target.value)}
          />
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmarExclusao}
            style={{ marginTop: 20 }}
          >
            Confirmar Exclusão
          </Button>
        </DialogContent>
      </Dialog>
            
    </div>
  );
}
