import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Download, X, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Employee } from "@/types/employee";
import { addEmployee, getEmployees, logActivity } from "@/utils/localStorage";

interface MassUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onEmployeesUploaded: () => void;
}

const MassUploadDialog = ({ open, onClose, onEmployeesUploaded }: MassUploadDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [duplicates, setDuplicates] = useState<string[]>([]);
  const [showDuplicates, setShowDuplicates] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (selectedFile) {
      if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith('.csv')) {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV file.",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
      setUploadSuccess(false);
      setDuplicates([]);
      setShowDuplicates(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    const droppedFile = e.dataTransfer.files[0];
    
    if (droppedFile) {
      if (droppedFile.type !== "text/csv" && !droppedFile.name.endsWith('.csv')) {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV file.",
          variant: "destructive",
        });
        return;
      }
      
      setFile(droppedFile);
      setUploadSuccess(false);
      setDuplicates([]);
      setShowDuplicates(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      const existingEmployees = await getEmployees();
      
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        const rows = text.split('\n');
        const headers = rows[0].split(',');
        
        const nameIndex = headers.findIndex(h => h.toLowerCase().includes('name'));
        const positionIndex = headers.findIndex(h => h.toLowerCase().includes('position'));
        const departmentIndex = headers.findIndex(h => h.toLowerCase().includes('department'));
        const emailIndex = headers.findIndex(h => h.toLowerCase().includes('email'));
        const phoneIndex = headers.findIndex(h => h.toLowerCase().includes('phone'));
        const hireDateIndex = headers.findIndex(h => h.toLowerCase().includes('hire') && h.toLowerCase().includes('date'));
        const genderIndex = headers.findIndex(h => h.toLowerCase().includes('gender'));
        const salaryIndex = headers.findIndex(h => h.toLowerCase().includes('salary'));
        
        if (nameIndex === -1 || positionIndex === -1 || departmentIndex === -1 || emailIndex === -1) {
          throw new Error("CSV file is missing required columns: Name, Position, Department, Email");
        }
        
        const employees: Omit<Employee, "id">[] = [];
        const duplicateEntries: string[] = [];
        
        for (let i = 1; i < rows.length; i++) {
          if (!rows[i].trim()) continue;
          
          const values = rows[i].split(',');
          
          const employee = {
            name: values[nameIndex].trim(),
            position: values[positionIndex].trim(),
            department: values[departmentIndex].trim(),
            email: values[emailIndex].trim(),
            phone: values[phoneIndex !== -1 ? phoneIndex : 0]?.trim() || "",
            hireDate: hireDateIndex !== -1 ? values[hireDateIndex]?.trim() : new Date().toISOString().split('T')[0],
            gender: genderIndex !== -1 ? values[genderIndex]?.trim() : "",
            salary: salaryIndex !== -1 ? parseFloat(values[salaryIndex]) : undefined,
          };
          
          if (!employee.name || !employee.position || !employee.department || !employee.email) {
            continue;
          }
          
          const isDuplicate = existingEmployees.some(
            existing => 
              existing.email.toLowerCase() === employee.email.toLowerCase() || 
              existing.name.toLowerCase() === employee.name.toLowerCase()
          );
          
          if (isDuplicate) {
            duplicateEntries.push(employee.name);
          } else {
            employees.push(employee);
          }
        }
        
        for (const employee of employees) {
          await addEmployee(employee);
        }
        
        if (duplicateEntries.length > 0) {
          setDuplicates(duplicateEntries);
          
          await logActivity({
            action: "duplicate_detected",
            module: "employees",
            description: `Duplicate employees detected during mass upload: ${duplicateEntries.length} duplicates, ${employees.length} uploaded`,
            timestamp: new Date().toISOString()
          });
          
          toast({
            title: "Upload partially successful",
            description: `${employees.length} employees added. ${duplicateEntries.length} duplicates skipped.`,
          });
        } else {
          toast({
            title: "Upload successful",
            description: `${employees.length} employees have been added.`,
          });
        }
        
        setUploadSuccess(true);
        onEmployeesUploaded();
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error("Error uploading employees:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload employees. Please check your file format.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

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

  const resetUpload = () => {
    setFile(null);
    setUploadSuccess(false);
    setDuplicates([]);
    setShowDuplicates(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Mass Upload Employees</DialogTitle>
          <DialogDescription>
            Upload a CSV file with employee information.
          </DialogDescription>
        </DialogHeader>
        
        {uploadSuccess ? (
          <div className="py-6 flex flex-col items-center text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">Upload Successful</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your employees have been successfully added to the system.
            </p>
            
            {duplicates.length > 0 && (
              <div className="mb-4 w-full">
                <div 
                  className="flex items-center justify-between bg-amber-50 text-amber-800 px-4 py-2 rounded-md cursor-pointer"
                  onClick={() => setShowDuplicates(!showDuplicates)}
                >
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <span>
                      {duplicates.length} duplicate {duplicates.length === 1 ? 'entry' : 'entries'} skipped
                    </span>
                  </div>
                  <Button variant="ghost" size="sm">
                    {showDuplicates ? 'Hide' : 'Show'}
                  </Button>
                </div>
                
                {showDuplicates && (
                  <div className="mt-2 bg-muted p-2 rounded-md max-h-40 overflow-y-auto">
                    <ul className="text-xs space-y-1">
                      {duplicates.map((name, index) => (
                        <li key={index} className="text-left">• {name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={resetUpload}>
                Upload Another File
              </Button>
              <Button onClick={onClose}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div 
              className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".csv"
                className="hidden"
              />
              
              {file ? (
                <div className="flex flex-col items-center">
                  <FileText className="h-10 w-10 text-primary mb-3" />
                  <p className="text-sm font-medium mb-1">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      resetUpload();
                    }}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-sm font-medium mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    CSV files only, max 5MB
                  </p>
                </div>
              )}
            </div>
            
            <div className="text-sm space-y-2">
              <p className="font-medium">The CSV file should contain the following columns:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground text-xs">
                <li>Name (required)</li>
                <li>Position (required)</li>
                <li>Department (required)</li>
                <li>Email (required)</li>
                <li>Phone, HireDate, Gender, etc. (optional)</li>
              </ul>
              <div className="flex justify-center mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={(e) => {
                    e.preventDefault();
                    downloadEmployeeTemplate();
                  }}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download Template
                </Button>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpload} 
                disabled={!file || isUploading}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MassUploadDialog;
