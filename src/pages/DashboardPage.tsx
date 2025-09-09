import { Typography, Paper, Box } from "@mui/material";
import DashboardLayout from "../components/DashboardLayout";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
        <Paper sx={{ p: 2, textAlign: "center" }}>📊 Relatório</Paper>
        <Paper sx={{ p: 2, textAlign: "center" }}>👥 Usuários</Paper>
        <Paper sx={{ p: 2, textAlign: "center" }}>💰 Financeiro</Paper>
      </Box>
    </DashboardLayout>
  );
}
