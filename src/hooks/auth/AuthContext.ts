
import { createContext } from "react";

export interface User {
  id: number;
  nome: string;
  email: string;
  cidade: string;
  telefone?: string;
  username?: string;
  avatarUrl?: string;
}

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
}

export const AuthContext = createContext<AuthContextData | undefined>(undefined);

