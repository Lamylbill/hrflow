
import { ReactNode, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EventTypes, emitEvent } from "@/utils/eventBus";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [authCheckAttempts, setAuthCheckAttempts] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Clear any previous timeouts to prevent memory leaks
    const timeouts: number[] = [];
    
    const checkAuth = async () => {
      try {
        console.log("Running auth check...");
        const { data } = await supabase.auth.getSession();
        const isAuthenticated = !!data.session;
        
        // If authenticated, store the user ID for reference
        if (isAuthenticated && data.session?.user?.id) {
          localStorage.setItem("currentUserId", data.session.user.id);
          console.log("Auth check successful: User is authenticated");
        } else {
          console.log("Auth check result: Not authenticated");
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
          const timeoutId = window.setTimeout(checkAuth, 1000);
          timeouts.push(timeoutId);
        } else {
          console.log("Auth check failed multiple times, redirecting to login");
          toast({
            title: "Authentication Error",
            description: "Please try logging in again",
            variant: "destructive",
          });
          // Clear any stale authentication data
          localStorage.removeItem("isAuthenticated");
          localStorage.removeItem("currentUserId");
          
          // Emit event for authentication failure
          emitEvent(EventTypes.AUTH_STATUS_CHANGED, { status: "failed" });
          
          navigate("/login", { replace: true });
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    // Set up listener for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change event:", event);
      
      if (event === 'SIGNED_OUT' && location.pathname !== "/login") {
        navigate("/login", { replace: true });
        emitEvent(EventTypes.AUTH_STATUS_CHANGED, { status: "signedOut" });
      } else if (event === 'SIGNED_IN' && session?.user?.id) {
        localStorage.setItem("currentUserId", session.user.id);
        localStorage.setItem("isAuthenticated", "true");
        emitEvent(EventTypes.AUTH_STATUS_CHANGED, { status: "signedIn", userId: session.user.id });
        setIsLoading(false);
      }
    });

    // Clear all timeouts on unmount
    return () => {
      timeouts.forEach(id => window.clearTimeout(id));
      authListener.subscription.unsubscribe();
    };
  }, [navigate, location, authCheckAttempts, toast]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="h-10 w-10 border-4 border-t-transparent border-primary rounded-full animate-spin mb-4"></div>
        <p className="text-muted-foreground">Checking authentication...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
