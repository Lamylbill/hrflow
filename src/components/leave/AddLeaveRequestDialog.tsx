
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { addLeaveRequest } from "@/utils/localStorage";
import { toast } from "@/hooks/use-toast";
import { getEmployees } from "@/utils/localStorage";

interface AddLeaveRequestDialogProps {
  open: boolean;
  onClose: () => void;
  onLeaveAdded: () => void;
  employees: string[];
}

const AddLeaveRequestDialog = ({ open, onClose, onLeaveAdded, employees }: AddLeaveRequestDialogProps) => {
  const [formData, setFormData] = useState({
    employeeName: "",
    type: "Annual Leave",
    reason: "",
  });
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState<"start" | "end" | null>(null);

  // Get all employee names
  const allEmployees = getEmployees().map(emp => emp.name);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.employeeName || !formData.type || !startDate || !endDate) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Validate date range
    if (endDate < startDate) {
      toast({
        title: "Invalid Date Range",
        description: "End date cannot be before start date",
        variant: "destructive",
      });
      return;
    }
    
    // Format dates for storage
    const formattedStartDate = format(startDate, "yyyy-MM-dd");
    const formattedEndDate = format(endDate, "yyyy-MM-dd");
    
    // Add leave request to localStorage
    addLeaveRequest({
      employeeName: formData.employeeName,
      type: formData.type,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      reason: formData.reason,
    });
    
    // Show success message
    toast({
      title: "Leave Request Submitted",
      description: "Your leave request has been submitted for approval",
    });
    
    // Reset form and close dialog
    setFormData({
      employeeName: "",
      type: "Annual Leave",
      reason: "",
    });
    setStartDate(undefined);
    setEndDate(undefined);
    
    // Call the callback to refresh the leave request list
    onLeaveAdded();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request Leave</DialogTitle>
          <DialogDescription>
            Fill in the leave request details. Required fields are marked with *.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="employeeName" className="text-right">
                Employee *
              </Label>
              <select
                id="employeeName"
                name="employeeName"
                className="col-span-3 px-3 py-2 border border-border rounded-md bg-transparent"
                value={formData.employeeName}
                onChange={handleChange}
                required
              >
                <option value="">Select Employee</option>
                {allEmployees.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Leave Type *
              </Label>
              <select
                id="type"
                name="type"
                className="col-span-3 px-3 py-2 border border-border rounded-md bg-transparent"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="Annual Leave">Annual Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Personal Leave">Personal Leave</option>
                <option value="Work from Home">Work from Home</option>
                <option value="Maternity/Paternity">Maternity/Paternity</option>
                <option value="Bereavement">Bereavement</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Start Date *
              </Label>
              <div className="col-span-3">
                <Popover open={calendarOpen === "start"} onOpenChange={(open) => {
                  if (open) setCalendarOpen("start");
                  else setCalendarOpen(null);
                }}>
                  <PopoverTrigger asChild>
                    <button
                      id="startDate"
                      type="button"
                      className={cn(
                        "w-full flex items-center justify-start px-3 py-2 border border-border rounded-md text-left",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Select start date"}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        setStartDate(date);
                        setCalendarOpen(null);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                End Date *
              </Label>
              <div className="col-span-3">
                <Popover open={calendarOpen === "end"} onOpenChange={(open) => {
                  if (open) setCalendarOpen("end");
                  else setCalendarOpen(null);
                }}>
                  <PopoverTrigger asChild>
                    <button
                      id="endDate"
                      type="button"
                      className={cn(
                        "w-full flex items-center justify-start px-3 py-2 border border-border rounded-md text-left",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Select end date"}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => {
                        setEndDate(date);
                        setCalendarOpen(null);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reason" className="text-right">
                Reason
              </Label>
              <textarea
                id="reason"
                name="reason"
                className="col-span-3 px-3 py-2 border border-border rounded-md h-20"
                value={formData.reason}
                onChange={handleChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Submit Request</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLeaveRequestDialog;
