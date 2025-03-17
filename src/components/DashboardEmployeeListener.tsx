
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
    
    if (userId) {
      // Create a channel and subscribe
      const channelName = `employees-changes-${userId}`;
      channel = supabase.channel(channelName);
      
      channel.subscribe((status: string) => {
        console.log("Employee realtime subscription status:", status);
        
        if (status === 'SUBSCRIBED') {
          // Only add listener after successful subscription
          channel.on(
            'postgres_changes',
            {
              event: '*',  // Listen for all event types
              schema: 'public',
              table: 'employees',
              filter: userId ? `user_id=eq.${userId}` : undefined
            },
            (payload: any) => {
              console.log("Realtime employee change detected:", payload);
              onEmployeeChange();
              
              // Show different toast messages based on the event type
              const eventType = payload.eventType;
              const employeeData = eventType === 'DELETE' ? payload.old_record : payload.new_record;
              const employeeName = employeeData ? 
                `${employeeData.first_name} ${employeeData.last_name}` : 
                'Employee';
              
              let message = '';
              
              switch(eventType) {
                case 'INSERT':
                  message = `New employee added: ${employeeName}`;
                  break;
                case 'UPDATE':
                  message = `Employee updated: ${employeeName}`;
                  break;
                case 'DELETE':
                  message = `Employee removed: ${employeeName}`;
                  break;
                default:
                  message = "Employee data has been updated";
              }
              
              toast({
                title: "Employee data updated",
                description: message,
              });
            }
          );
        }
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
