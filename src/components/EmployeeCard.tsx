
import { useState } from "react";
import { Mail, Phone, Pencil, Trash2, AlertTriangle } from "lucide-react";
import GlassCard from "./GlassCard";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EmployeeDetailsDialog from "./employee/EmployeeDetailsDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  const handleDeleteClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    setShowDetailsDialog(false);
    setShowDeleteConfirm(false);
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
        className="transition-all duration-300 cursor-pointer relative"
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
                  loading="lazy"
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
        
        {/* Action buttons that appear on hover */}
        <div className={`absolute top-2 right-2 flex space-x-1 ${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 bg-background/50 backdrop-blur-sm hover:bg-background/80"
            onClick={(e) => handleEdit(e)}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 bg-background/50 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground"
            onClick={(e) => handleDeleteClick(e)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </GlassCard>

      {showDetailsDialog && (
        <EmployeeDetailsDialog
          open={showDetailsDialog}
          onClose={() => setShowDetailsDialog(false)}
          employee={employee}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
              Confirm Employee Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {employee.name}'s 
              record and remove all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, delete employee
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EmployeeCard;
