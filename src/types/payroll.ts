
export type PayrollStatus = "paid" | "pending" | "processing" | "draft";

export interface PayrollData {
  id: string;
  employeeName: string;
  employeeId: string;
  position: string;
  salary: number;
  bonus: number;
  deductions: number;
  netPay: number;
  paymentDate: string;
  status: PayrollStatus;
}
