import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyPipe, NgForOf, NgIf } from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-view-bill-summary',
  templateUrl: './view-bill-summary.component.html',
  styleUrls: ['./view-bill-summary.component.css'],
  imports: [NgIf, NgForOf,FormsModule]
})
export class ViewBillSummaryComponent {
  hasError = false;
  selectAll = false;
  selectedPaymentMethod: string = '';
  proceedError: string = '';

  bills = [
    {
      consumerNo: 'C001',
      billDate: '2025-03-01',
      billPeriod: 'Jan-Feb',
      dueDate: '2025-03-15',
      dueAmount: 1200,
      selected: true
    },
    {
      consumerNo: 'C002',
      billDate: '2025-03-05',
      billPeriod: 'Feb-Mar',
      dueDate: '2025-03-18',
      dueAmount: 1600,
      selected: true
    },
    {
      consumerNo: 'C003',
      billDate: '2025-03-10',
      billPeriod: 'Mar-Apr',
      dueDate: '2025-03-25',
      dueAmount: 1000,
      selected: false
    }
  ];

  get totalAmount(): number {
    return this.bills
      .filter(bill => bill.selected)
      .reduce((sum, bill) => sum + bill.dueAmount, 0);
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

    alert(`Proceeding with ${selectedBills.length} bill(s) using ${this.selectedPaymentMethod}`);
    // Continue logic here...
  }

  goBack() {
    this.router.navigate(['']); // adjust as needed
  }

  retry() {
    this.hasError = false;
  }

  constructor(private router: Router) {}
}
