import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EventTypes, emitEvent } from "@/utils/eventBus";
import { getCurrentUserId } from "@/utils/auth";
import { unlinkEmployeeFromUser } from "@/utils/userManagement";

export function useAuthProvider() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(getCurrentUserId());
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;
    
    const checkAuthStatus = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        const isUserAuthenticated = !!data.session;
        setIsAuthenticated(isUserAuthenticated);
        
        if (data.session?.user) {
          let tabId = sessionStorage.getItem('tabId');
          if (!tabId) {
            tabId = crypto.randomUUID();
            sessionStorage.setItem('tabId', tabId);
          }
          
          setUserId(data.session.user.id);
          sessionStorage.setItem(`user:${tabId}`, data.session.user.id);
          
          const userName = data.session.user.user_metadata?.name;
          if (userName) {
            sessionStorage.setItem(`userName:${tabId}`, userName);
          }
          
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
        
        let tabId = sessionStorage.getItem('tabId');
        if (!tabId) {
          tabId = crypto.randomUUID();
          sessionStorage.setItem('tabId', tabId);
        }
        
        sessionStorage.setItem(`user:${tabId}`, session.user.id);
        
        const userName = session.user.user_metadata?.name;
        if (userName) {
          sessionStorage.setItem(`userName:${tabId}`, userName);
        }
        
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
        const tabId = crypto.randomUUID();
        sessionStorage.setItem('tabId', tabId);
        
        setUserId(data.user.id);
        sessionStorage.setItem(`user:${tabId}`, data.user.id);
        
        const userName = data.user.user_metadata?.name;
        if (userName) {
          sessionStorage.setItem(`userName:${tabId}`, userName);
        }
        
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
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
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
      
      try {
        if (sessionData.session.user) {
          await unlinkEmployeeFromUser(sessionData.session.user.id);
        }
      } catch (cleanupError) {
        console.error("Error during pre-logout cleanup:", cleanupError);
      }
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.warn("Supabase logout warning:", error.message);
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

  return {
    isAuthenticated,
    userId,
    login,
    logout,
    isLoading
  };
}
