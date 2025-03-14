
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
  amount?: number; // Add this property to fix errors
  period?: string; // Add this property to fix errors
}
