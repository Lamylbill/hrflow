
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlassCard from "@/components/GlassCard";
import LeaveCard from "@/components/LeaveCard";
import AnimatedButton from "@/components/AnimatedButton";
import { Search, Filter, Calendar, Plus, CheckCircle, Clock, XCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type LeaveStatus = "approved" | "pending" | "rejected";

type LeaveRequest = {
  id: string;
  employeeName: string;
  type: string;
  status: LeaveStatus;
  startDate: string;
  endDate: string;
  reason: string;
};

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

  // Group leave requests by status
  const pendingRequests = filteredLeaveRequests.filter(
    (leave) => leave.status === "pending"
  );
  const approvedRequests = filteredLeaveRequests.filter(
    (leave) => leave.status === "approved"
  );
  const rejectedRequests = filteredLeaveRequests.filter(
    (leave) => leave.status === "rejected"
  );

  // Stats
  const leaveStats = [
    {
      title: "Pending Requests",
      count: pendingRequests.length,
      icon: Clock,
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    },
    {
      title: "Approved Leaves",
      count: approvedRequests.length,
      icon: CheckCircle,
      color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    },
    {
      title: "Rejected Requests",
      count: rejectedRequests.length,
      icon: XCircle,
      color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {leaveStats.map((stat, index) => (
              <GlassCard 
                key={stat.title} 
                className="animate-slide-up" 
                style={{ animationDelay: `${0.05 * index}s` }}
              >
                <div className="flex items-center">
                  <div
                    className={`p-3 rounded-lg mr-4 ${stat.color}`}
                  >
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-semibold">{stat.count}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Filters */}
          <GlassCard className="mb-6 animate-slide-up" style={{ animationDelay: "0.15s" }}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by employee name..."
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-4">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select
                    className="pl-9 pr-8 py-2 rounded-lg border border-border bg-transparent appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select
                    className="pl-9 pr-8 py-2 rounded-lg border border-border bg-transparent appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    <option value="this-month">This Month</option>
                    <option value="next-month">Next Month</option>
                    <option value="all-time">All Time</option>
                  </select>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Tabbed content */}
          <Tabs defaultValue="all" className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Requests</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLeaveRequests.length > 0 ? (
                  filteredLeaveRequests.map((leave, index) => (
                    <div 
                      key={leave.id} 
                      className="animate-slide-up" 
                      style={{ animationDelay: `${0.05 * index}s` }}
                    >
                      <LeaveCard leave={leave} />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-muted-foreground">No leave requests found</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="pending">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingRequests.length > 0 ? (
                  pendingRequests.map((leave, index) => (
                    <div 
                      key={leave.id} 
                      className="animate-slide-up" 
                      style={{ animationDelay: `${0.05 * index}s` }}
                    >
                      <LeaveCard leave={leave} />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-muted-foreground">No pending leave requests</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="approved">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {approvedRequests.length > 0 ? (
                  approvedRequests.map((leave, index) => (
                    <div 
                      key={leave.id} 
                      className="animate-slide-up" 
                      style={{ animationDelay: `${0.05 * index}s` }}
                    >
                      <LeaveCard leave={leave} />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-muted-foreground">No approved leave requests</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="rejected">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rejectedRequests.length > 0 ? (
                  rejectedRequests.map((leave, index) => (
                    <div 
                      key={leave.id} 
                      className="animate-slide-up" 
                      style={{ animationDelay: `${0.05 * index}s` }}
                    >
                      <LeaveCard leave={leave} />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-muted-foreground">No rejected leave requests</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Leave;
