export interface Aluno {
  id: string;
  nome: string;
  cpf?: string;
  email?: string;
}

export interface Pessoa {
  id?: string; //UUID
  nome: string;
}

export interface SubCategoria {
  id?: string;
  nome: string;
}

export interface Categoria {
  id?: string;
  nome: string;
  subCategorias?: SubCategoria[];  
}

export interface ContaReceber {
  id?: string;
  descricao?: string;
  valor: number;
  vencimento: string;

  excluido?: boolean;
  dataExclusao?: string;
  motivoExclusao?: string;

  recebido?: boolean;
  dataRecebimento?: string;
  meioRecebimento?: string;
  obsRecebimento?: string;
  
  categoriaId?: string,
  subCategoriaId?: string,
  pessoaId?: string,
  categoriaNome?: string,
  subCategoriaNome?: string,
  pessoaNome?: string,
}

export interface RegistrarRecebimento {
  dataRecebimento: string;
  meioRecebimento: string;
  obsRecebimento: string;
}

export interface EstornarRecebimento {
  observacao: string;
}