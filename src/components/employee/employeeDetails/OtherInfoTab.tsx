
import React from "react";
import { Heart, DollarSign, Calendar, Clock, Award } from "lucide-react";
import { Employee } from "@/types/employee";

interface OtherInfoTabProps {
  employee: Employee;
}

const OtherInfoTab = ({ employee }: OtherInfoTabProps) => {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-muted-foreground mb-2">Benefits & Perks</h4>
      
      <div className="grid grid-cols-[20px_1fr] gap-x-2 items-center">
        <Heart className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Health Insurance</p>
          <p className="text-sm text-muted-foreground">{employee.healthInsurance || 'Not provided'}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-[20px_1fr] gap-x-2 items-center">
        <Heart className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Dental & Vision Coverage</p>
          <p className="text-sm text-muted-foreground">{employee.dentalVisionCoverage || 'Not provided'}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-[20px_1fr] gap-x-2 items-center">
        <DollarSign className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Retirement Plan</p>
          <p className="text-sm text-muted-foreground">{employee.retirementPlan || 'Not provided'}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-[20px_1fr] gap-x-2 items-center">
        <Calendar className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">PTO Balance</p>
          <p className="text-sm text-muted-foreground">
            {employee.ptoBalance !== undefined ? `${employee.ptoBalance} days` : 'Not provided'}
          </p>
        </div>
      </div>
      
      <h4 className="text-sm font-semibold text-muted-foreground mb-2 mt-6">Performance & Training</h4>
      
      <div className="grid grid-cols-[20px_1fr] gap-x-2 items-center">
        <Award className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Skills & Competencies</p>
          <p className="text-sm text-muted-foreground">
            {employee.skillsCompetencies?.length 
              ? employee.skillsCompetencies.join(', ') 
              : 'Not provided'}
          </p>
        </div>
      </div>
      
      <h4 className="text-sm font-semibold text-muted-foreground mb-2 mt-6">Attendance & Work Hours</h4>
      
      <div className="grid grid-cols-[20px_1fr] gap-x-2 items-center">
        <Clock className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Work Schedule</p>
          <p className="text-sm text-muted-foreground">{employee.workSchedule || 'Fixed'}</p>
        </div>
      </div>
    </div>
  );
};

export default OtherInfoTab;
