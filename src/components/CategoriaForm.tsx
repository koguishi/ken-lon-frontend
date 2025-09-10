import { Box, TextField, Button } from "@mui/material";
import { useEffect, useState } from "react";
import type { Categoria } from "../types";
import { CategoriaApi } from "../api/CategoriaApi";

interface Props {
  categoria?: Categoria;
  onSave: () => void;
  onCancel?: () => void;
}

export default function CategoriaForm({ categoria: categoria, onSave, onCancel }: Props) {
  const { create, update } = CategoriaApi;
  const [form, setForm] = useState<Categoria>({ nome: "", subcategorias: [] });

  useEffect(() => {
    // Preenche o form quando há registro para edição
    if (categoria) {
      setForm({
        id: categoria.id, // agora tratado como string UUID
        nome: categoria.nome,
        subcategorias: categoria.subcategorias || [],
      });
    }
  }, [categoria]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubChange = (index: number, value: string) => {
    const updated = [...(form.subcategorias || [])];
    updated[index].nome = value;
    setForm({ ...form, subcategorias: updated });
  };

  const addSubcategoria = () => {
    setForm({ ...form, subcategorias: [...(form.subcategorias || []), { nome: "" }] });
  };

  const removeSubcategoria = (index: number) => {
    setForm({
      ...form,
      subcategorias: (form.subcategorias ?? []).filter((_, i) => i !== index),
    });
  };  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (categoria)
        await update(categoria.id!, form);
      else
        await create({ ... form });

      onSave();
      setForm({ nome: "" });
    } catch (err) {
      console.error("Erro ao salvar categoria:", err);
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



      <div>
        <label className="block font-medium">Subcategorias</label>
        {(form.subcategorias ?? []).map((sub, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              type="text"
              value={sub.nome}
              onChange={(e) => handleSubChange(i, e.target.value)}
              className="border p-2 flex-1 rounded"
            />
            <button
              type="button"
              onClick={() => removeSubcategoria(i)}
              className="bg-red-500 text-white px-3 rounded"
            >
              Remover
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addSubcategoria}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Adicionar Subcategoria
        </button>
      </div>

      <Box sx={{ mt: 2 }}>
        <Button type="submit" variant="contained" color="primary" sx={{ mr: 2 }}>
          {categoria ? "Atualizar" : "Cadastrar"}
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
