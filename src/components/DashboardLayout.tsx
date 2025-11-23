import type { ReactNode } from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { AttachMoney, Category, Payment, RequestPage } from "@mui/icons-material";

const drawerWidth = 240;

interface Props {
    children: ReactNode;
}

export default function DashboardLayout({ children }: Props) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const menuItems = [
        // { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
        { text: "Pessoas", icon: <PeopleIcon />, path: "/pessoas" },
        { text: "Categorias", icon: <Category />, path: "/categorias" },
        { text: "Contas a Receber", icon: <AttachMoney />, path: "/contas-receber" },
        // { text: "Contas a Pagar", icon: <Payment />, path: "/contas-pagar" },
        { text: "Ficha Financeira", icon: <RequestPage />, path: "/ficha-financeira" },
    ];

    return (
        <Box sx={{ display: "flex" }}>
        <CssBaseline />

        {/* AppBar */}
        <AppBar
            position="fixed"
            sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
        >
            <Toolbar>
            <IconButton
                color="inherit"
                edge="start"
                sx={{ mr: 2, display: { sm: "none" } }}
            >
                <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Controle de Contas
            </Typography>
            {user && (
                <Typography variant="body1">
                    {user.email}
                </Typography>
            )}            
            <Button
                color="inherit"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
            >
                Sair
            </Button>
            </Toolbar>
        </AppBar>

        {/* Drawer lateral */}
        <Drawer
            variant="permanent"
            sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
                width: drawerWidth,
                boxSizing: "border-box",
            },
            }}
        >
            <Toolbar />
            <Box sx={{ overflow: "auto" }}>
            <List>
                {menuItems.map((item) => (
                <ListItem key={item.text} disablePadding>
                    <ListItemButton onClick={() => navigate(item.path)}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                    </ListItemButton>
                </ListItem>
                ))}
            </List>
            </Box>
        </Drawer>

        {/* Conteúdo central */}
        <Box
            component="main"
            sx={{
            flexGrow: 1,
            p: 3,
            backgroundColor: (theme) => theme.palette.background.default,
            minHeight: "100vh",
            }}
        >
            <Toolbar /> {/* espaço por causa do AppBar */}
            {children}
        </Box>
        </Box>
    );
}
