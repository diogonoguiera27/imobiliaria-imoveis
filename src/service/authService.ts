import api from "./api";

// Interfaces principais
export interface User {
  id: number;
  nome: string;
  email: string;
  cidade: string;
  telefone?: string;
  avatarUrl?: string;
  createdAt: string;       // ✅ novo campo
  ultimoAcesso: string;    // ✅ novo campo
}

interface LoginResponse {
  token: string;
  user: User;
}

interface RegisterData {
  nome: string;
  telefone: string;
  email: string;
  senha: string;
  cidade: string;
}

export interface UpdateUserData {
  nome: string;
  telefone?: string;
  cidade: string;
  email: string;
  avatarUrl?: string;
}

export interface UpdateEmailPayload {
  newEmail: string;
  motivo: string;
}

export interface UpdateEmailResponse {
  message: string;
  user: User;
}

// 📊 Tipos para overview
export interface Simulation {
  id: number;
  title: string;
  entry: number;
  installments: number;
  installmentValue: number;
  date: string;
}

// authService.ts
export interface UserOverview {
  user: User;
  simulations: Simulation[]; // ✅ Adicionado
  favoritosCount: number;
}



// 🔐 Login
export async function login(email: string, senha: string): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/users/login", { email, senha });
  return response.data;
}

// 📝 Cadastro
export async function registerUser(data: RegisterData) {
  const response = await api.post("/users/register", data);
  return response.data;
}

// 🔄 Atualizar dados do usuário
export async function updateUser(
  id: number,
  data: UpdateUserData,
  token: string
): Promise<User> {
  const response = await api.put<{ message: string; user: User }>(`/users/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.user;
}

// 📤 Upload de avatar
export async function uploadAvatar(userId: number, file: File): Promise<string> {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await api.post<{ avatarUrl: string }>(
    `/users/upload/avatar/${userId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return response.data.avatarUrl;
}

// ✉️ Atualizar e-mail
export async function updateEmail(
  userId: number,
  data: UpdateEmailPayload,
  token: string
): Promise<UpdateEmailResponse> {
  const response = await api.put<UpdateEmailResponse>(
    `/users/${userId}/email`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

// 🔒 Atualizar senha
export async function updatePassword(
  userId: number,
  data: { currentPassword: string; newPassword: string },
  token: string
): Promise<{ message: string }> {
  const response = await api.put<{ message: string }>(`/users/${userId}/password`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

// 📊 Obter visão geral do usuário (dados + simulações + favoritos)
export async function getUserOverview(userId: number, token: string): Promise<UserOverview> {
  const response = await api.get<UserOverview>(`/users/${userId}/overview`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
