
import { supabase } from "@/integrations/supabase/client";

// Helper function to get user-specific storage keys
const getUserSpecificKey = (userId: string, key: string): string => {
  return `${userId}:${key}`;
};

// This function should be called when a new user signs up or logs in
// It ensures the user doesn't see pre-populated data
export const initializeForNewUser = async (userId: string) => {
  console.log("Initializing data for new user:", userId);
  
  // Clear any localStorage data for this user
  localStorage.removeItem(getUserSpecificKey(userId, "employees"));
  localStorage.removeItem(getUserSpecificKey(userId, "leaveRequests"));
  localStorage.removeItem(getUserSpecificKey(userId, "payrollData"));
  localStorage.removeItem(getUserSpecificKey(userId, "activityLogs"));
  localStorage.removeItem(getUserSpecificKey(userId, "notifications"));
  
  // Initialize with empty arrays for the user
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
  
  return true;
};
