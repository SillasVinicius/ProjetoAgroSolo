export interface Cliente {
  id: string;
  nome: string;
  cpf: string;
  patrimonio: string;
  pdtvAgro: string;
  rg: string;
  telefone: string;
  dataNascimento: string;
  email: string;
  senha: string;
  informacoesAdicionais?: string;
  foto?: string;
  nomeFoto?: string;
  impostoRenda?: string;
  nomeIr?: string;
  cnh?: string;
  nomeCnh?: string;
}
