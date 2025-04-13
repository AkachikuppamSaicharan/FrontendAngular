import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {CommonModule} from '@angular/common';
import {Router, RouterModule, RouterOutlet} from '@angular/router';
import {ViewBillsComponent} from './view-bill/view-bill.component';
import { ViewBillSummaryComponent } from './view-bill-summary/view-bill-summary.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BillHistoryComponent } from './bill-history/bill-history.component';
import { InvoiceGenComponent } from './invoice-gen/invoice-gen.component';
import { PaymentsPageComponent } from './payments-page/payments-page.component';
import { DetailsService } from '../service/details.service';
import { MainPageComponent } from './main-page/main-page.component';
import { CustomerLoginComponent } from './customer-login/customer-login.component';
import { HomepageComponent } from './homepage/homepage.component';
import { CustomerRegistrationComponent } from './customer-registration/customer-registration.component';
import { SessionWarningComponent } from './session-warning/session-warning.component';
@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    CustomerLoginComponent,
    HomepageComponent,
    CustomerRegistrationComponent,
    SessionWarningComponent,





  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ViewBillsComponent,
    FormsModule,
    ViewBillSummaryComponent,
    HttpClientModule, CommonModule,
    BillHistoryComponent,
    InvoiceGenComponent,
    PaymentsPageComponent, ReactiveFormsModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
