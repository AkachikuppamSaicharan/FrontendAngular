import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Transaction} from '../model/Transaction';
@Injectable({
  providedIn: 'root'
})
export class GetBillsService {
  private baseURL='http://localhost:8080';
  constructor(private http:HttpClient) { }
  getBills(User_Id:string):Observable<any>{
    return this.http.get(`${this.baseURL}/fetchbills/${User_Id}`)
  }
  getHistoryBills(User_Id:string):Observable<any>{
    return this.http.get(`${this.baseURL}/BillHistory/${User_Id}`)
  }
  UpdatePayment(billnumber:number,Payment_Mode:string):Observable<any>{
    return this.http.post(`${this.baseURL}/Update`,{"billnumber":billnumber,"paymenttype":Payment_Mode});
  }
  InsertTransaction(data:Transaction):Observable<any>{
    return this.http.post(`${this.baseURL}/Transaction`,data);
  }
  getTransactions(User_Id:string):Observable<any>{
    return this.http.get(`${this.baseURL}/GetTransactions/${User_Id}`);
  }

}
