export interface LoanSummary {
    name: string;
    duration: number;
    fee: number;
    interest: number;
    prePayment: number;
    payed: number;
    realAPR: number; // percentage
}