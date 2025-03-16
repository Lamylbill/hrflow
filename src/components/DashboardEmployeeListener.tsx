
import { useEffect } from 'react';

interface DashboardEmployeeListenerProps {
  onEmployeeChange: () => void;
}

/**
 * Component that listens for employee data changes across the application
 * and triggers a refresh of the dashboard data when needed
 */
const DashboardEmployeeListener = ({ onEmployeeChange }: DashboardEmployeeListenerProps) => {
  useEffect(() => {
    // Listen for the custom event that indicates employee data has changed
    const handleEmployeeDataChanged = () => {
      console.log("Employee data change detected, refreshing dashboard data");
      onEmployeeChange();
    };

    window.addEventListener('employee-data-changed', handleEmployeeDataChanged);
    
    return () => {
      window.removeEventListener('employee-data-changed', handleEmployeeDataChanged);
    };
  }, [onEmployeeChange]);

  // This component doesn't render anything visible
  return null;
};

export default DashboardEmployeeListener;
