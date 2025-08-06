import api from "./api";


export const toggleFavorite = async (
  propertyId: number,
  isFavorited: boolean,
  token: string
) => {
  try {
    if (isFavorited) {
      
      await api.delete(`/favorites/${propertyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      
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


export const getUserFavorites = async (token: string): Promise<number[]> => {
  try {
    const response = await api.get("/favorites", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; 
  } catch (error) {
    console.error("Erro ao buscar IDs de favoritos:", error);
    return [];
  }
};


export const getFavoritedProperties = async (token: string) => {
  try {
    const ids = await getUserFavorites(token);

    if (ids.length === 0) return []; 

    const response = await api.post(
      "/property/by-ids", 
      { ids },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data; 
  } catch (error) {
    console.error("Erro ao buscar imóveis favoritos completos:", error);
    return [];
  }
};
