export interface History{
        Customer_Number:number;
        Bill_Number:number;
        Billing_Period:string;
        Bill_Amount:number;
        Payment_Status:string;
        Payment_Date:string;
        Payment_Mode:string
        pdfLink?:string ;
        Bill_Date:string;
        Due_Date:string;
}