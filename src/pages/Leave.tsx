import { useState } from "react";
import NavbarLoggedIn from "@/components/NavbarLoggedIn";
import Footer from "@/components/Footer";
import AnimatedButton from "@/components/AnimatedButton";
import { Plus } from "lucide-react";
import { LeaveRequest, LeaveStatus } from "@/types/leave";
import LeaveStats from "@/components/leave/LeaveStats";
import LeaveFilters from "@/components/leave/LeaveFilters";
import LeaveTabContent from "@/components/leave/LeaveTabContent";

const Leave = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | LeaveStatus>("all");

  // Mock leave data
  const leaveRequests: LeaveRequest[] = [
    {
      id: "1",
      employeeName: "John Smith",
      type: "Annual Leave",
      status: "approved",
      startDate: "2023-06-10",
      endDate: "2023-06-15",
      reason: "Family vacation",
    },
    {
      id: "2",
      employeeName: "Emily Johnson",
      type: "Sick Leave",
      status: "pending",
      startDate: "2023-06-12",
      endDate: "2023-06-13",
      reason: "Doctor's appointment",
    },
    {
      id: "3",
      employeeName: "Michael Brown",
      type: "Personal Leave",
      status: "rejected",
      startDate: "2023-06-20",
      endDate: "2023-06-22",
      reason: "Personal matters",
    },
    {
      id: "4",
      employeeName: "Jessica Williams",
      type: "Annual Leave",
      status: "approved",
      startDate: "2023-06-25",
      endDate: "2023-06-30",
      reason: "Summer holiday",
    },
    {
      id: "5",
      employeeName: "Robert Jones",
      type: "Work from Home",
      status: "pending",
      startDate: "2023-06-13",
      endDate: "2023-06-14",
      reason: "Home repairs",
    },
    {
      id: "6",
      employeeName: "Sarah Miller",
      type: "Sick Leave",
      status: "approved",
      startDate: "2023-06-15",
      endDate: "2023-06-16",
      reason: "Not feeling well",
    },
    {
      id: "7",
      employeeName: "David Davis",
      type: "Annual Leave",
      status: "pending",
      startDate: "2023-07-01",
      endDate: "2023-07-05",
      reason: "Family event",
    },
    {
      id: "8",
      employeeName: "Jennifer Garcia",
      type: "Personal Leave",
      status: "approved",
      startDate: "2023-06-18",
      endDate: "2023-06-19",
      reason: "Personal matters",
    },
    {
      id: "9",
      employeeName: "Thomas Wilson",
      type: "Work from Home",
      status: "pending",
      startDate: "2023-06-14",
      endDate: "2023-06-15",
      reason: "Internet installation",
    },
  ];

  // Filter leave requests
  const filteredLeaveRequests = leaveRequests.filter((leave) => {
    const matchesSearch = leave.employeeName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || leave.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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

            <AnimatedButton className="mt-4 md:mt-0 flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Request Leave
            </AnimatedButton>
          </div>

          {/* Stats */}
          <LeaveStats leaveRequests={filteredLeaveRequests} />

          {/* Filters */}
          <LeaveFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />

          {/* Tabbed content */}
          <LeaveTabContent filteredLeaveRequests={filteredLeaveRequests} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Leave;
