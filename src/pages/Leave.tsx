import { useState, useEffect } from "react";
import NavbarLoggedIn from "@/components/NavbarLoggedIn";
import Footer from "@/components/Footer";
import AnimatedButton from "@/components/AnimatedButton";
import { Plus, Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeaveRequest, LeaveStatus } from "@/types/leave";
import LeaveStats from "@/components/leave/LeaveStats";
import LeaveFilters from "@/components/leave/LeaveFilters";
import LeaveTabContent from "@/components/leave/LeaveTabContent";
import { getLeaveRequests } from "@/utils/localStorage";
import { AddLeaveRequestDialog } from "@/components/leave/AddLeaveRequestDialog";
import { MassUploadLeaveDialog } from "@/components/leave/MassUploadLeaveDialog";

const Leave = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | LeaveStatus>("all");
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [massUploadOpen, setMassUploadOpen] = useState(false);

  useEffect(() => {
    loadLeaveRequests();
  }, []);

  const loadLeaveRequests = async () => {
    try {
      const requests = await getLeaveRequests();
      setLeaveRequests(requests);
    } catch (error) {
      console.error("Error loading leave requests:", error);
    }
  };

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

  const handleMassUploadComplete = () => {
    loadLeaveRequests();
    setMassUploadOpen(false);
  };

  const downloadLeaveTemplate = () => {
    const csvContent = `EmployeeName,LeaveType,StartDate,EndDate,Reason,Status
John Doe,Annual Leave,2023-06-01,2023-06-05,Family vacation,pending
Jane Smith,Sick Leave,2023-06-10,2023-06-11,Doctor's appointment,approved
Sam Johnson,Parental Leave,2023-07-15,2023-08-15,New baby,pending
Mary Williams,Bereavement Leave,2023-06-20,2023-06-23,Family funeral,approved`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leave_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavbarLoggedIn />

      <main className="flex-grow pt-24 pb-12 page-transition">
        <div className="hr-container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Leave Management</h1>
              <p className="text-muted-foreground mt-1">
                Manage employee leave requests and approvals
              </p>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-4 md:mt-0">
              <Button variant="outline" onClick={downloadLeaveTemplate}>
                <Download className="h-4 w-4 mr-2" />
                Template
              </Button>
              
              <Button variant="outline" onClick={() => setMassUploadOpen(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Mass Upload
              </Button>
              
              <AnimatedButton 
                onClick={() => setDialogOpen(true)}
                className="flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Leave
              </AnimatedButton>
            </div>
          </div>

          <LeaveStats leaveRequests={leaveRequests} />

          <LeaveFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />

          <LeaveTabContent 
            filteredLeaveRequests={filteredLeaveRequests} 
            onStatusChange={handleLeaveStatusChange}
          />
        </div>
      </main>

      <Footer />
      
      <AddLeaveRequestDialog 
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onLeaveAdded={handleLeaveAdded}
        employees={leaveRequests.map(lr => lr.employeeName)}
      />
      
      <MassUploadLeaveDialog
        open={massUploadOpen}
        onClose={() => setMassUploadOpen(false)}
        onLeaveUploaded={handleMassUploadComplete}
      />
    </div>
  );
};

export default Leave;
