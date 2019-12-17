export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha: string;
  foto?: string;
  admin?: false;
}
