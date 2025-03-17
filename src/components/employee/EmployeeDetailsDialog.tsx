import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Mail, 
  Phone, 
  Building, 
  Briefcase, 
  Calendar, 
  User, 
  MapPin, 
  Globe, 
  DollarSign, 
  Heart, 
  Award, 
  Clock,
  Contact,
  Edit,
  Trash2,
  FileText
} from "lucide-react";
import { Employee } from "@/types/employee";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import EmployeeDocumentUpload from "./EmployeeDocumentUpload";

interface EmployeeDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  employee: Employee;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const EmployeeDetailsDialog = ({ open, onClose, employee, onEdit, onDelete }: EmployeeDetailsDialogProps) => {
  const handleEdit = () => {
    if (onEdit) {
      onEdit(employee.id);
      onClose();
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(employee.id);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Employee Details</DialogTitle>
          <DialogDescription>
            View detailed information about this employee.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-4">
          <Avatar className="h-20 w-20 mb-3">
            <AvatarImage src={employee.imageUrl} alt={employee.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-xl">
              {employee.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          
          <h3 className="text-xl font-bold">{employee.name}</h3>
          <p className="text-sm text-muted-foreground">{employee.position}</p>
        </div>

        <div className="flex justify-center space-x-4 mb-4">
          <Button onClick={handleEdit} className="flex items-center">
            <Edit className="mr-2 h-4 w-4" />
            Edit Employee
          </Button>
          <Button onClick={handleDelete} variant="destructive" className="flex items-center">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Employee
          </Button>
        </div>
        
        <ScrollArea className="h-[400px] pr-4">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="employment">Employment</TabsTrigger>
              <TabsTrigger value="compensation">Compensation</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="other">Other Info</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="space-y-4">
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">Personal Information</h4>
              
              <div className="grid grid-cols-[20px_1fr] gap-x-2 items-center">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Full Name</p>
                  <p className="text-sm text-muted-foreground">{employee.name}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-[20px_1fr] gap-x-2 items-center">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{employee.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-[20px_1fr] gap-x-2 items-center">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{employee.phone || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-[20px_1fr] gap-x-2 items-center">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Date of Birth</p>
                  <p className="text-sm text-muted-foreground">{employee.dateOfBirth || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-[20px_1fr] gap-x-2 items-center">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Gender</p>
                  <p className="text-sm text-muted-foreground">{employee.gender || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-[20px_1fr] gap-x-2 items-center">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Nationality</p>
                  <p className="text-sm text-muted-foreground">{employee.nationality || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-[20px_1fr] gap-x-2 items-center">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">{employee.address || 'Not provided'}</p>
                </div>
              </div>
              
              <h4 className="text-sm font-semibold text-muted-foreground mb-2 mt-6">Emergency Contact</h4>
              
              <div className="grid grid-cols-[20px_1fr] gap-x-2 items-center">
                <Contact className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Emergency Contact</p>
                  <p className="text-sm text-muted-foreground">
                    {employee.emergencyContactName ? 
                      `${employee.emergencyContactName} (${employee.emergencyContactRelationship || 'Not specified'})` : 
                      'Not provided'}
                  </p>
                  {employee.emergencyContactPhone && (
                    <p className="text-xs text-muted-foreground">{employee.emergencyContactPhone}</p>
                  )}
                  {employee.emergencyContactEmail && (
                    <p className="text-xs text-muted-foreground">{employee.emergencyContactEmail}</p>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="employment" className="space-y-4">
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
            </TabsContent>
            
            <TabsContent value="compensation" className="space-y-4">
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">Compensation & Payroll</h4>
              
              <div className="grid grid-cols-[20px_1fr] gap-x-2 items-center">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Salary/Rate</p>
                  <p className="text-sm text-muted-foreground">
                    {employee.salary ? `$${employee.salary.toLocaleString()}` : 'Not provided'}
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
            </TabsContent>
            
            <TabsContent value="documents" className="space-y-4">
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">Employee Documents</h4>
              <EmployeeDocumentUpload 
                employeeId={employee.id} 
                onDocumentUploaded={() => {}} 
              />
            </TabsContent>
            
            <TabsContent value="other" className="space-y-4">
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
            </TabsContent>
          </Tabs>
        </ScrollArea>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDetailsDialog;
