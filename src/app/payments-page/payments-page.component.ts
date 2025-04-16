// import { Component } from '@angular/core';
// import {GetBillsService} from '../../service/get-bills.service';
// import {
//   AbstractControl,
//   FormBuilder,
//   FormGroup,
//   Validators,
//   ReactiveFormsModule,
// } from '@angular/forms';
// import { Router } from '@angular/router';
// import { NgIf } from '@angular/common';
// import { BillSelectionService } from '../../service/bill-selection.service';
// import { Transaction } from '../../model/Transaction';
// import {DetailsService} from '../../service/details.service';
// @Component({
//   selector: 'app-payments-page',
//   templateUrl: './payments-page.component.html',
//   styleUrls: ['./payments-page.component.css'],
//   imports: [
//     ReactiveFormsModule,
//     NgIf,
//   ]
// })
// export class PaymentsPageComponent {
//   paymentForm!: FormGroup;
//   cardType: string = '';
//   totalAmount:number=0;
//   showConfirmation: boolean = false;
//   paymentSuccess: boolean = false;
//   transactionDetails!: Transaction;
//   cvvMaxLength: number = 3;
//   billNumber:string="";
//   constructor(private fb: FormBuilder, private router: Router,private billService:BillSelectionService,private UpdateOperation:GetBillsService,private detailServices:DetailsService) {}
//
//   ngOnInit(): void {
//     const selectedBills = this.billService.getSelectedBills();
//     this.totalAmount = this.billService.getTotalAmount();
//
//     // If no bills or amount is zero, redirect to View Bill page
//     if (!selectedBills || selectedBills.length === 0 || this.totalAmount <= 0) {
//       this.router.navigate(['PayBill']);
//       return;
//     }
//     this.paymentForm = this.fb.group({
//       cardNumber: ['', [Validators.required]],
//       expiryDate: ['', [Validators.required, this.expiryDateValidator]],
//       cvv: ['', [Validators.required]],
//       cardHolder: ['', Validators.required,Validators.pattern(/^[A-Za-z ]+$/)],
//     });
//
//     this.getControl('cardNumber')?.valueChanges.subscribe((value) => {
//       const cleanValue = value.replace(/\s+/g, '');
//       this.detectCardType(cleanValue);
//       const formatted = cleanValue.replace(/(\d{4})/g, '$1 ').trim();
//       this.getControl('cardNumber')?.setValue(formatted, { emitEvent: false });
//     });
//
//     // this.getControl('expiryDate')?.valueChanges.subscribe((value: string) => {
//     //   const formatted = value
//     //     .replace(/\D/g, '')
//     //     .slice(0, 4)
//     //     .replace(/(\d{2})(\d{1,2})?/, (_, mm, yy) => (yy ? `${mm}/${yy}` : mm));
//     //   this.getControl('expiryDate')?.setValue(formatted, { emitEvent: false });
//     // });
//     this.getControl('expiryDate')?.valueChanges.subscribe((value: string) => {
//       const clean = value.replace(/\D/g, '').slice(0, 4);
//       let formatted = clean;
//       if (clean.length >= 3) {
//         formatted = clean.slice(0, 2) + '/' + clean.slice(2);
//       }
//       this.getControl('expiryDate')?.setValue(formatted, { emitEvent: false });
//     });
//
//   }
//
//   public getControl(controlName: string) {
//     return this.paymentForm.get(controlName);
//   }
//
//   detectCardType(cardNumber: string) {
//     if (!cardNumber) {
//       this.cardType = '';
//       this.cvvMaxLength = 3;
//       return;
//     }
//
//     const firstTwo = cardNumber.substring(0, 2);
//
//     if (firstTwo === '34') {
//       this.cardType = 'American Express';
//       this.cvvMaxLength = 4;
//     } else if (['51', '52', '53', '54', '55'].includes(firstTwo)) {
//       this.cardType = 'MasterCard';
//       this.cvvMaxLength = 3;
//     } else if (['49', '44', '47'].includes(firstTwo)) {
//       this.cardType = 'Visa';
//       this.cvvMaxLength = 3;
//     } else if (['42', '45', '48', '49'].includes(firstTwo)) {
//       this.cardType = 'Visa Electron';
//       this.cvvMaxLength = 3;
//     } else {
//       this.cardType = 'Unknown';
//       this.cvvMaxLength = 3;
//     }
//
//     this.getControl('cvv')?.setValidators([
//       Validators.required,
//       Validators.pattern(new RegExp(`^\\d{${this.cvvMaxLength}}$`)),
//     ]);
//     this.getControl('cvv')?.updateValueAndValidity();
//   }
//
//   // expiryDateValidator(control: AbstractControl) {
//   //   const value: string = control.value;
//   //   if (!/^\d{2}\/\d{2}$/.test(value)) return null;
//   //
//   //   const [month, year] = value.split('/').map(Number);
//   //   const current = new Date();
//   //   const inputDate = new Date(Number('20' + year), month - 1);
//   //
//   //   if (month < 1 || month > 12 || inputDate < current) {
//   //     return { expired: true };
//   //   }
//   //
//   //   return null;
//   // }
//   expiryDateValidator(control: AbstractControl) {
//     const value: string = control.value;
//
//     // Check for MM/YY format strictly
//     const match = /^(\d{2})\/(\d{2})$/.exec(value);
//     if (!match) return { expired: true };
//
//     const month = +match[1];
//     const year = +match[2];
//
//     if (month < 1 || month > 12) return { expired: true };
//
//     // Convert year to 4-digit
//     const currentYear = new Date().getFullYear() % 100;
//     const currentMonth = new Date().getMonth() + 1;
//
//     // Expired if year is in the past
//     if (year < currentYear || (year === currentYear && month < currentMonth)) {
//       return { expired: true };
//     }
//
//     return null; // Valid
//   }
//
//
//   onSubmit() {
//     if (this.paymentForm.invalid) {
//       this.paymentForm.markAllAsTouched();
//       return;
//     }
//
//     this.showConfirmation = true;
//   }
//
//   confirmPayment() {
//
//     for (const bill of this.billService.getSelectedBills()) {
//       this.billNumber+=bill.BillNumber.toString();
//         this.UpdateOperation.UpdatePayment(bill.BillNumber,this.billService.getPaymentMode()).subscribe({
//           next:(data:any) => {
//             if(data){
//               console.log(data);
//             }
//             else{
//               console.log("Operation Not Succeeded");
//             }
//           }
//         });
//     }
//     this.transactionDetails = {
//       "paymentid": 'PAY' + Math.floor(100000 + Math.random() * 900000),
//       "receiptnumber": 'RCT' + Math.floor(100000 + Math.random() * 900000),
//       "tid": 'TXN' + Math.floor(100000 + Math.random() * 900000),
//       "type": this.billService.getPaymentMode(),
//       "billnumbers": this.billNumber,
//       "amount": this.totalAmount,
//       "userid": this.detailServices.getCustomerDetails().userID,
//       "status": 'Success',
//       "date": new Date().toLocaleString()
//     };
//     this.UpdateOperation.InsertTransaction(this.transactionDetails).subscribe({
//       next:(data:any) => {
//         console.log(data);
//       }
//     })
//     this.paymentSuccess = true;
//     this.showConfirmation = false;
//
//
//   }
//
//   cancelPayment() {
//     this.showConfirmation = false;
//   }
//
//   goToDashboard() {
//     this.router.navigate(['Homepage']);
//   }
//
//   generateInvoice() {
//     this.router.navigate(['Invoice']);
//   }
// }
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { BillSelectionService } from '../../service/bill-selection.service';
import { GetBillsService } from '../../service/get-bills.service';
import { DetailsService } from '../../service/details.service';
import { Transaction } from '../../model/Transaction';

