import api from "./api";
import { Imovel } from "../types";

// 🔹 Buscar todos os imóveis (sem filtro)
export async function buscarImoveis(): Promise<Imovel[]> {
  const response = await api.get<Imovel[]>("/property");
  return response.data;
}

// 🔹 Buscar imóveis com prioridade para a cidade do usuário
export async function buscarImoveisPorCidade(cidade: string): Promise<Imovel[]> {
  const response = await api.get<Imovel[]>("/property", {
    params: {
      cidade,
    },
  });
  return response.data;
}

// 🔹 Obter estatísticas de tipos de imóveis
export async function getPropertyTypeStats(token: string) {
  const response = await api.get("/property/stats/property-types", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
