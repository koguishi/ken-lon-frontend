import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { useState } from "react";
import type { ContaReceber, EstornarRecebimento } from "../../types";
import { ContaReceberApi } from "../../api/ContaReceberApi";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { toast } from "react-toastify";
import { useApiError } from "../../api/useApiError";
import { useConfirm } from "../../hooks/useConfirm";

interface Props {
  contaReceber?: ContaReceber;
  onSave: () => void;
  onCancel?: () => void;
}

export default function EstornarRecebimento({ contaReceber: contaReceber, onSave, onCancel }: Props) {
  const { EstornarRecebimento } = ContaReceberApi;
  const [form, setForm] = useState<EstornarRecebimento>({
    observacao: ""
  });
  const { confirm } = useConfirm();  
  const { handleApiError } = useApiError();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const ok = await confirm("Confirma estorno deste recebimento?");
    if (!ok) return;       

    try {
      await EstornarRecebimento(contaReceber!.id!, form);
      onSave();
      setForm({ observacao: "" });
      toast.success("Recebimento estornado!");
    } catch (err) {
      handleApiError(err, "estornar recebimento");
    }
  };

  const { run, isLoading } = useAsyncAction(handleSubmit);  

  return (
    <Box component="form" onSubmit={run} sx={{
      mb: 4, backgroundColor: "background.paper", padding: 2, borderRadius: 2,
    }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" gutterBottom>
          Estornar Recebimento
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

      <Paper sx={{ p: 2, mt: 1 }}>
        <Typography><strong>Data do recebimento:</strong> {contaReceber?.dataRecebimento}</Typography>
        <Typography><strong>Meio:</strong> {contaReceber?.meioRecebimento}</Typography>
        <Typography><strong>Observação:</strong> {contaReceber?.obsRecebimento}</Typography>
      </Paper>

      <TextField
        label="Observação"
        name="observacao"
        value={form.observacao}
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
