
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Use a flag to prevent multiple redirects
    let isMounted = true;
    
    const checkAuth = async () => {
      try {
        console.log("Running auth check...");
        
        // First check local storage for a cached auth state to prevent flickering
        const cachedAuthStatus = localStorage.getItem("isAuthenticated") === "true";
        
        if (cachedAuthStatus) {
          console.log("Using cached auth status: authenticated");
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }
        
        const { data } = await supabase.auth.getSession();
        const authStatus = !!data.session;
        
        // If component was unmounted during the async call, don't update state
        if (!isMounted) return;
        
        if (authStatus && data.session?.user?.id) {
          localStorage.setItem("currentUserId", data.session.user.id);
          localStorage.setItem("isAuthenticated", "true");
          console.log("Auth check successful: User is authenticated");
          setIsAuthenticated(true);
        } else {
          console.log("Auth check result: Not authenticated");
          localStorage.removeItem("isAuthenticated");
          localStorage.removeItem("currentUserId");
          setIsAuthenticated(false);
          
          // Only redirect if we're not already on the login page
          if (location.pathname !== "/login" && location.pathname !== "/") {
            navigate("/login", { replace: true });
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Auth check error:", error);
        
        if (!isMounted) return;
        
        toast({
          title: "Authentication Error",
          description: "Please try logging in again",
          variant: "destructive",
        });
        
        // Redirect to login on error
        if (location.pathname !== "/login" && location.pathname !== "/") {
          navigate("/login", { replace: true });
        }
        setIsLoading(false);
      }
    };

    checkAuth();

    // Set up listener for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change event:", event);
      
      if (!isMounted) return;
      
      if (event === 'SIGNED_OUT' && location.pathname !== "/login" && location.pathname !== "/") {
        navigate("/login", { replace: true });
        emitEvent(EventTypes.AUTH_STATUS_CHANGED, { status: "signedOut" });
        setIsAuthenticated(false);
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("currentUserId");
      } else if (event === 'SIGNED_IN' && session?.user?.id) {
        localStorage.setItem("currentUserId", session.user.id);
        localStorage.setItem("isAuthenticated", "true");
        emitEvent(EventTypes.AUTH_STATUS_CHANGED, { status: "signedIn", userId: session.user.id });
        setIsAuthenticated(true);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [navigate, location.pathname, toast]); // Removed location.pathname to prevent rechecking on every page change

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
