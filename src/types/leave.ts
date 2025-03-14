
export type LeaveStatus = "approved" | "pending" | "rejected";

export interface LeaveRequest {
  id: string;
  employeeName: string;
  type: string;
  leaveType?: string; // Add this property to fix errors
  status: LeaveStatus;
  startDate: string;
  endDate: string;
  reason?: string;
}
