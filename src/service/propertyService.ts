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
   🔹 Tipo para resposta paginada
   ========================================================= */
export interface PaginatedProperties {
  data: Imovel[];
  pagination: {
    total: number;
    page: number;
    take: number;
    totalPages: number;
  };
}


export async function buscarImoveis(params?: {
  cidade?: string;
  cityId?: number | null;
  tipo?: string;
  precoMax?: number;
  categoria?: string; 
  page?: number;
  take?: number;
}): Promise<PaginatedProperties> {
  const { data } = await api.get<PaginatedProperties>("/property", { params });
  return data;
}

/* =========================================================
   🔹 Lista filtrando por cidade (legado, sem paginação)
   ========================================================= */
export async function buscarImoveisPorCidade(cidade: string): Promise<Imovel[]> {
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
export async function buscarImovel(identifier: string | number): Promise<Imovel> {
  const { data } = await api.get<Imovel>(`/property/${identifier}`);
  return data;
}

/* =========================================================
   🔒 Criar imóvel
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
  identifier: number | string,
  payload: UpdatePropertyPayload | FormData
): Promise<Imovel> {
  const isFormData = payload instanceof FormData;
  const { data } = await api.put<Imovel>(
    `/property/${identifier}`,
    payload,
    isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : undefined
  );
  return data;
}





export async function buscarImoveisPorIds(ids: (number | string)[]): Promise<Imovel[]> {
  const { data } = await api.post<Imovel[]>("/property/by-ids", { ids });
  return data;
}


export async function buscarMeusImoveis(params?: {
  page?: number;
  take?: number;
  cidade?: string;
  tipo?: string;
  negocio?: string;
  ativo?: boolean;
}): Promise<PaginatedProperties> {
  const { data } = await api.get<PaginatedProperties>("/property/mine", { params });
  return data;
}


export async function enviarContato(
  identifier: string | number,
  data: { nome?: string; email?: string; telefone?: string; mensagem?: string }
) {
  const response = await api.post(`/property/${identifier}/contact`, data);
  return response.data;
}


export async function atualizarStatusImovel(
  identifier: string | number,
  ativo: boolean
): Promise<{ id: number; uuid: string | null; ativo: boolean }> {
  const { data } = await api.patch<{ id: number; uuid: string | null; ativo: boolean }>(
    `/property/${identifier}/ativo`,
    { ativo }
  );
  return data;
}

export async function buscarCidadesDoUsuario(): Promise<string[]> {
  const { data } = await api.get<string[]>("/property/mine/cities");
  return data;
}

// src/service/propertyService.ts
export async function getCorretorByProperty(propertyId: number | string) {
  if (!propertyId) throw new Error("ID do imóvel inválido");

  const response = await api.get(`/property/${propertyId}/corretor`);
  return response.data.corretor;
}
