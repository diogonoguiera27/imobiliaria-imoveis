// ✅ src/service/favoriteService.ts
import api from "./api";
import { PaginatedProperties } from "./propertyService";
import type { AxiosError } from "axios";

export interface FavoriteIdentifier {
  propertyId: number;
  propertyUuid?: string;
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

    // Detecta UUID válido
    const isUuid = (val: string): boolean =>
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(val);

    if (isFavorited) {
      // Remover favorito
      await api.delete(`/favorites/${identifier}`, { headers });
      return;
    }

    // Adicionar favorito
    let body: Record<string, string | number>;

    if (typeof identifier === "string") {
      if (/^\d+$/.test(identifier)) {
        body = { propertyId: Number(identifier) };
      } else if (isUuid(identifier)) {
        body = { propertyUuid: identifier };
      } else {
        throw new Error("Identificador inválido (não é ID nem UUID)");
      }
    } else {
      body = { propertyId: identifier };
    }

    await api.post("/favorites", body, { headers });
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

/* =========================================================
   🔹 Buscar apenas os identificadores (IDs/UUIDs)
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

    return favoritos.map((f) => ({
      propertyId: f.id ?? 0,
      propertyUuid: f.uuid ?? undefined,
    }));
  } catch {
    return [];
  }
};

/* =========================================================
   🔹 Buscar imóveis favoritos completos (sem paginação)
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
  } catch {
    return [];
  }
};

/* =========================================================
   🔹 Buscar imóveis favoritos com paginação
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
  } catch {
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
