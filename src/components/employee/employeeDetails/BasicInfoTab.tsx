
import { Employee } from "@/types/employee";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone } from "lucide-react";

interface BasicInfoTabProps {
  employee: Employee;
}

const BasicInfoTab = ({ employee }: BasicInfoTabProps) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default BasicInfoTab;
