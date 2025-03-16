
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
    const checkAuth = async () => {
      try {
        console.log("Running auth check...");
        const { data } = await supabase.auth.getSession();
        const authStatus = !!data.session;
        
        // If authenticated, store the user ID for reference
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
        }
        
        // Check if we need to redirect
        if (!authStatus && location.pathname !== "/login") {
          console.log("Not authenticated, redirecting to login");
          navigate("/login", { replace: true });
        }
        
        // Set loading to false regardless of auth state
        setIsLoading(false);
      } catch (error) {
        console.error("Auth check error:", error);
        
        // Handle auth check failure
        toast({
          title: "Authentication Error",
          description: "Please try logging in again",
          variant: "destructive",
        });
        
        // Redirect to login on error
        navigate("/login", { replace: true });
        setIsLoading(false);
      }
    };

    checkAuth();

    // Set up listener for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change event:", event);
      
      if (event === 'SIGNED_OUT' && location.pathname !== "/login") {
        navigate("/login", { replace: true });
        emitEvent(EventTypes.AUTH_STATUS_CHANGED, { status: "signedOut" });
        setIsAuthenticated(false);
      } else if (event === 'SIGNED_IN' && session?.user?.id) {
        localStorage.setItem("currentUserId", session.user.id);
        localStorage.setItem("isAuthenticated", "true");
        emitEvent(EventTypes.AUTH_STATUS_CHANGED, { status: "signedIn", userId: session.user.id });
        setIsAuthenticated(true);
        setIsLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, location, toast]);

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
