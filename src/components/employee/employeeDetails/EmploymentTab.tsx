
import React from "react";
import { Briefcase, Building, User, Calendar, MapPin } from "lucide-react";
import { Employee } from "@/types/employee";

interface EmploymentTabProps {
  employee: Employee;
}

const EmploymentTab = ({ employee }: EmploymentTabProps) => {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-muted-foreground mb-2">Employment Details</h4>
      
      <div className="grid grid-cols-[20px_1fr] gap-x-2 items-center">
        <Briefcase className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Position</p>
          <p className="text-sm text-muted-foreground">{employee.position}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-[20px_1fr] gap-x-2 items-center">
        <Building className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Department</p>
          <p className="text-sm text-muted-foreground">{employee.department}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-[20px_1fr] gap-x-2 items-center">
        <User className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Employee ID</p>
          <p className="text-sm text-muted-foreground">{employee.employeeId || 'Not provided'}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-[20px_1fr] gap-x-2 items-center">
        <Briefcase className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Employment Type</p>
          <p className="text-sm text-muted-foreground">{employee.employmentType || 'Full-time'}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-[20px_1fr] gap-x-2 items-center">
        <Calendar className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Date of Hire</p>
          <p className="text-sm text-muted-foreground">{employee.hireDate || 'Not provided'}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-[20px_1fr] gap-x-2 items-center">
        <MapPin className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Work Location</p>
          <p className="text-sm text-muted-foreground">{employee.workLocation || 'Not provided'}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-[20px_1fr] gap-x-2 items-center">
        <User className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Manager/Supervisor</p>
          <p className="text-sm text-muted-foreground">{employee.managerName || 'Not provided'}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-[20px_1fr] gap-x-2 items-center">
        <User className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Employee Status</p>
          <p className="text-sm text-muted-foreground">{employee.status || 'Active'}</p>
        </div>
      </div>
    </div>
  );
};

export default EmploymentTab;
