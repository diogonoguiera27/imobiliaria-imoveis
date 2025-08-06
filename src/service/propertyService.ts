import api from "./api";
import { Imovel } from "../types";


export async function buscarImoveis(): Promise<Imovel[]> {
  const response = await api.get<Imovel[]>("/property");
  return response.data;
}


export async function buscarImoveisPorCidade(cidade: string): Promise<Imovel[]> {
  const response = await api.get<Imovel[]>("/property", {
    params: { cidade },
  });
  return response.data;
}
