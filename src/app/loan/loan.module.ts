import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoanComponent } from './loan.component';
import { ChartComponent } from './chart/chart.component';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';
import { JsonDialogComponent } from './json-dialog/json-dialog.component';
import { ChangeEditorComponent } from './change-editor/change-editor.component';
import { CurrencySymbolPipe } from './currency-symbol.pipe';

import { FlexLayoutModule } from '@angular/flex-layout';
import { DateAdapter, MatRippleModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card'
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog'
import { MatListModule } from '@angular/material/list'

import { ChartsModule } from 'ng2-charts';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { TableComponent } from './table/table.component';

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY MMM',
  },
  display: {
    dateInput: 'YYYY MMM',
    monthYearLabel: 'YYYY MMM',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY MMMM',
  },
};

@NgModule({
  declarations: [
    LoanComponent,
    ChartComponent,
    DisclaimerComponent,
    JsonDialogComponent,
    ChangeEditorComponent,
    CurrencySymbolPipe,
    TableComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    FlexLayoutModule,
    MatRippleModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatListModule,

    ChartsModule,    
    NgxMaskModule.forRoot()
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class LoanModule { }
