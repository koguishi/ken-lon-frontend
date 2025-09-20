import { useState, useEffect } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { PessoaApi } from "../api/PessoaApi";

interface Pessoa {
  id: string;
  nome: string;
}

interface Props {
  autoFocus?: boolean;
  idInicial?: string; // usado na edição
  onChange?: (pessoa: Pessoa | null) => void;
}

export default function PessoaAutocomplete({ autoFocus, idInicial: pessoaIdInicial, onChange }: Props) {
  const { getAll, getById } = PessoaApi;  
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<Pessoa[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Pessoa | null>(null);

  // Carrega o pessoa inicial (edição)
  useEffect(() => {
    if (!pessoaIdInicial) return;

    const carregarPessoa = async () => {
      try {
        getById(pessoaIdInicial).then((res) => {
          setSelected(res.data);
        });
      } catch (err) {
        console.error("Erro ao carregar pessoa inicial", err);
      }
    };

    carregarPessoa();
  }, [pessoaIdInicial]);

  // Busca conforme digitação
  useEffect(() => {
    if (inputValue.length < 2) {
      setOptions([]);
      return;
    }

    let cancel = false;

    const buscarPessoas = async () => {
      setLoading(true);
      try {
        getAll(undefined, undefined, inputValue).then((res) => {
          if (!cancel) setOptions(res.data.pessoas);
        });
      } catch (err) {
        console.error("Erro ao buscar pessoas", err);
      } finally {
        if (!cancel) setLoading(false);
      }
    };

    buscarPessoas();

    return () => {
      cancel = true;
    };
  }, [inputValue]);

  return (
    <Autocomplete
      value={selected}
      onChange={(_, newValue) => {
        setSelected(newValue);
        onChange?.(newValue);
      }}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      options={options}
      getOptionLabel={(option) => option.nome}
      isOptionEqualToValue={(opt, val) => opt.id === val.id}
      loading={loading}
      renderInput={(params) => (
        <TextField
          autoFocus={autoFocus}
          {...params}
          label="Selecione um pessoa"
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }
          }}
        />
      )}
    />
  );
}
