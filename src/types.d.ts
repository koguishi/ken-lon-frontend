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