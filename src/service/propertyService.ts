// src/service/propertyService.ts
import api from "./api";
import { Imovel } from "@/types/index";

export type CreatePropertyPayload = {
  endereco: string;
  bairro: string;
  cidade?: string; // legado
  cityId?: number; // novo
  tipo: string;
  tipoNegocio: string;
  categoria: string;
  metragem: number;
  areaConstruida?: number | null;
  quartos: number;
  suites?: number | null;
  banheiros: number;
  vagas: number;
  preco: number;
  caracteristicas?: string[];
  descricao?: string;
};

export type UpdatePropertyPayload = Partial<CreatePropertyPayload>;

/* =========================================================
   🔹 Lista geral de imóveis (público)
   - Pode receber filtros: cidade, cityId, tipo, precoMax
   ========================================================= */
export async function buscarImoveis(filtros?: {
  cidade?: string;
  cityId?: number | null;
  tipo?: string;
  precoMax?: number;
}): Promise<Imovel[]> {
  const { data } = await api.get<Imovel[]>("/property", {
    params: filtros,
  });
  return data;
}

/* =========================================================
   🔹 Lista filtrando por cidade (público – legado)
   ========================================================= */
export async function buscarImoveisPorCidade(
  cidade: string
): Promise<Imovel[]> {
  const { data } = await api.get<Imovel[]>("/property", { params: { cidade } });
  return data;
}

/* =========================================================
   🔹 Busca imóveis similares
   ========================================================= */
export async function buscarImoveisSimilares(identifier: string | number) {
  const response = await api.get(`/property/similares/${identifier}`);
  return response.data;
}

/* =========================================================
   🔹 Busca um único imóvel
   ========================================================= */
export async function buscarImovel(
  identifier: string | number
): Promise<Imovel> {
  const { data } = await api.get<Imovel>(`/property/${identifier}`);
  return data;
}

/* =========================================================
   🔒 Criar imóvel (privado – usa userId da sessão)
   ========================================================= */
export async function criarImovel(formData: FormData): Promise<Imovel> {
  const { data } = await api.post<Imovel>("/property", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

/* =========================================================
   🔒 Atualizar imóvel
   ========================================================= */
export async function atualizarImovel(
  identifier: number,
  payload: UpdatePropertyPayload | FormData
): Promise<Imovel> {
  const isFormData = payload instanceof FormData;
  const { data } = await api.put<Imovel>(
    `/property/${identifier}`,
    payload,
    isFormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : undefined
  );
  return data;
}

/* =========================================================
   🔒 Deletar (desativar) imóvel
   ========================================================= */
export async function deletarImovel(identifier: number): Promise<void> {
  await api.delete(`/property/${identifier}`);
}

/* =========================================================
   🔹 Buscar vários imóveis por lista de IDs ou UUIDs
   ========================================================= */
export async function buscarImoveisPorIds(
  ids: (number | string)[]
): Promise<Imovel[]> {
  const { data } = await api.post<Imovel[]>("/property/by-ids", { ids });
  return data;
}

/* =========================================================
   🔒 Meus imóveis (privado – sempre id numérico)
   ========================================================= */
export async function buscarMeusImoveis(): Promise<Imovel[]> {
  const { data } = await api.get<Imovel[]>("/property/mine");
  return data;
}

/* =========================================================
   🔹 Enviar contato
   ========================================================= */
export async function enviarContato(
  identifier: string | number,
  data: {
    nome?: string;
    email?: string;
    telefone?: string;
    mensagem?: string;
  }
) {
  const response = await api.post(`/property/${identifier}/contact`, data);
  return response.data;
}

/* =========================================================
   🔒 Atualizar status ativo/inativo
   ========================================================= */
export async function atualizarStatusImovel(
  identifier: string | number,
  ativo: boolean
): Promise<{ id: number; uuid: string | null; ativo: boolean }> {
  const { data } = await api.patch<{
    id: number;
    uuid: string | null;
    ativo: boolean;
  }>(`/property/${identifier}/ativo`, { ativo });
  return data;
}
