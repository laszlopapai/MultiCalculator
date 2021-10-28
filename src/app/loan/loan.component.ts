import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { AnnuityService } from './annuity.service';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { JsonDialogComponent } from './json-dialog/json-dialog.component';
import { LoanProperties } from './model/loan-properties.dto';
import { MatDatepicker } from '@angular/material/datepicker';
import { Moment } from 'moment';
import * as _moment from 'moment';

@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.scss']
})
export class LoanComponent implements OnInit, AfterViewInit {

  env = environment;
  loan : LoanProperties;

  constructor(
    private dialog: MatDialog,
    public dataSrv: DataService, 
    public annuitySrv: AnnuityService) {
    this.loan = dataSrv.loanProperties;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.annuitySrv.calculate();
  }

  save() {
    this.dataSrv.save();
  }

  saveDialog() {
    this.dialog.open(JsonDialogComponent, {
      data: {
        saveMode: true,
        text: this.dataSrv.getJSON()
      },
      width: '80%'
    });
  }

  loadDialog() {
    const dialogRef = this.dialog.open(JsonDialogComponent, {
      data: {
        saveMode: false,
        text: '{}'
      },
      width: '80%'
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.dataSrv.loadJSON(res, 'Loaded form JSON');
      }
    });
  }

  loadFile(event: any) {
    let files = event.target.files;

    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();
      reader.onload = (result: any) => {
        let enc = new TextDecoder("ascii");
        this.dataSrv.loadJSON(enc.decode(result.target.result), `Loaded from file: ${files[0].name}`);
      };
      reader.readAsArrayBuffer(files[0]);
    }
  }

  saveFile() {
    if (typeof(Storage) !== "undefined") {
      //save data
      var element = document.createElement("a");
      element.style.display = "none";
      element.setAttribute("href", "data:text/json;charset=utf-8," + encodeURIComponent(this.dataSrv.getJSON()));
      element.setAttribute("download", "loan-properties.json");
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
    else {
        alert("Save into file is a HTML5 only feature.");
    }
  }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = _moment(this.loan.beginDate);
    ctrlValue.year(normalizedYear.year());
    this.loan.beginDate = ctrlValue.toDate();
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = _moment(this.loan.beginDate);
    ctrlValue.month(normalizedMonth.month());
    this.loan.beginDate = ctrlValue.toDate();

    datepicker.close();
  }

  abs(number:number) : number {
    return Math.abs(number);
  }
}
