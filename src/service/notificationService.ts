import api from "./api";

export interface NotificationPreference {
  id?: number;        // id interno (opcional)
  uuid?: string;      // ✅ uuid retornado pelo backend
  tipo: string;
  porEmail: boolean;
  porPush: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 🔹 Busca TODAS as preferências do usuário autenticado e,
 * opcionalmente, filtra por tipo.
 *
 * O backend retorna um array com:
 * { id, uuid, tipo, porEmail, porPush, createdAt, updatedAt }
 */
export async function getNotificationPreferences(
  token: string,
  tipo?: string
): Promise<NotificationPreference[] | NotificationPreference | null> {
  try {
    const response = await api.get<NotificationPreference[]>(`/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (tipo) {
      // filtra a preferência específica, se solicitado
      return response.data.find((pref) => pref.tipo === tipo) || null;
    }

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar preferências de notificação:", error);
    throw error;
  }
}

/**
 * 🔒 Cria ou atualiza uma preferência de notificação.
 * Continua usando userId da sessão, mas já retorna o UUID da preferência.
 */
export async function saveNotificationPreference(
  data: Pick<NotificationPreference, "tipo" | "porEmail" | "porPush">,
  token: string
): Promise<NotificationPreference> {
  try {
    const response = await api.post<NotificationPreference>(`/notifications`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao salvar preferência de notificação:", error);
    throw error;
  }
}