@Component({
  selector: 'app-payments-page',
  templateUrl: './payments-page.component.html',
  styleUrls: ['./payments-page.component.css'],
  imports: [
    ReactiveFormsModule,
    NgIf,
  ]
})
export class PaymentsPageComponent {
  paymentForm!: FormGroup;
  cardType: string = '';
  totalAmount: number = 0;
  showConfirmation: boolean = false;
  paymentSuccess: boolean = false;
  transactionDetails!: Transaction;
  cvvMaxLength: number = 3;
  billNumber: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private billService: BillSelectionService,
    private UpdateOperation: GetBillsService,
    private detailServices: DetailsService
  ) {}

  ngOnInit(): void {
    const selectedBills = this.billService.getSelectedBills();
    this.totalAmount = this.billService.getTotalAmount();

    if (!selectedBills || selectedBills.length === 0 || this.totalAmount <= 0) {
      this.router.navigate(['PayBill']);
      return;
    }

    this.paymentForm = this.fb.group({
      cardNumber: ['', [
        Validators.required,
        Validators.pattern(/^\d{4} \d{4} \d{4} \d{4}$/)
      ]],
      expiryDate: ['', [
        Validators.required,
        this.expiryDateValidator
      ]],
      cvv: ['', [Validators.required]],
      cardHolder: ['', [
        Validators.required,
        Validators.pattern(/^[A-Za-z ]+$/)
      ]]
    });

    this.getControl('cardNumber')?.valueChanges.subscribe((value) => {
      const cleanValue = value.replace(/\s+/g, '').replace(/\D/g, '');
      this.detectCardType(cleanValue);
      const formatted = cleanValue.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
      this.getControl('cardNumber')?.setValue(formatted, { emitEvent: false });
    });

    this.getControl('expiryDate')?.valueChanges.subscribe((value: string) => {
      const clean = value.replace(/\D/g, '').slice(0, 4);
      let formatted = clean;
      if (clean.length >= 3) {
        formatted = clean.slice(0, 2) + '/' + clean.slice(2);
      }
      this.getControl('expiryDate')?.setValue(formatted, { emitEvent: false });
    });
  }

  public getControl(controlName: string) {
    return this.paymentForm.get(controlName);
  }

  detectCardType(cardNumber: string) {
    if (!cardNumber) {
      this.cardType = '';
      this.cvvMaxLength = 3;
      return;
    }

    const firstTwo = cardNumber.substring(0, 2);
    if (firstTwo === '34') {
      this.cardType = 'American Express';
      this.cvvMaxLength = 4;
    } else if (['51', '52', '53', '54', '55'].includes(firstTwo)) {
      this.cardType = 'MasterCard';
      this.cvvMaxLength = 3;
    } else if (['49', '44', '47'].includes(firstTwo)) {
      this.cardType = 'Visa';
      this.cvvMaxLength = 3;
    } else if (['42', '45', '48'].includes(firstTwo)) {
      this.cardType = 'Visa Electron';
      this.cvvMaxLength = 3;
    } else {
      this.cardType = 'Unknown';
      this.cvvMaxLength = 3;
    }

    this.getControl('cvv')?.setValidators([
      Validators.required,
      Validators.pattern(`^\\d{${this.cvvMaxLength}}$`)
    ]);
    this.getControl('cvv')?.updateValueAndValidity();
  }

  expiryDateValidator(control: AbstractControl) {
    const value: string = control.value;
    const match = /^(\d{2})\/(\d{2})$/.exec(value);
    if (!match) return { expired: true };

    const [_, mm, yy] = match;
    const month = +mm;
    const year = +yy;

    if (month < 1 || month > 12) return { expired: true };

    const now = new Date();
    const expiry = new Date(2000 + year, month - 1, 1);
    expiry.setMonth(expiry.getMonth() + 1); // End of expiry month

    if (expiry <= now) return { expired: true };

    return null;
  }

  onSubmit() {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }
    this.showConfirmation = true;
  }

  confirmPayment() {
    for (const bill of this.billService.getSelectedBills()) {
      this.billNumber += bill.BillNumber.toString();
      this.UpdateOperation.UpdatePayment(bill.BillNumber, this.billService.getPaymentMode()).subscribe({
        next: (data: any) => {
          console.log(data ?? "Operation Not Succeeded");
        }
      });
    }

    this.transactionDetails = {
      paymentid: 'PAY' + Math.floor(100000 + Math.random() * 900000),
      receiptnumber: 'RCT' + Math.floor(100000 + Math.random() * 900000),
      tid: 'TXN' + Math.floor(100000 + Math.random() * 900000),
      type: this.billService.getPaymentMode(),
      billnumbers: this.billNumber,
      amount: this.totalAmount,
      userid: this.detailServices.getCustomerDetails().userID,
      status: 'Success',
      date: new Date().toLocaleString()
    };

    this.UpdateOperation.InsertTransaction(this.transactionDetails).subscribe({
      next: (data: any) => {
        console.log(data);
      }
    });

    this.paymentSuccess = true;
    this.showConfirmation = false;
  }

  cancelPayment() {
    this.showConfirmation = false;
  }

  goToDashboard() {
    this.router.navigate(['Homepage']);
  }

  generateInvoice() {
    this.router.navigate(['Invoice']);
  }
}
