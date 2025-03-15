
import { supabase } from "@/integrations/supabase/client";

// Helper function to get user-specific storage keys
const getUserSpecificKey = (userId: string, key: string): string => {
  return `${userId}:${key}`;
};

// This function should be called when a new user signs up or logs in
// It ensures the user doesn't see pre-populated data
export const initializeForNewUser = async (userId: string) => {
  console.log("Initializing data for new user:", userId);
  
  // STEP 1: Clear ALL localStorage data that might be shared
  // Clear any localStorage data for this user and any potential shared data
  localStorage.removeItem(getUserSpecificKey(userId, "employees"));
  localStorage.removeItem(getUserSpecificKey(userId, "leaveRequests"));
  localStorage.removeItem(getUserSpecificKey(userId, "payrollData"));
  localStorage.removeItem(getUserSpecificKey(userId, "activityLogs"));
  localStorage.removeItem(getUserSpecificKey(userId, "notifications"));
  
  // Also clear any non-prefixed data that might be shared
  localStorage.removeItem("employees");
  localStorage.removeItem("leaveRequests");
  localStorage.removeItem("payrollData");
  localStorage.removeItem("activityLogs");
  localStorage.removeItem("notifications");
  
  // STEP 2: Initialize with EMPTY arrays for the user
  localStorage.setItem(getUserSpecificKey(userId, "employees"), JSON.stringify([]));
  localStorage.setItem(getUserSpecificKey(userId, "leaveRequests"), JSON.stringify([]));
  localStorage.setItem(getUserSpecificKey(userId, "payrollData"), JSON.stringify([]));
  localStorage.setItem(getUserSpecificKey(userId, "activityLogs"), JSON.stringify([]));
  
  // Setup basic notifications
  const welcomeNotification = [{
    id: Date.now().toString(),
    title: "Welcome to HR Flow",
    message: "Thank you for creating an account. Get started by adding employees to your database.",
    timestamp: new Date().toISOString(),
    read: false,
    type: "info"
  }];
  
  localStorage.setItem(getUserSpecificKey(userId, "notifications"), JSON.stringify(welcomeNotification));
  
  // STEP 3: Check if there's any Supabase data for this user and clear it
  try {
    // Check if they have any employees in Supabase and clear them
    const { error: fetchError } = await supabase
      .from('employees')
      .select('id');
    
    if (!fetchError) {
      // Clear existing Supabase data - we want a fresh start
      await supabase.from('employees').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    }
  } catch (error) {
    console.error("Error checking/clearing Supabase data:", error);
  }
  
  return true;
};
