
import { useEffect } from 'react';
import { EventTypes, onEvent } from '@/utils/eventBus';

interface DashboardEmployeeListenerProps {
  onEmployeeChange: () => void;
}

/**
 * Component that listens for employee data changes across the application
 * and triggers a refresh of the dashboard data when needed
 */
const DashboardEmployeeListener = ({ onEmployeeChange }: DashboardEmployeeListenerProps) => {
  useEffect(() => {
    console.log("DashboardEmployeeListener mounted, setting up listeners");
    
    // Listen for employee data changes using the event bus
    const cleanup = onEvent(EventTypes.EMPLOYEE_DATA_CHANGED, (data) => {
      console.log("Employee data change detected via event bus:", data);
      onEmployeeChange();
    });
    
    return () => {
      console.log("DashboardEmployeeListener unmounting, cleaning up listeners");
      cleanup();
    };
  }, [onEmployeeChange]);

  // This component doesn't render anything visible
  return null;
};

export default DashboardEmployeeListener;
