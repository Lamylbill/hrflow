
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import AnimatedButton from "./AnimatedButton";
import { useIsMobile } from "@/hooks/use-mobile";
import { EventTypes, onEvent } from "@/utils/eventBus";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        // Get current user ID from sessionStorage for THIS specific browser tab
        const currentUserId = sessionStorage.getItem("currentUserId");
        setIsAuthenticated(!!currentUserId);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
    
    // Set up event listener for auth state changes
    const handleAuthChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.status === 'signedIn') {
        setIsAuthenticated(true);
      } else if (customEvent.detail?.status === 'signedOut') {
        setIsAuthenticated(false);
      }
    };
    
    // Listen for auth status change events
    window.addEventListener(EventTypes.AUTH_STATUS_CHANGED, handleAuthChange as EventListener);
    
    return () => {
      window.removeEventListener(EventTypes.AUTH_STATUS_CHANGED, handleAuthChange as EventListener);
    };
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Landing page public navigation items
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/#features" },
    { name: "Pricing", path: "/#pricing" },
    { name: "Compliance", path: "/#compliance" },
    { name: "About", path: "/#about" },
    { name: "Contact", path: "/#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm"
          : "py-3 md:py-4 bg-transparent"
      }`}
    >
      <div className="hr-container flex items-center justify-between px-4 md:px-6">
        <Link
          to="/"
          className="flex items-center space-x-2 text-primary font-semibold text-lg md:text-xl"
        >
          <span className="bg-primary text-white px-2 py-1 rounded-md">HR</span>
          <span className="tracking-tight">Flow</span>
          <span className="text-xs font-normal text-muted-foreground mt-1">SG/MY</span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <div className="flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === item.path || 
                  (item.path.startsWith("/#") && location.pathname === "/" && location.hash === item.path.substring(1))
                    ? "text-primary"
                    : "text-foreground/80 dark:text-white dark:text-opacity-80"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <AnimatedButton
                  variant="ghost"
                  className="text-sm font-medium px-4 py-2"
                >
                  Dashboard
                </AnimatedButton>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <AnimatedButton
                    variant="ghost"
                    className="text-sm font-medium px-4 py-2"
                  >
                    Log in
                  </AnimatedButton>
                </Link>
                <Link to="/login?signup=true">
                  <AnimatedButton className="text-sm font-medium px-4 py-2">
                    Sign up
                  </AnimatedButton>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-foreground dark:text-white p-1"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-background/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg animate-slide-down overflow-y-auto max-h-[calc(100vh-4rem)]">
          <div className="hr-container py-4 flex flex-col space-y-3 px-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium py-2.5 px-3 rounded-md transition-colors ${
                  location.pathname === item.path || 
                  (item.path.startsWith("/#") && location.pathname === "/" && location.hash === item.path.substring(1))
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80 dark:text-white dark:text-opacity-80 hover:bg-secondary/50 hover:text-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex flex-col space-y-2 pt-3 border-t border-border">
              {isAuthenticated ? (
                <Link to="/dashboard" className="w-full">
                  <AnimatedButton
                    className="text-sm font-medium w-full py-2.5 mt-2"
                  >
                    Dashboard
                  </AnimatedButton>
                </Link>
              ) : (
                <>
                  <Link to="/login" className="w-full">
                    <AnimatedButton
                      variant="outline"
                      className="text-sm font-medium w-full py-2.5 mt-2"
                    >
                      Log in
                    </AnimatedButton>
                  </Link>
                  <Link to="/login?signup=true" className="w-full">
                    <AnimatedButton className="text-sm font-medium w-full py-2.5">
                      Sign up
                    </AnimatedButton>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
