
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardCard from "@/components/DashboardCard";
import GlassCard from "@/components/GlassCard";
import {
  Users,
  Calendar,
  Clock,
  UserCheck,
  BarChart3,
  Mail,
  Bell,
  Briefcase,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Dashboard = () => {
  // Mock data for the dashboard
  const [activeTab, setActiveTab] = useState("overview");

  const dashboardStats = [
    {
      title: "Total Employees",
      value: 47,
      description: "Active employees",
      icon: Users,
      iconColor: "bg-hr-blue/10 text-hr-blue",
      trend: { value: 12, isPositive: true },
    },
    {
      title: "On Leave Today",
      value: 3,
      description: "Out of office",
      icon: Calendar,
      iconColor: "bg-hr-purple/10 text-hr-purple",
    },
    {
      title: "Pending Requests",
      value: 5,
      description: "Requiring attention",
      icon: Clock,
      iconColor: "bg-hr-lightblue/10 text-hr-lightblue",
    },
    {
      title: "Onboarding",
      value: 2,
      description: "New employees",
      icon: UserCheck,
      iconColor: "bg-hr-teal/10 text-hr-teal",
      trend: { value: 2, isPositive: true },
    },
  ];

  const recentActivity = [
    {
      id: 1,
      user: "John Smith",
      action: "requested leave",
      time: "2 hours ago",
      icon: Calendar,
      iconColor: "bg-hr-purple/10 text-hr-purple",
    },
    {
      id: 2,
      user: "Emily Johnson",
      action: "submitted a timesheet",
      time: "4 hours ago",
      icon: Clock,
      iconColor: "bg-hr-blue/10 text-hr-blue",
    },
    {
      id: 3,
      user: "Michael Brown",
      action: "completed onboarding",
      time: "Yesterday at 2:30 PM",
      icon: UserCheck,
      iconColor: "bg-hr-teal/10 text-hr-teal",
    },
    {
      id: 4,
      user: "Jessica Williams",
      action: "updated profile information",
      time: "Yesterday at 11:15 AM",
      icon: Users,
      iconColor: "bg-hr-lightblue/10 text-hr-lightblue",
    },
    {
      id: 5,
      user: "Admin",
      action: "generated monthly payroll report",
      time: "2 days ago",
      icon: BarChart3,
      iconColor: "bg-hr-indigo/10 text-hr-indigo",
    },
  ];

  const departments = [
    { name: "Engineering", count: 15, color: "bg-hr-blue" },
    { name: "Product", count: 8, color: "bg-hr-purple" },
    { name: "Design", count: 6, color: "bg-hr-teal" },
    { name: "Marketing", count: 7, color: "bg-hr-lightblue" },
    { name: "Sales", count: 8, color: "bg-hr-indigo" },
    { name: "Operations", count: 3, color: "bg-hr-slate" },
  ];

  const totalEmployees = dashboardStats[0].value;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow pt-24 pb-12 page-transition">
        <div className="hr-container">
          {/* Page header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Welcome back! Here's an overview of your HR operations.
              </p>
            </div>

            <div className="flex space-x-3 mt-4 md:mt-0">
              <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                <Mail className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <div className="w-px bg-border self-stretch mx-1"></div>
              <button className="flex items-center space-x-2 rounded-lg hover:bg-secondary transition-colors p-2">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">AD</span>
                </div>
              </button>
            </div>
          </div>

          {/* Dashboard tabs */}
          <div className="flex border-b border-border mb-6">
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === "overview"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === "employees"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("employees")}
            >
              Employees
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === "leave"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("leave")}
            >
              Leave
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === "payroll"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("payroll")}
            >
              Payroll
            </button>
          </div>

          {/* Dashboard stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {dashboardStats.map((stat, index) => (
              <DashboardCard
                key={stat.title}
                {...stat}
                className="animate-slide-up"
                style={{ animationDelay: `${0.05 * index}s` }}
              />
            ))}
          </div>

          {/* Dashboard main content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-6">
              <GlassCard className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Employee Overview</h2>
                  <button className="text-sm text-primary hover:underline">
                    View All
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Department Distribution</span>
                      <span className="font-medium">{totalEmployees} employees</span>
                    </div>

                    <div className="space-y-3">
                      {departments.map((dept) => (
                        <div key={dept.name}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{dept.name}</span>
                            <span className="font-medium">
                              {dept.count} ({Math.round((dept.count / totalEmployees) * 100)}%)
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Progress
                              value={Math.round((dept.count / totalEmployees) * 100)}
                              className="h-2"
                            />
                            <div className={`w-3 h-3 rounded-full ${dept.color}`}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-medium">Key Metrics</h3>
                      <select className="text-xs bg-transparent border border-border rounded-md px-2 py-1">
                        <option>This Month</option>
                        <option>Last Month</option>
                        <option>This Quarter</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {[
                        {
                          label: "Avg. Attendance",
                          value: "94%",
                          icon: UserCheck,
                          color: "text-hr-blue",
                          trend: "+2.5%",
                          trendUp: true,
                        },
                        {
                          label: "Leave Utilization",
                          value: "68%",
                          icon: Calendar,
                          color: "text-hr-purple",
                          trend: "-1.2%",
                          trendUp: false,
                        },
                        {
                          label: "Turnover Rate",
                          value: "3.2%",
                          icon: Briefcase,
                          color: "text-hr-teal",
                          trend: "-0.8%",
                          trendUp: true,
                        },
                        {
                          label: "Open Positions",
                          value: "4",
                          icon: Users,
                          color: "text-hr-lightblue",
                          trend: "Same",
                          trendUp: null,
                        },
                      ].map((metric) => (
                        <div
                          key={metric.label}
                          className="bg-secondary/50 rounded-lg p-3 flex items-center"
                        >
                          <metric.icon className={`h-8 w-8 mr-3 ${metric.color}`} />
                          <div>
                            <div className="text-xs text-muted-foreground">
                              {metric.label}
                            </div>
                            <div className="text-lg font-semibold">{metric.value}</div>
                            <div className="text-xs">
                              <span
                                className={
                                  metric.trendUp === true
                                    ? "text-green-600"
                                    : metric.trendUp === false
                                    ? "text-red-600"
                                    : "text-muted-foreground"
                                }
                              >
                                {metric.trend}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="animate-slide-up" style={{ animationDelay: "0.15s" }}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Upcoming Events</h2>
                  <button className="text-sm text-primary hover:underline">View All</button>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      title: "Team Meeting",
                      date: "Today, 2:00 PM",
                      participants: 8,
                      color: "border-hr-blue",
                    },
                    {
                      title: "Performance Reviews",
                      date: "Tomorrow, 10:00 AM",
                      participants: 12,
                      color: "border-hr-purple",
                    },
                    {
                      title: "New Employee Orientation",
                      date: "June 15, 9:00 AM",
                      participants: 2,
                      color: "border-hr-teal",
                    },
                  ].map((event, i) => (
                    <div
                      key={i}
                      className={`flex items-start py-3 ${
                        i < 2 ? "border-b border-border" : ""
                      }`}
                    >
                      <div className={`w-1 h-12 rounded-full mr-4 ${event.color}`}></div>
                      <div className="flex-1">
                        <h3 className="font-medium">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">{event.date}</p>
                      </div>
                      <div className="flex items-center">
                        <div className="flex -space-x-2">
                          {[...Array(Math.min(3, event.participants))].map((_, i) => (
                            <div
                              key={i}
                              className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs border border-background"
                            ></div>
                          ))}
                        </div>
                        {event.participants > 3 && (
                          <div className="text-xs text-muted-foreground ml-1">
                            +{event.participants - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              <GlassCard className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Recent Activity</h2>
                  <button className="text-sm text-primary hover:underline">View All</button>
                </div>

                <div className="space-y-4">
                  {recentActivity.map((activity) => {
                    const Icon = activity.icon;
                    return (
                      <div
                        key={activity.id}
                        className="flex items-start py-3 border-b border-border last:border-0"
                      >
                        <div className={`p-2 rounded-lg mr-3 ${activity.iconColor}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">{activity.user}</span>{" "}
                            {activity.action}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>

              <GlassCard className="animate-slide-up" style={{ animationDelay: "0.25s" }}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Quick Actions</h2>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: "Add Employee", icon: Users, color: "bg-hr-blue/10 text-hr-blue" },
                    { name: "Approve Leave", icon: Calendar, color: "bg-hr-purple/10 text-hr-purple" },
                    { name: "Run Payroll", icon: BarChart3, color: "bg-hr-indigo/10 text-hr-indigo" },
                    { name: "Send Announcement", icon: Mail, color: "bg-hr-teal/10 text-hr-teal" },
                  ].map((action) => (
                    <button
                      key={action.name}
                      className="flex flex-col items-center justify-center p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
                    >
                      <div className={`p-2 rounded-lg mb-2 ${action.color}`}>
                        <action.icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium">{action.name}</span>
                    </button>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Help & Resources</h2>
                </div>

                <div className="space-y-3">
                  {[
                    "How to add a new employee",
                    "Setting up payroll schedules",
                    "Leave policy management",
                    "Generate custom reports",
                  ].map((resource, i) => (
                    <a
                      key={i}
                      href="#"
                      className="block px-3 py-2 text-sm hover:bg-secondary rounded-lg transition-colors"
                    >
                      {resource}
                    </a>
                  ))}
                </div>

                <button className="w-full mt-4 text-sm text-primary hover:underline">
                  View all resources
                </button>
              </GlassCard>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
