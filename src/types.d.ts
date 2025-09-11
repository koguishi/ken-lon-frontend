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
