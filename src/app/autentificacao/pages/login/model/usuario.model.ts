export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha: string;
  foto?: string;
  nomeFoto?: string;
  admin?: true;
}
