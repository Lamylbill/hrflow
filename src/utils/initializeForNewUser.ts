
import { supabase } from "@/integrations/supabase/client";

// This function should be called when a new user signs up or logs in
// It ensures the user doesn't see pre-populated data
export const initializeForNewUser = async (userId: string) => {
  console.log("Initializing data for new user:", userId);
  
  // Clear any localStorage data 
  localStorage.removeItem("employees");
  localStorage.removeItem("leaveRequests");
  localStorage.removeItem("payrollData");
  localStorage.removeItem("activityLogs");
  localStorage.removeItem("notifications");
  
  // Initialize with empty arrays for the user
  localStorage.setItem("employees", JSON.stringify([]));
  localStorage.setItem("leaveRequests", JSON.stringify([]));
  localStorage.setItem("payrollData", JSON.stringify([]));
  localStorage.setItem("activityLogs", JSON.stringify([]));
  
  // Setup basic notifications
  const welcomeNotification = [{
    id: Date.now().toString(),
    title: "Welcome to HR Flow",
    message: "Thank you for creating an account. Get started by adding employees to your database.",
    timestamp: new Date().toISOString(),
    read: false,
    type: "info"
  }];
  
  localStorage.setItem("notifications", JSON.stringify(welcomeNotification));
  
  return true;
};
