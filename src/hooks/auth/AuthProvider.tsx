// src/contexts/AuthProvider.tsx
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { AuthContext, type AuthState } from "./AuthContext";
import type { User } from "@/service/userService"; // ✅ centraliza o tipo
import { login as loginSvc, getMe, setAuthToken } from "@/service/authService";
import { socket } from "@/service/socket";

interface AppProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AppProviderProps) {
  const [data, setData] = useState<AuthState | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("@Imobiliaria:token");
    localStorage.removeItem("@Imobiliaria:user"); // 🔹 evita dados antigos

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

  const signIn = useCallback(
    async ({
      email,
      senha,
      keepConnected,
    }: {
      email: string;
      senha: string;
      keepConnected: boolean;
    }) => {
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

      // 🔄 garante que dados atualizados de /me prevaleçam
      const me = await getMe();
      setData({ token, user: me });
    },
    []
  );

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
    // Se o socket estiver conectado, desconectar para disparar o evento
    // de `disconnect` no backend e marcar o usuário como offline.
    try {
      if (socket && socket.connected) {
        socket.disconnect();
        console.log("🔌 Socket desconectado pelo signOut");
      }
    } catch (err) {
      console.warn("⚠️ Falha ao desconectar socket no signOut:", err);
    }

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
        isAdmin: data?.user?.role === "ADMIN" || false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
