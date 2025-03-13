
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
import { addLeaveRequest } from "@/utils/localStorage";
import { toast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { Employee } from "@/types/employee";
import { getEmployees } from "@/utils/localStorage";

export function AddLeaveRequestDialog() {
  const [open, setOpen] = useState(false);
  const [employeeName, setEmployeeName] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      const employeeData = await getEmployees();
      setEmployees(employeeData);
    };
    
    fetchEmployees();
  }, []);

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
      title: "Leave request submitted",
      description: "The leave request has been submitted successfully",
    });

    // Reset form and close dialog
    setEmployeeName("");
    setLeaveType("");
    setStartDate("");
    setEndDate("");
    setReason("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1">
          <Plus className="h-4 w-4" />
          Add Request
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Leave Request</DialogTitle>
          <DialogDescription>
            Submit a new leave request. All fields marked with * are required.
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
              placeholder="Brief explanation for the leave request"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit Request</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
