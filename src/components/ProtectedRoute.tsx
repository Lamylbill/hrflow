
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
  const [authCheckAttempts, setAuthCheckAttempts] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const isAuthenticated = !!data.session;
        
        // If authenticated, store the user ID for reference
        if (isAuthenticated && data.session?.user?.id) {
          localStorage.setItem("currentUserId", data.session.user.id);
        }
        
        // Also check localStorage as fallback for demo purposes
        const localAuth = localStorage.getItem("isAuthenticated") === "true";
        
        if (!isAuthenticated && !localAuth && location.pathname !== "/login") {
          console.log("Not authenticated, redirecting to login");
          navigate("/login", { replace: true });
        } else {
          // Successfully authenticated or on login page
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        
        // Retry logic for auth check failures
        if (authCheckAttempts < 3) {
          console.log(`Auth check attempt ${authCheckAttempts + 1} failed, retrying...`);
          setAuthCheckAttempts(prev => prev + 1);
          // Wait a moment before retrying
          setTimeout(checkAuth, 1000);
        } else {
          console.log("Auth check failed multiple times, redirecting to login");
          navigate("/login", { replace: true });
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    // Set up listener for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' && location.pathname !== "/login") {
        navigate("/login", { replace: true });
      } else if (session?.user?.id) {
        localStorage.setItem("currentUserId", session.user.id);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, location, authCheckAttempts]);

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
