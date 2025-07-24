import api from "./api";

interface LoginResponse {
  token: string;
  user: {
    id: number;
    nome: string;
    email: string;
    cidade: string;
    telefone?: string;
    avatarUrl?: string;
  };
}

interface RegisterData {
  nome: string;
  telefone: string;
  email: string;
  senha: string;
  cidade: string;
}

interface UpdateUserData {
  nome: string;
  telefone?: string;
  email: string;
  cidade: string;
  avatarUrl?: string; // ✅ adicione isso
}


export interface UpdateEmailPayload {
  newEmail: string;
  motivo: string;
}

export interface UpdateEmailResponse {
  message: string;
  user: {
    id: number;
    nome: string;
    email: string;
    cidade: string;
    telefone?: string;
    avatarUrl?: string;
  };
}
// 🔑 Login
export async function login(email: string, senha: string): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/users/login", { email, senha });
  return response.data;
}

// 📝 Cadastro
export async function registerUser(data: RegisterData) {
  const response = await api.post("/users/register", data);
  return response.data;
}

// 🔄 Atualizar perfil
export async function updateUser(id: number, data: UpdateUserData) {
  const response = await api.put(`/users/${id}`, data);
  return response.data;
}

// 📤 Upload de avatar
export async function uploadAvatar(userId: number, file: File): Promise<string> {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await api.post(`/users/upload/avatar/${userId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data.avatarUrl;
}


// ✅ Funções no topo do escopo (fora de objetos, fora de outros métodos)

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
) {
  const response = await api.put(`/users/${userId}/password`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}


