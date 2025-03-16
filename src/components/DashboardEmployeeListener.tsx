
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
    console.log("DashboardEmployeeListener mounted, setting up listener");
    
    // Listen for employee data changes using the event bus
    const cleanup = onEvent(EventTypes.EMPLOYEE_DATA_CHANGED, () => {
      console.log("Employee data change detected via event bus");
      onEmployeeChange();
    });
    
    return () => {
      console.log("DashboardEmployeeListener unmounting, cleaning up listener");
      cleanup();
    };
  }, [onEmployeeChange]);

  // This component doesn't render anything visible
  return null;
};

export default DashboardEmployeeListener;
