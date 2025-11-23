import type { JSX } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./auth/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import CategoriaFormPage from "./pages/CategoriaFormPage";
import CategoriasListPage from "./pages/CategoriasListPage";
import ContaReceberFormPage from "./pages/ContaReceber/ContaReceberFormPage";
import ContasReceberListPage from "./pages/ContaReceber/ContasReceberListPage";
import EstornarRecebimentoPage from "./pages/ContaReceber/EstornarRecebimentoPage";
import RegistrarRecebimentoPage from "./pages/ContaReceber/RegistrarRecebimentoPage";
import DashboardPage from "./pages/DashboardPage";
import FichaFinanceiraPage from "./pages/FichaFinanceiraPage";
import Login from "./pages/Login";
import PessoaFormPage from "./pages/PessoaFormPage";
import PessoasListPage from "./pages/PessoasListPage";
import SelfRegister from "./pages/SelfRegister";
import { ROUTES } from "./Routes";

import "react-toastify/dist/ReactToastify.css";

// TODO: confiurar e implementar tema escuro futuramente
// import { ThemeProvider } from "@mui/material";
// import theme from "./theme";
// import MensalidadesPage01 from "./pages/MensalidadesPage01";

export function App(): JSX.Element {
  return (
    <div>
      <AuthProvider>
        <Router>
          <Routes>
            {/* <Route path="teste" element={<MensalidadesPage01/>} /> */}
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
              <Route path={ROUTES.contasReceber} element={<ContasReceberListPage />} />
              <Route path={ROUTES.contaReceberNovo} element={<ContaReceberFormPage />} />
              <Route path={ROUTES.contaReceberDetalhe.path} element={<ContaReceberFormPage />} />
              <Route path={ROUTES.registrarRecebimento.path} element={<RegistrarRecebimentoPage />} />
              <Route path={ROUTES.estornarRecebimento.path} element={<EstornarRecebimentoPage />} />
              <Route path={ROUTES.fichaFinanceira.path} element={<FichaFinanceiraPage />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
      <ToastContainer position="top-right" autoClose={4000} />
    </div>
  );
}

export default App;
