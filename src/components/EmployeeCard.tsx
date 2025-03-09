
import { useState } from "react";
import { MoreHorizontal, Mail, Phone, Edit, Trash2, FileText } from "lucide-react";
import GlassCard from "./GlassCard";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

interface EmployeeCardProps {
  employee: {
    id: string;
    name: string;
    position: string;
    department: string;
    email: string;
    phone: string;
    imageUrl?: string;
  };
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

const EmployeeCard = ({ employee, onEdit, onDelete, onViewDetails }: EmployeeCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleEdit = () => {
    if (onEdit) {
      onEdit(employee.id);
    } else {
      toast({
        title: "Edit Employee",
        description: `Editing ${employee.name}'s information`,
      });
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(employee.id);
    } else {
      toast({
        title: "Delete Employee",
        description: `${employee.name} would be removed from the system`,
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(employee.id);
    } else {
      toast({
        title: "View Details",
        description: `Viewing ${employee.name}'s details`,
      });
    }
  };

  return (
    <GlassCard
      className="transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      hoverEffect
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            {employee.imageUrl ? (
              <img
                src={employee.imageUrl}
                alt={employee.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg font-medium text-primary">
                {employee.name.charAt(0)}
              </span>
            )}
          </div>
        </div>
        <div className="ml-4 flex-1">
          <div className="flex justify-between">
            <h3 className="text-base font-semibold">{employee.name}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleViewDetails}>
                  <FileText className="mr-2 h-4 w-4" /> View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-sm text-muted-foreground">
            {employee.position} • {employee.department}
          </p>
        </div>
      </div>

      <div
        className={`mt-4 pt-4 border-t border-border grid grid-cols-2 gap-2 ${
          isHovered ? "opacity-100" : "opacity-70"
        } transition-opacity duration-300`}
      >
        <div className="flex items-center text-xs text-muted-foreground">
          <Mail className="h-3.5 w-3.5 mr-1.5" />
          <span className="truncate">{employee.email}</span>
        </div>
        <div className="flex items-center text-xs text-muted-foreground">
          <Phone className="h-3.5 w-3.5 mr-1.5" />
          <span>{employee.phone}</span>
        </div>
      </div>
    </GlassCard>
  );
};

export default EmployeeCard;
