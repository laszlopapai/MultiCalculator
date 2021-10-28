import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartFontOptions, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { AnnuityService } from '../annuity.service';
import { CurrencyPipe, DatePipe } from '@angular/common'
import { environment } from 'src/environments/environment';
import { MonthSummary } from '../model/month-summary.dto';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  providers: [    
    CurrencyPipe,
    DatePipe,
  ]
})
export class ChartComponent implements OnInit {
  @Input() type = 'capital';
  @Input() chartName = '';

  public lineChartLabels: Label[] = [];
  public lineChartData: ChartDataSets[] = [
    {
       data: [],
       label: 'Original',
       lineTension: 0,
       fill: 1
    },
    {
       data: [],
       label: 'Updated',
       lineTension: 0
    },
  ];

  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    annotation: '',
    
    title: {
      fontColor: 'white',
      display: true,
      text: "CHART TITLE"
    },
    responsive: true,
    hover: {
      mode: 'index'
    },
    legend: {
      labels: {
        fontColor: 'white'
      }
    },
    tooltips: {
      mode: 'index',
      callbacks: {
        title: (data) => this.dp.transform(this.annuitySrv.getDateFromMonthIndex(data[0].index ?? 0), environment.dateFormat) ?? "",
        label: (data) => {
          return this.lineChartData[data.datasetIndex ?? 0].label + ": " + this.cp.transform(data.value ?? "", this.annuitySrv.getLoan().currency, undefined, environment.numberPrecision);
        }
      }
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: 'white',
          beginAtZero: true,
          callback: (data) => this.cp.transform(data ?? "", this.annuitySrv.getLoan().currency, undefined, environment.numberPrecision)
        },
        display: true,
        scaleLabel: {
          fontColor: 'white',
          display: false,
          labelString: "Y TITLE"
        }
      }],
      xAxes: [{
        ticks: {
          fontColor: 'white'
        }
      }]
    }
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'rgba(54, 162, 235, 0.4)',
      backgroundColor: 'rgba(54, 162, 235, 0.4)',
      borderWidth: 1
    },
    {
      borderColor: 'rgba(255, 99, 132, 0.4)',
      backgroundColor: 'rgba(255, 99, 132, 0.4)',
      borderWidth: 1
    },
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';
  public lineChartPlugins = [];

  private dataExtract = (month: MonthSummary) => 0;

  constructor(
    private annuitySrv: AnnuityService, 
    private cp: CurrencyPipe,
    private dp: DatePipe)
  { }

  ngOnInit() {
    if (this.lineChartOptions.title) {
      this.lineChartOptions.title.text = this.chartName;
    }

    if (this.type == "capital") {
      this.dataExtract = (month: MonthSummary) => {
        return month.remainingCapital;
      };
    }
    else {
      this.dataExtract = (month: MonthSummary) => {
        return month.cumlatedPayedFee + month.cumlatedPayedInterest;
      };
    }

    this.annuitySrv.subscribe(() => this.plot());
    this.plot();
  }

  plot() {
    this.lineChartLabels = [];
    this.lineChartData[0].data = [];
    this.lineChartData[1].data = [];

    let originalSummary = this.annuitySrv.getOriginalMonthlySummary();
    let updatedSummary = this.annuitySrv.getMonthlySummary();
    let allLength = Math.max(originalSummary.length, updatedSummary.length);

    let lastDefault = 0;
    let lastUpdated = 0;
    for (let i = 0; i < allLength; i++) {
      if (i < originalSummary.length) {
        lastDefault = this.dataExtract(originalSummary[i]);
      }
      if (i < updatedSummary.length) {
        lastUpdated = this.dataExtract(updatedSummary[i]);
      }
      
      this.lineChartLabels.push(this.dp.transform(this.annuitySrv.getDateFromMonthIndex(i), environment.dateFormat) ?? "");
      this.lineChartData[0].data?.push(lastDefault);
      this.lineChartData[1].data?.push(lastUpdated);
    }
  }
}
