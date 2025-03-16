
import { ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthLoadingIndicator from "./AuthLoadingIndicator";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

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
