// src/service/authService.ts
import api from "./api";

interface LoginResponse {
  token: string;
  user: {
    id: number;
    nome: string;
    email: string;
    cidade: string;
  };
}

interface RegisterData {
  nome: string;
  telefone: string;
  email: string;
  senha: string;
  cidade: string;
}

// Função de login
export async function login(email: string, senha: string): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/users/login", { email, senha });
  return response.data;
}

// Função de cadastro
export async function registerUser(data: RegisterData) {
  const response = await api.post("/users/register", data);
  return response.data;
}
