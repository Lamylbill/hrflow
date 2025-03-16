
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EventTypes, emitEvent } from "@/utils/eventBus";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  userId: string | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [userId, setUserId] = useState<string | null>(
    localStorage.getItem("currentUserId")
  );
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;
    
    // Check if user is logged in on initial load
    const checkAuthStatus = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        const isUserAuthenticated = !!data.session;
        setIsAuthenticated(isUserAuthenticated);
        
        // Store user data if user is authenticated
        if (data.session?.user) {
          setUserId(data.session.user.id);
          localStorage.setItem("currentUserId", data.session.user.id);
          localStorage.setItem("isAuthenticated", "true");
        } else {
          setUserId(null);
          localStorage.removeItem("currentUserId");
          localStorage.removeItem("isAuthenticated");
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking auth status:", error);
        if (isMounted) {
          setIsAuthenticated(false);
          setUserId(null);
          localStorage.removeItem("currentUserId");
          localStorage.removeItem("isAuthenticated");
          setIsLoading(false);
        }
      }
    };
    
    checkAuthStatus();
    
    // Listen for authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      
      console.log("Auth state change in AuthContext:", event);
      
      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setUserId(null);
        localStorage.removeItem("currentUserId");
        localStorage.removeItem("isAuthenticated");
        emitEvent(EventTypes.AUTH_STATUS_CHANGED, { status: 'signedOut' });
        navigate("/login", { replace: true });
      } else if (event === 'SIGNED_IN' && session?.user) {
        setIsAuthenticated(true);
        setUserId(session.user.id);
        localStorage.setItem("currentUserId", session.user.id);
        localStorage.setItem("isAuthenticated", "true");
        emitEvent(EventTypes.AUTH_STATUS_CHANGED, { status: 'signedIn' });
      }
    });
    
    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      setIsAuthenticated(true);
      if (data.user) {
        setUserId(data.user.id);
        localStorage.setItem("currentUserId", data.user.id);
        localStorage.setItem("isAuthenticated", "true");
      }
      
      toast({
        title: "Login successful",
        description: "Welcome back to HR Flow!",
      });
      
      return true;
    } catch (error: any) {
      console.error("Login error:", error);
      
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
      
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // Clear all localStorage data on logout
      localStorage.clear();
      
      setIsAuthenticated(false);
      setUserId(null);
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      
      navigate("/login", { replace: true });
    } catch (error: any) {
      console.error("Logout error:", error);
      
      toast({
        title: "Logout error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
