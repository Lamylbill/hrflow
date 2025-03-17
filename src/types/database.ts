
// Define types for our database tables that are compatible with Supabase
// This file supplements the auto-generated types.ts which we can't modify

export interface EmployeeRecord {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  position: string;
  department: string;
  phone?: string;
  gender?: string;
  date_of_birth?: string;
  nationality?: string;
  address?: string;
  employee_id?: string;
  employment_type?: 'Full-time' | 'Part-time' | 'Contract';
  hire_date: string;
  work_location?: string;
  manager_name?: string;
  status?: 'Active' | 'On Leave' | 'Terminated';
  pay_frequency?: 'Monthly' | 'Bi-Weekly' | 'Weekly';
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  emergency_contact_email?: string;
  salary?: number;
  overtime_eligible?: boolean;
  bonus_eligible?: boolean;
  tax_id?: string;
  bank_account_details?: string;
  secondary_emergency_contact?: string;
  health_insurance?: string;
  dental_vision_coverage?: string;
  retirement_plan?: string;
  work_schedule?: 'Fixed' | 'Flexible' | 'Remote';
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Type assertion helper for Supabase responses
export function asEmployeeRecord(data: any): EmployeeRecord {
  return data as EmployeeRecord;
}

export function asEmployeeRecords(data: any[]): EmployeeRecord[] {
  return data as EmployeeRecord[];
}
