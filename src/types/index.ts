


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


export type UsuarioResumo = {
  id: number;
  nome: string;
  telefone: string;
};

export type Imovel = {
  id: number;

  
  imagem: string;
  endereco: string;
  bairro: string;
  cidade: string;
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
};
