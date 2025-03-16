
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getSession, signOut } from "@/utils/auth";
import { initializeForNewUser } from "@/utils/initializeForNewUser";
import { useToast } from "@/hooks/use-toast";
import { EventTypes, emitEvent } from "@/utils/eventBus";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  userId: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [userId, setUserId] = useState<string | null>(
    localStorage.getItem("currentUserId")
  );
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;
    
    // Check if user is logged in on initial load
    const checkAuthStatus = async () => {
      try {
        const session = await getSession();
        
        if (!isMounted) return;
        
        const isUserAuthenticated = !!session;
        setIsAuthenticated(isUserAuthenticated);
        
        // Store and initialize user data if user is authenticated
        if (session?.user) {
          setUserId(session.user.id);
          console.log("Setting userId in AuthContext:", session.user.id);
          localStorage.setItem("currentUserId", session.user.id);
          localStorage.setItem("isAuthenticated", "true");
          await initializeForNewUser(session.user.id);
        } else {
          setUserId(null);
          localStorage.removeItem("currentUserId");
          localStorage.removeItem("isAuthenticated");
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        if (isMounted) {
          setIsAuthenticated(false);
          setUserId(null);
          localStorage.removeItem("currentUserId");
          localStorage.removeItem("isAuthenticated");
        }
      }
    };
    
    checkAuthStatus();
    
    // Listen for authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      
      console.log("Auth state change in AuthContext:", event);
      const isUserAuthenticated = !!session;
      setIsAuthenticated(isUserAuthenticated);
      
      if (session?.user) {
        setUserId(session.user.id);
        console.log("Auth state change - userId:", session.user.id);
        localStorage.setItem("currentUserId", session.user.id);
        localStorage.setItem("isAuthenticated", "true");
        // For login events, reinitialize user data
        if (event === 'SIGNED_IN') {
          await initializeForNewUser(session.user.id);
          emitEvent(EventTypes.AUTH_STATUS_CHANGED, { status: 'signedIn' });
        }
      } else {
        setUserId(null);
        localStorage.removeItem("currentUserId");
        localStorage.removeItem("isAuthenticated");
        if (event === 'SIGNED_OUT') {
          emitEvent(EventTypes.AUTH_STATUS_CHANGED, { status: 'signedOut' });
        }
      }
    });
    
    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

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
        console.log("Login function - setting userId:", data.user.id);
        localStorage.setItem("currentUserId", data.user.id);
        localStorage.setItem("isAuthenticated", "true");
        // Initialize user data after successful login
        await initializeForNewUser(data.user.id);
        emitEvent(EventTypes.AUTH_STATUS_CHANGED, { status: 'signedIn' });
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
      console.log("Logout initiated");
      await signOut();
      
      setIsAuthenticated(false);
      setUserId(null);
      
      // Clear all localStorage data on logout
      localStorage.clear();
      
      emitEvent(EventTypes.AUTH_STATUS_CHANGED, { status: 'signedOut' });
      
      console.log("Logout completed successfully");
      
      // Navigation is now handled at the NavbarLoggedIn component
    } catch (error) {
      console.error("Logout error:", error);
      
      toast({
        title: "Logout error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, login, logout }}>
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
