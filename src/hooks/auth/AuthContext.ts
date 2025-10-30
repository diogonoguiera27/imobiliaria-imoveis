// src/contexts/AuthContext.ts
import { createContext } from "react";
import type { User } from "@/service/userService"; // ✅ usa o tipo centralizado

export interface AuthState {
  token: string;
  user: User | null;
}

export interface AuthContextData {
  signIn(credentials: { email: string; senha: string; keepConnected: boolean }): Promise<void>;
  signOut(): void;
  updateUser(user: User): void;
  token: string | null;
  user: User | null;
  isAdmin: boolean;
}

export type { User };
export const AuthContext = createContext<AuthContextData | undefined>(undefined);
