
import api from "./api";
import { Imovel } from "@/types/index";


export type CreatePropertyPayload = {
  endereco: string;
  bairro: string;
  cidade: string;
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




export async function buscarImoveis(): Promise<Imovel[]> {
  const { data } = await api.get<Imovel[]>("/property");
  return data;
}


export async function buscarImoveisPorCidade(cidade: string): Promise<Imovel[]> {
  const { data } = await api.get<Imovel[]>("/property", { params: { cidade } });
  return data;
}

export async function buscarImoveisSimilares(id: number) {
  const response = await api.get(`/property/similares/${id}`);
  return response.data;
}



export async function buscarImovelPorId(id: number): Promise<Imovel> {
  const { data } = await api.get<Imovel>(`/property/${id}`);
  return data;
}


export async function criarImovel(formData: FormData): Promise<Imovel> {
  const { data } = await api.post<Imovel>("/property", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}


export async function atualizarImovel(
  id: number,
  payload: UpdatePropertyPayload | FormData
): Promise<Imovel> {
  const isFormData = payload instanceof FormData;

  const { data } = await api.put<Imovel>(
    `/property/${id}`,
    payload,
    isFormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : undefined
  );

  return data;
}


export async function deletarImovel(id: number): Promise<void> {
  await api.delete(`/property/${id}`);
}


export async function buscarImoveisPorIds(ids: number[]): Promise<Imovel[]> {
  const { data } = await api.post<Imovel[]>("/property/by-ids", { ids });
  return data;
}


export async function buscarMeusImoveis(): Promise<Imovel[]> {
  const { data } = await api.get<Imovel[]>("/property/mine");
  return data;
}

export async function enviarContato(propertyId: number, data: {
  nome?: string;
  email?: string;
  telefone?: string;
  mensagem?: string;
}) {
  const response = await api.post(`/property/${propertyId}/contact`, data);
  return response.data;
}

export async function atualizarStatusImovel(id: number, ativo: boolean): Promise<{ id: number; ativo: boolean }> {
  const { data } = await api.patch<{ id: number; ativo: boolean }>(`/property/${id}/ativo`, { ativo });
  return data;
}