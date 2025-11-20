import api from "./api";


export interface ChatContato {
  id: number;
  nome: string;
  avatar?: string;
  avatarUrl?: string;
  role?: "USER" | "CORRETOR" | "ADMIN";
  ultimaMensagem?: string;
  horario?: string;
  online?: boolean;
}

export interface ChatMensagem {
  id: number;
  conteudo: string;
  remetenteId: number;
  destinatarioId: number;
  criadoEm: string;
}


export async function listarConversasDoUsuario(
  userId: number
): Promise<ChatContato[]> {
  try {
    const { data } = await api.get(`/chat/conversas/${userId}`);

    
    if (Array.isArray(data)) return data;
    if (data?.corretores) return data.corretores;
    return [];
  } catch (error) {
    console.error("❌ Erro ao listar conversas do usuário:", error);
    return [];
  }
}

export async function listarMensagensEntreUsuarios(
  usuarioA: number,
  usuarioB: number
): Promise<ChatMensagem[]> {
  try {
    const { data } = await api.get(`/chat/mensagens/${usuarioA}/${usuarioB}`);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("❌ Erro ao listar mensagens entre usuários:", error);
    return [];
  }
}
