import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessGuard } from './access.guard';

import { DisclaimerComponent } from './loan/disclaimer/disclaimer.component';
import { LoanComponent } from './loan/loan.component';

const routes: Routes = [
  { path: 'loan', component: LoanComponent, canActivate: [AccessGuard] },
  { path: 'loan/disclaimer', component: DisclaimerComponent },
  { path: '**', redirectTo: 'loan' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
