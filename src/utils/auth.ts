
import { supabase } from "@/integrations/supabase/client";
import { initializeForNewUser } from "./initializeForNewUser";

// Sign up a new user
export const signUp = async (email: string, password: string, metadata?: { name?: string; plan?: string }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  });
  
  if (error) throw error;
  
  // Initialize empty data for the new user
  if (data.user) {
    // Store the user ID for reference
    localStorage.setItem("currentUserId", data.user.id);
    localStorage.setItem("isAuthenticated", "true");
    
    await initializeForNewUser(data.user.id);
    
    // Store user name for display
    if (metadata?.name) {
      localStorage.setItem("userName", metadata.name);
    }
  }
  
  return { data, error: null };
};

// Sign in an existing user
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  
  // Initialize empty data structures for the user
  if (data.user) {
    // Store the user ID for reference
    localStorage.setItem("currentUserId", data.user.id);
    localStorage.setItem("isAuthenticated", "true");
    
    // This ensures we're not showing pre-recorded data by aggressively clearing and initializing
    await initializeForNewUser(data.user.id);
    
    // Store user name for display
    const userName = data.user.user_metadata?.name;
    if (userName) {
      localStorage.setItem("userName", userName);
    }
  }
  
  return { data, error: null };
};

// Sign out the current user
export const signOut = async () => {
  console.log("signOut function called");
  
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Supabase signOut error:", error);
      throw error;
    }
    
    // Clear ALL localStorage data on logout to prevent data leaking
    console.log("Clearing localStorage on logout");
    localStorage.clear();
    
    return { success: true };
  } catch (error) {
    console.error("Error during signOut:", error);
    throw error;
  }
};

// Get the current session
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) throw error;
  
  if (data.session) {
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("currentUserId", data.session.user.id);
    return data.session;
  } else {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("currentUserId");
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = async () => {
  const session = await getSession();
  return !!session;
};
