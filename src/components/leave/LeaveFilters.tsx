
import { Search, Filter, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { LeaveStatus } from "@/types/leave";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { LeaveRequest } from "@/types/leave";

interface LeaveFiltersProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filterStatus: "all" | LeaveStatus;
  setFilterStatus: React.Dispatch<React.SetStateAction<"all" | LeaveStatus>>;
  leaveRequests?: LeaveRequest[];
}

const LeaveFilters = ({ searchTerm, setSearchTerm, filterStatus, setFilterStatus, leaveRequests = [] }: LeaveFiltersProps) => {
  const exportLeaveData = () => {
    try {
      // Create CSV content
      let csvContent = "Employee Name,Leave Type,Start Date,End Date,Reason,Status\n";
      
      leaveRequests.forEach((leave) => {
        // Format dates properly
        const startDate = new Date(leave.startDate).toISOString().split('T')[0];
        const endDate = new Date(leave.endDate).toISOString().split('T')[0];
        
        // Escape fields that might contain commas
        const escapedName = `"${leave.employeeName.replace(/"/g, '""')}"`;
        const escapedType = `"${leave.leaveType.replace(/"/g, '""')}"`;
        const escapedReason = leave.reason ? `"${leave.reason.replace(/"/g, '""')}"` : '""';
        
        csvContent += `${escapedName},${escapedType},${startDate},${endDate},${escapedReason},${leave.status}\n`;
      });
      
      // Create blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `leave_data_${new Date().toISOString().split('T')[0]}.csv`);
      
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
  
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by employee name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>
      
      <div className="flex gap-2">
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <select
            className="pl-9 pr-8 py-2 rounded-md border border-input bg-transparent appearance-none focus:outline-none"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as "all" | LeaveStatus)}
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        
        <Button 
          variant="outline" 
          className="flex items-center"
          onClick={exportLeaveData}
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
};

export default LeaveFilters;
