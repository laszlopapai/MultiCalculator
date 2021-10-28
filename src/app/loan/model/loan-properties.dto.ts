import { ChangeEvent } from "./change-event.dto";

export class LoanProperties {
    currency: string = 'EUR';
    loanTerm: number = 180; // months
    interestRate: number = 3.5; // percentage
    loanAmount: number = 30000;
    instalment: number = 215;
    beginDate: Date = new Date();
    beginCost: number = 0;
    monthlyCost: number = 0;
    changes: ChangeEvent[] = [];
  
    public getJSON(): string {
      return JSON.stringify(this);
    }
  
    public loadJSON(json: string) {
      let obj = JSON.parse(json);
      setTimeout(() => {
        this.currency = obj.currency;
      }, 10); // FIXME: Yes, I am really that hopeless
      this.loanTerm = obj.loanTerm;
      this.interestRate = obj.interestRate;
      this.loanAmount = obj.loanAmount;
      this.instalment = obj.instalment;
      this.beginDate = new Date(obj.beginDate);
      this.beginCost = obj.beginCost;
      this.monthlyCost = obj.monthlyCost;
  
      this.changes.splice(0, this.changes.length);
      obj.changes.forEach((change: ChangeEvent) => {
        change.date = new Date(change.date ?? new Date());
        this.changes.push(change);
      });
    }
  }