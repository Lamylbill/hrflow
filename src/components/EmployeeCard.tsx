
import { useState } from "react";
import { Mail, Phone, Pencil, Trash2 } from "lucide-react";
import GlassCard from "./GlassCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const handleEdit = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setShowDetailsDialog(false);
    if (onEdit) {
      onEdit(employee.id);
    } else {
      toast({
        title: "Edit Employee",
        description: `Editing ${employee.name}'s information`,
      });
    }
  };

  const handleDelete = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setShowDetailsDialog(false);
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

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(employee.id);
    } else {
      setShowDetailsDialog(true);
    }
  };
  
  return (
    <>
      <GlassCard
        className="transition-all duration-300 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
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

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-md dark:bg-gray-800 dark:text-white">
          <DialogHeader>
            <DialogTitle className="text-center mb-2 dark:text-white">Employee Details</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center mb-4">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={employee.imageUrl} alt={employee.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                {employee.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-bold dark:text-white">{employee.name}</h3>
            <p className="text-sm text-muted-foreground dark:text-gray-300">{employee.position} • {employee.department}</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span className="dark:text-gray-200">{employee.email}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <span className="dark:text-gray-200">{employee.phone}</span>
            </div>
          </div>
          
          <div className="flex space-x-3 mt-4">
            <Button 
              className="flex-1 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600" 
              variant="outline"
              onClick={(e) => handleEdit(e)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button 
              className="flex-1" 
              variant="destructive"
              onClick={(e) => handleDelete(e)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmployeeCard;
