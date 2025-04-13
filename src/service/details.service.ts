import { Injectable } from '@angular/core';
import { CustomerDetails } from '../model/customerDetails';

@Injectable({
  providedIn: 'root'
})
export class DetailsService {
  private customerDetails: CustomerDetails = {
    name: '',
    userID: '',
    address: '',
    customerType: '',
    email: '',
    mobile: 0
  };

  private storageKey = 'customerDetails';

  constructor() {
    const storedData = localStorage.getItem(this.storageKey);
    if (storedData) {
      this.customerDetails = JSON.parse(storedData);
    }
  }

  setCustomerDetails(details: CustomerDetails): void {
    this.customerDetails = details;
    localStorage.setItem(this.storageKey, JSON.stringify(details));
  }

  getCustomerDetails(): CustomerDetails {
    return this.customerDetails;
  }

  clearAll(): void {
    this.customerDetails = {
      name: '',
      userID: '',
      address: '',
      customerType: '',
      email: '',
      mobile: 0
    };
    localStorage.removeItem(this.storageKey);
  }
}
