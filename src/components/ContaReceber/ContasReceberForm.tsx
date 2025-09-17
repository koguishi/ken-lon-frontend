import { Box, TextField, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import type { ContaReceber } from "../../types";
import { ContaReceberApi } from "../../api/ContaReceberApi";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

interface Props {
  contaReceber?: ContaReceber;
  onSave: () => void;
  onCancel?: () => void;
}

export default function ContaReceberForm({ contaReceber: contaReceber, onSave, onCancel }: Props) {
  const { create, update } = ContaReceberApi;
  const [form, setForm] = useState<ContaReceber>({ valor: 0, vencimento: "", descricao: "" });

  useEffect(() => {
    // Preenche o form quando há registro para edição   
    if (contaReceber) {
      setForm({
        id: contaReceber.id, // agora tratado como string UUID
        descricao: contaReceber.descricao,
        vencimento: contaReceber.vencimento
          ? contaReceber.vencimento.split("T")[0] // mantém só a parte YYYY-MM-DD
          : "",
        valor: contaReceber.valor
      });
    }
  }, [contaReceber]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (contaReceber)
        await update(contaReceber.id!, form);
      else
        await create({ ... form });

      onSave();
      setForm({ valor: 0, vencimento: "", descricao: "" });
    } catch (err) {
      console.error("Erro ao salvar pessoa:", err);
    }
  };

  const { run, isLoading } = useAsyncAction(handleSubmit);  

  return (
    <Box component="form" onSubmit={run} sx={{
      mb: 4, backgroundColor: "background.paper", padding: 2, borderRadius: 2,
    }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" gutterBottom>
          Conta a Receber
        </Typography>
      </Box>
      <TextField
        label="Descrição"
        name="descricao"
        value={form.descricao}
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
          label="Data do Vencimento"
          value={form.vencimento ? dayjs(form.vencimento) : null}

          onChange={(newValue) =>
            setForm({
              ...form,
              vencimento: newValue ? newValue.format("YYYY-MM-DD") : "", // salva no formato ISO
            })
          }          
          format="DD/MM/YYYY"
          slotProps={{ textField: { required: true, fullWidth: true } }}
        />
      </LocalizationProvider>
      <TextField
        label="Valor"
        type="number"
        fullWidth
        margin="dense"
        required
        value={form.valor || ""}
        onChange={(e) => setForm({ ...form, valor: Number(e.target.value) })}
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
