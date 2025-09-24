import { Box, TextField, Button, Typography, FormControl, Select, MenuItem, InputLabel, type SelectChangeEvent, Grid, FormControlLabel, Switch } from "@mui/material";
import { useEffect, useState } from "react";
import type { Categoria, ContaReceber, Pessoa, SubCategoria } from "../../types";
import { ContaReceberApi } from "../../api/ContaReceberApi";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { CategoriaApi } from "../../api/CategoriaApi";
import PessoaAutocomplete from "../PessoaAutoComplete";
import type { PickerValue } from "@mui/x-date-pickers/internals";

interface Props {
  contaReceber?: ContaReceber;
  onSave: () => void;
  onCancel?: () => void;
}

export default function ContaReceberForm({ contaReceber, onSave, onCancel }: Props) {
  const { create: createConta, update: updateConta } = ContaReceberApi;
  const { getAll: getCategorias } = CategoriaApi;

  const [pessoaId, setPessoaId] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [subCategoriaId, setSubCategoriaId] = useState("");
  const [subCategorias, setSubcategorias] = useState<SubCategoria[]>([]);

  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState(0);
  const [vencimento, setVencimento] = useState("");
  const [vencimentos, setVencimentosApi] = useState(Array<string>());

  const [pessoaNome, setPessoaNome] = useState("");
  const [categoriaNome, setCategoriaNome] = useState("");
  const [subCategoriaNome, setSubCategoriaNome] = useState("");

  const [recorrencia, setRecorrencia] = useState(false);
  const [qtdParcelas, setQtdParcelas] = useState(2);
  const [frequencia, setFrequencia] = useState("mensal");
  const [textoRecorrencia, setTextoRecorrencia] = useState("");
  
  // Carrega todas as categorias no início
  useEffect(() => {
    getCategorias().then((res) => {
      setCategorias(res.data.categorias);
    });
  }, []);

  // Quando muda a categoria, atualiza as subcategorias
  useEffect(() => {
    carregarSubCategorias();
    setSubCategoriaId("");
  }, [categoriaId]);

  const carregarSubCategorias = () => {
    setSubcategorias([]);
    if (categoriaId) {
      const categoria = categorias.find((c) => c.id === categoriaId);
      setSubcategorias(categoria?.subCategorias!);
    }
  }

  // Preenche o form quando há registro para edição   
  useEffect(() => {
    if (contaReceber) {
      setDescricao(contaReceber.descricao ?? "");
      setValor(contaReceber.valor ?? 0);
      setVencimento(contaReceber.vencimento
          ? contaReceber.vencimento.split("T")[0] // mantém só a parte YYYY-MM-DD
          : ""
      );
      setPessoaId(contaReceber.pessoaId ?? "");
      setCategoriaId(contaReceber.categoriaId ?? "");
      setSubCategoriaId(contaReceber.subCategoriaId ?? "");

      setPessoaNome(contaReceber.pessoaNome ?? "");
      setCategoriaNome(contaReceber.categoriaNome ?? "");
      setSubCategoriaNome(contaReceber.subCategoriaNome ?? "");      

      if (contaReceber.categoriaId)
      {
        setCategoriaId(contaReceber.categoriaId);
        carregarSubCategorias();
        setSubCategoriaId(contaReceber.subCategoriaId!);
      }
    }
  }, [contaReceber]);

  const handlePessoaChange = (pessoa: Pessoa | null) => {
    setDescricao(`${pessoa?.nome ?? ""} - ${categoriaNome} - ${subCategoriaNome}`);
    setPessoaId(pessoa?.id ?? "");
    setPessoaNome(pessoa?.nome ?? "");
  };

  const handleCategoriaChange = (e: SelectChangeEvent) => {
    setCategoriaId(e.target.value);
    const novaCategoriaId = e.target.value;    
    const categoria = categorias.find((c) => c.id === novaCategoriaId);
    setDescricao(`${pessoaNome} - ${categoria?.nome ?? ""}`);
    setCategoriaNome(categoria?.nome ?? "");
  };

  const handleSubCategoriaChange = (e: SelectChangeEvent) => {
    setSubCategoriaId(e.target.value);
    const novaSubCategoriaId = e.target.value;    
    const subCategoria = subCategorias.find((c) => c.id === novaSubCategoriaId);
    setDescricao(`${pessoaNome} - ${categoriaNome} - ${subCategoria?.nome ?? ""}`);
    setSubCategoriaNome(subCategoria?.nome ?? "");
  };  

  const handleDescricaoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescricao(e.target.value);
  };

  const handleVencimentoChange = (e: PickerValue) => {
    const vcto = e ? e.format("YYYY-MM-DD") : "";
    setVencimento(vcto);
    montarRecorrenciaMensal(vcto, qtdParcelas);
  };

  const handleQtdParcelasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parcelas = Number(e.target.value);
    setQtdParcelas(parcelas);
    montarRecorrenciaMensal(vencimento, parcelas);
  };

  const addMonths = (date: Date, monthsToAdd: number): Date => {
    const newDate = new Date(date);
    const day = newDate.getDate();

    // Move para o primeiro dia do mês alvo
    newDate.setDate(1);
    newDate.setMonth(newDate.getMonth() + monthsToAdd);

    // Pega o último dia do mês alvo
    const lastDayOfTargetMonth = new Date(
      newDate.getFullYear(),
      newDate.getMonth() + 1,
      0
    ).getDate();

    // Define o dia como o mínimo entre o dia original e o último dia do mês
    newDate.setDate(Math.min(day, lastDayOfTargetMonth));

    return newDate;
  };

  function formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const montarRecorrenciaMensal = (vencimento: string, qtdParcelas: number) => {
    let vctosApi: string[] = [];
    let vctosForm: string[] = [];
    let atual = new Date(vencimento);
    atual.setDate(atual.getDate() + 1); // Adiciona os dias à data    
    for (let cont = 0; cont < qtdParcelas; cont++) {
      let proxVenc = addMonths(atual, cont);
      vctosApi.push(formatDateToYYYYMMDD(proxVenc));
      vctosForm.push(formatDateToYYYYMMDD(proxVenc));
    }
    setVencimentosApi(vctosApi);
    setTextoRecorrencia(vctosForm.toString());
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (contaReceber) {
        const dto = {
          descricao: descricao,
          valor: valor,
          vencimento: vencimento,
          categoriaId: categoriaId == "" ? undefined : categoriaId,
          subCategoriaId: subCategoriaId == "" ? undefined : subCategoriaId,
          pessoaId: pessoaId == "" ? undefined : pessoaId,
        };
        await updateConta(contaReceber.id!, dto);
      }
      else {
        // Monta o DTO de insercao pois é diferente do de alteracao
        // vencimentos: [] no lugar de vencimento: ""
        const dto = {
          descricao: descricao,
          valor: valor,
          vencimentos: recorrencia ? vencimentos : [vencimento],
          categoriaId: categoriaId == "" ? undefined : categoriaId,
          subCategoriaId: subCategoriaId == "" ? undefined : subCategoriaId,
          pessoaId: pessoaId == "" ? undefined : pessoaId,
        };
        await createConta({ ... dto });
      }

      onSave();
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

      <Grid container>
        <Grid size={12}>
          <PessoaAutocomplete autoFocus
            idInicial={contaReceber?.pessoaId}
            onChange={handlePessoaChange}
          />
        </Grid>
      </Grid>

      <Grid container>
        <Grid size={6}>
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
        </Grid>
        <Grid size={6} pl={2}>
          <FormControl fullWidth margin="dense" disabled={!categoriaId}>
            <InputLabel>Subcategoria</InputLabel>
            <Select value={subCategoriaId} label="Subcategoria" onChange={handleSubCategoriaChange}>

              <MenuItem value={""}>
                <em>Nenhuma subcategoria</em>
              </MenuItem>

              {subCategorias.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <TextField
        label="Descrição"
        name="descricao"
        value={descricao}
        onChange={handleDescricaoChange}
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

      <TextField
        label="Valor"
        type="number"
        sx={{ mr: 2 }}
        margin="dense"
        required
        value={valor || ""}
        onChange={(e) => setValor(Number(e.target.value))}
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker 
          label="Data do Vencimento"
          value={vencimento ? dayjs(vencimento) : null}
          onChange={handleVencimentoChange}
            // setVencimento(newValue ? newValue.format("YYYY-MM-DD") : "")
          format="DD/MM/YYYY"
          slotProps={{ textField: { 
            required: true, 
            margin: "dense" 
          } }}
        />
      </LocalizationProvider>

      {!contaReceber && (
        <FormControlLabel sx={{ ml: 1, mt: 2}}
          control={<Switch checked={recorrencia} onChange={(e) => setRecorrencia(e.target.checked)} />}
          label="Conta recorrente"
        />
      )}

      {recorrencia && (
        <Box sx={{ mt: 1, p: 2, border: "1px dashed #ddd", borderRadius: 1 }}>
          <Grid container>
            <Grid size={2}>
              <TextField
                label="Qtd. Parcelas"
                type="number"
                slotProps={{
                  htmlInput: { min: 2, max: 12 }
                }}
                fullWidth
                // sx={{ pr: 1 }}
                // margin="dense"
                value={qtdParcelas}
                onChange={handleQtdParcelasChange}
              />
            </Grid>
            <Grid size={3} sx={{ pl: 2}}>
              <FormControl fullWidth>
                <InputLabel>Frequência</InputLabel>
                <Select label="Frequência" value={frequencia} onChange={(e) => setFrequencia(e.target.value)}>
                  <MenuItem value="mensal">Mensal</MenuItem>
                  {/* <MenuItem value="semanal">Semanal</MenuItem>
                  <MenuItem value="anual">Anual</MenuItem>
                  <MenuItem value="personalizado">Personalizado</MenuItem> */}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={7} sx={{ pl: 2}}>
              <Typography variant="body2">
                {textoRecorrencia}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      )}

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
