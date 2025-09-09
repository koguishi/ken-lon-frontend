import { useState } from "react";
import axios from "axios";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Avatar,
  Button,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Alert,
} from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";

export default function SelfRegister() {
    // const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("As senhas não conferem");
            return;
        }

        try {
            await axios.post(`${apiUrl}/auth/self-register`, {
                // username,
                email,
                password,
            });
            setSuccess("Cadastro realizado! Redirecionando...");
            setTimeout(() => navigate("/login"), 2000);
        } catch {
            setError("Erro ao registrar. Verifique os dados.");
        }
    };

    return (
        <Container component="main" maxWidth="xs">
        <Box
            sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
                <PersonAddAlt1Icon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Criar Conta
            </Typography>

            {error && (
                <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert severity="success" sx={{ width: "100%", mt: 2 }}>
                    {success}
                </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                {/* <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                /> */}
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="E-mail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    type="password"
                    label="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    type="password"
                    label="Confirmar senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="success"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Cadastrar
                </Button>
                <Grid container justifyContent="flex-end">
                    <Link component={RouterLink} to="/login" variant="body2">
                        {"Já tem conta? Faça login"}
                    </Link>
                </Grid>
            </Box>
        </Box>
        </Container>
    );
}
