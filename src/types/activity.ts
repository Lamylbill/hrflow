
export type ActivityAction = "create" | "update" | "delete" | "approve" | "reject" | "process" | "duplicate_detected" | "upload";
export type ActivityModule = "employees" | "leave" | "payroll";

export interface ActivityLog {
  id: string;
  action: ActivityAction;
  module: ActivityModule;
  description: string;
  timestamp: string;
}
