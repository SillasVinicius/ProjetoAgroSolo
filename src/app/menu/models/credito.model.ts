export interface Credito{
    id: string;
    clienteId: string;
    dataAprovacaoCredito: string;
    dataExpiracaoCredito: string;
    valorCredito: string;
    arquivo?: string;
}