import api from "@/service/api";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

// 1. Defina o formato completo do usuário
interface User {
  id: number;
  nome: string;
  email: string;
  cidade: string;
  telefone?: string;
  username?: string;
  avatarUrl?: string; // ✅ ADICIONE ISSO
}

// 2. Atualize o estado de autenticação para incluir o user
interface AuthState {
  token: string;
  user: User;
}

interface SignInCredentials {
  email: string;
  senha: string;
  keepConnected: boolean;
}

// 3. Adicione user e updateUser ao AuthContextData
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
    const token = localStorage.getItem("@Imobiliaria:token");
    const user = localStorage.getItem("@Imobiliaria:user");

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;
      return { token, user: JSON.parse(user) };
    }

    return null;
  });

  // 4. Login com user
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

  // ✅ 5. Atualizar o usuário localmente
  const updateUser = useCallback((updatedUser: User) => {
    setData((prev) => (prev ? { ...prev, user: updatedUser } : prev));
    localStorage.setItem("@Imobiliaria:user", JSON.stringify(updatedUser));
  }, []);

  // 6. Logout
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
        updateUser, // ← incluído no contexto
        token: data?.token || null,
        user: data?.user || null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 7. Hook personalizado
function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return context;
}

export { AuthProvider, useAuth, AuthContext };
