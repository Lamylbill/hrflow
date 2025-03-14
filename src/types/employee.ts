
export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  imageUrl?: string;
  
  // Personal Information
  dateOfBirth?: string;
  gender?: string;
  nationality?: string;
  address?: string;
  
  // Employment Details
  employeeId?: string;
  employmentType?: 'Full-time' | 'Part-time' | 'Contract';
  hireDate?: string;
  workLocation?: string;
  managerName?: string;
  status?: 'Active' | 'On Leave' | 'Terminated';
  
  // Compensation & Payroll
  salary?: number;
  payFrequency?: 'Monthly' | 'Bi-Weekly' | 'Weekly';
  overtimeEligible?: boolean;
  taxId?: string;
  bankAccountDetails?: string;
  bonusEligible?: boolean;
  
  // Emergency Contact Information
  emergencyContactName?: string;
  emergencyContactRelationship?: string;
  emergencyContactPhone?: string;
  emergencyContactEmail?: string;
  secondaryEmergencyContact?: string;
  
  // Benefits & Perks
  healthInsurance?: string;
  dentalVisionCoverage?: string;
  retirementPlan?: string;
  ptoBalance?: number;
  
  // Performance & Training
  performanceReviews?: any[];
  trainingCertifications?: any[];
  skillsCompetencies?: string[];
  promotionHistory?: any[];
  
  // Attendance & Work Hours
  workSchedule?: 'Fixed' | 'Flexible' | 'Remote';
  attendanceRecords?: any[];
}
