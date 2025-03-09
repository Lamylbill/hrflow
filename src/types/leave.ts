
export type LeaveStatus = "approved" | "pending" | "rejected";

export interface LeaveRequest {
  id: string;
  employeeName: string;
  type: string;
  status: LeaveStatus;
  startDate: string;
  endDate: string;
  reason?: string;
}
