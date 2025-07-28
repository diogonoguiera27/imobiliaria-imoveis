import api from "@/service/api";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

// 🔐 Interface do usuário
export interface User {
  id: number;
  nome: string;
  email: string;
  cidade: string;
  telefone?: string;
  username?: string;
  avatarUrl?: string;
}

// 🔐 Estado de autenticação
interface AuthState {
  token: string;
  user: User;
}

interface SignInCredentials {
  email: string;
  senha: string;
  keepConnected: boolean;
}

// 🔐 Contexto com funções úteis
interface AuthContextData {
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: User): void;
  token: string | null;
  user: User | null;
}

interface AppProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [data, setData] = useState<AuthState | null>(() => {
    try {
      const token = localStorage.getItem("@Imobiliaria:token");
      const userRaw = localStorage.getItem("@Imobiliaria:user");
      const user = userRaw ? JSON.parse(userRaw) : null;

      if (token && user) {
        api.defaults.headers.authorization = `Bearer ${token}`;
        return { token, user };
      }

      return null;
    } catch (error) {
      console.error("❌ Erro ao recuperar dados do localStorage:", error);
      return null;
    }
  });

  // 🔑 Login
  const signIn = useCallback(
    async ({ email, senha, keepConnected }: SignInCredentials) => {
      const response = await api.post("/users/login", { email, senha });

      const { token, user } = response.data;

      if (keepConnected) {
        localStorage.setItem("@Imobiliaria:token", token);
        localStorage.setItem("@Imobiliaria:user", JSON.stringify(user));
      }

      api.defaults.headers.authorization = `Bearer ${token}`;
      setData({ token, user });
    },
    []
  );

  // ✏️ Atualizar os dados do usuário no estado global + localStorage
  const updateUser = useCallback((updatedUser: User) => {
    setData((prev) => {
      if (!prev) return prev;

      if (!updatedUser || typeof updatedUser !== "object") {
        console.warn("🚫 updateUser recebeu valor inválido:", updatedUser);
        return prev;
      }

      const mergedUser: User = {
        ...prev.user,
        ...updatedUser,
        avatarUrl:
          updatedUser.avatarUrl !== undefined
            ? updatedUser.avatarUrl
            : prev.user.avatarUrl,
      };

      localStorage.setItem("@Imobiliaria:user", JSON.stringify(mergedUser));
      return { ...prev, user: mergedUser };
    });
  }, []);

  // 🚪 Logout
  const signOut = useCallback(() => {
    localStorage.removeItem("@Imobiliaria:token");
    localStorage.removeItem("@Imobiliaria:user");
    setData(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        updateUser,
        token: data?.token || null,
        user: data?.user || null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook de acesso ao contexto
function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
}

export { AuthProvider, useAuth, AuthContext };
