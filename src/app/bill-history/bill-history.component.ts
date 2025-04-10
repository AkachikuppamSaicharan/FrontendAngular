import { Component, OnInit } from '@angular/core';
import {CurrencyPipe, DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';

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

  // onDateChange() {
  //   this.dateRangeError = false;
  //
  //   if (this.fromDate && this.toDate) {
  //     const from = new Date(this.fromDate);
  //     const to = new Date(this.toDate);
  //
  //     if (to < from) {
  //       this.dateRangeError = true;
  //       this.filteredBills = []; // Optionally clear data
  //       return;
  //     }
  //   }
  //
  //   this.filterBills();
  // }
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

}
