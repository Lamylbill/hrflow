
import { supabase } from "@/integrations/supabase/client";

// This function should be called when a new user signs up
// It ensures the user doesn't see pre-populated data
export const initializeForNewUser = async (userId: string) => {
  console.log("Initializing data for new user:", userId);
  
  // Clear any localStorage data that might have been set globally
  localStorage.removeItem("employees");
  localStorage.removeItem("leaveRequests");
  localStorage.removeItem("payrollData");
  localStorage.removeItem("activityLogs");
  
  // Initialize with empty arrays for the new user
  localStorage.setItem("employees", JSON.stringify([]));
  localStorage.setItem("leaveRequests", JSON.stringify([]));
  localStorage.setItem("payrollData", JSON.stringify([]));
  localStorage.setItem("activityLogs", JSON.stringify([]));
  
  return true;
};
