import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarLoggedIn from "@/components/NavbarLoggedIn";
import Footer from "@/components/Footer";
import DashboardCard from "@/components/DashboardCard";
import GlassCard from "@/components/GlassCard";
import {
  Users,
  Calendar,
  Clock,
  UserCheck,
  BarChart3,
  Briefcase,
  ClipboardList,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import EmployeesTabContent from "@/components/dashboard/EmployeesTabContent";
import LeaveTabContent from "@/components/dashboard/LeaveTabContent";
import PayrollTabContent from "@/components/dashboard/PayrollTabContent";

const Dashboard = () => {
  const navigate = useNavigate();
  // Mock data for the dashboard
  const [activeTab, setActiveTab] = useState("overview");

  const dashboardStats = [
    {
      title: "Total Employees",
      value: 0,
      description: "Active employees",
      icon: Users,
      iconColor: "bg-hr-blue/10 text-hr-blue",
    },
    {
      title: "On Leave Today",
      value: 0,
      description: "Out of office",
      icon: Calendar,
      iconColor: "bg-hr-purple/10 text-hr-purple",
    },
    {
      title: "Pending Requests",
      value: 0,
      description: "Requiring attention",
      icon: Clock,
      iconColor: "bg-hr-lightblue/10 text-hr-lightblue",
    },
    {
      title: "Onboarding",
      value: 0,
      description: "New employees",
      icon: UserCheck,
      iconColor: "bg-hr-teal/10 text-hr-teal",
    },
  ];

  const recentActivity = [
    // Empty by default - will be populated when user performs actions
  ];

  const departments = [
    // These will be populated from actual employee data
  ];

  const totalEmployees = dashboardStats[0].value;

  const renderTabContent = () => {
    switch (activeTab) {
      case "employees":
        return <EmployeesTabContent />;
      case "leave":
        return <LeaveTabContent />;
      case "payroll":
        return <PayrollTabContent />;
      case "overview":
      default:
        return (
          <>
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
                  {totalEmployees > 0 ? (
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold">Employee Overview</h2>
                      <button className="text-sm text-primary hover:underline">
                        View All
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No employees yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start by adding employees to your organization
                      </p>
                      <button 
                        onClick={() => navigate("/employees")} 
                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                      >
                        Add Employees
                      </button>
                    </div>
                  )}

                  {totalEmployees > 0 && (
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
                    </div>
                  )}
                </GlassCard>

                <GlassCard className="animate-slide-up" style={{ animationDelay: "0.15s" }}>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Upcoming Events</h2>
                  </div>

                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No upcoming events</h3>
                    <p className="text-muted-foreground">
                      Events will appear here as you schedule them
                    </p>
                  </div>
                </GlassCard>
              </div>

              {/* Right column */}
              <div className="space-y-6">
                <GlassCard className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Recent Activity</h2>
                  </div>

                  {recentActivity.length > 0 ? (
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => {
                        const Icon = activity.icon;
                        return (
                          <div
                            key={index}
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
                  ) : (
                    <div className="text-center py-8">
                      <ClipboardList className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No recent activity</h3>
                      <p className="text-muted-foreground">
                        Your activity will be logged here
                      </p>
                    </div>
                  )}
                </GlassCard>

                <GlassCard className="animate-slide-up" style={{ animationDelay: "0.25s" }}>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Quick Actions</h2>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: "Add Employee", icon: Users, color: "bg-hr-blue/10 text-hr-blue", path: "/employees" },
                      { name: "Approve Leave", icon: Calendar, color: "bg-hr-purple/10 text-hr-purple", path: "/leave" },
                      { name: "Run Payroll", icon: BarChart3, color: "bg-hr-indigo/10 text-hr-indigo", path: "/payroll" },
                      { name: "View Activity", icon: ClipboardList, color: "bg-hr-teal/10 text-hr-teal", path: "/activity" },
                    ].map((action) => (
                      <button
                        key={action.name}
                        onClick={() => navigate(action.path)}
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
                </GlassCard>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavbarLoggedIn />

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

          {/* Dashboard content based on active tab */}
          {renderTabContent()}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
