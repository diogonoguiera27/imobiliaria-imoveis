import api from "./api";

export interface User {
  id: number;          // ID interno (nunca exiba no front)
  uuid?: string;       // ✅ UUID seguro para rotas públicas
  nome: string;
  email: string;
  cidade: string;
  telefone?: string;
  avatarUrl?: string;
  createdAt: string;
  ultimoAcesso: string;

  role: "ADMIN" | "USER";
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

export interface Simulation {
  id: number;
  uuid?: string; // ✅ Agora o backend também retorna uuid
  title: string;
  entry: number;
  installments: number;
  installmentValue: number;
  date: string;
}

export interface UserOverview {
  user: User;
  simulations: Simulation[];
  favoritosCount: number;
}

/**
 * Define ou remove o token de autenticação globalmente
 */
export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

/**
 * Login do usuário
 */
export async function login(
  email: string,
  senha: string
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/users/login", {
    email,
    senha,
  });
  return response.data;
}

/**
 * Retorna os dados do usuário logado (com uuid)
 */
export async function getMe(): Promise<User> {
  const { data } = await api.get<User>("/users/me");
  return data;
}

/**
 * Registro de novo usuário
 */
export async function registerUser(data: RegisterData) {
  const response = await api.post("/users/register", data);
  return response.data;
}

/**
 * Atualiza os dados do usuário autenticado
 * ⚡ Ainda usa ID interno porque é uma rota protegida e já exige token
 */
export async function updateUser(
  id: number,
  data: UpdateUserData,
  token: string
): Promise<User> {
  const response = await api.put<{ message: string; user: User }>(
    `/users/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.user;
}

/**
 * Upload de avatar
 * ⚡ Continua usando ID porque é uma rota autenticada
 */
export async function uploadAvatar(
  userId: number,
  file: File
): Promise<string> {
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

/**
 * Atualiza e-mail do usuário
 */
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

/**
 * Atualiza senha do usuário
 */
export async function updatePassword(
  userId: number,
  data: { currentPassword: string; newPassword: string },
  token: string
): Promise<{ message: string }> {
  const response = await api.put<{ message: string }>(
    `/users/${userId}/password`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

/**
 * Resumo do usuário para painel
 * ⚡ Se disponível, use UUID em vez de ID (mais seguro para links públicos)
 */
export async function getUserOverview(
  identifier: number | string,
  token: string
): Promise<UserOverview> {
  const response = await api.get<UserOverview>(
    `/users/${identifier}/overview`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

/**
 * Fluxo de recuperação de senha
 */
export async function sendForgotPassword(email: string) {
  const { data } = await api.post<{ message: string }>(
    "/auth/forgot-password",
    { email }
  );
  return data;
}

export async function verifyResetCode(email: string, code: string) {
  const { data } = await api.post<{ message: string }>(
    "/auth/verify-reset-code",
    { email, code }
  );
  return data;
}

export async function resetPassword(email: string, newPassword: string) {
  const { data } = await api.post<{ message: string }>(
    "/auth/reset-password",
    { email, newPassword }
  );
  return data;
}
