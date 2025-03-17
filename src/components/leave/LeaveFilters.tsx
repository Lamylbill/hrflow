
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, SearchIcon, FilterIcon, Download } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { LeaveRequest, LeaveRequestWithEmployee } from "@/types/leave";
import { toast } from "@/hooks/use-toast";

interface LeaveFiltersProps {
  onFilterChange: (filters: {
    searchTerm: string;
    status: string | null;
    dateRange: { from: Date | undefined; to: Date | undefined };
    leaveType: string | null;
  }) => void;
  leaveRequests: LeaveRequestWithEmployee[];
}

const LeaveFilters = ({ onFilterChange, leaveRequests }: LeaveFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [date, setDate] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [leaveType, setLeaveType] = useState<string | null>(null);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onFilterChange({
      searchTerm: value,
      status,
      dateRange: date,
      leaveType,
    });
  };

  const handleStatusChange = (value: string) => {
    setStatus(value === "all" ? null : value);
    onFilterChange({
      searchTerm,
      status: value === "all" ? null : value,
      dateRange: date,
      leaveType,
    });
  };

  const handleDateSelect = (range: { from: Date | undefined; to: Date | undefined }) => {
    setDate(range);
    onFilterChange({
      searchTerm,
      status,
      dateRange: range,
      leaveType,
    });
  };

  const handleLeaveTypeChange = (value: string) => {
    setLeaveType(value === "all" ? null : value);
    onFilterChange({
      searchTerm,
      status,
      dateRange: date,
      leaveType: value === "all" ? null : value,
    });
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatus(null);
    setDate({ from: undefined, to: undefined });
    setLeaveType(null);
    onFilterChange({
      searchTerm: "",
      status: null,
      dateRange: { from: undefined, to: undefined },
      leaveType: null,
    });
  };

  // New function to export leave data
  const exportLeaveData = () => {
    try {
      // Create CSV content
      let csvContent = "Employee Name,Leave Type,From,To,Status,Reason\n";
      
      leaveRequests.forEach((leave) => {
        const fromDate = format(new Date(leave.start_date), 'yyyy-MM-dd');
        const toDate = format(new Date(leave.end_date), 'yyyy-MM-dd');
        
        // Escape fields that might contain commas
        const escapedReason = leave.reason ? `"${leave.reason.replace(/"/g, '""')}"` : "";
        const employeeName = leave.employee ? `"${leave.employee.name.replace(/"/g, '""')}"` : "";
        
        csvContent += `${employeeName},${leave.leave_type},${fromDate},${toDate},${leave.status},${escapedReason}\n`;
      });
      
      // Create a blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `leave_data_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      
      // Append, click and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Successful",
        description: "Leave data has been exported to CSV",
      });
    } catch (error) {
      console.error("Error exporting leave data:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the leave data",
        variant: "destructive",
      });
    }
  };

  const hasFilters = searchTerm || status || date.from || leaveType;

  return (
    <div className="flex flex-wrap gap-2 mb-6 items-center justify-between">
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leave requests..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 w-[200px] md:w-[300px]"
          />
        </div>

        <Select value={status || "all"} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[130px]">
            <div className="flex items-center gap-2">
              <FilterIcon className="h-4 w-4" />
              <span>Status</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-[180px] justify-start text-left font-normal ${
                date.from ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Date Range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Select value={leaveType || "all"} onValueChange={handleLeaveTypeChange}>
          <SelectTrigger className="w-[150px]">
            <span>Leave Type</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="annual">Annual Leave</SelectItem>
            <SelectItem value="sick">Sick Leave</SelectItem>
            <SelectItem value="parental">Parental Leave</SelectItem>
            <SelectItem value="unpaid">Unpaid Leave</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="h-9">
            Clear filters
          </Button>
        )}

        {hasFilters && (
          <Badge variant="outline" className="ml-2">
            {[
              searchTerm && "Search",
              status && `Status: ${status}`,
              date.from && "Date range",
              leaveType && `Type: ${leaveType}`,
            ]
              .filter(Boolean)
              .join(", ")}
          </Badge>
        )}
      </div>

      {/* Add export button */}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={exportLeaveData}
        className="flex items-center"
      >
        <Download className="mr-2 h-4 w-4" />
        Export
      </Button>
    </div>
  );
};

export default LeaveFilters;
