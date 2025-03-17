
import React from "react";
import { DollarSign, Calendar, Clock } from "lucide-react";
import { Employee } from "@/types/employee";

interface CompensationTabProps {
  employee: Employee;
}

const CompensationTab = ({ employee }: CompensationTabProps) => {
  // Format salary with currency symbol and commas
  const formattedSalary = employee.salary 
    ? `$${employee.salary.toLocaleString()}`
    : 'Not provided';

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-muted-foreground mb-2">Compensation & Payroll</h4>
      
      <div className="grid grid-cols-[20px_1fr] gap-x-2 items-center">
        <DollarSign className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Salary/Rate</p>
          <p className="text-sm text-muted-foreground">
            {formattedSalary}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-[20px_1fr] gap-x-2 items-center">
        <Calendar className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Pay Frequency</p>
          <p className="text-sm text-muted-foreground">{employee.payFrequency || 'Monthly'}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-[20px_1fr] gap-x-2 items-center">
        <Clock className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Overtime Eligible</p>
          <p className="text-sm text-muted-foreground">{employee.overtimeEligible ? 'Yes' : 'No'}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-[20px_1fr] gap-x-2 items-center">
        <DollarSign className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Tax ID</p>
          <p className="text-sm text-muted-foreground">{employee.taxId || 'Not provided'}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-[20px_1fr] gap-x-2 items-center">
        <DollarSign className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Bank Account Details</p>
          <p className="text-sm text-muted-foreground">{employee.bankAccountDetails || 'Not provided'}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-[20px_1fr] gap-x-2 items-center">
        <DollarSign className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Bonus Eligible</p>
          <p className="text-sm text-muted-foreground">{employee.bonusEligible ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </div>
  );
};

export default CompensationTab;
