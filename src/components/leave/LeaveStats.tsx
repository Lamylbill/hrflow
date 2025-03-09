
import { CheckCircle, Clock, XCircle } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { LeaveRequest, LeaveStatus } from "@/types/leave";

interface LeaveStatsProps {
  leaveRequests: LeaveRequest[];
}

const LeaveStats = ({ leaveRequests }: LeaveStatsProps) => {
  // Group leave requests by status
  const pendingRequests = leaveRequests.filter(
    (leave) => leave.status === "pending"
  );
  const approvedRequests = leaveRequests.filter(
    (leave) => leave.status === "approved"
  );
  const rejectedRequests = leaveRequests.filter(
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
  );
};

export default LeaveStats;
