import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function Dashboard() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Bem-vindo ao Dashboard</h1>
        <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
            Logout
        </button>
        </div>
    );
}
