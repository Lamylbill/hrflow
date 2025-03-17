
import { useEffect } from 'react';
import { EventTypes, onEvent } from '@/utils/eventBus';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardEmployeeListenerProps {
  onEmployeeChange: () => void;
}

/**
 * Component that listens for employee data changes across the application
 * and triggers a refresh of the dashboard data when needed
 */
const DashboardEmployeeListener = ({ onEmployeeChange }: DashboardEmployeeListenerProps) => {
  const { userId } = useAuth();
  
  useEffect(() => {
    console.log("DashboardEmployeeListener mounted, setting up listener");
    
    // Listen for employee data changes using the event bus (for same-browser updates)
    const eventCleanup = onEvent(EventTypes.EMPLOYEE_DATA_CHANGED, () => {
      console.log("Employee data change detected via event bus");
      onEmployeeChange();
    });
    
    // Set up Supabase realtime subscription for cross-browser updates
    let channel: any;
    
    if (userId) {
      console.log("Setting up Supabase realtime listener for employee changes, user:", userId);
      
      // Subscribe to all changes in the employees table for this user
      // Make sure we're using the correct channel name format
      channel = supabase
        .channel('public:employees:user_id=eq.' + userId)
        .on(
          'postgres_changes',
          {
            event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
            schema: 'public',
            table: 'employees',
            filter: `user_id=eq.${userId}`
          },
          (payload) => {
            console.log("Realtime employee change detected via Supabase:", payload);
            onEmployeeChange();
          }
        )
        .subscribe((status: string) => {
          console.log("Supabase realtime subscription status:", status);
        });
    }
    
    return () => {
      console.log("DashboardEmployeeListener unmounting, cleaning up listeners");
      eventCleanup();
      
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [onEmployeeChange, userId]);

  // This component doesn't render anything visible
  return null;
};

export default DashboardEmployeeListener;
