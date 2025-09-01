// import { useState, type JSX } from "react";
// import AlunoForm from "./components/AlunoForm";
// import AlunoList from "./components/AlunoListOld";
// import Button from "@mui/material/Button";
// import DeleteIcon from "@mui/icons-material/Delete";
// import AlunoListMUI from "./components/AlunoList";

import type { JSX } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AlunoListPage from "./pages/AlunoListPage";
import AlunoFormPage from "./pages/AlunoFormPage";
import { createTheme, ThemeProvider } from "@mui/material";

export function App(): JSX.Element {
  const darkTheme = createTheme({
    palette: { mode: "dark" },
  });
  return (
    <ThemeProvider theme={darkTheme}>

    <Router>
      {/* <nav style={{ padding: "1rem", background: "#eee" }}>
        <Link to="/" style={{ marginRight: "1rem" }}>Lista de Alunos</Link>
        <Link to="/novo">Cadastrar Aluno</Link>
      </nav> */}

      <Routes>
        <Route path="/" element={<AlunoListPage />} />
        <Route path="/novo" element={<AlunoFormPage />} />
        <Route path="/editar/:id" element={<AlunoFormPage />} />
      </Routes>
    </Router>
    </ThemeProvider>
  );
}

// function App(): JSX.Element {
//   // Estado do contador, inicializado em 0
//   // const [contador, setContador] = useState<number>(0);

//   const [refresh, setRefresh] = useState(false);  

//   return (

//     <div style={{ textAlign: "center", marginTop: "50px" }}>
//       <h1>Olá, Edson Koguishi! 👋</h1>

//       <Button variant="contained" color="primary" startIcon={<DeleteIcon />}>
//         Botão com Ícone
//       </Button>      

//       {/* Chamando o componente Contador */}
//       {/* <Contador inicial={0} /> */}

//       <div style={{ padding: "20px" }}>
//         <h1>Academia - Controle de Alunos</h1>
//         <AlunoForm onAlunoCriado={() => setRefresh(!refresh)} />
//         <hr />
//         <AlunoList refreshKey={refresh} />
//       </div>
//     </div>
//   );
// }

export default App;
