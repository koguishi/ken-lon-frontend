import type { JSX } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { AuthProvider } from "./auth/AuthContext";
import { ROUTES } from "./Routes";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import DashboardPage from "./pages/DashboardPage";
import SelfRegister from "./pages/SelfRegister";
import theme from "./theme";
import PessoasListPage from "./pages/PessoasListPage";
import PessoaFormPage from "./pages/PessoaFormPage";
import CategoriasListPage from "./pages/CategoriasListPage";
import CategoriaFormPage from "./pages/CategoriaFormPage";

export function App(): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path={ROUTES.login} element={<Login />} />
            <Route path={ROUTES.selfRegister} element={<SelfRegister />} />
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path={ROUTES.dashboard} element={<DashboardPage />} />
              <Route path={ROUTES.pessoas} element={<PessoasListPage />} />
              <Route path={ROUTES.pessoaNovo} element={<PessoaFormPage />} />
              <Route path={ROUTES.pessoaDetalhe.path} element={<PessoaFormPage />} />
              <Route path={ROUTES.categorias} element={<CategoriasListPage />} />
              <Route path={ROUTES.categoriaNovo} element={<CategoriaFormPage />} />
              <Route path={ROUTES.categoriaDetalhe.path} element={<CategoriaFormPage />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
