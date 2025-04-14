import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetBillsService } from '../../service/get-bills.service';
import { DetailsService } from '../../service/details.service';
import {NgClass, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-invoice-gen',
  templateUrl: './invoice-gen.component.html',
  imports: [
    NgForOf,
    NgIf
  ],
  styleUrls: ['./invoice-gen.component.css']
})
export class InvoiceGenComponent implements OnInit {
  invoiceData: any[] = [];
  expandedIndex: number | null = null;

  constructor(
    private router: Router,
    private getInvoice: GetBillsService,
    protected billsService: DetailsService
  ) {}

  ngOnInit(): void {
    const userId = this.billsService.getCustomerDetails().userID;
    this.getInvoice.getTransactions(userId).subscribe({
      next: (data: any[]) => {
        if (data && data.length > 0) {
          // Assign random but fixed invoice numbers (one-time)
          this.invoiceData = data.map((item, index) => ({
            ...item,
            invoiceNumber: this.generateInvoiceNumber(index)
          }));
          console.log(this.invoiceData);
        }
      },
      error: () => {
        this.invoiceData = [];
      }
    });
  }

  generateInvoiceNumber(index: number): string {
    return 'INV-' + (100000 + index); // e.g., INV-100000, INV-100001
  }

  toggleExpand(index: number): void {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  goBack(): void {
    this.router.navigate(['Homepage']);
  }
}
