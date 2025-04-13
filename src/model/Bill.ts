export interface Bill {
   Consumer_Number: number;
   BillNumber: number;
   Payment_Status: string;
   Connection_Type: string;
   Connection_Status: string;
   Mobile_Number:number;
    Bill_Date: string;
    Bill_Period: string;
    Due_Date: string;
    Disconnection_Date: string;
    Due_Amount: number;
    payableAmount?: number | null;
    selected?: boolean;
    errorMessage?: string;
  }
  