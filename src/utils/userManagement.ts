
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

/**
 * Unlinks an employee from a user account in Supabase
 * This preserves employee data while removing the association with the user
 */
export const unlinkEmployeeFromUser = async (userId: string): Promise<boolean> => {
  try {
    // Update any employee records associated with this user
    const { error } = await supabase
      .from('employees')
      .update({ user_id: null })
      .eq('user_id', userId);
    
    if (error) {
      console.warn("Error unlinking employee records:", error.message);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error during employee unlinking:", error);
    return false;
  }
};

/**
 * Deletes a user account from Supabase
 * Note: This requires admin privileges and won't work with client-side code 
 * unless using a service role token or Edge Function
 */
export const deleteUserAccount = async (userId: string): Promise<{ success: boolean; error?: any }> => {
  try {
    // First, unlink any employee records
    const unlinkSuccess = await unlinkEmployeeFromUser(userId);
    if (!unlinkSuccess) {
      console.warn("Failed to unlink employee records, but continuing with deletion attempt");
    }
    
    // Note: This requires admin privileges or a server-side function
    // This won't work with client-side code unless using a service role
    const { error } = await supabase.auth.admin.deleteUser(userId);
    
    if (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "User deletion failed",
        description: "The user account could not be deleted. Please try again or contact support.",
        variant: "destructive",
      });
      
      return { success: false, error };
    }
    
    toast({
      title: "User deleted",
      description: "The user account has been successfully deleted",
    });
    
    return { success: true };
  } catch (error) {
    console.error("Failed to delete user account:", error);
    
    toast({
      title: "User deletion failed",
      description: "An unexpected error occurred. Please try again or contact support.",
      variant: "destructive",
    });
    
    return { success: false, error };
  }
};
