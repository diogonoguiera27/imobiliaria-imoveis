import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "@/hooks/auth/useAuth";

export default function ProtectedLoginRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  // 🔥 Se estiver logado → NÃO pode acessar /login
  if (user) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>; // renderiza o conteúdo normalmente
}
