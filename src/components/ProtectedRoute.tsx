
import { ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AuthLoadingIndicator from "./AuthLoadingIndicator";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    // Check if user still exists in Supabase
    const checkUserExists = async () => {
      if (isAuthenticated) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          
          if (!session) {
            console.log("No valid session found, logging out");
            await logout();
            navigate("/login", { replace: true });
            return;
          }
          
          // Additional check - try to retrieve user data
          const { data: userData, error } = await supabase.auth.getUser();
          
          if (error || !userData.user) {
            console.log("User no longer exists in Supabase, logging out");
            await logout();
            navigate("/login", { replace: true });
          }
        } catch (error) {
          console.error("Error checking if user exists:", error);
          // On any error, safest to log the user out
          await logout();
          navigate("/login", { replace: true });
        }
      }
    };

    // Only check if the user exists when they're authenticated and not loading
    if (!isLoading && isAuthenticated) {
      checkUserExists();
    }
  }, [isAuthenticated, isLoading, logout, navigate, location.pathname]);

  useEffect(() => {
    // Only redirect if authentication check is done (not loading) and user is not authenticated
    if (!isLoading && !isAuthenticated && location.pathname !== "/login" && location.pathname !== "/") {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location.pathname]);

  // Show loading indicator only during initial auth check
  if (isLoading) {
    return <AuthLoadingIndicator message="Checking authentication..." />;
  }

  // If authenticated, render the children
  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;
