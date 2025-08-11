import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { login as loginSvc, getMe, setAuthToken } from "@/service/authService"; // ✅ serviços

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

// 🔐 Estado de autenticação (user pode ser null enquanto hidrata)
interface AuthState {
  token: string;
  user: User | null;
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
  updateUser(user: User): void; // mantido como estava
  token: string | null;
  user: User | null;
}

interface AppProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

function AuthProvider({ children }: AppProviderProps) {
  const [data, setData] = useState<AuthState | null>(null);

  // 🔄 Hidrata sessão no reload usando só o token
  useEffect(() => {
    const token = localStorage.getItem("@Imobiliaria:token");

    // limpeza de legado — nunca manter user no storage
    localStorage.removeItem("@Imobiliaria:user");

    if (!token) return;

    setAuthToken(token);

    (async () => {
      try {
        const me = await getMe();
        setData({ token, user: me });
      } catch {
        // token inválido/expirado → limpa
        localStorage.removeItem("@Imobiliaria:token");
        setAuthToken(null);
        setData(null);
      }
    })();
  }, []);

  // 🔑 Login: salva só o token; user fica apenas em memória
  const signIn = useCallback(
    async ({ email, senha, keepConnected }: SignInCredentials) => {
      const { token, user } = await loginSvc(email, senha);

      if (keepConnected) {
        localStorage.setItem("@Imobiliaria:token", token); // ✅ só o token
      }

      // garantia extra: nunca gravar user no storage
      localStorage.removeItem("@Imobiliaria:user");

      setAuthToken(token);

      // usa o user retornado (se vier) pra evitar “piscada”
      if (user) {
        setData({ token, user });
      } else {
        setData({ token, user: null });
      }

      // confirma/perfila oficialmente via /users/me
      const me = await getMe();
      setData({ token, user: me });
    },
    []
  );

  // ✏️ Atualiza apenas em memória (nada no localStorage)
  const updateUser = useCallback((updatedUser: User) => {
    setData((prev) => {
      if (!prev) return prev;

      const mergedUser: User = {
        ...(prev.user ?? ({} as User)),
        ...updatedUser,
        avatarUrl:
          updatedUser.avatarUrl !== undefined
            ? updatedUser.avatarUrl
            : prev.user?.avatarUrl,
      };

      return { ...prev, user: mergedUser };
    });
  }, []);

  // 🚪 Logout: remove só o token e limpa header
  const signOut = useCallback(() => {
    localStorage.removeItem("@Imobiliaria:token");
    localStorage.removeItem("@Imobiliaria:user"); // limpeza de legado
    setAuthToken(null);
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
}

// Hook de acesso ao contexto
function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth, AuthContext };
