import type { JSX } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { AuthProvider } from "./auth/AuthContext";
// import AlunoListPage from "./pages/AlunoListPage";
// import AlunoFormPage from "./pages/AlunoFormPage";
// import MensalidadeListPage from "./pages/MensalidadeListPage";
// import MensalidadesPage01 from "./pages/MensalidadesPage01";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import DashboardPage from "./pages/DashboardPage";
import SelfRegister from "./pages/SelfRegister";
import theme from "./theme";
import PessoasListPage from "./pages/PessoasListPage";
import PessoaFormPage from "./pages/PessoaFormPage";

export function App(): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/self-register" element={<SelfRegister />} />
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/pessoas" element={<PessoasListPage />} />
              <Route path="/pessoas/novo" element={<PessoaFormPage />} />
              <Route path="pessoas/editar/:id" element={<PessoaFormPage />} />
              {/* <Route path="/mensalidades" element={<MensalidadeListPage />} /> */}
            </Route>        
            {/* <Route path="/" element={<AlunoListPage />} />
            <Route path="/novo" element={<AlunoFormPage />} />
            <Route path="/editar/:id" element={<AlunoFormPage />} /> */}
            {/* <Route path="/mensalidades01" element={<MensalidadesPage01 />} /> */}
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
