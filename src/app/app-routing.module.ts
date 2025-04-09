import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ViewBillsComponent} from './view-bill/view-bill.component';

const routes: Routes = [
  { path: '', component: ViewBillsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
