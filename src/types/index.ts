// src/types/imovel.ts
export type TipoNegocio = "venda" | "aluguel";

export type TipoImovel = "Apartamento" | "Condomínio" | "Casa Residencial";


export type Imovel = {
  id: number;
  imagem: string;
  titulo: string;
  endereco: string;
  metragem: number;
  quartos: number;
  banheiros: number;
  vagas: number;
  preco: string;
  infoExtra: string;
  tipoNegocio: TipoNegocio;
  tipo: TipoImovel;
};

export type ImovelCarrossel = {
  id: number;
  imagem: string;
  tipo: "Apartamento" | "Condomínio" | "Casa Residencial";
  bairro: string;
  cidade: string;
  endereco: string;
  metragem: number;
  quartos: number;
  vagas: number;
  preco: string;
  tipoNegocio: "venda" | "aluguel";
};
