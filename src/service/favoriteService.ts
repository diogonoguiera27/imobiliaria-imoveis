import api from "./api";

export interface FavoriteIdentifier {
  propertyId: number;     // ID interno do imóvel
  propertyUuid?: string;  // ✅ UUID público do imóvel
}

/**
 * Alterna o status de favorito de um imóvel.
 * 🔑 Aceita tanto ID quanto UUID. Prefira UUID quando disponível.
 */
export const toggleFavorite = async (
  identifier: number | string,
  isFavorited: boolean,
  token: string
): Promise<void> => {
  try {
    const headers = { Authorization: `Bearer ${token}` };

    if (isFavorited) {
      // Se já está favoritado, remove
      await api.delete(`/favorites/${identifier}`, { headers });
    } else {
      // Se não está, adiciona
      // Se for string, é tratado como UUID
      const body =
        typeof identifier === "string"
          ? { propertyUuid: identifier }
          : { propertyId: Number(identifier) };

      await api.post("/favorites", body, { headers });
    }
  } catch (error) {
    console.error("Erro ao favoritar/desfavoritar imóvel:", error);
    throw error;
  }
};

/**
 * Retorna a lista de favoritos do usuário autenticado.
 * Agora retorna IDs **e** UUIDs de cada imóvel.
 */
export const getUserFavorites = async (
  token: string
): Promise<FavoriteIdentifier[]> => {
  try {
    const response = await api.get<FavoriteIdentifier[]>("/favorites", {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Exemplo de item retornado:
    // { propertyId: 123, propertyUuid: "550e8400-e29b-41d4-a716-446655440000" }
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar favoritos:", error);
    return [];
  }
};

/**
 * Retorna os imóveis favoritos completos.
 * Pode enviar IDs ou UUIDs para o backend.
 */
export const getFavoritedProperties = async (token: string) => {
  try {
    const favs = await getUserFavorites(token);
    if (favs.length === 0) return [];

    // Envia a lista mista de IDs/UUIDs para o backend
    const idsOrUuids = favs.map((f) => f.propertyUuid || f.propertyId);

    const response = await api.post(
      "/property/by-ids",
      { ids: idsOrUuids },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar imóveis favoritos completos:", error);
    return [];
  }
};
