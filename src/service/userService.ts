// src/service/userService.ts
import api from "./api";

/* =========================================================
   🔹 Tipos
   ========================================================= */
export interface User {
  id: number;
  uuid?: string;
  nome: string;
  email: string;
  cidade: string;
  telefone?: string; // 🔹 agora opcional para alinhar com authService
  avatarUrl?: string;
  createdAt: string;
  ultimoAcesso?: string;
  quantidadeImoveis?: number;
  role: "ADMIN" | "USER" | "CORRETOR";
}

export interface Simulation {
  id: number;
  userId: number;
  valor: number;
  prazo: number;
  createdAt: string;
}

export interface PaginatedUsers {
  data: User[];
  pagination: {
    total: number;
    page: number;
    take: number; // 🔄 alinhado com backend
    totalPages: number;
  };
}

/* =========================================================
   🔹 Listagem de usuários (ADMIN)
   ========================================================= */
export async function getUsers(
  page = 1,
  take = 10
): Promise<PaginatedUsers> {
  const { data } = await api.get<PaginatedUsers>("/users", {
    params: { page, take },
  });
  return data;
}

/* =========================================================
   🔹 Buscar usuário pelo ID
   ========================================================= */
export async function getUserByIdentifier(
  identifier: number | string
): Promise<User> {
  const { data } = await api.get<User>(`/users/${identifier}`);
  return data;
}

/* =========================================================
   🔹 Excluir usuário (somente o próprio ou Admin pode)
   ========================================================= */
export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/users/${id}`);
}

/* =========================================================
   🔹 Upload de avatar
   ========================================================= */
export async function uploadAvatar(
  userId: number,
  file: File
): Promise<{ avatarUrl: string }> {
  const formData = new FormData();
  formData.append("avatar", file);

  const { data } = await api.post<{ avatarUrl: string }>(
    `/users/upload/avatar/${userId}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return data;
}

/* =========================================================
   🔹 Alterar email
   ========================================================= */
export async function updateUserEmail(
  id: number,
  newEmail: string,
  motivo: string
): Promise<{ message: string; user: User }> {
  const { data } = await api.put<{ message: string; user: User }>(
    `/users/${id}/email`,
    { newEmail, motivo }
  );
  return data;
}

/* =========================================================
   🔹 Alterar senha
   ========================================================= */
export async function updateUserPassword(
  id: number,
  currentPassword: string,
  newPassword: string
): Promise<{ message: string }> {
  const { data } = await api.put<{ message: string }>(`/users/${id}/password`, {
    currentPassword,
    newPassword,
  });
  return data;
}

/* =========================================================
   🔹 Atualizar perfil
   ========================================================= */
export async function updateUserProfile(
  id: number,
  payload: Partial<Pick<User, "nome" | "telefone" | "cidade" | "avatarUrl">>
): Promise<{ message: string; user: User }> {
  const { data } = await api.put<{ message: string; user: User }>(
    `/users/${id}`,
    payload
  );
  return data;
}

/* =========================================================
   🔹 Overview do usuário
   ========================================================= */
export async function getUserOverview(
  id: number
): Promise<{
  user: User;
  favoritosCount: number;
  simulations: Simulation[];
}> {
  const { data } = await api.get<{
    user: User;
    favoritosCount: number;
    simulations: Simulation[];
  }>(`/users/${id}/overview`);

  return data;
}
