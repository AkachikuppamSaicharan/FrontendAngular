import { Injectable } from '@angular/core';
import {Bill} from '../model/Bill';
import { Important } from '../model/Important';

@Injectable({
  providedIn: 'root'
})
export class BillSelectionService {
  private selectedBills:Bill[]=[];
  private totalAmount!:number;
  private Payment_Mode!:string;
  setPaymentMode(mode:string){  this.Payment_Mode = mode; }
  getPaymentMode(){return this.Payment_Mode;}
  setTotalAmount(t:number){
    this.totalAmount=t;
  }
  getTotalAmount():number{
    return this.totalAmount;
  }
  clearTotalAmount(){
    this.totalAmount=0;
  }
  setSelectedBills(bills:Bill[]){
    this.selectedBills = bills;
  }
  getSelectedBills():Bill[]{
    return this.selectedBills;
  }
  clearSelectedBills(){
    this.selectedBills = [];
  }
}
