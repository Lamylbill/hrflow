
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EventTypes, emitEvent } from "@/utils/eventBus";
import { getCurrentUserId, getCurrentUserName } from "@/utils/auth";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  userId: string | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(getCurrentUserId());
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
          // Use a tab-specific ID to prevent cross-contamination between tabs
          let tabId = sessionStorage.getItem('tabId');
          if (!tabId) {
            tabId = crypto.randomUUID();
            sessionStorage.setItem('tabId', tabId);
          }
          
          setUserId(data.session.user.id);
          sessionStorage.setItem(`user:${tabId}`, data.session.user.id);
          
          // Update userName for this session/tab
          const userName = data.session.user.user_metadata?.name;
          if (userName) {
            sessionStorage.setItem(`userName:${tabId}`, userName);
          }
          
          // Store email
          const email = data.session.user.email;
          if (email) {
            sessionStorage.setItem(`userEmail:${tabId}`, email);
          }
        } else {
          setUserId(null);
          const tabId = sessionStorage.getItem('tabId');
          if (tabId) {
            sessionStorage.removeItem(`user:${tabId}`);
            sessionStorage.removeItem(`userName:${tabId}`);
            sessionStorage.removeItem(`userEmail:${tabId}`);
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking auth status:", error);
        if (isMounted) {
          setIsAuthenticated(false);
          setUserId(null);
          const tabId = sessionStorage.getItem('tabId');
          if (tabId) {
            sessionStorage.removeItem(`user:${tabId}`);
            sessionStorage.removeItem(`userName:${tabId}`);
            sessionStorage.removeItem(`userEmail:${tabId}`);
          }
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
        const tabId = sessionStorage.getItem('tabId');
        if (tabId) {
          sessionStorage.removeItem(`user:${tabId}`);
          sessionStorage.removeItem(`userName:${tabId}`);
          sessionStorage.removeItem(`userEmail:${tabId}`);
        }
        emitEvent(EventTypes.AUTH_STATUS_CHANGED, { status: 'signedOut' });
        navigate("/login", { replace: true });
      } else if (event === 'SIGNED_IN' && session?.user) {
        setIsAuthenticated(true);
        setUserId(session.user.id);
        
        // Use a tab-specific ID to prevent cross-contamination between tabs
        let tabId = sessionStorage.getItem('tabId');
        if (!tabId) {
          tabId = crypto.randomUUID();
          sessionStorage.setItem('tabId', tabId);
        }
        
        sessionStorage.setItem(`user:${tabId}`, session.user.id);
        
        // Update userName for this session/tab
        const userName = session.user.user_metadata?.name;
        if (userName) {
          sessionStorage.setItem(`userName:${tabId}`, userName);
        }
        
        // Store email
        const email = session.user.email;
        if (email) {
          sessionStorage.setItem(`userEmail:${tabId}`, email);
        }
        
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
        // Generate a tab-specific ID
        const tabId = crypto.randomUUID();
        sessionStorage.setItem('tabId', tabId);
        
        setUserId(data.user.id);
        sessionStorage.setItem(`user:${tabId}`, data.user.id);
        
        // Update userName for this session/tab
        const userName = data.user.user_metadata?.name;
        if (userName) {
          sessionStorage.setItem(`userName:${tabId}`, userName);
        }
        
        // Store email for profile
        sessionStorage.setItem(`userEmail:${tabId}`, email);
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
      // First check if the session exists
      const { data: sessionData } = await supabase.auth.getSession();
      
      // If no session, just clean up the UI state and storage
      if (!sessionData.session) {
        // Clean up local state
        setIsAuthenticated(false);
        setUserId(null);
        const tabId = sessionStorage.getItem('tabId');
        if (tabId) {
          sessionStorage.removeItem(`user:${tabId}`);
          sessionStorage.removeItem(`userName:${tabId}`);
          sessionStorage.removeItem(`userEmail:${tabId}`);
          sessionStorage.removeItem('tabId');
        }
        
        toast({
          title: "Logged out successfully",
          description: "You have been logged out of your account",
        });
        
        navigate("/login", { replace: true });
        return;
      }
      
      // Attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      // Even if there's an API error, proceed with local cleanup
      if (error) {
        console.warn("Supabase logout warning:", error.message);
        // Display a warning but don't stop the logout process
        toast({
          title: "Partial logout completed",
          description: "Your session may not be fully cleared on the server. Please refresh your browser.",
        });
      } else {
        toast({
          title: "Logged out successfully",
          description: "You have been logged out of your account",
        });
      }
      
      // Clean up session storage and React state regardless of server response
      const tabId = sessionStorage.getItem('tabId');
      if (tabId) {
        sessionStorage.removeItem(`user:${tabId}`);
        sessionStorage.removeItem(`userName:${tabId}`);
        sessionStorage.removeItem(`userEmail:${tabId}`);
        sessionStorage.removeItem('tabId');
      }
      
      setIsAuthenticated(false);
      setUserId(null);
      
      navigate("/login", { replace: true });
    } catch (error: any) {
      console.error("Logout error:", error);
      
      // Ensure the user is still logged out client-side despite any errors
      setIsAuthenticated(false);
      setUserId(null);
      const tabId = sessionStorage.getItem('tabId');
      if (tabId) {
        sessionStorage.removeItem(`user:${tabId}`);
        sessionStorage.removeItem(`userName:${tabId}`);
        sessionStorage.removeItem(`userEmail:${tabId}`);
        sessionStorage.removeItem('tabId');
      }
      
      toast({
        title: "Logout partially completed",
        description: "Your session has been cleared locally. Please refresh your browser.",
      });
      
      navigate("/login", { replace: true });
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
