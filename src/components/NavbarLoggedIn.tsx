import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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

const NavbarLoggedIn = () => {
  const { logout, userId } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string>("User");

  useEffect(() => {
    // Get user name from localStorage
    if (userId) {
      const storedName = localStorage.getItem("userName");
      if (storedName) {
        setUserName(storedName);
      }
    }
  }, [userId]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Get user initials for the avatar fallback
  const getInitials = () => {
    if (!userName) return "U";
    const parts = userName.split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
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
            <NotificationsDropdown />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="ml-2 relative flex items-center gap-2 rounded-full px-2">
                  <span className="hidden md:block text-sm font-medium">{userName}</span>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt={userName} />
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={4} className="w-56">
                <DropdownMenuLabel>{userName}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center w-full cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
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
