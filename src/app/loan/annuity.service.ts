import { Injectable } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { ChangeEvent } from './model/change-event.dto';
import { LoanProperties } from './model/loan-properties.dto';
import { LoanSummary } from './model/loan-summary.dto';
import { MonthSummary } from './model/month-summary.dto';


interface ChangeDictionary {
  [monthIndex: number]: ChangeEvent[];
}

@Injectable({
  providedIn: 'root'
})
export class AnnuityService {

  private loan: LoanProperties;
  changeDictionary: ChangeDictionary = {};

  private originalMonthlySummary: MonthSummary[] = [];
  private updatedMonthlySummary: MonthSummary[] = [];
  private loanSummary: LoanSummary[] = [];
  private subscribers:any[] = [];

  constructor(private dataSrv: DataService) {
    this.loan = dataSrv.loanProperties;
  }

  public subscribe(callback: any) {
    this.subscribers.push(callback);
  }

  private notify() {
    this.subscribers.forEach(callback => callback());
  }
  
  public getLoan() : LoanProperties {
    return this.loan;
  }

  public isConvergent() : boolean {
    return this.updatedMonthlySummary.length > 0 && !this.updatedMonthlySummary[this.updatedMonthlySummary.length - 1].divergent;
  }

  public getOverallSummary(): LoanSummary[] {
    return this.loanSummary;
  }

  public getOriginalMonthlySummary() {
    return this.originalMonthlySummary;
  }

  public getMonthlySummary() {    
    return this.updatedMonthlySummary;
  }

  private getInstalment(amount: number, interest: number, months: number): number {
    return Math.ceil(
      amount * Math.pow(1 + interest, months) * interest / (Math.pow(1 + interest, months) - 1));
  }

  public getMonthIndexFromDate(date: Date): number {
      let loanDate = new Date(this.loan.beginDate);
      return 12 * (date.getFullYear() - loanDate.getFullYear()) + date.getMonth() - loanDate.getMonth();
  }

  public getDateFromMonthIndex(monthIndex: number) : Date {
    let date : Date = new Date(this.loan.beginDate) ?? new Date();
    date.setMonth(date.getMonth() + monthIndex - 1);
    return date;
  }

  public getCurrentMonthIndex(): number {
    let begin = this.loan.beginDate
    let now = new Date();
    return 12 * (now.getFullYear() - begin.getFullYear()) + now.getMonth() - begin.getMonth() + 1;
  }

  public calculateLoanInstalment() {
    this.loan.instalment = this.getInstalment(
      this.loan.loanAmount ?? 0, 
      (this.loan.interestRate ?? 0) / 1200.0, 
      this.loan.loanTerm ?? 0);
  }

  public calculatePrePaymentInstalment(index: number) {
    if (index < 0 || index >= this.loan.changes.length) return;
    let prePayment = this.loan.changes[index];
    let monthIndex = this.getMonthIndexFromDate(prePayment.date ?? new Date);
    let monthState = this.updatedMonthlySummary[monthIndex];
    let actualRate = monthState.interestRate;
    if (prePayment.newRate) {
      actualRate = prePayment.newRate ?? actualRate;
    }
    prePayment.newInstalment = this.getInstalment(
      monthState.remainingCapital - (prePayment.prePayedAmount ?? 0), 
      actualRate / 1200.0, 
      (this.loan.loanTerm ?? 0) - monthIndex);
  }

  private clearChangeDictionary() {
    this.changeDictionary = {};
  }

  private buildPrePaymentDictionary() {
    this.clearChangeDictionary();
    this.loan.changes.forEach(change => {
      let prePayDate = new Date(change.date ?? new Date);
      let monthIndex = this.getMonthIndexFromDate(prePayDate);

      if (this.changeDictionary[monthIndex] == undefined) {
        this.changeDictionary[monthIndex] = [];
      }
      this.changeDictionary[monthIndex].push(change);
    });
  }
  
  calculate() {
    const t0 = performance.now();
    
    this.clearChangeDictionary();
    this.originalMonthlySummary = this.buildMonthlySummary();
    
    let t1 = performance.now();
    // console.log(`Build original summary took ${t1 - t0} milliseconds.`);

    this.buildPrePaymentDictionary();
    this.updatedMonthlySummary = this.buildMonthlySummary();

    this.buildLoanSummary();

    t1 = performance.now();
    // console.log(`Build updated summary took ${t1 - t0} milliseconds.`);

    this.notify();

    t1 = performance.now();
    // console.log(`Notify subscribers took ${t1 - t0} milliseconds.`);
  }

