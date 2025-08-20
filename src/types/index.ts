// src/types/imovel.ts

// Sugestões conhecidas + mantêm flexibilidade para qualquer string do backend
export type TipoNegocio = "venda" | "aluguel" | (string & {});
export type TipoImovel =
  | "Apartamento"
  | "Condomínio"
  | "Casa Residencial"
  | (string & {});
export type CategoriaImovel =
  | "popular"
  | "promocao"
  | "destaque"
  | "venda"
  | (string & {});

export type Imovel = {
  id: number;

  // campos principais
  imagem: string;
  endereco: string;
  bairro: string;
  cidade: string;

  // classificação
  tipo: TipoImovel;
  tipoNegocio: TipoNegocio;
  categoria: CategoriaImovel;

  // numéricos (compatíveis com Prisma/rota)
  metragem: number;
  areaConstruida?: number | null; // Prisma permite opcional
  quartos: number;
  suites?: number | null;         // Prisma permite opcional
  banheiros: number;
  vagas: number;
  preco: number;

  // textos opcionais conforme backend
  infoExtra?: string;
  descricao?: string;

  // metadados que o backend retorna
  userId?: number | null;
  createdAt?: string;
  updatedAt?: string;
};
