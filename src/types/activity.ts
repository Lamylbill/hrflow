
export type ActivityAction = 
  | "create" 
  | "update" 
  | "delete" 
  | "view" 
  | "process" 
  | "approve" 
  | "reject" 
  | "export" 
  | "import" 
  | "upload"
  | "duplicate_detected";

export interface ActivityLog {
  id: string;
  action: ActivityAction;
  module: "employees" | "leave" | "payroll" | "settings";
  description: string;
  timestamp: string;
  // Can contain additional metadata
  details?: Record<string, any>;
}
