import api from "./api";

// ✅ Tipo esperado do backend
export interface User {
  id: number;                 // ID interno (não exibir em URLs públicas)
  uuid?: string;               // ✅ UUID seguro para rotas públicas
  nome: string;
  email: string;
  cidade: string;
  telefone: string;
  avatarUrl?: string;
  createdAt: string;
  quantidadeImoveis: number;
}

export interface PaginatedUsers {
  data: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Lista usuários com paginação.
 * ⚡ Pode ser usado para painéis de administração.
 */
export async function getUsers(
  page = 1,
  limit = 10
): Promise<PaginatedUsers> {
  const res = await api.get<PaginatedUsers>(`/users?page=${page}&limit=${limit}`);
  return res.data;
}

/**
 * Buscar um usuário específico.
 * ✅ Aceita tanto ID numérico (admin interno) quanto UUID (link seguro).
 */
export async function getUserByIdentifier(
  identifier: number | string
): Promise<User> {
  const response = await api.get<User>(`/users/${identifier}`);
  return response.data;
}

/**
 * Excluir usuário (rota administrativa)
 * ⚡ Continua usando ID interno, pois só deve ser acessível em contexto autenticado de admin.
 */
export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/users/${id}`);
}
