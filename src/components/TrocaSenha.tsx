import { Alert, Box, Button, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useAuth } from "../auth/useAuth";
import { AuthApi } from "../api/AuthApi";
import { toast } from "react-toastify";

export default function TrocaSenha() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [error, setError] = useState("");
    const auth = useAuth();
    const { trocarSenha } = AuthApi;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (newPassword !== repeatPassword) {
            setError("As senhas novas não coincidem");
            return;
        }
        if (newPassword === currentPassword) {
            setError("A senha nova deve ser diferente da atual");
            return;
        }

        try {
            const response = await trocarSenha({
                email: auth.user?.email,
                currentPassword,
                newPassword
            });
            if (response.status === 200) {
                setCurrentPassword("");
                setNewPassword("");
                setRepeatPassword("");
                toast.success("Senha alterada com sucesso!");                
            }

            // console.log(response);
        } catch (err: any) {
            setError(err.response?.data?.message || "Erro ao trocar senha");
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
                <Typography component="h1" variant="h5">
                    Troca de Senha
                </Typography>
                {error && (
                    <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        type="password"
                        label="Senha atual"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        type="password"
                        label="Senha nova"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        type="password"
                        label="confirmar senha nova"
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Trocar
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
