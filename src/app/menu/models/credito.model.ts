export interface Credito{
    id: string;
    cliente: string;
    dataAprovacaoCredito: string;
    dataExpiracaoCredito: string;
    ValorCredito: string;
    arquivo?: string;
}