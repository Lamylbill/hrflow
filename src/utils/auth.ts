import { supabase } from "@/integrations/supabase/client";
import { initializeForNewUser } from "./initializeForNewUser";
import { EventTypes, emitEvent } from "./eventBus";
import { unlinkEmployeeFromUser } from "@/utils/userManagement";

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
    // Store the user ID for THIS browser session only (not shared between tabs)
    // We use a tab-specific ID key to prevent cross-contamination
    const tabId = crypto.randomUUID();
    sessionStorage.setItem('tabId', tabId);
    sessionStorage.setItem(`user:${tabId}`, data.user.id);
    
    await initializeForNewUser(data.user.id);
    
    // Store user metadata with user-specific keys for persistence
    if (metadata?.name) {
      // Store both user-specific and current-session keys
      localStorage.setItem(getUserSpecificKey(data.user.id, "userName"), metadata.name);
      // Also set the current user's name for the active session
      sessionStorage.setItem(`userName:${tabId}`, metadata.name);
    }
    
    // Store user email for profile access
    localStorage.setItem(getUserSpecificKey(data.user.id, "userEmail"), email);
    sessionStorage.setItem(`userEmail:${tabId}`, email);
    
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
    // Use a tab-specific ID to prevent cross-contamination between tabs
    const tabId = crypto.randomUUID();
    sessionStorage.setItem('tabId', tabId);
    sessionStorage.setItem(`user:${tabId}`, data.user.id);
    
    // Store user info with user-specific prefix for persistence
    const userName = data.user.user_metadata?.name;
    if (userName) {
      localStorage.setItem(getUserSpecificKey(data.user.id, "userName"), userName);
      // Store in sessionStorage with tab-specific ID
      sessionStorage.setItem(`userName:${tabId}`, userName);
    }
    
    // Store user email for profile access
    localStorage.setItem(getUserSpecificKey(data.user.id, "userEmail"), email);
    sessionStorage.setItem(`userEmail:${tabId}`, email);
    
    // Emit event for profile update
    emitEvent(EventTypes.USER_PROFILE_UPDATED, { 
      userId: data.user.id, 
      userName,
      userEmail: email
    });
  }
  
  return { data, error: null };
};

// Sign out the user
export const signOut = async () => {
  try {
    // First check if the session exists
    const { data: sessionData } = await supabase.auth.getSession();

    // If no session, just return success
    if (!sessionData.session) {
      return { success: true };
    }
    
    // Before signing out, handle employee record cleanup if needed
    try {
      if (sessionData.session.user) {
        await unlinkEmployeeFromUser(sessionData.session.user.id);
      }
    } catch (cleanupError) {
      console.error("Error during pre-signout cleanup:", cleanupError);
      // Continue with sign out even if cleanup fails
    }
    
    // We have a session, attempt to sign out
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Supabase signOut error:", error);
      // Even if the API call fails, we should clean up sessionStorage
      if (sessionData.session) {
        sessionStorage.removeItem(`user:${sessionData.session.user.id}`);
        sessionStorage.removeItem(`userName:${sessionData.session.user.id}`);
        sessionStorage.removeItem(`userEmail:${sessionData.session.user.id}`);
        sessionStorage.removeItem('tabId');
      }
      throw error;
    }
    
    // Clean up tab-specific sessionStorage data on logout
    if (sessionData.session) {
      sessionStorage.removeItem(`user:${sessionData.session.user.id}`);
      sessionStorage.removeItem(`userName:${sessionData.session.user.id}`);
      sessionStorage.removeItem(`userEmail:${sessionData.session.user.id}`);
      sessionStorage.removeItem('tabId');
    }
    
    // Emit event for auth status change
    emitEvent(EventTypes.AUTH_STATUS_CHANGED, { status: 'signedOut' });
    
    return { success: true };
  } catch (error) {
    console.error("Error during signOut:", error);
    // Even after errors, ensure we clean up sessionStorage
    const tabId = sessionStorage.getItem('tabId');
    if (tabId) {
      sessionStorage.removeItem(`user:${tabId}`);
      sessionStorage.removeItem(`userName:${tabId}`);
      sessionStorage.removeItem(`userEmail:${tabId}`);
      sessionStorage.removeItem('tabId');
    }
    
    // Emit event for auth status change
    emitEvent(EventTypes.AUTH_STATUS_CHANGED, { status: 'signedOut' });
    
    // Return a special flag to indicate client-side cleanup was done
    // even if the server-side session deletion failed
    return { success: true, clientCleanup: true, error };
  }
};

// Re-export the deleteUserAccount function for compatibility
export { deleteUserAccount } from "@/utils/userManagement";

// Get the current session
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) throw error;
  
  if (data.session) {
    // Use a tab-specific ID to prevent cross-contamination between tabs
    let tabId = sessionStorage.getItem('tabId');
    if (!tabId) {
      tabId = crypto.randomUUID();
      sessionStorage.setItem('tabId', tabId);
    }
    
    // Update sessionStorage which is specific to this browser tab/window
    sessionStorage.setItem(`user:${tabId}`, data.session.user.id);
    
    // Update the current tab-specific user data
    const userName = data.session.user.user_metadata?.name;
    if (userName) {
      sessionStorage.setItem(`userName:${tabId}`, userName);
      // Also ensure we have the user-specific data saved
      localStorage.setItem(getUserSpecificKey(data.session.user.id, "userName"), userName);
    }
    
    // Get user email if available
    const email = data.session.user.email;
    if (email) {
      sessionStorage.setItem(`userEmail:${tabId}`, email);
      localStorage.setItem(getUserSpecificKey(data.session.user.id, "userEmail"), email);
    }
    
    return data.session;
  } else {
    const tabId = sessionStorage.getItem('tabId');
    if (tabId) {
      sessionStorage.removeItem(`user:${tabId}`);
      sessionStorage.removeItem(`userName:${tabId}`);
      sessionStorage.removeItem(`userEmail:${tabId}`);
    }
    return null;
  }
};

// Helper function to get current user ID for this tab
export const getCurrentUserId = (): string | null => {
  const tabId = sessionStorage.getItem('tabId');
  return tabId ? sessionStorage.getItem(`user:${tabId}`) : null;
};

// Helper function to get current user name for this tab
export const getCurrentUserName = (): string | null => {
  const tabId = sessionStorage.getItem('tabId');
  return tabId ? sessionStorage.getItem(`userName:${tabId}`) : null;
};

// Helper function to get current user email for this tab
export const getCurrentUserEmail = (): string | null => {
  const tabId = sessionStorage.getItem('tabId');
  return tabId ? sessionStorage.getItem(`userEmail:${tabId}`) : null;
};

// Check if user is authenticated
export const isAuthenticated = async () => {
  const session = await getSession();
  return !!session;
};
