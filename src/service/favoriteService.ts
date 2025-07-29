import api from "./api";

// Adiciona ou remove um imóvel dos favoritos
export const toggleFavorite = async (
  propertyId: number,
  isFavorited: boolean,
  token: string
) => {
  try {
    if (isFavorited) {
      // Já favoritado → remover
      await api.delete(`/favorites/${propertyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      // Ainda não favoritado → adicionar
      await api.post(
        "/favorites",
        { propertyId: Number(propertyId) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }
  } catch (error) {
    console.error("Erro ao favoritar/desfavoritar imóvel:", error);
    throw error;
  }
};

// Retorna apenas os IDs dos imóveis favoritados
export const getUserFavorites = async (token: string): Promise<number[]> => {
  try {
    const response = await api.get("/favorites", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Ex: [1, 2, 3]
  } catch (error) {
    console.error("Erro ao buscar IDs de favoritos:", error);
    return [];
  }
};

// ✅ Retorna os dados completos dos imóveis favoritados
export const getFavoritedProperties = async (token: string) => {
  try {
    const ids = await getUserFavorites(token);

    if (ids.length === 0) return []; // Nenhum favorito

    const response = await api.post(
      "/property/by-ids", // ✅ Correção: rota correta com base no seu backend
      { ids },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data; // Array de imóveis com todos os campos
  } catch (error) {
    console.error("Erro ao buscar imóveis favoritos completos:", error);
    return [];
  }
};
