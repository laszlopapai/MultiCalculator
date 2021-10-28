export interface ChangeEvent {
    date: Date;

    rateChanged: boolean;
    newRate: number; // percentage

    instalmentChanged: boolean;
    newInstalment?: number;

    prePayedAmount: number;
    prePaymentFeeRate: number; // percentage
    changeFeeCost: number;
}