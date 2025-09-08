import { useAuthContext } from "./AuthContext";

export function useAuth() {
    const { token, login, logout, isAuthenticated } = useAuthContext();

    return {
        token,
        login,
        logout,
        isAuthenticated,
    };
}
