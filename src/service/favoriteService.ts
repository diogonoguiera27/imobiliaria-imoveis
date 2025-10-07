// ✅ src/service/favoriteService.ts
import api from "./api";
import { PaginatedProperties } from "./propertyService";

export interface FavoriteIdentifier {
  propertyId: number; // ID interno do imóvel
  propertyUuid?: string; // UUID público do imóvel
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

    // 🔍 Detecta UUID válido (formato padrão 8-4-4-4-12)
    const isUuid = (val: string): boolean =>
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        val
      );

    if (isFavorited) {
      // ✅ Remover favorito
      await api.delete(`/favorites/${identifier}`, { headers });
    } else {
      // ✅ Adicionar favorito
      let body: Record<string, string | number>;

      if (typeof identifier === "string") {
        // Se for string numérica ex: "123" → trata como ID
        if (/^\d+$/.test(identifier)) {
          body = { propertyId: Number(identifier) };
        }
        // Se for UUID válido → envia propertyUuid
        else if (isUuid(identifier)) {
          body = { propertyUuid: identifier };
        } else {
          throw new Error("Identificador inválido (não é ID nem UUID)");
        }
      } else {
        // Se vier número direto → propertyId
        body = { propertyId: identifier };
      }

      await api.post("/favorites", body, { headers });
    }
  } catch (error) {
    console.error("❌ Erro ao favoritar/desfavoritar imóvel:", error);
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
    const response = await api.get<{
      data: { id?: number; uuid?: string | null }[];
      pagination?: object;
    }>("/favorites", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const favoritos = Array.isArray(response.data?.data)
      ? response.data.data
      : [];

    // ✅ Extrai corretamente os identificadores retornados do backend
    return favoritos.map((f) => ({
      propertyId: f.id ?? 0,
      propertyUuid: f.uuid ?? undefined,
    }));
  } catch (error) {
    console.error("❌ Erro ao buscar favoritos:", error);
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
    console.error("❌ Erro ao buscar imóveis favoritos completos:", error);
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
    console.error("❌ Erro ao buscar favoritos paginados:", error);
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
