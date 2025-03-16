
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
  PAGE_LOAD_FAILED = 'page-load-failed',
  PAGE_LOADED = 'pageLoaded'
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

// Helper function to mark a page as successfully loaded
export const markPageAsLoaded = (pageId: string) => {
  console.log(`Page ${pageId} marked as loaded`);
  
  // Add a data attribute to the body for the global load check
  const loadIndicator = document.createElement('div');
  loadIndicator.setAttribute('data-page-loaded', 'true');
  loadIndicator.setAttribute('data-page-id', pageId);
  loadIndicator.style.display = 'none';
  document.body.appendChild(loadIndicator);
  
  // Emit the page loaded event
  window.dispatchEvent(new Event('pageLoaded'));
  emitEvent(EventTypes.PAGE_LOADED, { pageId });
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
