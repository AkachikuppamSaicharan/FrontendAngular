import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ViewBillsComponent} from './view-bill/view-bill.component';
import {ViewBillSummaryComponent} from './view-bill-summary/view-bill-summary.component';
import { BillHistoryComponent } from './bill-history/bill-history.component';
import { PaymentsPageComponent } from './payments-page/payments-page.component';
import { InvoiceGenComponent } from './invoice-gen/invoice-gen.component';
import {MainPageComponent} from './main-page/main-page.component';
import {CustomerLoginComponent} from './customer-login/customer-login.component';
import {HomepageComponent} from './homepage/homepage.component';
import {CustomerRegistrationComponent} from './customer-registration/customer-registration.component';
import {AuthGuard} from '../service/auth.guard';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  {path:'Customer-Login', component: CustomerLoginComponent},
  {path:'Homepage',component:HomepageComponent,canActivate:[AuthGuard]},
  {path:'Registration',component:CustomerRegistrationComponent},
  {path:'PayBill',component:ViewBillsComponent,canActivate:[AuthGuard]},
  {path:'PayBillSummary',component:ViewBillSummaryComponent,canActivate:[AuthGuard]},
  {path:'Payments',component:PaymentsPageComponent,canActivate:[AuthGuard]},
  {path:'Invoice',component:InvoiceGenComponent,canActivate:[AuthGuard]},
  {path:'BillHistory',component:BillHistoryComponent,canActivate:[AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
