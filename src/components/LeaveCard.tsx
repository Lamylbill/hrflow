
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import GlassCard from "./GlassCard";

interface LeaveCardProps {
  leave: {
    id: string;
    employeeName: string;
    type: string;
    status: "approved" | "pending" | "rejected";
    startDate: string;
    endDate: string;
    reason?: string;
  };
}

const LeaveCard = ({ leave }: LeaveCardProps) => {
  const statusStyles = {
    approved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  const statusLabels = {
    approved: "Approved",
    pending: "Pending",
    rejected: "Rejected",
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getDurationDays = () => {
    const start = new Date(leave.startDate);
    const end = new Date(leave.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  return (
    <GlassCard hoverEffect>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{leave.employeeName}</h3>
          <p className="text-sm text-muted-foreground mt-1">{leave.type}</p>
        </div>
        <Badge
          className={cn(
            "px-2.5 py-0.5 text-xs font-medium",
            statusStyles[leave.status]
          )}
        >
          {statusLabels[leave.status]}
        </Badge>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div>
          <p className="text-xs text-muted-foreground">From</p>
          <p className="text-sm font-medium">{formatDate(leave.startDate)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">To</p>
          <p className="text-sm font-medium">{formatDate(leave.endDate)}</p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-border">
        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            Duration: <span className="font-medium">{getDurationDays()} days</span>
          </p>
          {leave.status === "pending" && (
            <div className="flex space-x-2">
              <button className="text-xs text-green-600 hover:text-green-700 font-medium">
                Approve
              </button>
              <button className="text-xs text-red-600 hover:text-red-700 font-medium">
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
};

export default LeaveCard;
