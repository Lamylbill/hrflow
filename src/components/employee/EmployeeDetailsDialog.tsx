
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Edit,
  Trash2
} from "lucide-react";
import { Employee } from "@/types/employee";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import EmployeeDocumentUpload from "./EmployeeDocumentUpload";
import PersonalInfoTab from "./employeeDetails/PersonalInfoTab";
import EmploymentTab from "./employeeDetails/EmploymentTab";
import CompensationTab from "./employeeDetails/CompensationTab";
import OtherInfoTab from "./employeeDetails/OtherInfoTab";

interface EmployeeDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  employee: Employee;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const EmployeeDetailsDialog = ({ open, onClose, employee, onEdit, onDelete }: EmployeeDetailsDialogProps) => {
  // The key issue was here - the handlers need to call the callbacks with the employee ID 
  // and then close the dialog
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
            
            <TabsContent value="personal" className="m-0">
              <PersonalInfoTab employee={employee} />
            </TabsContent>
            
            <TabsContent value="employment" className="m-0">
              <EmploymentTab employee={employee} />
            </TabsContent>
            
            <TabsContent value="compensation" className="m-0">
              <CompensationTab employee={employee} />
            </TabsContent>
            
            <TabsContent value="documents" className="m-0">
              <EmployeeDocumentUpload 
                employeeId={employee.id} 
                onDocumentUploaded={() => {}} 
              />
            </TabsContent>
            
            <TabsContent value="other" className="m-0">
              <OtherInfoTab employee={employee} />
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