  private buildLoanSummary() {
    let original: LoanSummary = {
      name: "",
      duration: 0,
      fee:0,
      interest: 0,
      prePayment: 0,
      payed: 0,
      realAPR:0
    };
    let updated: LoanSummary = Object.assign({}, original);
    let difference: LoanSummary = Object.assign({}, original);

    original.name = "Original";
    updated.name = "Updated";
    difference.name = "Difference";

    original.duration = this.originalMonthlySummary.length - 1;
    updated.duration = this.updatedMonthlySummary.length - 1;
    difference.duration = updated.duration - original.duration;

    original.fee = this.originalMonthlySummary[original.duration].cumlatedPayedFee;
    updated.fee = this.updatedMonthlySummary[updated.duration].cumlatedPayedFee;
    difference.fee = updated.fee - original.fee;

    original.interest = this.originalMonthlySummary[original.duration].cumlatedPayedInterest;
    updated.interest = this.updatedMonthlySummary[updated.duration].cumlatedPayedInterest;
    difference.interest = updated.interest - original.interest;

    original.prePayment = this.originalMonthlySummary[original.duration].cumlatedPrePayment;
    updated.prePayment = this.updatedMonthlySummary[updated.duration].cumlatedPrePayment;
    difference.prePayment = updated.prePayment - original.prePayment;

    original.payed = this.originalMonthlySummary[original.duration].cumlatedPayedSum;
    updated.payed = this.updatedMonthlySummary[updated.duration].cumlatedPayedSum;
    difference.payed = updated.payed - original.payed;

    original.realAPR = this.getAPR(this.loan.loanAmount, original.payed, original.duration);
    updated.realAPR = this.getAPR(this.loan.loanAmount, updated.payed, updated.duration);
    difference.realAPR = updated.realAPR - original.realAPR;

    this.loanSummary = [];
    this.loanSummary.push(original);
    this.loanSummary.push(difference);
    this.loanSummary.push(updated);
  }

  private getAPR(startPrice: number, fullPrice: number, duration: number) : number {
    // Thanks to csaba504 for this code snippet! https://github.com/csaba504/hitel_torleszto_kalkulator
    let monthly = fullPrice / duration;	
    let r = 0.000001;
    let calcPrice = startPrice + 1;
    while (startPrice < calcPrice){
      r = r + 0.000001;
      calcPrice = monthly * ( (1/r) - (1/  (r * (Math.pow((1+r), duration)))   )     );
    }
    return Math.round(r * 12 * 100 * 1000) / 1000;
  }

  private buildMonthlySummary() {
    let summary: MonthSummary[] = [];

    let actualMonth: MonthSummary = {
      index: 0,

      remainingCapital: this.loan.loanAmount ?? 0,
      interestRate: this.loan.interestRate ?? 0,

      payedCapital: 0,
      payedInterest: 0,
      payedFee: Number(this.loan.beginCost) ?? 0,
      payedInstalment: 0,
      prePayment: 0,

      cumlatedPayedCapital: 0,
      cumlatedPayedInterest: 0,
      cumlatedPayedFee: 0,
      cumlatedPayedSum: 0,
      cumlatedPrePayment: 0,
      divergent: false
    };
    let actualInstalment = this.loan.instalment ?? 0;

    summary.push(Object.assign({}, actualMonth));
    for (let i = 0; actualMonth.remainingCapital > 0 && (!actualMonth.divergent || i < 1000); i++)
    {
      // Zero previous month
      if (i > 0) {
        actualMonth.prePayment = 0;
        actualMonth.payedFee = 0;
      }

      // Calulate pre-payment changes
      if (this.changeDictionary[i] != undefined) {
        this.changeDictionary[i].forEach(change => {
          let prePaymentAmount = change.prePayedAmount ?? 0;
          actualMonth.prePayment += prePaymentAmount
          actualMonth.payedFee += prePaymentAmount * (change.prePaymentFeeRate ?? 0) * 0.01 + (change.changeFeeCost ?? 0);
          if (change.instalmentChanged) {
            actualInstalment = change.newInstalment ?? actualInstalment;
          }
          if (change.rateChanged) {
            actualMonth.interestRate = change.newRate ?? actualMonth.interestRate;
          }
        });
      }
      actualMonth.remainingCapital -= actualMonth.prePayment;

      // General annuity calculation
      actualMonth.payedInterest = Math.round(actualMonth.remainingCapital * actualMonth.interestRate * 0.01 * (1 / 12.0));
      actualMonth.divergent = actualMonth.payedInterest > actualInstalment;      
      if (actualMonth.remainingCapital < actualInstalment) { // TODO: Is this good?
        // In case when the last instalment is greater than the others
        actualMonth.payedCapital = actualMonth.remainingCapital;
      }
      else {
        // In case when the last instalment is smaller than the others
        actualMonth.payedCapital = Math.min(actualInstalment - actualMonth.payedInterest, actualMonth.remainingCapital);
      }
      actualMonth.payedInstalment = actualMonth.payedInterest + actualMonth.payedCapital;

      actualMonth.cumlatedPayedInterest += actualMonth.payedInterest;
      
      actualMonth.cumlatedPayedCapital += actualMonth.payedCapital + actualMonth.prePayment;
      actualMonth.cumlatedPayedSum += actualMonth.payedInstalment + actualMonth.prePayment + actualMonth.payedFee;
      actualMonth.cumlatedPayedFee += actualMonth.payedFee;
      actualMonth.cumlatedPrePayment += actualMonth.prePayment;
      actualMonth.remainingCapital = Math.max(actualMonth.remainingCapital - actualMonth.payedCapital, 0);

      actualMonth.index++;
      summary.push(Object.assign({}, actualMonth));
    }
    return summary;
  }
}
