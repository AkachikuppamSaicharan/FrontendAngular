import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyPipe, NgForOf, NgIf } from '@angular/common';
import {FormsModule} from '@angular/forms';
import { Bill } from '../../model/Bill';
import { BillSelectionService } from '../../service/bill-selection.service';
import { GetBillsService } from '../../service/get-bills.service';
@Component({
  selector: 'app-view-bill-summary',
  templateUrl: './view-bill-summary.component.html',
  styleUrls: ['./view-bill-summary.component.css'],
  imports: [NgIf, NgForOf,FormsModule]
})
export class ViewBillSummaryComponent {
  bills:Bill[]=[];
  constructor(private router: Router,private billService:BillSelectionService) {}
  hasError = false;
  selectAll = false;
  selectedPaymentMethod: string = '';
  proceedError: string = '';
  ngOnInit(){
    this.bills=this.billService.getSelectedBills();
    if (!this.bills || this.bills.length === 0 || this.totalAmount <= 0) {
      alert("Unauthorized Access to this Page Using Url is not a Good Practice! Redirecting to Bills Page");
      this.router.navigate(['PayBill']);
      return;
    }
  }


  get totalAmount(): number {
    return this.bills
      .filter(bill => bill.selected)
      .reduce((sum, bill) => sum + bill.Due_Amount, 0);
  }

  toggleAll() {
    this.bills.forEach(bill => (bill.selected = this.selectAll));
  }

  updateSelection() {
    this.selectAll = this.bills.every(bill => bill.selected);
  }

  canProceed(): boolean {
    return this.totalAmount > 0 && this.selectedPaymentMethod !== '';
  }

  proceedToPayment() {
    this.proceedError = '';
    const selectedBills = this.bills.filter(bill => bill.selected);

    if (selectedBills.length === 0 || this.totalAmount === 0) {
      this.proceedError = 'No bills selected.';
      return;
    }

    if (!this.selectedPaymentMethod) {
      this.proceedError = 'Please select a payment method.';
      return;
    }
    this.billService.setSelectedBills(selectedBills);
    this.billService.setTotalAmount(this.totalAmount);
    this.billService.setPaymentMode(this.selectedPaymentMethod);
    console.log(this.billService.getTotalAmount());
    alert(`Proceeding with ${selectedBills.length} bill(s) using ${this.selectedPaymentMethod}`);
    this.router.navigate(['Payments']);
    // Continue logic here...
  }

  goBack() {
    this.router.navigate(['PayBill']); // adjust as needed
  }

  retry() {
    this.hasError = false;
  }


}
