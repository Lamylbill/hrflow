
export type ActivityAction = "create" | "update" | "delete" | "approve" | "reject" | "process";
export type ActivityModule = "employees" | "leave" | "payroll";

export interface ActivityLog {
  id: string;
  action: ActivityAction;
  module: ActivityModule;
  description: string;
  timestamp: string;
}
