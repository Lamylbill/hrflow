import { useState, useEffect } from "react";
import NavbarLoggedIn from "@/components/NavbarLoggedIn";
import Footer from "@/components/Footer";
import AnimatedButton from "@/components/AnimatedButton";
import { Plus } from "lucide-react";
import { LeaveRequest, LeaveStatus } from "@/types/leave";
import LeaveStats from "@/components/leave/LeaveStats";
import LeaveFilters from "@/components/leave/LeaveFilters";
import LeaveTabContent from "@/components/leave/LeaveTabContent";
import { getLeaveRequests } from "@/utils/localStorage";
import { AddLeaveRequestDialog } from "@/components/leave/AddLeaveRequestDialog";

const Leave = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | LeaveStatus>("all");
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    // Load leave requests from localStorage
    loadLeaveRequests();
  }, []);

  const loadLeaveRequests = () => {
    setLeaveRequests(getLeaveRequests());
  };

  // Filter leave requests
  const filteredLeaveRequests = leaveRequests.filter((leave) => {
    const matchesSearch = leave.employeeName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || leave.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleLeaveStatusChange = () => {
    loadLeaveRequests();
  };

  const handleLeaveAdded = () => {
    loadLeaveRequests();
    setDialogOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavbarLoggedIn />

      <main className="flex-grow pt-24 pb-12 page-transition">
        <div className="hr-container">
          {/* Page header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Leave Management</h1>
              <p className="text-muted-foreground mt-1">
                Manage employee leave requests and approvals
              </p>
            </div>

            <AnimatedButton 
              className="mt-4 md:mt-0 flex items-center"
              onClick={() => setDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Request Leave
            </AnimatedButton>
          </div>

          {/* Stats */}
          <LeaveStats leaveRequests={leaveRequests} />

          {/* Filters */}
          <LeaveFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />

          {/* Tabbed content */}
          <LeaveTabContent 
            filteredLeaveRequests={filteredLeaveRequests} 
            onStatusChange={handleLeaveStatusChange}
          />
        </div>
      </main>

      <Footer />
      
      {/* Add Leave Request Dialog */}
      <AddLeaveRequestDialog 
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onLeaveAdded={handleLeaveAdded}
        employees={getLeaveRequests().map(lr => lr.employeeName)}
      />
    </div>
  );
};

export default Leave;
