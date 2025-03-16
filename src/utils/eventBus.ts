
/**
 * Utility to handle inter-component communication through events
 * This helps keep components in sync without complex prop drilling
 */

// Event types for type safety
export enum EventTypes {
  EMPLOYEE_DATA_CHANGED = 'employee-data-changed',
  LEAVE_DATA_CHANGED = 'leave-data-changed',
  PAYROLL_DATA_CHANGED = 'payroll-data-changed', 
  AUTH_STATUS_CHANGED = 'auth-status-changed',
  PAGE_LOAD_FAILED = 'page-load-failed'
}

// Trigger an event to notify listeners
export const emitEvent = (eventType: EventTypes, data?: any) => {
  const event = new CustomEvent(eventType, { detail: data });
  window.dispatchEvent(event);
  console.log(`Event emitted: ${eventType}`, data || '');
};

// Subscribe to an event
export const onEvent = (
  eventType: EventTypes, 
  handler: (data?: any) => void, 
  dependencies: React.DependencyList = []
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

/**
 * Usage example:
 * 
 * // In component A (emitter):
 * import { emitEvent, EventTypes } from '@/utils/eventBus';
 * 
 * // After employee is added
 * emitEvent(EventTypes.EMPLOYEE_DATA_CHANGED, { action: 'added', count: newCount });
 * 
 * // In component B (listener):
 * import { onEvent, EventTypes } from '@/utils/eventBus';
 * 
 * useEffect(() => {
 *   const cleanup = onEvent(EventTypes.EMPLOYEE_DATA_CHANGED, (data) => {
 *     console.log('Employee data changed:', data);
 *     refreshEmployeeData();
 *   }, []);
 *   
 *   return cleanup;
 * }, []);
 */
