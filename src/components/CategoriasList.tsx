import { Container, Box, Typography, Button, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton, TablePagination }
from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Categoria } from "../types";
import { CategoriaApi } from "../api/CategoriaApi";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ROUTES } from "../Routes";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";

export default function CategoriasList() {
  const { getAll, remove } = CategoriaApi;
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const rowsPerPage = 8;

  const abrirNovo = () => navigate(ROUTES.categoriaNovo);
  useKeyboardShortcuts({
    "Alt+N": abrirNovo,
    // "Alt+E": editarSelecionado,
    // "Alt+D": deletarSelecionado,
  });

  const fetch = () => {
    getAll(page + 1, rowsPerPage).then((res) => {
      setCategorias(res.data.categorias);
      setTotal(res.data.totalItems);
    });
  }

  useEffect(() => {
    fetch();
  }, [page, rowsPerPage]); 

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja realmente excluir esta categoria?")) return;

    await remove(id);
    fetch();
  };

  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ mt: 0 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={0}>
        <Typography variant="h5" gutterBottom>
          Categorias
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={ abrirNovo }
        >
          Novo
        </Button>
      </Box>
      <TableContainer sx={{ width: 800, height: 450 }} component={Paper}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categorias.map(categoria => (
              <TableRow key={categoria.id}>
                <TableCell>{categoria.nome}</TableCell>
                <TableCell>

                  <IconButton color="primary" onClick={() => navigate(`${ROUTES.categoriaDetalhe.build(categoria.id!)}`)}>
                    <EditIcon />
                  </IconButton>

                  <IconButton onClick={() => handleDelete(categoria.id!)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[rowsPerPage]}
      />
    </Container>
  );
}
