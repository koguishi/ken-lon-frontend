import { useState, useEffect } from "react";
import { TextField, Button, Box } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React from "react";
import dayjs from "dayjs";

interface Aluno {
  id?: string; //UUID
  nome: string;
  cpf: string;
  dataNascimento?: string; // novo campo, formato ISO "YYYY-MM-DD"
}

interface Props {
  aluno?: Aluno;
  onSave: () => void;
  onCancel?: () => void;
}

export default function AlunoForm({ aluno, onSave, onCancel }: Props) {
  const [form, setForm] = useState<Aluno>({ nome: "", cpf: "" });

  useEffect(() => {
    // Preenche o form quando há um aluno para edição
    if (aluno)
      setForm({
        // ...aluno,
        id: aluno.id, // agora tratado como string UUID
        nome: aluno.nome,
        cpf: aluno.cpf,        
        dataNascimento: aluno.dataNascimento
          ? aluno.dataNascimento.split("T")[0] // mantém só a parte YYYY-MM-DD
          : "",
      });
  }, [aluno]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = aluno ? "PUT" : "POST";
    const url = aluno
      ? `${apiUrl}/alunos/${aluno.id}`
      : `${apiUrl}/alunos`;

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      onSave();
      setForm({ nome: "", cpf: "" });
    } catch (err) {
      console.error("Erro ao salvar aluno:", err);
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

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Data de Nascimento"
          value={form.dataNascimento ? dayjs(form.dataNascimento) : null}
          // onChange={(newValue) => setValue(newValue)}

          onChange={(newValue) =>
            setForm({
              ...form,
              dataNascimento: newValue ? newValue.format("YYYY-MM-DD") : "", // salva no formato ISO
            })
          }          
          format="DD/MM/YYYY"
          slotProps={{ textField: { required: true, fullWidth: true } }}
        />
      </LocalizationProvider>
      <TextField
        label="CPF"
        name="cpf"
        value={form.cpf}
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
          {aluno ? "Atualizar" : "Cadastrar"}
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
