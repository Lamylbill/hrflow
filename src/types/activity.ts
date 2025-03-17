
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
  | "duplicate_detected"
  | "restore";

export type ActivityModule = "employees" | "leave" | "payroll" | "settings";

export interface ActivityLog {
  id: string;
  action: ActivityAction;
  module: ActivityModule;
  description: string;
  timestamp: string;
  // Can contain additional metadata
  details?: Record<string, any>;
}

export interface DeletedItem {
  id: string;
  entityType: 'employee' | 'payroll' | 'leave'; 
  entityData: any;
  deletedAt: string;
  deletedBy?: string;
  expiryDate: string; // Date when this record should be permanently deleted
}
