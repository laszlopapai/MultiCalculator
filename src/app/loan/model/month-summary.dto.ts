export interface MonthSummary {
    index: number;
  
    remainingCapital: number;
  
    interestRate: number;
  
    payedCapital: number;
    payedInterest: number;
    payedFee: number;
    payedInstalment: number;
    prePayment: number;
  
    cumlatedPayedCapital: number;
    cumlatedPayedInterest: number;
    cumlatedPayedFee: number;
    cumlatedPayedSum: number;
    cumlatedPrePayment: number;
  
    divergent: boolean;
}