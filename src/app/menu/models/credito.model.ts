export interface Credito{
    id: string;
    clienteId: string;
    descricao: string;
    dataAprovacaoCredito: string;
    dataExpiracaoCredito: string;
    valorCredito: string;
    arquivo?: string;
}