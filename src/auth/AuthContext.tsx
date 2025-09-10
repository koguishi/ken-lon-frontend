import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface UserInfo {
  name?: string;
  email?: string;
  roles?: string[];
}

interface AuthContextType {
    token: string | null;
    user: UserInfo | null;
    login: (token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<UserInfo | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
            decodeAndSetUser(storedToken);
        }
    }, []);

    const decodeAndSetUser = (jwt: string) => {
        try {
            const decoded: any = jwtDecode(jwt);
            setUser({
                // name: decoded["name"] || decoded["unique_name"],
                email: decoded["email"] || decoded["sub"],
                roles: decoded["role"]
                ? Array.isArray(decoded["role"])
                    ? decoded["role"]
                    : [decoded["role"]]
                : [],
            });
        } catch (err) {
            console.error("Erro ao decodificar token:", err);
            setUser(null);
        }
    };

    const login = (newToken: string) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        decodeAndSetUser(newToken);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext deve ser usado dentro de AuthProvider");
    }
    return context;
}
