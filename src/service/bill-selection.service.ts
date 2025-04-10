import { Injectable } from '@angular/core';
import {Bill} from '../model/Bill';

@Injectable({
  providedIn: 'root'
})
export class BillSelectionService {
  private selectedBills:Bill[]=[];
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
