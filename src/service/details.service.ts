import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CustomerDetails } from '../model/customerDetails';
@Injectable({
  providedIn: 'root'
})
export class DetailsService {
  private customerDetails!:CustomerDetails;

  setCustomerDetails(ele:CustomerDetails){
    this.customerDetails=ele;
  }
  getcustomerDetails():CustomerDetails{
    return this.customerDetails;
  }
  // clearAll(){
  //   this.customerDetails={name:'', userID:'',address:'',customerType:''};
  // }
  constructor() { }
}
