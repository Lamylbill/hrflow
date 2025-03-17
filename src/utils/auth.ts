
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

// Sign out the current user
export const signOut = async () => {
  try {
    // Get the current tab ID
    const tabId = sessionStorage.getItem('tabId');
    
    // First check if we have a session before attempting to sign out
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session) {
      console.log("No active session found, cleaning up local storage only");
      // Clean up tab-specific sessionStorage
      if (tabId) {
        sessionStorage.removeItem(`user:${tabId}`);
        sessionStorage.removeItem(`userName:${tabId}`);
        sessionStorage.removeItem(`userEmail:${tabId}`);
        sessionStorage.removeItem('tabId');
      }
      return { success: true };
    }
    
    // Before signing out, handle employee record cleanup if needed
    try {
      const userId = sessionData.session.user.id;
      
      // Clean up any employee records associated with this user
      // Setting user_id to null instead of deleting the employee
      const { error: employeeUpdateError } = await supabase
        .from('employees')
        .update({ user_id: null })
        .eq('user_id', userId);
      
      if (employeeUpdateError) {
        console.warn("Error unlinking employee records:", employeeUpdateError.message);
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
      if (tabId) {
        sessionStorage.removeItem(`user:${tabId}`);
        sessionStorage.removeItem(`userName:${tabId}`);
        sessionStorage.removeItem(`userEmail:${tabId}`);
        sessionStorage.removeItem('tabId');
      }
      throw error;
    }
    
    // Clean up tab-specific sessionStorage data on logout
    if (tabId) {
      sessionStorage.removeItem(`user:${tabId}`);
      sessionStorage.removeItem(`userName:${tabId}`);
      sessionStorage.removeItem(`userEmail:${tabId}`);
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

// Helper function to delete a user account (for admin use or account deletion by user)
export const deleteUserAccount = async (userId: string) => {
  try {
    // First, remove any association between the user and employee records
    const { error: updateError } = await supabase
      .from('employees')
      .update({ user_id: null })
      .eq('user_id', userId);
    
    if (updateError) {
      console.error("Error unlinking employee records:", updateError);
      throw updateError;
    }
    
    // Now attempt to delete the user
    // Note: This requires admin privileges or a server-side function
    // This won't work with client-side code unless you're using a service role
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);
    
    if (deleteError) {
      console.error("Error deleting user:", deleteError);
      throw deleteError;
    }
    
    return { success: true };
  } catch (error) {
    console.error("Failed to delete user account:", error);
    return { success: false, error };
  }
};

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
