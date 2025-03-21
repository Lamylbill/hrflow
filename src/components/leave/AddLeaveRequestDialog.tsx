
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addLeaveRequest, getEmployees } from "@/utils/localStorage";
import { toast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { Employee } from "@/types/employee";

interface AddLeaveRequestDialogProps {
  open: boolean;
  onClose: () => void;
  onLeaveAdded: () => void;
  employees?: string[];
}

export function AddLeaveRequestDialog({ open, onClose, onLeaveAdded, employees: propEmployees }: AddLeaveRequestDialogProps) {
  const [employeeName, setEmployeeName] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  
  // Load employees on mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeeData = await getEmployees();
        setEmployees(employeeData);
        
        // If there's at least one employee, set the first one as default
        if (employeeData.length > 0 && !employeeName) {
          setEmployeeName(employeeData[0].name);
        }
      } catch (error) {
        console.error("Error loading employees:", error);
        toast({
          title: "Error",
          description: "Could not load employee data",
          variant: "destructive",
        });
      }
    };
    
    fetchEmployees();
  }, [open]);
  
  useEffect(() => {
    if (!open) {
      // Reset form when dialog closes
      setEmployeeName("");
      setLeaveType("");
      setStartDate("");
      setEndDate("");
      setReason("");
    }
  }, [open]);

  const handleSubmit = () => {
    if (!employeeName || !leaveType || !startDate || !endDate) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }

    addLeaveRequest({
      employeeName,
      type: leaveType,
      startDate,
      endDate,
      reason,
    });

    toast({
      title: "Leave added",
      description: "The leave record has been added successfully",
    });

    // Call the callback to notify parent component
    onLeaveAdded();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Leave</DialogTitle>
          <DialogDescription>
            Add a new leave record for an employee. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="employee">Employee Name *</Label>
            <Select value={employeeName} onValueChange={setEmployeeName}>
              <SelectTrigger id="employee">
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.name}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Leave Type *</Label>
            <Select value={leaveType} onValueChange={setLeaveType}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Annual Leave">Annual Leave</SelectItem>
                <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                <SelectItem value="Personal Leave">Personal Leave</SelectItem>
                <SelectItem value="Work from Home">Work from Home</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="reason">Reason</Label>
            <Input
              id="reason"
              placeholder="Brief explanation for the leave"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Leave</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
