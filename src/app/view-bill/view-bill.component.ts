import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';
interface Bill {
  consumerNo: string;
  billNumber: string;
  paymentStatus: string;
  connectionType: string;
  connectionStatus: string;
  mobileNumber: string;
  billPeriod: string;
  billDate: string;
  dueDate: string;
  disconnectionDate: string;
  dueAmount: number;
  payableAmount?: number | null;
  selected: boolean;
  errorMessage?: string;
}

@Component({
  selector: 'app-view-bills',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.css'],
  imports: [
    FormsModule,
    CurrencyPipe,
    NgIf,
    NgForOf
  ]
})
export class ViewBillsComponent {
  bills: Bill[] = [
    {
      consumerNo: 'C001',
      billNumber: 'B1001',
      paymentStatus: 'Unpaid',
      connectionType: 'Domestic',
      connectionStatus: 'Connected',
      mobileNumber: '9876543210',
      billPeriod: 'Jan-Feb',
      billDate: '2025-03-01',
      dueDate: '2025-03-15',
      disconnectionDate: '2025-03-20',
      dueAmount: 1200,
      payableAmount: null,
      selected: false,
      errorMessage: ''
    },
    {
      consumerNo: 'C002',
      billNumber: 'B1002',
      paymentStatus: 'Unpaid',
      connectionType: 'Commercial',
      connectionStatus: 'Disconnected',
      mobileNumber: '9123456780',
      billPeriod: 'Feb-Mar',
      billDate: '2025-03-05',
      dueDate: '2025-03-18',
      disconnectionDate: '2025-03-25',
      dueAmount: 1600,
      payableAmount: null,
      selected: false,
      errorMessage: ''
    }
  ];

  selectAll: boolean = false;
  totalPayableAmount: number = 0;
  proceedError: string = '';

  constructor(private router: Router) {}

  toggleAllSelection() {
    this.bills.forEach(bill => {
      if (this.isValidAmount(bill.payableAmount, bill.dueAmount)) {
        bill.selected = this.selectAll;
      } else {
        bill.selected = false;
      }
    });
    this.updateTotalAmount();
  }

  handlePayableChange(bill: Bill) {
    const amt = bill.payableAmount;
    bill.errorMessage = '';
    if (amt === null || amt === undefined || isNaN(Number(amt))) {
      bill.errorMessage = 'Invalid input';
      bill.selected = false;
    } else if (amt < 0) {
      bill.errorMessage = 'Amount cannot be negative';
      bill.selected = false;
    } else if (amt > bill.dueAmount) {
      bill.errorMessage = 'Amount exceeds due amount';
      bill.selected = false;
    } else if (amt < bill.dueAmount) {
      bill.errorMessage = 'Partial payment not allowed';
      bill.selected = false;
    } else {
      bill.selected = true;
    }

    this.updateTotalAmount();
  }

  isValidAmount(payableAmount: any, dueAmount: number): boolean {
    return (
      payableAmount !== null &&
      !isNaN(Number(payableAmount)) &&
      payableAmount == dueAmount
    );
  }

  updateTotalAmount() {
    this.totalPayableAmount = this.bills
      .filter(bill => bill.selected && this.isValidAmount(bill.payableAmount, bill.dueAmount))
      .reduce((total, bill) => total + bill.payableAmount!, 0);
  }

  proceedToPay() {
    this.proceedError = '';
    const validBills = this.bills.filter(bill => bill.selected && this.isValidAmount(bill.payableAmount, bill.dueAmount));
    if (validBills.length === 0) {
      this.proceedError = 'No valid bills selected';
      return;
    }

    const totalDue = validBills.reduce((sum, bill) => sum + bill.dueAmount, 0);
    const totalPayable = validBills.reduce((sum, bill) => sum + bill.payableAmount!, 0);

    if (totalDue !== totalPayable) {
      this.proceedError = 'Total payable amount must equal total due amount';
      return;
    }

    // Proceed with selected bills (send via route state or service)
    this.router.navigate(['/view-billsummary'], { state: { bills: validBills } });
  }
}
