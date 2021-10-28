import { Component, Input, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { AnnuityService } from '../annuity.service';
import { ChangeEvent } from '../model/change-event.dto';
import { MatDatepicker } from '@angular/material/datepicker';
import { Moment } from 'moment';
import * as _moment from 'moment';

@Component({
  selector: 'app-change-editor',
  templateUrl: './change-editor.component.html',
  styleUrls: ['./change-editor.component.scss']
})
export class ChangeEditorComponent implements OnInit {

  @Input() filter: 'interest-change'|'pre-payment' = 'pre-payment';

  private changes: ChangeEvent[] = [];
  constructor(
    public dataSrv: DataService,
    public annuitySrv: AnnuityService
    ) {
    this.changes = dataSrv.loanProperties.changes;
  }

  ngOnInit(): void {
  }
  
  trackByFn(index : number, item : ChangeEvent) {
    return index;
  }

  changeItems : ChangeEvent[] = [];
  getChangeItems(): ChangeEvent[] {
    this.changeItems = [];
    this.changes.forEach(x => {
      if ( x.rateChanged && this.filter == 'interest-change' || 
          !x.rateChanged && this.filter == 'pre-payment') {
        this.changeItems.push(x);
      }
    });
    return this.changeItems;
  }

  addPrePayment() {
    this.changes.push({date: new Date(), newRate: 0, changeFeeCost:0, prePaymentFeeRate:0, prePayedAmount: 0, rateChanged: false, instalmentChanged: false});
  }

  addInterestChange() {
    this.changes.push({date: new Date(), newRate: 0, changeFeeCost:0, prePaymentFeeRate:0, prePayedAmount: 0, rateChanged: true, instalmentChanged: false});
  }

  removeChange(itemIndex: number) {
    const changeIndex = this.changes.indexOf(this.changeItems[itemIndex]);
    this.changes.splice(changeIndex, 1);
  }
  
  calulateInstalmentAfterChange(itemIndex: number) {
    const changeIndex = this.changes.indexOf(this.changeItems[itemIndex]);
    this.annuitySrv.calculatePrePaymentInstalment(changeIndex);
  }

  chosenYearHandler(normalizedYear: Moment, itemIndex: number) {
    const ctrlValue = _moment(this.changeItems[itemIndex].date);
    ctrlValue.year(normalizedYear.year());
    this.changeItems[itemIndex].date = ctrlValue.toDate();
  }

  chosenMonthHandler(normalizedMonth: Moment, itemIndex: number, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = _moment(this.changeItems[itemIndex].date);
    ctrlValue.month(normalizedMonth.month());
    this.changeItems[itemIndex].date = ctrlValue.toDate();
    
    datepicker.close();
  }
}
