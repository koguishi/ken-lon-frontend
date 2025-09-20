import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { useState } from "react";
import type { ContaReceber, RegistrarRecebimento } from "../../types";
import { ContaReceberApi } from "../../api/ContaReceberApi";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { useApiError } from "../../api/useApiError";
import { useConfirm } from "../../hooks/useConfirm";

interface Props {
  contaReceber?: ContaReceber;
  onSave: () => void;
  onCancel?: () => void;
}

export default function RegistrarRecebimento({ contaReceber: contaReceber, onSave, onCancel }: Props) {
  const { registrarRecebimento } = ContaReceberApi;
  const [form, setForm] = useState<RegistrarRecebimento>({
    dataRecebimento: "", meioRecebimento: "", obsRecebimento: ""
  });
  const { confirm } = useConfirm();  
  const { handleApiError } = useApiError();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const ok = await confirm("Confirma registro deste recebimento?");
    if (!ok) return;       

    try {
      await registrarRecebimento(contaReceber!.id!, form);
      onSave();
      setForm({ dataRecebimento: "", meioRecebimento: "", obsRecebimento: "" });
      toast.success("Recebimento registrado!");
    } catch (err) {
      handleApiError(err, "registrar recebimento");
    }
  };

  const { run, isLoading } = useAsyncAction(handleSubmit);  

  return (
    <Box component="form" onSubmit={run} sx={{
      mb: 4, backgroundColor: "background.paper", padding: 2, borderRadius: 2,
    }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" gutterBottom>
          Registrar Recebimento
        </Typography>
      </Box>

      <Paper sx={{ p: 2, mt: 1 }}>
        <Typography><strong>Descrição:</strong> {contaReceber?.descricao}</Typography>
        <Typography><strong>Vencimento:</strong> {contaReceber?.vencimento}</Typography>
        <Typography><strong>Valor:</strong> R$ {contaReceber?.valor.toFixed(2)}</Typography>

        <Typography><strong>Pessoa:</strong> {contaReceber?.pessoaNome}</Typography>
        <Typography><strong>Categoria:</strong> {contaReceber?.categoriaNome}</Typography>
        <Typography><strong>Subcategoria:</strong> {contaReceber?.subCategoriaNome}</Typography>
      </Paper>

      <TextField
        label="Observação"
        name="obsRecebimento"
        value={form.obsRecebimento}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
        sx={{
          input: {
            backgroundColor: "background.paper",
            color: "text.primary",
          },
          label: { color: "text.primary" },
        }}
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Data do Recebimento"
          value={form.dataRecebimento ? dayjs(form.dataRecebimento) : null}

          onChange={(newValue) =>
            setForm({
              ...form,
              dataRecebimento: newValue ? newValue.format("YYYY-MM-DD") : "", // salva no formato ISO
            })
          }          
          format="DD/MM/YYYY"
          slotProps={{ textField: { required: true, fullWidth: true } }}
        />
      </LocalizationProvider>
      <TextField
        label="Meio de Recebimento"
        name="meioRecebimento"
        value={form.meioRecebimento}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
        sx={{
          input: {
            backgroundColor: "background.paper",
            color: "text.primary",
          },
          label: { color: "text.primary" },
        }}
      />

      <Box sx={{ mt: 2 }}>
        <Button type="submit" disabled={isLoading} variant="contained" color="primary" sx={{ mr: 2 }}>
          {isLoading ? "Salvando..." : "Salvar"}
          {contaReceber ? "Atualizar" : "Cadastrar"}
        </Button>
        {onCancel && (
          <Button variant="outlined" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </Box>
    </Box>
  );
}
