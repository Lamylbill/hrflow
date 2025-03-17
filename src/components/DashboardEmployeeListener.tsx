
import { useEffect } from 'react';
import { EventTypes, onEvent } from '@/utils/eventBus';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

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
    let reconnectTimer: any;
    
    const setupRealtimeListener = () => {
      if (!userId) return;
      
      console.log("Setting up Supabase realtime listener for employee changes, user:", userId);
      
      if (channel) {
        supabase.removeChannel(channel);
      }
      
      // Use a unique channel name with timestamp to avoid conflicts
      const channelName = `employee-changes-${userId}-${Date.now()}`;
      
      // Subscribe to all changes in the employees table for this user
      channel = supabase
        .channel(channelName)
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
            toast({
              title: "Employee data updated",
              description: "Employee data has been updated from another session",
            });
          }
        )
        .subscribe((status: string) => {
          console.log(`DashboardEmployeeListener: Supabase realtime subscription status (${channelName}):`, status);
          
          // If subscription failed, try to reconnect
          if (status === 'SUBSCRIBED') {
            console.log("Successfully subscribed to employee changes for user:", userId);
            if (reconnectTimer) {
              clearTimeout(reconnectTimer);
              reconnectTimer = null;
            }
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            console.error(`Failed to subscribe to employee changes (${status})`);
            
            // Try to reconnect after 3 seconds
            if (!reconnectTimer) {
              reconnectTimer = setTimeout(() => {
                console.log("Attempting to reconnect to Supabase realtime...");
                setupRealtimeListener();
              }, 3000);
            }
          }
        });
    };
    
    // Initial setup of realtime listener
    setupRealtimeListener();
    
    return () => {
      console.log("DashboardEmployeeListener unmounting, cleaning up listeners");
      eventCleanup();
      
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
      
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [onEmployeeChange, userId]);

  // This component doesn't render anything visible
  return null;
};

export default DashboardEmployeeListener;
