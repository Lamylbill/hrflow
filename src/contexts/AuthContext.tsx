
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getSession, signOut } from "@/utils/auth";
import { initializeForNewUser } from "@/utils/initializeForNewUser";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  userId: string | null; // Add userId to context
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null); // Track current user ID
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in on initial load
    const checkAuthStatus = async () => {
      try {
        const session = await getSession();
        const isUserAuthenticated = !!session;
        setIsAuthenticated(isUserAuthenticated);
        
        // Store and initialize user data if user is authenticated
        if (session?.user) {
          setUserId(session.user.id);
          await initializeForNewUser(session.user.id);
        } else {
          setUserId(null);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsAuthenticated(false);
        setUserId(null);
      }
    };
    
    checkAuthStatus();
    
    // Listen for authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const isUserAuthenticated = !!session;
      setIsAuthenticated(isUserAuthenticated);
      
      if (session?.user) {
        setUserId(session.user.id);
        // For login events, reinitialize user data
        if (event === 'SIGNED_IN') {
          await initializeForNewUser(session.user.id);
        }
      } else {
        setUserId(null);
      }
    });
    
    return () => {
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
        // Initialize user data after successful login
        await initializeForNewUser(data.user.id);
      }
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setIsAuthenticated(false);
      setUserId(null);
      // Clear all localStorage data on logout
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
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
