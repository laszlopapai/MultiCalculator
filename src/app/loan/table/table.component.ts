import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from 'src/app/data.service';
import { environment } from 'src/environments/environment';
import { AnnuityService } from '../annuity.service';
import { LoanProperties } from '../model/loan-properties.dto';
import { MonthSummary } from '../model/month-summary.dto';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class TableComponent implements OnInit, AfterViewInit {

  env = environment;
  loan : LoanProperties;
  displayedColumns: string[] = ['no', 'status', 'month', 'beginCapital', 'instalment', 'payedCapital', 'payedInterest', 'cumlatedPayedSum', 'endCapital'];
  expandedElement: MonthSummary | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource: MatTableDataSource<MonthSummary>;

  constructor(
    public dataSrv: DataService,
    public annuitySrv: AnnuityService
    ) {
      this.loan = dataSrv.loanProperties;
      this.dataSource = new MatTableDataSource(this.annuitySrv.getMonthlySummary());
     }

  ngOnInit(): void {
    this.annuitySrv.subscribe(()=> this.refresh())
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  refresh() {
    this.dataSource.data = this.annuitySrv.getMonthlySummary();
  }

}
