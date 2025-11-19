// src/types/index.ts
// ✅ Tipos globais do frontend, alinhados com o schema do Prisma

// ------------------------------
// Categorias / Tipos de Imóvel
// ------------------------------
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

// ------------------------------
// Usuários
// ------------------------------
export type Role = "admin" | "user";

export type User = {
  id: number;
  uuid?: string;
  nome: string;
  telefone: string;
  email?: string;
  avatarUrl?: string | null;
  cidade?: string; 
  createdAt?: string;
  quantidadeImoveis?: number;

  // 🔑 Controle de acesso
  role: Role;
};
export type UsuarioResumo = {
  id: number;
  uuid?: string;
  nome: string;
  telefone: string;
  email?: string;
  avatarUrl?: string | null;
  cidade?: string; // 🔹 cidade agora é string simples
 
};

// ------------------------------
// Imóveis
// ------------------------------
export type Imovel = {
  id: number;
  uuid?: string;

  imagem: string;
  endereco: string;
  bairro: string;

  // 🔹 Cidade como string (única fonte da verdade)
  cidade?: string;

  ativo: boolean;

  tipo: TipoImovel;
  tipoNegocio: TipoNegocio;
  categoria: CategoriaImovel;

  metragem: number;
  areaConstruida?: number | null;
  quartos: number;
  suites?: number | null;
  banheiros: number;
  vagas: number;
  preco: number;

  caracteristicas?: string[];
  descricao?: string;

  userId?: number | null;
  createdAt?: string;
  updatedAt?: string;

  user?: UsuarioResumo;
   /** 🔴 ESTE É O CAMPO NOVO QUE FALTAVA */
  isFavorito?: boolean;
};
