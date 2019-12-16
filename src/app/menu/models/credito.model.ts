export interface Credito{
    id: string;
    cliente: string;
    dataAprovacaoCredito: string;
    dataExpiracaoCredito: string;
    valorCredito: string;
    arquivo?: string;
}