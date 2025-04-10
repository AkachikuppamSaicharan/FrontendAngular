import { Component, OnInit } from '@angular/core';
import {CurrencyPipe, DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import * as jspdf from "jspdf";
import jsPDF from "jspdf";

interface Bill {
  billNumber: number;
  billDate: string;
  billingPeriod: string;
  dueDate: string;
  billAmount: number;
  paymentStatus: 'Paid' | 'Unpaid';
  paymentDate: string;
  modeOfPayment: string;
  pdfLink: string;
}

@Component({
  selector: 'app-bill-history',
  templateUrl: './bill-history.component.html',
  imports: [
    NgIf,
    CurrencyPipe,
    NgClass,
    NgForOf,
    FormsModule,
    DatePipe
  ],
  styleUrls: ['./bill-history.component.css']
})
export class BillHistoryComponent implements OnInit {
  allBills: Bill[] = [];
  filteredBills: Bill[] = [];

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  selectedStatusFilter: string = 'All';

  ngOnInit() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    this.allBills = [
      {
        billNumber: 1001,
        billDate: '2024-11-10',
        billingPeriod: 'Oct 2024',
        dueDate: '2024-11-25',
        billAmount: 120.5,
        paymentStatus: 'Paid',
        paymentDate: '2024-11-15',
        modeOfPayment: 'Credit Card',
        pdfLink: '#'
      },
      {
        billNumber: 1002,
        billDate: '2024-12-10',
        billingPeriod: 'Nov 2024',
        dueDate: '2024-12-25',
        billAmount: 130.75,
        paymentStatus: 'Unpaid',
        paymentDate: '',
        modeOfPayment: '',
        pdfLink: '#'
      },
      {
        billNumber: 1003,
        billDate: '2025-01-10',
        billingPeriod: 'Dec 2024',
        dueDate: '2025-01-25',
        billAmount: 110.0,
        paymentStatus: 'Paid',
        paymentDate: '2025-01-20',
        modeOfPayment: 'Net Banking',
        pdfLink: '#'
      }
    ];

    this.filterBills();
  }
  fromDate: string = '';
  toDate: string = '';

  filterBills() {
    this.filteredBills = this.allBills.filter(bill => {
      const billDate = new Date(bill.billDate);

      const isWithinDateRange =
          (!this.fromDate || billDate >= new Date(this.fromDate)) &&
          (!this.toDate || billDate <= new Date(this.toDate));

      const matchesStatus =
          this.selectedStatusFilter === 'All' || bill.paymentStatus === this.selectedStatusFilter;

      return isWithinDateRange && matchesStatus;
    });

    this.sortBills();
  }

  customer = {
    customerNumber: 'CUST123456',
    name: 'John Doe',
    email: 'john.doe@example.com',
    mobileNumber: '+1 987-654-3210',
    address: '123 Main Street, Springfield, IL 62704',
    connectionType: 'Residential'
  };
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
      let aValue: any = a[this.sortColumn as keyof Bill];
      let bValue: any = b[this.sortColumn as keyof Bill];

      if (dateFields.includes(this.sortColumn)) {
        const aDate = aValue ? new Date(aValue) : null;
        const bDate = bValue ? new Date(bValue) : null;

        // Special handling for paymentDate — only when filtered to "Paid"
        if (this.sortColumn === 'paymentDate') {
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
    const paidBills = this.filteredBills.filter(bill => bill.paymentStatus === 'Paid');

    for (const bill of paidBills) {
      const link = document.createElement('a');
      link.href = bill.pdfLink;
      link.target = '_blank';
      link.download = ''; // You can set a filename here if needed
      link.click();
    }
  }
  hasAnyPaidBills(): boolean {
    return this.filteredBills.some(bill => bill.paymentStatus === 'Paid');
  }
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  }
  generatePDF(bill: Bill) {
    const doc = new jsPDF();

    // Customer Details Block
    doc.setFontSize(14);
    doc.text('Customer Details', 10, 10);
    doc.setFontSize(11);
    doc.text(`Customer Number: ${this.customer.customerNumber}`, 10, 20);
    doc.text(`Name: ${this.customer.name}`, 10, 30);
    doc.text(`Email: ${this.customer.email}`, 10, 40);
    doc.text(`Address: ${this.customer.address}`, 10, 60);
    doc.text(`Connection Type: ${this.customer.connectionType}`, 10, 70);

    // Bill Details Block
    doc.setFontSize(14);
    doc.text('Bill Details', 10, 90);
    doc.setFontSize(11);
    doc.text(`Bill Number: ${bill.billNumber}`, 10, 100);
    doc.text(`Bill Date: ${bill.billDate}`, 10, 110);
    doc.text(`Billing Period: ${bill.billingPeriod}`, 10, 120);
    doc.text(`Due Date: ${bill.dueDate}`, 10, 130);
    doc.text(`Bill Amount: ₹${bill.billAmount}`, 10, 140);
    doc.text(`Payment Status: ${bill.paymentStatus}`, 10, 150);
    doc.text(`Payment Date: ${bill.paymentDate || '-'}`, 10, 160);
    doc.text(`Mode of Payment: ${bill.modeOfPayment || '-'}`, 10, 170);

    // Open in New Tab
    const pdfBlob = doc.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);
    window.open(blobUrl, '_blank');
  }



}
