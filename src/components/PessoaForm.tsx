import { Box, TextField, Button } from "@mui/material";
import { useEffect, useState } from "react";
import type { Pessoa } from "../types";
import { PessoaApi } from "../api/PessoaApi";

interface Props {
  pessoa?: Pessoa;
  onSave: () => void;
  onCancel?: () => void;
}

export default function PessoaForm({ pessoa: pessoa, onSave, onCancel }: Props) {
  const { create, update } = PessoaApi;
  const [form, setForm] = useState<Pessoa>({ nome: "" });

  useEffect(() => {
    // Preenche o form quando há registro para edição
    if (pessoa) {
      setForm({
        id: pessoa.id, // agora tratado como string UUID
        nome: pessoa.nome,
      });
    }
  }, [pessoa]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (pessoa)
        await update(pessoa.id!, form);
      else
        await create({ ... form });

      onSave();
      setForm({ nome: "" });
    } catch (err) {
      console.error("Erro ao salvar pessoa:", err);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{
      mb: 4, backgroundColor: "background.paper", padding: 2, borderRadius: 2,
    }}>
      <TextField
        label="Nome"
        name="nome"
        value={form.nome}
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
        <Button type="submit" variant="contained" color="primary" sx={{ mr: 2 }}>
          {pessoa ? "Atualizar" : "Cadastrar"}
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
