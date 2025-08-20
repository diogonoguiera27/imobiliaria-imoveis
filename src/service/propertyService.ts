// src/service/propertyService.ts
import api from "./api";
import { Imovel } from "@/types/index";

// Payload de criação alinhado ao backend (o userId é lido do token no backend)
export type CreatePropertyPayload = {
  imagem: string;
  endereco: string;
  bairro: string;
  cidade: string;
  tipo: string;         // backend aceita string livre
  tipoNegocio: string;  // idem
  categoria: string;    // idem
  metragem: number;
  areaConstruida?: number | null; // compatível com Prisma
  quartos: number;
  suites?: number | null;         // compatível com Prisma
  banheiros: number;
  vagas: number;
  preco: number;
  infoExtra?: string;
  descricao?: string;
};

export type UpdatePropertyPayload = Partial<CreatePropertyPayload>;

// -------------------- chamadas --------------------

// 🔍 Listar todos
export async function buscarImoveis(): Promise<Imovel[]> {
  const { data } = await api.get<Imovel[]>("/property");
  return data;
}

// 🔍 Listar por cidade (prioriza a cidade, depois o resto)
export async function buscarImoveisPorCidade(cidade: string): Promise<Imovel[]> {
  const { data } = await api.get<Imovel[]>("/property", { params: { cidade } });
  return data;
}

// 🔎 Buscar por ID
export async function buscarImovelPorId(id: number): Promise<Imovel> {
  const { data } = await api.get<Imovel>(`/property/${id}`);
  return data;
}

// 🆕 Criar imóvel (userId vem do token no backend)
export async function criarImovel(payload: CreatePropertyPayload): Promise<Imovel> {
  const { data } = await api.post<Imovel>("/property", payload);
  return data;
}

// ✏️ Atualizar imóvel
export async function atualizarImovel(
  id: number,
  payload: UpdatePropertyPayload
): Promise<Imovel> {
  const { data } = await api.put<Imovel>(`/property/${id}`, payload);
  return data;
}

// 🗑️ Deletar imóvel
export async function deletarImovel(id: number): Promise<void> {
  await api.delete(`/property/${id}`);
}

// 📦 Buscar vários por IDS
export async function buscarImoveisPorIds(ids: number[]): Promise<Imovel[]> {
  const { data } = await api.post<Imovel[]>("/property/by-ids", { ids });
  return data;
}

// 🔐 Listar somente os imóveis do usuário autenticado
export async function buscarMeusImoveis(): Promise<Imovel[]> {
  const { data } = await api.get<Imovel[]>("/property/mine");
  return data;
}