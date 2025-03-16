import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NotificationsDropdown from "@/components/NotificationsDropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import {
  Home,
  Users,
  CalendarDays,
  DollarSign,
  Settings,
  LogOut,
  Menu,
  FileBarChart,
  X,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";

const NavbarLoggedIn = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { toast } = useToast();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: <Home className="mr-2 h-4 w-4" />,
      path: "/dashboard",
    },
    {
      name: "Employees",
      icon: <Users className="mr-2 h-4 w-4" />,
      path: "/employees",
    },
    {
      name: "Leave",
      icon: <CalendarDays className="mr-2 h-4 w-4" />,
      path: "/leave",
    },
    {
      name: "Payroll",
      icon: <DollarSign className="mr-2 h-4 w-4" />,
      path: "/payroll",
    },
    {
      name: "Activity Log",
      icon: <FileBarChart className="mr-2 h-4 w-4" />,
      path: "/activity",
    },
  ];

  return (
    <nav className="fixed w-full top-0 z-50 bg-background border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                to="/dashboard"
                className="text-xl font-bold text-primary"
              >
                HR Flow
              </Link>
            </div>
            {!isMobile && (
              <div className="ml-10 flex items-center space-x-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors ${
                      isActive(item.path)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center">
            <NotificationsDropdown 
              showDropdown={showNotifications} 
              onToggle={setShowNotifications}
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="ml-2 relative h-9 w-9 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="User" />
                    <AvatarFallback>AU</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Admin User</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {isMobile && (
              <Button
                variant="ghost"
                className="ml-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {isMobile && mobileMenuOpen && (
        <div className="sm:hidden bg-background border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                  isActive(item.path)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
            <Link
              to="/settings"
              className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                isActive("/settings")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left block px-3 py-2 rounded-md text-base font-medium flex items-center text-muted-foreground hover:bg-muted"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarLoggedIn;
