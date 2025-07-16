import api from "@/service/api";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

interface AuthState {
  token: string;
}

interface SignInCredentials {
  email: string;
  senha: string;
  keepConnected: boolean;
}

interface AuthContextData {
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  token: string | null;
}

interface AppProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem("@Imobiliaria:token");

    if (token) {
      api.defaults.headers.authorization = `Bearer ${token}`;
      return { token };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(
    async ({ email, senha, keepConnected }: SignInCredentials) => {
      const response = await api.post("/users/login", {
        email,
        senha,
      });

      const { token } = response.data;

      if (keepConnected) {
        localStorage.setItem("@Imobiliaria:token", token);
      }

      api.defaults.headers.authorization = `Bearer ${token}`;
      setData({ token });
    },
    []
  );

  const signOut = useCallback(() => {
    localStorage.removeItem("@Imobiliaria:token");
    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{ signIn, signOut, token: data.token }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { AuthProvider, useAuth, AuthContext };
