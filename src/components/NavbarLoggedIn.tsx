
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  BarChart,
  Users,
  Calendar,
  CreditCard,
  ClipboardList,
  LogOut,
  Bell,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { signOut } from "@/utils/auth";
import NotificationsDropdown from "./NotificationsDropdown";
import { useState } from "react";

const NavbarLoggedIn = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "An error occurred during logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between p-4 hr-container">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2 text-primary font-semibold text-xl mr-8">
            <span className="bg-primary text-white px-2 py-1 rounded-md">HR</span>
            <span className="tracking-tight">Flow</span>
          </Link>
          <nav className="hidden md:flex space-x-1">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `px-3 py-2 text-sm rounded-md ${
                  isActive
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                } transition-colors`
              }
            >
              <div className="flex items-center">
                <BarChart className="h-4 w-4 mr-2" />
                Dashboard
              </div>
            </NavLink>
            <NavLink
              to="/employees"
              className={({ isActive }) =>
                `px-3 py-2 text-sm rounded-md ${
                  isActive
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                } transition-colors`
              }
            >
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Employees
              </div>
            </NavLink>
            <NavLink
              to="/leave"
              className={({ isActive }) =>
                `px-3 py-2 text-sm rounded-md ${
                  isActive
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                } transition-colors`
              }
            >
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Leave
              </div>
            </NavLink>
            <NavLink
              to="/payroll"
              className={({ isActive }) =>
                `px-3 py-2 text-sm rounded-md ${
                  isActive
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                } transition-colors`
              }
            >
              <div className="flex items-center">
                <CreditCard className="h-4 w-4 mr-2" />
                Payroll
              </div>
            </NavLink>
            <NavLink
              to="/activity"
              className={({ isActive }) =>
                `px-3 py-2 text-sm rounded-md ${
                  isActive
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                } transition-colors`
              }
            >
              <div className="flex items-center">
                <ClipboardList className="h-4 w-4 mr-2" />
                Activity Log
              </div>
            </NavLink>
          </nav>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <button
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
              onClick={toggleNotifications}
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            {showNotifications && <NotificationsDropdown />}
          </div>
          <div className="hidden md:flex items-center">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-2">
              <span className="text-sm font-medium text-primary">
                {localStorage.getItem("userName")?.split(" ").map(name => name[0]).join("") || "U"}
              </span>
            </div>
            <span className="text-sm font-medium mr-4">
              {localStorage.getItem("userName") || "User"}
            </span>
          </div>
          <button
            className="px-3 py-2 text-sm text-red-500 hover:text-red-600 hover:bg-secondary/50 rounded-md transition-colors flex items-center"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavbarLoggedIn;
