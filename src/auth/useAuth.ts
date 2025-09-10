import { useAuthContext } from "./AuthContext";

export function useAuth() {
    const { token, user, login, logout, isAuthenticated } = useAuthContext();

    return {
        token,
        user,
        login,
        logout,
        isAuthenticated,
    };
}
