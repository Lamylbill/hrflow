
import { ReactNode, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const isAuthenticated = !!data.session;
        
        // Also check localStorage as fallback for demo purposes
        const localAuth = localStorage.getItem("isAuthenticated") === "true";
        
        if (!isAuthenticated && !localAuth && location.pathname !== "/login") {
          navigate("/login");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Set up listener for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' && location.pathname !== "/login") {
        navigate("/login");
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, location]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-10 w-10 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
