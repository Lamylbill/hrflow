
import { supabase } from "@/integrations/supabase/client";

// Sign up a new user
export const signUpWithEmail = async (email: string, password: string, metadata?: { name?: string; plan?: string }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  });
  
  if (error) throw error;
  
  // Set localStorage for backward compatibility with existing code
  localStorage.setItem("isAuthenticated", "true");
  
  return { data, error: null };
};

// Sign in an existing user
export const loginWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  
  // Set localStorage for backward compatibility with existing code
  localStorage.setItem("isAuthenticated", "true");
  
  return { data, error: null };
};

// Sign out the current user
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) throw error;
  
  // Clear localStorage for backward compatibility
  localStorage.removeItem("isAuthenticated");
};

// Get the current session
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) throw error;
  
  if (data.session) {
    localStorage.setItem("isAuthenticated", "true");
    return data.session;
  } else {
    localStorage.removeItem("isAuthenticated");
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = async () => {
  const session = await getSession();
  return !!session;
};
