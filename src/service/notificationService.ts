import api from "./api";

export interface NotificationPreference {
  tipo: string;
  porEmail: boolean;
  porPush: boolean;
}

export const getNotificationPreferences = async (
  tipo: string,
  token: string
) => {
  try {
    const response = await api.get(`/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    
    if (Array.isArray(response.data)) {
      return response.data.find(
        (pref: NotificationPreference) => pref.tipo === tipo
      );
    } else {
      console.warn("Resposta inesperada ao buscar preferências:", response.data);
      return null;
    }
  } catch (error) {
    console.error("Erro ao buscar preferências de notificação:", error);
    throw error;
  }
};

export const saveNotificationPreference = async (
  data: NotificationPreference,
  token: string
) => {
  try {
    const response = await api.post(`/notifications`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao salvar preferência de notificação:", error);
    throw error;
  }
};