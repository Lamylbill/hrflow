
import React from "react";
import { PlusCircle, Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface EmployeeActionsProps {
  onAddEmployee: () => void;
  onMassUpload: () => void;
}

const EmployeeActions = ({
  onAddEmployee,
  onMassUpload
}: EmployeeActionsProps) => {
  
  const downloadEmployeeTemplate = () => {
    const csvContent = `Name,Position,Department,Email,Phone,EmployeeID,HireDate,Gender,DateOfBirth,Nationality,Address,EmploymentType,WorkLocation,ManagerName,Status,Salary,PayFrequency,OvertimeEligible,BonusEligible,TaxID,BankAccountDetails,EmergencyContactName,EmergencyContactRelationship,EmergencyContactPhone,EmergencyContactEmail,SecondaryEmergencyContact,HealthInsurance,DentalVisionCoverage,RetirementPlan,PTOBalance,WorkSchedule
John Doe,Manager,Engineering,john.doe@example.com,+1-555-123-4567,EMP001,2023-01-15,Male,1980-05-10,American,123 Main St,Full-time,Headquarters,Jane Smith,Active,75000,Monthly,true,true,TAX123456,Bank Account XXXX1234,Mary Doe,Spouse,+1-555-987-6543,mary.doe@example.com,Jack Doe,Premium Health Plan,Dental & Vision Basic,401k 5% match,120,Fixed
Jane Smith,Developer,Engineering,jane.smith@example.com,+1-555-987-6543,EMP002,2023-02-01,Female,1985-08-22,Canadian,456 Oak Ave,Full-time,Remote,John Doe,Active,65000,Monthly,false,true,TAX789012,Bank Account XXXX5678,Jack Smith,Spouse,+1-555-123-7890,jack.smith@example.com,Sarah Smith,Basic Health Plan,Dental Only,401k 3% match,80,Flexible`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employee_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Template downloaded",
      description: "Complete employee template has been downloaded.",
    });
  };
  
  return (
    <div className="flex space-x-2">
      <Button variant="outline" onClick={downloadEmployeeTemplate}>
        <Download className="mr-2 h-4 w-4" />
        Template
      </Button>
      <Button variant="outline" onClick={onMassUpload}>
        <Upload className="mr-2 h-4 w-4" />
        Mass Upload
      </Button>
      <Button onClick={onAddEmployee}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Employee
      </Button>
    </div>
  );
};

export default EmployeeActions;
