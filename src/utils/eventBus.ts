
/**
 * Utility to handle inter-component communication through events
 * This helps keep components in sync without complex prop drilling
 */

// Event types for type safety
export enum EventTypes {
  EMPLOYEE_DATA_CHANGED = 'employee-data-changed',
  LEAVE_DATA_CHANGED = 'leave-data-changed',
  PAYROLL_DATA_CHANGED = 'payroll-data-changed', 
  AUTH_STATUS_CHANGED = 'auth-status-changed'
}

// Trigger an event to notify listeners
export const emitEvent = (eventType: EventTypes, data?: any) => {
  const event = new CustomEvent(eventType, { detail: data });
  window.dispatchEvent(event);
  console.log(`Event emitted: ${eventType}`, data || '');
};

// Subscribe to an event
export const onEvent = (
  eventType: EventTypes | string, 
  handler: (data?: any) => void
): (() => void) => {
  
  const handlerWrapper = (event: Event) => {
    const customEvent = event as CustomEvent;
    handler(customEvent.detail);
  };
  
  window.addEventListener(eventType, handlerWrapper);
  
  // Return cleanup function to unsubscribe
  return () => {
    window.removeEventListener(eventType, handlerWrapper);
  };
};
