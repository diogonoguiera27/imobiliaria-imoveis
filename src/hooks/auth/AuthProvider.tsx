import { useCallback, useEffect, useState, type ReactNode } from "react";
import { AuthContext, AuthState, User } from "./AuthContext";
import { login as loginSvc, getMe, setAuthToken } from "@/service/authService";

interface AppProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AppProviderProps) {
  const [data, setData] = useState<AuthState | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("@Imobiliaria:token");
    localStorage.removeItem("@Imobiliaria:user");

    if (!token) return;

    setAuthToken(token);

    (async () => {
      try {
        const me = await getMe();
        setData({ token, user: me });
      } catch {
        localStorage.removeItem("@Imobiliaria:token");
        setAuthToken(null);
        setData(null);
      }
    })();
  }, []);

  const signIn = useCallback(async ({ email, senha, keepConnected }: { email: string; senha: string; keepConnected: boolean }) => {
    const { token, user } = await loginSvc(email, senha);

    if (keepConnected) {
      localStorage.setItem("@Imobiliaria:token", token);
    }

    localStorage.removeItem("@Imobiliaria:user");
    setAuthToken(token);

    if (user) {
      setData({ token, user });
    } else {
      setData({ token, user: null });
    }

    const me = await getMe();
    setData({ token, user: me });
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    setData((prev) => {
      if (!prev) return prev;

      const mergedUser: User = {
        ...(prev.user ?? ({} as User)),
        ...updatedUser,
        avatarUrl: updatedUser.avatarUrl ?? prev.user?.avatarUrl,
      };

      return { ...prev, user: mergedUser };
    });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem("@Imobiliaria:token");
    localStorage.removeItem("@Imobiliaria:user");
    setAuthToken(null);
    setData(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      signIn,
      signOut,
      updateUser,
      token: data?.token || null,
      user: data?.user || null,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
