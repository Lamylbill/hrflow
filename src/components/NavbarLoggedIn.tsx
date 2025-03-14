
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  BarChart,
  Users,
  Calendar,
  CreditCard,
  ClipboardList,
  LogOut,
  Bell,
  Settings,
  User,
  Key,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { signOut } from "@/utils/auth";
import NotificationsDropdown from "./NotificationsDropdown";
import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NavbarLoggedIn = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

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

  // Handle clicking outside to close notifications dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get user information from localStorage
  const userName = localStorage.getItem("userName") || "User";
  const userInitials = userName.split(" ").map(name => name[0]).join("") || "U";

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
          <div className="relative" ref={notificationRef}>
            <button
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
              onMouseEnter={() => setShowNotifications(true)}
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            {showNotifications && <NotificationsDropdown onMouseLeave={() => setShowNotifications(false)} />}
          </div>
          <div className="hidden md:flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <div className="flex items-center hover:bg-secondary/50 p-2 rounded-lg cursor-pointer">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={localStorage.getItem("userAvatar") || ""} alt={userName} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    {userName}
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/settings/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings/password")}>
                  <Key className="mr-2 h-4 w-4" />
                  <span>Change Password</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarLoggedIn;
