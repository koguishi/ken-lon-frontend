import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#1976d2", // Azul padrão
        },
        secondary: {
            main: "#9c27b0", // Roxo
        },
        success: {
            main: "#2e7d32", // Verde
        },
        error: {
            main: "#d32f2f", // Vermelho
        },
        background: {
            // default: "#f4f6f8", // Cinza claro para fundo
            default: "background", // Cinza claro para fundo
        },
        mode: "dark",
    },
    typography: {
        fontFamily: "Roboto, Arial, sans-serif",
        h5: {
            fontWeight: 600,
        },
        button: {
            textTransform: "none", // Mantém texto normal nos botões
        },
    },
    shape: {
        borderRadius: 12, // Deixa botões e inputs mais arredondados
    },
    components: {
        MuiButton: {
        styleOverrides: {
            root: {
                padding: "10px 20px",
            },
        },
        },
        MuiTextField: {
        styleOverrides: {
            root: {
                marginBottom: "12px",
            },
        },
        },
    },
});

export default theme;
