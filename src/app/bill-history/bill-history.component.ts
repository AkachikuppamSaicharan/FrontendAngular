import { Component, OnInit } from '@angular/core';
import {CurrencyPipe, DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import * as jspdf from "jspdf";
import jsPDF from "jspdf";
import { CustomerDetails } from '../../model/customerDetails';
import { DetailsService } from '../../service/details.service';
import { History } from '../../model/History';
import { GetBillsService } from '../../service/get-bills.service';
import {Router, RouterLink} from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-bill-history',
  templateUrl: './bill-history.component.html',
  imports: [
    NgIf,
    CurrencyPipe,
    NgClass,
    NgForOf,
    FormsModule,
    DatePipe,
    RouterLink
  ],
  styleUrls: ['./bill-history.component.css']
})
export class BillHistoryComponent implements OnInit {
  names!:string;
  allBills: History[] = [];
  filteredBills: History[] = [];
  customer!:CustomerDetails;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  selectedStatusFilter: string = 'All';
  sixMonthsAgo: Date = new Date();
  constructor(private router:Router,private billService:GetBillsService,private detailService:DetailsService){}
  ngOnInit() {
    // this.names=this.detailService.getCustomerDetails().userID;
    // const sixMonthsAgo = new Date();
    // sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    // this.customer=this.detailService.getCustomerDetails();
    // this.billService.getHistoryBills(this.names).subscribe({
    //   next:(data:any)=>{
    //     console.log(data);
    //     console.log(data.length);
    //     if(data && data.length>0){
    //       this.allBills=data;
    //       console.log(data)
    //     }
    //     else{
    //       this.allBills=[];
    //     }
    //   }
    // })
    //
    // this.filterBills();
    this.names = this.detailService.getCustomerDetails().userID;
    this.customer = this.detailService.getCustomerDetails();

    // Set sixMonthsAgo to 6 months before today
    this.sixMonthsAgo.setMonth(this.sixMonthsAgo.getMonth() - 6);

    // Set fromDate and toDate to auto-filter last 6 months
    this.fromDate = this.sixMonthsAgo.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    this.toDate = new Date().toISOString().split('T')[0];

    this.billService.getHistoryBills(this.names).subscribe({
      next: (data: any) => {
        if (data && data.length > 0) {
          this.allBills = data;
          this.filterBills(); // Apply 6-month filter right after data fetch
        } else {
          this.allBills = [];
          this.filteredBills = [];
        }
      }
    });
  }
  fromDate: string = '';
  toDate: string = '';

  filterBills() {
    this.filteredBills = this.allBills.filter(bill => {
      const billDate = new Date(bill.Bill_Date);

      const isWithinDateRange =
        (!this.fromDate || billDate >= new Date(this.fromDate)) &&
        (!this.toDate || billDate <= new Date(this.toDate));

      const matchesStatus =
        this.selectedStatusFilter === 'All' || bill.Payment_Status === this.selectedStatusFilter;

      return isWithinDateRange && matchesStatus;
    });

    this.sortBills();
  }


  onDateChange() {
    this.dateRangeError = false;

    if (this.fromDate && this.toDate) {
      const from = new Date(this.fromDate);
      const to = new Date(this.toDate);

      if (to < from) {
        this.dateRangeError = true;
        this.filteredBills = [];
        return;
      }
    }

    this.filterBills();
  }


  dateRangeError: boolean = false;

  sortBills() {
    if (!this.sortColumn) return;

    const direction = this.sortDirection === 'asc' ? 1 : -1;
    const dateFields = ['billDate', 'dueDate', 'paymentDate'];

    this.filteredBills.sort((a, b) => {
      let aValue: any = a[this.sortColumn as keyof History];
      let bValue: any = b[this.sortColumn as keyof History];

      if (dateFields.includes(this.sortColumn)) {
        const aDate = aValue ? new Date(aValue) : null;
        const bDate = bValue ? new Date(bValue) : null;

        // Special handling for paymentDate — only when filtered to "Paid"
        if (this.sortColumn === 'Payment_Date') {
          if (this.selectedStatusFilter === 'Paid') {
            return (aDate!.getTime() - bDate!.getTime()) * direction;
          } else {
            // fallback for mixed/null paymentDate (optional)
            if (!aDate && !bDate) return 0;
            if (!aDate) return 1 * direction;
            if (!bDate) return -1 * direction;
            return (aDate.getTime() - bDate.getTime()) * direction;
          }
        }

        // All other date fields (billDate, dueDate)
        return (aDate!.getTime() - bDate!.getTime()) * direction;
      }

      // Numeric sort
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return (aValue - bValue) * direction;
      }

      // String sort
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * direction;
      }

      return 0;
    });
  }



  toggleSort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortBills();
  }

  onStatusFilterChange(status: string) {
    this.selectedStatusFilter = status;
    this.filterBills();
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return '';
    return this.sortDirection === 'asc' ? '▲' : '▼';
  }
  downloadAllPaidBills() {
    const paidBills = this.filteredBills.filter(bill => bill.Payment_Status === 'Paid');

    for (const bill of paidBills) {
      const link = document.createElement('a');
      bill.pdfLink="#"
      link.href = bill.pdfLink;
      link.target = '_blank';
      link.download = ''; // You can set a filename here if needed
      link.click();
    }
  }
  hasAnyPaidBills(): boolean {
    return this.filteredBills.some(bill => bill.Payment_Status === 'Paid');
  }
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  }
  logout():void{
    this.detailService.clearAll();
    this.router.navigate(['']);
  }
  generatePDF(bill: History) {
    const doc = new jsPDF();

    // Customer Details Block
    doc.setFontSize(14);
    doc.text('Customer Details', 10, 10);
    doc.setFontSize(11);
    doc.text(`Consumer Number: ${bill.Customer_Number}`, 10, 20);
    doc.text(`Name: ${this.customer.name}`, 10, 30);
    doc.text(`Email: ${this.customer.email}`, 10, 40);
    doc.text(`Mobile_Number: ${this.customer.mobile}`, 10, 60);
    doc.text(`Connection Type: ${this.customer.customerType}`, 10, 70);

    // Bill Details Block
    doc.setFontSize(14);
    doc.text('Bill Details', 10, 90);
    doc.setFontSize(11);

    doc.text(`Bill Number: ${bill.Bill_Number}`, 10, 100);
    doc.text(`Bill Date: ${bill.Bill_Date}`, 10, 110);
    doc.text(`Billing Period: ${bill.Billing_Period}`, 10, 120);
    doc.text(`Due Date: ${bill.Due_Date}`, 10, 130);
    doc.text(`Bill Amount: ₹${bill.Bill_Amount}`, 10, 140);
    doc.text(`Payment Status: ${bill.Payment_Status}`, 10, 150);
    doc.text(`Payment Date: ${bill.Payment_Date || '-'}`, 10, 160);
    doc.text(`Mode of Payment: ${bill.Payment_Mode || '-'}`, 10, 170);

    // Generate PDF as blob
    const blob = doc.output('blob');
    const blobUrl = URL.createObjectURL(blob);

    // Open in new tab safely
    const newTab = window.open('', '_blank');
    if (newTab) {
      newTab.document.write(
        `<html><head><title>Bill PDF</title></head><body style="margin:0">
       <iframe width="100%" height="100%" src="${blobUrl}" frameborder="0"></iframe>
       </body></html>`
      );
    } else {
      alert('Popup blocked. Please allow popups for this website.');
    }
  }



}
