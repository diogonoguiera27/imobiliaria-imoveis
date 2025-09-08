import api from "./api";


export interface User {
  id: number;
  nome: string;
  email: string;
  cidade: string;
  telefone?: string;
  avatarUrl?: string;
  createdAt: string;
  ultimoAcesso: string;
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


export function setAuthToken(token: string | null) {
  if (token) {
    
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}


export async function login(email: string, senha: string): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/users/login", { email, senha });
  return response.data;
}


export async function getMe(): Promise<User> {
  const { data } = await api.get<User>("/users/me");
  return data;
}


export async function registerUser(data: RegisterData) {
  const response = await api.post("/users/register", data);
  return response.data;
}

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


export async function getUserOverview(userId: number, token: string): Promise<UserOverview> {
  const response = await api.get<UserOverview>(`/users/${userId}/overview`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}


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
