import api from "./api";
import { PaginatedProperties } from "./propertyService";

export interface FavoriteIdentifier {
  propertyId: number;     // ID interno do imóvel
  propertyUuid?: string;  // ✅ UUID público do imóvel
}

/* =========================================================
   🔹 Alternar favorito (adiciona ou remove)
   ========================================================= */
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

/* =========================================================
   🔹 Buscar apenas os identificadores (IDs/UUIDs) dos favoritos
   ========================================================= */
export const getUserFavorites = async (
  token: string
): Promise<FavoriteIdentifier[]> => {
  try {
    const response = await api.get<FavoriteIdentifier[]>("/favorites", {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Exemplo de retorno:
    // { propertyId: 123, propertyUuid: "550e8400-e29b-41d4-a716-446655440000" }
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar favoritos:", error);
    return [];
  }
};

/* =========================================================
   🔹 Buscar imóveis favoritos completos (sem paginação)
   ⚠️ Uso legado → em novas telas prefira buscarFavoritosPaginados
   ========================================================= */
export const getFavoritedProperties = async (token: string) => {
  try {
    const favs = await getUserFavorites(token);
    if (favs.length === 0) return [];

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

/* =========================================================
   🔹 Buscar imóveis favoritos completos com paginação
   ✅ Use este em /imoveis-favoritos
   ========================================================= */
export const buscarFavoritosPaginados = async (
  token: string,
  params?: { page?: number; take?: number }
): Promise<PaginatedProperties> => {
  try {
    const { data } = await api.get<PaginatedProperties>("/favorites", {
      params,
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    console.error("Erro ao buscar favoritos paginados:", error);
    return {
      data: [],
      pagination: {
        total: 0,
        page: params?.page || 1,
        take: params?.take || 6,
        totalPages: 1,
      },
    };
  }
};
