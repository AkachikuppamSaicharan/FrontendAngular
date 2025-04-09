import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, NgForOf, NgIf } from '@angular/common';
import {BillSelectionService} from '../../service/bill-selection.service';
import {Bill} from '../../model/Bill';

@Component({
  selector: 'app-view-bills',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.css'],
  standalone: true,
  imports: [FormsModule, CurrencyPipe, NgIf, NgForOf]
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

  constructor(private router: Router,private billService:BillSelectionService) {}


  toggleAllSelection() {
    if (this.selectAll) {
      // Select all only if each bill is valid
      this.bills.forEach(bill => {
        bill.payableAmount = bill.dueAmount;
        bill.selected = true;
        bill.errorMessage = '';
      });
    } else {
      // Unselect all
      this.bills.forEach(bill => {
        bill.selected = false;
        bill.payableAmount = null;
        bill.errorMessage = '';
      });
    }

    // Delay to ensure checkboxes sync with ngModel before calculating
    setTimeout(() => {
      this.bills.forEach(bill => this.handlePayableChange(bill));
      this.updateTotalAmount();
    });
  }

  handlePayableChange(bill: Bill) {
    const amt = bill.payableAmount;

    // If bill is NOT selected, don't validate anything
    if (!bill.selected) {
      bill.errorMessage = '';
      return;
    }

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
    this.syncSelectAll();
  }


  isValidAmount(payableAmount: any, dueAmount: number): boolean {
    return (
      payableAmount !== null &&
      !isNaN(Number(payableAmount)) &&
      Number(payableAmount) === dueAmount
    );
  }

  updateTotalAmount() {
    this.totalPayableAmount = this.bills
      .filter(bill => bill.selected && this.isValidAmount(bill.payableAmount, bill.dueAmount))
      .reduce((total, bill) => total + bill.payableAmount!, 0);
  }

  // proceedToPay() {
  //   this.proceedError = '';
  //   const validBills = this.bills.filter(
  //     bill => bill.selected && this.isValidAmount(bill.payableAmount, bill.dueAmount)
  //   );
  //
  //   if (validBills.length === 0) {
  //     this.proceedError = 'No valid bills selected';
  //     return;
  //   }
  //
  //   const totalDue = validBills.reduce((sum, bill) => sum + bill.dueAmount, 0);
  //   const totalPayable = validBills.reduce((sum, bill) => sum + bill.payableAmount!, 0);
  //
  //   if (totalDue !== totalPayable) {
  //     this.proceedError = 'Total payable amount must equal total due amount';
  //     return;
  //   }
  //   this.billService.setSelectedBills(validBills)
  //   this.router.navigate(['view-billsummary'], { state: { bills: validBills } });
  // }
  proceedToPay() {
    this.proceedError = '';
    const validBills = this.bills.filter(
      bill => bill.selected && this.isValidAmount(bill.payableAmount, bill.dueAmount)
    );

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

    this.billService.setSelectedBills(validBills); // ✅ Save to service
    this.router.navigate(['view-billsummary'],{
      replaceUrl: true
    });
  }

  onCheckboxChange(bill: Bill) {
    if (bill.selected) {
      // If selected and amount is null or 0, auto-fill dueAmount
      if (
        bill.payableAmount === null ||
        bill.payableAmount === undefined ||
        bill.payableAmount === 0
      ) {
        bill.payableAmount = bill.dueAmount;
      }

      // Validate amount on selection
      this.handlePayableChange(bill);
    } else {
      // On unchecking: clear errors and value
      bill.errorMessage = '';
      bill.payableAmount = null;
    }

    this.updateTotalAmount();
    this.syncSelectAll();
  }

  syncSelectAll() {
    const allChecked = this.bills.every(
      bill => bill.selected && this.isValidAmount(bill.payableAmount, bill.dueAmount)
    );
    this.selectAll = allChecked;
  }
}
