import { Box, Grid, InputLabel, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import PessoaAutocomplete from "./PessoaAutoComplete";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState } from "react";
import dayjs from "dayjs";
import type { PickerValue } from "@mui/x-date-pickers/internals";

interface Props {
    pessoaIdInicial: string | undefined;
}

export default function FichaFinanceira({ pessoaIdInicial: pessoaId }: Props) {

  // const [filtroPessoaId, setFiltroPessoaId] = useState("");
  const [filtroDe, setFiltroDe] = useState("");
  const [filtroAte, setFiltroAte] = useState("");

  const handlePessoaChange = () => {
  };

  const handleFiltroVencimentoDeChange = (e: PickerValue) => {
    const vcto = e ? e.format("YYYY-MM-DD") : "";
    setFiltroDe(vcto);
  };

  const handleFiltroVencimentoAteChange = (e: PickerValue) => {
    const vcto = e ? e.format("YYYY-MM-DD") : "";
    setFiltroAte(vcto);
  };

  return (
    <Box sx={{
      mb: 4, backgroundColor: "background.paper", padding: 2, borderRadius: 2,
    }}>
      <Typography variant="h5" gutterBottom>
        Ficha Financeira
      </Typography>

      {/* TODO: preencher a pessoa caso já venha o Id */}
      {pessoaId && (
        <InputLabel>{pessoaId}</InputLabel>
      )}

      <Grid container>
        <Grid size={12}>
          <PessoaAutocomplete autoFocus
              idInicial={pessoaId}
              onChange={handlePessoaChange}
          />
        </Grid>
      </Grid>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker 
          label="de"
          value={filtroDe ? dayjs(filtroDe) : null}
          onChange={handleFiltroVencimentoDeChange}
          format="DD/MM/YYYY"
          slotProps={{ textField: { 
            required: true, 
            margin: "dense" 
          } }}
        />
        <DatePicker 
          label="até"
          value={filtroAte ? dayjs(filtroAte) : null}
          onChange={handleFiltroVencimentoAteChange}
          format="DD/MM/YYYY"
          slotProps={{ textField: { 
            required: true, 
            margin: "dense" 
          } }}
        />
      </LocalizationProvider>

      <TableContainer sx={{ width: 800, height: 450 }} component={Paper}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Descrição</TableCell>
              <TableCell>Vencimento</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Liquidado</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
