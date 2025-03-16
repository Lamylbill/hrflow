
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
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated && location.pathname !== "/login" && location.pathname !== "/") {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate, location.pathname]);

  // If authenticated, render the children
  return isAuthenticated ? <>{children}</> : <AuthLoadingIndicator message="Checking authentication..." />;
};

export default ProtectedRoute;
