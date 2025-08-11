// src/hooks/useAuth.ts
import { useContext } from "react";
import { AuthContext } from "../auth";

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// opcional: também exportar default para cobrir imports default antigos
export default useAuth;
