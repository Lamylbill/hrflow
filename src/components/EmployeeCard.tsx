
import { useState } from "react";
import { Mail, Phone } from "lucide-react";
import GlassCard from "./GlassCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
  const [showActionDialog, setShowActionDialog] = useState(false);

  const handleEdit = () => {
    setShowActionDialog(false);
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
    setShowActionDialog(false);
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
    setShowActionDialog(false);
    if (onViewDetails) {
      onViewDetails(employee.id);
    } else {
      toast({
        title: "View Details",
        description: `Viewing ${employee.name}'s details`,
      });
    }
  };
  
  const handleCardClick = () => {
    setShowActionDialog(true);
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

      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center mb-2">Employee Actions</DialogTitle>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                {employee.imageUrl ? (
                  <img
                    src={employee.imageUrl}
                    alt={employee.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-medium text-primary">
                    {employee.name.charAt(0)}
                  </span>
                )}
              </div>
            </div>
            <h3 className="text-center text-xl font-medium">{employee.name}</h3>
            <p className="text-center text-muted-foreground">{employee.position}</p>
          </DialogHeader>
          
          <div className="flex flex-col space-y-3 mt-2">
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={handleViewDetails}
            >
              View Details
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={handleEdit}
            >
              Edit Employee
            </Button>
            <Button 
              variant="destructive" 
              className="w-full justify-start" 
              onClick={handleDelete}
            >
              Delete Employee
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmployeeCard;
