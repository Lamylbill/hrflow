
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
 * Deletes a user account from Supabase using the Edge Function
 * that has admin privileges
 */
export const deleteUserAccount = async (userId: string): Promise<{ success: boolean; error?: any }> => {
  try {
    // First, unlink any employee records - redundant but safer as a fallback
    // in case the edge function fails to do so
    const unlinkSuccess = await unlinkEmployeeFromUser(userId);
    if (!unlinkSuccess) {
      console.warn("Failed to unlink employee records locally, but continuing with deletion attempt");
    }
    
    // Call the Edge Function to delete the user with admin privileges
    const { data, error } = await supabase.functions.invoke('delete-user', {
      body: { userId },
    });
    
    if (error) {
      console.error("Error calling delete-user function:", error);
      toast({
        title: "User deletion failed",
        description: "The user account could not be deleted. Please try again or contact support.",
        variant: "destructive",
      });
      
      return { success: false, error };
    }
    
    if (!data?.success) {
      console.error("Delete-user function returned error:", data?.error);
      toast({
        title: "User deletion failed",
        description: data?.error || "An error occurred during user deletion. Please try again or contact support.",
        variant: "destructive",
      });
      
      return { success: false, error: data?.error };
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
