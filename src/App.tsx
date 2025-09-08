import type { JSX } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";
import { AuthProvider } from "./auth/AuthContext";
import AlunoListPage from "./pages/AlunoListPage";
import AlunoFormPage from "./pages/AlunoFormPage";
// import MensalidadeListPage from "./pages/MensalidadeListPage";
// import MensalidadesPage01 from "./pages/MensalidadesPage01";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";

export function App(): JSX.Element {
  const darkTheme = createTheme({
    palette: { mode: "dark" },
  });
  return (
    <ThemeProvider theme={darkTheme}>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            {/* <Route path="/mensalidades" element={<MensalidadeListPage />} /> */}
          </Route>        
          <Route path="/" element={<AlunoListPage />} />
          <Route path="/novo" element={<AlunoFormPage />} />
          <Route path="/editar/:id" element={<AlunoFormPage />} />
          {/* <Route path="/mensalidades01" element={<MensalidadesPage01 />} /> */}
        </Routes>
      </Router>
    </AuthProvider>

    </ThemeProvider>
  );
}

export default App;
