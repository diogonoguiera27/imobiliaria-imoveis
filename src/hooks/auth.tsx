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
  password: string;
  keepConnected: boolean;
}

interface AuthContextData {
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
}
interface AppProviderProps {
  children: ReactNode;
}

interface IProps {
  email: string;
  password: string;
  keepConnected: boolean;
}
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem("@LocaVibe:token");

    if (token) {
      api.defaults.headers.authorization = `Bearer ${token}`;

      return { token };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(
    async ({ email, password, keepConnected }: IProps) => {
      const response = await api.post("session", {
        email,
        password,
        keepConnected,
      });

      const { token } = response.data;

      localStorage.setItem("@LocaVibe:token", token);

      api.defaults.headers.authorization = `Bearer ${token}`;

      setData({ token });
    },
    [],
  );

  const signOut = useCallback(() => {
    localStorage.removeItem("@LocaVibe:token");

    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{ signIn, signOut }}>
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
export { AuthProvider, useAuth };
