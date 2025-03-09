
import { Filter, Search, Calendar } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { LeaveStatus } from "@/types/leave";

interface LeaveFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: "all" | LeaveStatus;
  setFilterStatus: (status: "all" | LeaveStatus) => void;
}

const LeaveFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  filterStatus, 
  setFilterStatus 
}: LeaveFiltersProps) => {
  return (
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
              onChange={(e) => setFilterStatus(e.target.value as "all" | LeaveStatus)}
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
  );
};

export default LeaveFilters;
