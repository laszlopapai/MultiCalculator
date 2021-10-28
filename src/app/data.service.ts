import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoanProperties } from './loan/model/loan-properties.dto';

export interface MemoryItem {
  date: Date;
  name: string;
  json: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public disclaimerAccepted = !environment.production;
  public loanMemory : MemoryItem[] = [];
  public loanProperties : LoanProperties = new LoanProperties();

  constructor() {
    let memoryJson = localStorage.getItem("loan-memory");
    if (memoryJson) {
      this.loanMemory = JSON.parse(memoryJson);
      this.loanMemory.forEach((memoryItem: MemoryItem) => {
        memoryItem.date = new Date(memoryItem.date ?? new Date());
      });
      if (this.loanMemory.length > 0) {
        this.loanProperties.loadJSON(this.loanMemory[0].json);
      }
    }
  }
  
  public save() {
    this.loanMemory.unshift({ date: new Date, name: "Saved into browser", json: this.getJSON() });
    localStorage.setItem("loan-memory", JSON.stringify(this.loanMemory));
  }

  public loadJSON(json: string, storeAs?: string) {
    this.loanProperties.loadJSON(json);
    if (storeAs) {
      this.loanMemory.unshift({ date: new Date, name: storeAs, json: this.getJSON() });
      localStorage.setItem("loan-memory", JSON.stringify(this.loanMemory));
    }
  }

  public getJSON(): string {
    return this.loanProperties.getJSON();
  }
}
