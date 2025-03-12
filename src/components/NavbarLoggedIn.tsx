
import { NavLink } from "react-router-dom";
import {
  BarChart,
  Users,
  Calendar,
  CreditCard,
  ClipboardList,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const NavbarLoggedIn = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.setItem("isAuthenticated", "false");
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    
    navigate("/login");
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between p-4 hr-container">
        <div className="flex items-center">
          <span className="text-xl font-bold mr-8">HR Flow</span>
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
              to="/activity-log"
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
        <button
          className="px-3 py-2 text-sm text-red-500 hover:text-red-600 hover:bg-secondary/50 rounded-md transition-colors flex items-center"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default NavbarLoggedIn;
