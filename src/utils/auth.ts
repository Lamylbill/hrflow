import { supabase } from "@/integrations/supabase/client";
import { initializeForNewUser } from "./initializeForNewUser";

// Helper function to get user-specific storage keys
const getUserSpecificKey = (userId: string, key: string): string => {
  return `${userId}:${key}`;
};

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
    // Store the user ID and authentication state for this browser session
    // We don't use a generic "isAuthenticated" flag anymore
    sessionStorage.setItem("currentUserId", data.user.id);
    
    await initializeForNewUser(data.user.id);
    
    // Store user metadata for this specific user
    if (metadata?.name) {
      localStorage.setItem("userName", metadata.name); // Keep this in localStorage for cross-tab access
      localStorage.setItem(`${data.user.id}:userName`, metadata.name);
    }
    
    // Store user email for profile access
    localStorage.setItem("userEmail", email);
    localStorage.setItem(`${data.user.id}:userEmail`, email);
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
  
  // Update session storage with user data (session-specific)
  if (data.user) {
    // Use sessionStorage for the current browser tab/window only
    sessionStorage.setItem("currentUserId", data.user.id);
    
    // Store user info in localStorage for persistence across sessions
    // but with user-specific keys
    const userName = data.user.user_metadata?.name;
    if (userName) {
      localStorage.setItem("userName", userName); // Keep this in localStorage for cross-tab access
      localStorage.setItem(`${data.user.id}:userName`, userName);
    }
    
    // Store user email for profile access
    localStorage.setItem("userEmail", email);
    localStorage.setItem(`${data.user.id}:userEmail`, email);
  }
  
  return { data, error: null };
};

// Sign out the current user
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Supabase signOut error:", error);
      throw error;
    }
    
    // Clear only session-specific data on logout
    // We keep the user-specific localStorage data for future use
    sessionStorage.removeItem("currentUserId");
    
    // Clear the generic non-prefixed user data
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    
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
    // Use sessionStorage which is specific to this browser tab/window
    sessionStorage.setItem("currentUserId", data.session.user.id);
    
    // Update the current generic user data
    const userName = data.session.user.user_metadata?.name;
    if (userName) {
      localStorage.setItem("userName", userName);
    }
    
    return data.session;
  } else {
    sessionStorage.removeItem("currentUserId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = async () => {
  const session = await getSession();
  return !!session;
};
