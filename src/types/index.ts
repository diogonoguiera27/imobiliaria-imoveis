// src/types/imovel.ts

export type TipoNegocio = "venda" | "aluguel";

export type TipoImovel = "Apartamento" | "Condomínio" | "Casa Residencial";

export type CategoriaImovel = "popular" | "promocao" | "destaque"| "venda";

export type Imovel = {
  id: number;
  imagem: string;
  cidade: string;
  bairro: string;
  endereco: string;
  metragem: number;
  quartos: number;
  banheiros: number;
  vagas: number;
  preco: number;
  infoExtra: string;
  tipoNegocio: TipoNegocio;
  tipo: TipoImovel;
  categoria: CategoriaImovel; // ← campo novo incluído
  
};
