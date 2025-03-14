
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, Building, Briefcase, Calendar, User } from "lucide-react";
import { Employee } from "@/types/employee";

interface EmployeeDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  employee: Employee;
}

const EmployeeDetailsDialog = ({ open, onClose, employee }: EmployeeDetailsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
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
        
        <div className="space-y-4">
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
              <p className="text-sm text-muted-foreground">{employee.phone}</p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDetailsDialog;
