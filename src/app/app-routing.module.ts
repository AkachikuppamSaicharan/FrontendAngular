import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ViewBillsComponent} from './view-bill/view-bill.component';
import {ViewBillSummaryComponent} from './view-bill-summary/view-bill-summary.component';
import {BillHistoryComponent} from './bill-history/bill-history.component';

const routes: Routes = [
  { path: '', component: ViewBillsComponent},
  { path: 'view-billsummary', component: ViewBillSummaryComponent},
  {path:'bill-history', component: BillHistoryComponent},
  // {path:'Payments',component:PaymentComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
