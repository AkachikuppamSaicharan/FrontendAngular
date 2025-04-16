import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, NgForOf, NgIf } from '@angular/common';
import {BillSelectionService} from '../../service/bill-selection.service';
import {Bill} from '../../model/Bill';
import { GetBillsService } from '../../service/get-bills.service';
import {DetailsService} from '../../service/details.service';
@Component({
  selector: 'app-view-bills',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.css'],
  imports: [FormsModule, CurrencyPipe, NgIf, NgForOf, RouterLink]
})
export class ViewBillsComponent {
  constructor(private router: Router,private billService:BillSelectionService,private seeBills:GetBillsService,private detailService:DetailsService) {}
  User_Id!:string;
  bills:Bill[]=[];
  selectAll: boolean = false;
  totalPayableAmount: number = 0;
  proceedError: string = '';
  names!:string

  ngOnInit():void{
    this.names=this.detailService.getCustomerDetails().name;
    this.User_Id=this.detailService.getCustomerDetails().userID;
    this.seeBills.getBills("Akach").subscribe({
      next:(data:any)=>{
        console.log(data);
        console.log(data.length);
        if(data && data.length>0){
          this.bills=data;
          console.log(data)
        }
        else{
          this.bills=[];
        }
      }
    })
  }

  toggleAllSelection() {
    if (this.selectAll) {
      // Select all only if each bill is valid
      this.bills.forEach(bill => {
        bill.payableAmount = bill.Due_Amount;
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
      this.clearOrSetErrorBasedOnSelection();
    });
    // this.updateProceedErrorIfNoneSelected();
    this.clearProceedErrorIfValidSelected();
  }
  clearOrSetErrorBasedOnSelection() {
    const hasValidBill = this.bills.some(bill =>
      bill.selected && this.isValidAmount(bill.payableAmount, bill.Due_Amount)
    );

    if (hasValidBill) {
      this.proceedError = '';
    } else {
      this.proceedError = 'No Bills Selected to Proceed for Payment';
    }
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
    } else if (amt > bill.Due_Amount) {
      bill.errorMessage = 'Amount exceeds due amount';
      bill.selected = false;
    } else if (amt < bill.Due_Amount) {
      bill.errorMessage = 'Partial payment not allowed';
      bill.selected = false;
    } else {
      bill.selected = true;
    }

    this.updateTotalAmount();
    this.syncSelectAll();
    // this.updateProceedErrorIfNoneSelected();
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
      .filter(bill => bill.selected && this.isValidAmount(bill.payableAmount, bill.Due_Amount))
      .reduce((total, bill) => total + bill.payableAmount!, 0);
  }


  clearProceedErrorIfValidSelected() {
    const hasValidBill = this.bills.some(bill =>
      bill.selected && this.isValidAmount(bill.payableAmount, bill.Due_Amount)
    );

    if (hasValidBill && this.proceedError) {
      this.proceedError = '';
    }
  }

  proceedToPay() {
    const validBills = this.bills.filter(bill =>
      bill.selected && this.isValidAmount(bill.payableAmount, bill.Due_Amount)
    );

    if (validBills.length === 0) {
      this.proceedError = 'No Bills Selected to Proceed for Payment';
      return;
    }

    const totalDue = validBills.reduce((sum, bill) => sum + bill.Due_Amount, 0);
    const totalPayable = validBills.reduce((sum, bill) => sum + (bill.payableAmount || 0), 0);

    if (totalPayable === 0 || totalDue !== totalPayable) {
      this.proceedError = 'Total payable amount must equal total due amount';
      return;
    }

    // ✅ All clear — clear any lingering errors
    this.proceedError = '';

    this.billService.setSelectedBills(validBills);
    this.router.navigate(['PayBillSummary']);
  }


  onCheckboxChange(bill: Bill) {
    if (bill.selected) {
      // Clear previous errors
      bill.errorMessage = '';

      // Reset payable amount to due amount
      bill.payableAmount = bill.Due_Amount;

      // Revalidate
      this.handlePayableChange(bill);
    } else {
      // If unchecked manually or due to error
      bill.errorMessage = '';
      bill.payableAmount = null;
    }

    this.updateTotalAmount();
    this.syncSelectAll();

    // Additional check for the error message below the table
    this.updateProceedErrorIfNoneSelected();
    this.clearProceedErrorIfValidSelected();
  }
  updateProceedErrorIfNoneSelected() {
    const hasValidBill = this.bills.some(bill =>
      bill.selected && this.isValidAmount(bill.payableAmount, bill.Due_Amount)
    );

    this.proceedError = hasValidBill ? '' : 'No Bills Selected to Proceed for Payment';
  }

  syncSelectAll() {
    const allChecked = this.bills.every(
      bill => bill.selected && this.isValidAmount(bill.payableAmount, bill.Due_Amount)
    );
    this.selectAll = allChecked;
  }
  isProceedEnabled(): boolean {
    // Check if there is at least one bill selected with a valid payable amount
    return this.bills.some(bill => bill.selected && this.isValidAmount(bill.payableAmount, bill.Due_Amount));
  }
  logout():void{
    this.detailService.clearAll();
    this.router.navigate(['']);
  }

}
