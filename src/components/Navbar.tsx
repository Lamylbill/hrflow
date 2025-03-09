
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import AnimatedButton from "./AnimatedButton";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

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

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Employees", path: "/employees" },
    { name: "Leave", path: "/leave" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm"
          : "py-4 bg-transparent"
      }`}
    >
      <div className="hr-container flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center space-x-2 text-primary font-semibold text-xl"
        >
          <span className="bg-primary text-white px-2 py-1 rounded-md">HR</span>
          <span className="tracking-tight">Flow</span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <div className="flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-foreground/80"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <AnimatedButton
                variant="ghost"
                className="text-sm font-medium px-4 py-2"
              >
                Log in
              </AnimatedButton>
            </Link>
            <Link to="/signup">
              <AnimatedButton className="text-sm font-medium px-4 py-2">
                Sign up
              </AnimatedButton>
            </Link>
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md shadow-lg animate-slide-down">
          <div className="hr-container py-4 flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium py-2 transition-colors hover:text-primary ${
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-foreground/80"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex flex-col space-y-2 pt-2 border-t border-border">
              <Link to="/login">
                <AnimatedButton
                  variant="ghost"
                  className="text-sm font-medium w-full py-2"
                >
                  Log in
                </AnimatedButton>
              </Link>
              <Link to="/signup">
                <AnimatedButton className="text-sm font-medium w-full py-2">
                  Sign up
                </AnimatedButton>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
