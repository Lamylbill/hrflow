
import { useState, useEffect } from "react";
import NavbarLoggedIn from "@/components/NavbarLoggedIn";
import Footer from "@/components/Footer";
import GlassCard from "@/components/GlassCard";
import { CalendarClock, Filter, Search } from "lucide-react";
import { getActivityLogs } from "@/utils/localStorage";
import { ActivityLog, ActivityModule } from "@/types/activity";

const ActivityLogPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterModule, setFilterModule] = useState<"all" | ActivityModule>("all");
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    // Load activity logs from localStorage
    const loadActivityLogs = async () => {
      try {
        const logs = await getActivityLogs();
        setActivityLogs(logs);
      } catch (error) {
        console.error("Error loading activity logs:", error);
      }
    };
    
    loadActivityLogs();
  }, []);

  // Filter activity logs
  const filteredLogs = activityLogs.filter((log) => {
    const matchesSearch = log.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = filterModule === "all" || log.module === filterModule;
    return matchesSearch && matchesModule;
  });

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Get icon color based on action
  const getActionColor = (action: string) => {
    switch (action) {
      case "create":
        return "text-green-500";
      case "update":
        return "text-blue-500";
      case "delete":
        return "text-red-500";
      case "approve":
        return "text-green-500";
      case "reject":
        return "text-red-500";
      case "process":
        return "text-purple-500";
      default:
        return "text-gray-500";
    }
  };

  // Get badge color based on module
  const getModuleColor = (module: ActivityModule) => {
    switch (module) {
      case "employees":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "leave":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "payroll":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavbarLoggedIn />

      <main className="flex-grow pt-24 pb-12 page-transition">
        <div className="hr-container">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Activity Log</h1>
            <p className="text-muted-foreground mt-1">
              Track all system activities and user actions
            </p>
          </div>

          {/* Filters */}
          <GlassCard className="mb-6 animate-slide-up">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search activities..."
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select
                  className="pl-9 pr-8 py-2 rounded-lg border border-border bg-transparent appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  value={filterModule}
                  onChange={(e) => setFilterModule(e.target.value as "all" | ActivityModule)}
                >
                  <option value="all">All Modules</option>
                  <option value="employees">Employees</option>
                  <option value="leave">Leave</option>
                  <option value="payroll">Payroll</option>
                </select>
              </div>
            </div>
          </GlassCard>

          {/* Activity Logs */}
          <GlassCard className="animate-slide-up" style={{ animationDelay: "0.15s" }}>
            {filteredLogs.length > 0 ? (
              <div className="space-y-4">
                {filteredLogs.map((log) => (
                  <div 
                    key={log.id} 
                    className="border-b border-border last:border-0 pb-4 last:pb-0"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CalendarClock className={`h-5 w-5 mr-3 ${getActionColor(log.action)}`} />
                        <div>
                          <p className="text-sm">{log.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatTimestamp(log.timestamp)}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getModuleColor(
                          log.module
                        )}`}
                      >
                        {log.module.charAt(0).toUpperCase() + log.module.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <CalendarClock className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">No activity logs found</p>
              </div>
            )}
          </GlassCard>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ActivityLogPage;
