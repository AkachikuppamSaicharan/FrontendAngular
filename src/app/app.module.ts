import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {CommonModule} from '@angular/common';
import {Router, RouterModule, RouterOutlet} from '@angular/router';
import {ViewBillsComponent} from './view-bill/view-bill.component';
import { ViewBillSummaryComponent } from './view-bill-summary/view-bill-summary.component';
import { BillHistoryComponent } from './bill-history/bill-history.component';
import {PaymentsPageComponent} from './payments-page/payments-page.component';
import { InvoiceGenComponent } from './invoice-gen/invoice-gen.component';

@NgModule({
  declarations: [
    AppComponent,







  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ViewBillsComponent,
    FormsModule,
    ViewBillSummaryComponent,
    BillHistoryComponent,
    PaymentsPageComponent,
    ReactiveFormsModule,CommonModule,
    InvoiceGenComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
