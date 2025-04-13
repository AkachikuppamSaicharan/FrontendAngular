export interface Transaction{
    paymentid:string;
    tid:string;
    receiptnumber:string;
    date:string;
    type:string;
    billnumbers?:string;
    amount:number;
    status:string;
    userid:string;
}
