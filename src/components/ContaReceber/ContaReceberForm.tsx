import { Box, TextField, Button, Typography, FormControl, Select, MenuItem, InputLabel, type SelectChangeEvent } from "@mui/material";
import { useEffect, useState } from "react";
import type { Categoria, ContaReceber, Pessoa, SubCategoria } from "../../types";
import { ContaReceberApi } from "../../api/ContaReceberApi";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { CategoriaApi } from "../../api/CategoriaApi";
import PessoaAutocomplete from "../PessoaAutoComplete";

interface ContaReceberDto {
  id?: string;
  descricao?: string;
  valor: number;
  vencimento: string;
  
  categoriaId?: string,
  subCategoriaId?: string,
  pessoaId?: string,
}

interface Props {
  contaReceber?: ContaReceber;
  onSave: () => void;
  onCancel?: () => void;
}

export default function ContaReceberForm({ contaReceber: contaReceber, onSave, onCancel }: Props) {
  const { create: createConta, update: updateConta } = ContaReceberApi;
  const { getAll: getCategorias } = CategoriaApi;
  const [form, setForm] = useState<ContaReceberDto>({ valor: 0, vencimento: "", descricao: ""
    // campos desnecessário, pois agora estamos usando um dto especifico - 22/09/2025
    // , excluido: false, dataExclusao: undefined, motivoExclusao: undefined
    // , recebido: false, dataRecebimento: undefined, meioRecebimento: undefined, obsRecebimento: undefined
    , categoriaId: undefined, subCategoriaId: undefined, pessoaId: undefined});
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaId, setCategoriaId] = useState("");
  const [subCategoriaId, setSubCategoriaId] = useState("");
  const [subcategorias, setSubcategorias] = useState<SubCategoria[]>([]);

  const [pessoaNome, setPessoaNome] = useState("");
  const [categoriaNome, setCategoriaNome] = useState("");
  const [subCategoriaNome, setSubCategoriaNome] = useState("");
  
  // Carrega todas as categorias no início
  useEffect(() => {
    getCategorias().then((res) => {
      setCategorias(res.data.categorias);
    });
  }, []);

  // Quando muda a categoria, atualiza as subcategorias
  useEffect(() => {
    carregarSubCategorias();
    setForm({ ...form, subCategoriaId: undefined });
  }, [form.categoriaId]);

  const carregarSubCategorias = () => {
    const categoria = categorias.find((c) => c.id === form.categoriaId);
    if (categoria) setSubcategorias(categoria.subCategorias!);
    else setSubcategorias([]);
  }

  // Preenche o form quando há registro para edição   
  useEffect(() => {
    if (contaReceber) {
      setForm({
        id: contaReceber.id, // agora tratado como string UUID
        descricao: contaReceber.descricao,
        vencimento: contaReceber.vencimento
          ? contaReceber.vencimento.split("T")[0] // mantém só a parte YYYY-MM-DD
          : "",
        valor: contaReceber.valor,
        categoriaId: contaReceber.categoriaId,
        subCategoriaId: contaReceber.subCategoriaId,
        pessoaId: contaReceber.pessoaId,
        // campos desnecessário, pois agora estamos usando um dto especifico - 22/09/2025
        // excluido: contaReceber.excluido,
        // dataExclusao: contaReceber.dataExclusao,
        // motivoExclusao: contaReceber.motivoExclusao,
        // recebido: contaReceber.recebido,
        // dataRecebimento: contaReceber.dataRecebimento,
        // meioRecebimento: contaReceber.meioRecebimento,
        // obsRecebimento: contaReceber.obsRecebimento
      });
      if (contaReceber.categoriaId)
      {
        setCategoriaId(contaReceber.categoriaId);
        carregarSubCategorias();
        setSubCategoriaId(contaReceber.subCategoriaId!);
      }
    }
  }, [contaReceber]);


  const handlePessoaChange = (pessoa: Pessoa | null) => {
    setForm((prev) => ({
      ...prev,
      pessoaId: pessoa?.id ?? "",
      descricao: `${pessoa?.nome ?? ""} - ${categoriaNome} - ${subCategoriaNome}`,
    }));
    setPessoaNome(pessoa?.nome ?? "");
  };

  const handleCategoriaChange = (e: SelectChangeEvent) => {
    setCategoriaId(e.target.value);
    // setForm({ ...form, categoriaId: e.target.value == "" ? undefined : e.target.value });

    const novaCategoriaId = e.target.value;    
    const categoria = categorias.find((c) => c.id === novaCategoriaId);
    setForm((prev) => ({
      ...prev,
      categoriaId: e.target.value == "" ? undefined : e.target.value,
      descricao: `${pessoaNome} - ${categoria?.nome ?? ""}`,
    }));
    setCategoriaNome(categoria?.nome ?? "");
  };

  const handleSubCategoriaChange = (e: SelectChangeEvent) => {
    setSubCategoriaId(e.target.value);
    // setForm({ ...form, subCategoriaId: e.target.value == "" ? undefined : e.target.value });

    const novaSubCategoriaId = e.target.value;    
    const subCategoria = subcategorias.find((c) => c.id === novaSubCategoriaId);
    setForm((prev) => ({
      ...prev,
      subCategoriaId: e.target.value == "" ? undefined : e.target.value,
      descricao: `${pessoaNome} - ${categoriaNome} - ${subCategoria?.nome ?? ""}`,
    }));
    setSubCategoriaNome(subCategoria?.nome ?? "");
  };  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (contaReceber)
        await updateConta(contaReceber.id!, form);
      else {
        // Monta o DTO de insercao pois é diferente do de alteracao
        // vencimentos: [] no lugar de vencimento: ""
        const dto = {
          descricao: form.descricao,
          valor: form.valor,
          vencimentos: [form.vencimento],
          categoriaId: form.categoriaId,
          subCategoriaId: form.subCategoriaId,
          pessoaId: form.pessoaId,
        };
        await createConta({ ... dto });
      }

      onSave();
      setForm({ valor: 0, vencimento: "", descricao: ""
        // campos desnecessário, pois agora estamos usando um dto especifico - 22/09/2025
        // , excluido: false, dataExclusao: undefined, motivoExclusao: undefined
        // , recebido: false, dataRecebimento: undefined, meioRecebimento: undefined, obsRecebimento: undefined
        , categoriaId: "", subCategoriaId: "", pessoaId: "" 
      });
    } catch (err) {
      console.error("Erro ao salvar conta a receber:", err);
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

      <PessoaAutocomplete autoFocus
        idInicial={contaReceber?.pessoaId}
        onChange={handlePessoaChange}
      />

      <FormControl fullWidth margin="dense">
        <InputLabel>Categoria</InputLabel>
        <Select value={categoriaId} label="Categoria" onChange={handleCategoriaChange}>

          <MenuItem value={""}>
            <em>Nenhuma categoria</em>
          </MenuItem>

          {categorias.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.nome}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="dense" disabled={!form.categoriaId}>
        <InputLabel>Subcategoria</InputLabel>
        <Select value={subCategoriaId} label="Subcategoria" onChange={handleSubCategoriaChange}>

          <MenuItem value={""}>
            <em>Nenhuma subcategoria</em>
          </MenuItem>

          {subcategorias.map((s) => (
            <MenuItem key={s.id} value={s.id}>
              {s.nome}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

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
