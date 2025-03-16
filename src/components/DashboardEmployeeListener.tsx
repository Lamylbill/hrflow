
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
    
    // Also listen for the legacy custom event for backward compatibility
    const handleLegacyEvent = () => {
      console.log("Employee data change detected via legacy event");
      onEmployeeChange();
    };
    
    window.addEventListener('employee-data-changed', handleLegacyEvent);
    
    return () => {
      cleanup();
      window.removeEventListener('employee-data-changed', handleLegacyEvent);
    };
  }, [onEmployeeChange]);

  // This component doesn't render anything visible
  return null;
};

export default DashboardEmployeeListener;
