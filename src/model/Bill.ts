export interface Bill {
  consumerNo: string;
  billNumber: string;
  paymentStatus: string;
  connectionType: string;
  connectionStatus: string;
  mobileNumber: string;
  billPeriod: string;
  billDate: string;
  dueDate: string;
  disconnectionDate: string;
  dueAmount: number;
  payableAmount?: number | null;
  selected: boolean;
  errorMessage?: string;

}
