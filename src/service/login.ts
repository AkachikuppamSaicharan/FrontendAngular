import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn:'root',
})
export class LoginService{
    private baseURL='http://localhost:8080';

    constructor(private http: HttpClient){}

    loginCustomer(data: any):Observable<any>{
        return  this.http.post(`${this.baseURL}/login`,data);
    }
    getName(userID:string):Observable<any>{
        return this.http.get(`${this.baseURL}/login/${userID}`);
    }
}

