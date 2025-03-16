
import { supabase } from "@/integrations/supabase/client";
import { initializeForNewUser } from "./initializeForNewUser";
import { EventTypes, emitEvent } from "./eventBus";

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
    // Store the user ID for THIS browser session only
    sessionStorage.setItem("currentUserId", data.user.id);
    
    await initializeForNewUser(data.user.id);
    
    // Store user metadata with user-specific keys for persistence
    if (metadata?.name) {
      // Store both user-specific and current-session keys
      localStorage.setItem(getUserSpecificKey(data.user.id, "userName"), metadata.name);
      // Also set the current user's name for the active session
      localStorage.setItem("userName", metadata.name);
    }
    
    // Store user email for profile access
    localStorage.setItem(getUserSpecificKey(data.user.id, "userEmail"), email);
    localStorage.setItem("userEmail", email);
    
    // Emit event for profile update
    emitEvent(EventTypes.USER_PROFILE_UPDATED, { 
      userId: data.user.id, 
      userName: metadata?.name,
      userEmail: email
    });
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
    
    // Store user info with user-specific prefix for persistence
    const userName = data.user.user_metadata?.name;
    if (userName) {
      localStorage.setItem(getUserSpecificKey(data.user.id, "userName"), userName);
      // Also set the current active user name
      localStorage.setItem("userName", userName);
    }
    
    // Store user email for profile access
    localStorage.setItem(getUserSpecificKey(data.user.id, "userEmail"), email);
    localStorage.setItem("userEmail", email);
    
    // Emit event for profile update
    emitEvent(EventTypes.USER_PROFILE_UPDATED, { 
      userId: data.user.id, 
      userName,
      userEmail: email
    });
  }
  
  return { data, error: null };
};

// Sign out the current user
export const signOut = async () => {
  try {
    // Get the current user ID before attempting to sign out
    const currentUserId = sessionStorage.getItem("currentUserId");
    
    // First check if we have a session before attempting to sign out
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session) {
      console.log("No active session found, cleaning up local storage only");
      // No active session, but we still want to clean up sessionStorage
      sessionStorage.removeItem("currentUserId");
      // Clean up the non-prefixed current user data
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      return { success: true };
    }
    
    // We have a session, attempt to sign out
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Supabase signOut error:", error);
      // Even if the API call fails, we should clean up sessionStorage
      sessionStorage.removeItem("currentUserId");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      throw error;
    }
    
    // Clear only session-specific data on logout
    // We keep the user-specific localStorage data for future use
    sessionStorage.removeItem("currentUserId");
    
    // Clear the generic non-prefixed user data
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    
    // Emit event for auth status change
    emitEvent(EventTypes.AUTH_STATUS_CHANGED, { status: 'signedOut' });
    
    return { success: true };
  } catch (error) {
    console.error("Error during signOut:", error);
    // Even after errors, ensure we clean up local storage
    sessionStorage.removeItem("currentUserId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    
    // Emit event for auth status change
    emitEvent(EventTypes.AUTH_STATUS_CHANGED, { status: 'signedOut' });
    
    // Return a special flag to indicate client-side cleanup was done
    // even if the server-side session deletion failed
    return { success: true, clientCleanup: true, error };
  }
};

// Get the current session
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) throw error;
  
  if (data.session) {
    // Update sessionStorage which is specific to this browser tab/window
    sessionStorage.setItem("currentUserId", data.session.user.id);
    
    // Update the current generic user data
    const userName = data.session.user.user_metadata?.name;
    if (userName) {
      localStorage.setItem("userName", userName);
      // Also ensure we have the user-specific data saved
      localStorage.setItem(getUserSpecificKey(data.session.user.id, "userName"), userName);
    }
    
    // Get user email if available
    const email = data.session.user.email;
    if (email) {
      localStorage.setItem("userEmail", email);
      localStorage.setItem(getUserSpecificKey(data.session.user.id, "userEmail"), email);
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
