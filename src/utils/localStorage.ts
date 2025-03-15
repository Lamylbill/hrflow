// Helper functions for managing data persistence in localStorage and Supabase

// Types
import { Employee } from "@/types/employee";
import { LeaveRequest, LeaveStatus } from "@/types/leave";
import { PayrollData, PayrollStatus } from "@/types/payroll";
import { ActivityLog } from "@/types/activity";
import { supabase } from "@/integrations/supabase/client";

// Get the current user ID
const getCurrentUserId = async (): Promise<string | null> => {
  // First try from localStorage for faster access
  const storedUserId = localStorage.getItem("currentUserId");
  if (storedUserId) {
    return storedUserId;
  }
  
  // Fallback to checking session
  const { data } = await supabase.auth.getSession();
  const userId = data.session?.user?.id || null;
  
  // If we found it from session, store it for future use
  if (userId) {
    localStorage.setItem("currentUserId", userId);
  }
  
  return userId;
};

// Helper function to get user-specific storage keys
const getUserSpecificKey = (userId: string, key: string): string => {
  return `${userId}:${key}`;
};

// Initialize with empty data for all users
export const initializeLocalStorage = async () => {
  // Check if we're in a production environment and a user is logged in
  const userId = await getCurrentUserId();
  
  if (!userId) {
    console.log("No user logged in, skipping localStorage initialization");
    return;
  }

  console.log("Initializing localStorage for user:", userId);
  
  // Initialize with empty arrays for all data types if they don't exist
  if (!localStorage.getItem(getUserSpecificKey(userId, "employees"))) {
    localStorage.setItem(getUserSpecificKey(userId, "employees"), JSON.stringify([]));
  }

  if (!localStorage.getItem(getUserSpecificKey(userId, "leaveRequests"))) {
    localStorage.setItem(getUserSpecificKey(userId, "leaveRequests"), JSON.stringify([]));
  }

  if (!localStorage.getItem(getUserSpecificKey(userId, "payrollData"))) {
    localStorage.setItem(getUserSpecificKey(userId, "payrollData"), JSON.stringify([]));
  }

  if (!localStorage.getItem(getUserSpecificKey(userId, "activityLogs"))) {
    localStorage.setItem(getUserSpecificKey(userId, "activityLogs"), JSON.stringify([]));
  }
};

// Employee CRUD operations - Now correctly handling promises
export const getEmployees = async (): Promise<Employee[]> => {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    console.log("No user logged in, returning empty employees array");
    return [];
  }
  
  try {
    // Try to get from Supabase first
    const { data, error } = await supabase
      .from('employees')
      .select('*');
      
    if (error) throw error;
    
    if (data && data.length > 0) {
      // Map Supabase data to our Employee type
      return data.map(emp => ({
        id: emp.id,
        name: `${emp.first_name} ${emp.last_name}`,
        position: emp.position,
        department: emp.department,
        email: emp.email,
        phone: emp.phone || '',
      }));
    }
  } catch (error) {
    console.error("Error fetching employees from Supabase:", error);
  }
  
  // Fallback to localStorage with user-specific key
  const employees = localStorage.getItem(getUserSpecificKey(userId, "employees"));
  return employees ? JSON.parse(employees) : [];
};

export const addEmployee = async (employee: Omit<Employee, "id">): Promise<Employee> => {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    throw new Error("No user logged in, cannot add employee");
  }
  
  try {
    // Split name into first and last name
    const nameParts = employee.name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');
    
    // Add to Supabase
    const { data, error } = await supabase
      .from('employees')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email: employee.email,
        position: employee.position,
        department: employee.department,
        phone: employee.phone,
        hire_date: new Date().toISOString().split('T')[0], // Today
        status: 'active'
      })
      .select();
      
    if (error) throw error;
    
    if (data && data.length > 0) {
      const newEmployee = {
        id: data[0].id,
        name: `${data[0].first_name} ${data[0].last_name}`,
        position: data[0].position,
        department: data[0].department,
        email: data[0].email,
        phone: data[0].phone || '',
      };
      
      // Log activity
      await logActivity({
        action: "create",
        module: "employees",
        description: `Added new employee: ${employee.name}`,
        timestamp: new Date().toISOString(),
      });
      
      return newEmployee;
    }
  } catch (error) {
    console.error("Error adding employee to Supabase:", error);
  }
  
  // Fallback to localStorage with user-specific key
  const employees = await getEmployees();
  const newEmployee = {
    ...employee,
    id: Date.now().toString(),
  };
  
  employees.push(newEmployee);
  localStorage.setItem(getUserSpecificKey(userId, "employees"), JSON.stringify(employees));
  
  // Log activity
  logActivity({
    action: "create",
    module: "employees",
    description: `Added new employee: ${employee.name}`,
    timestamp: new Date().toISOString(),
  });
  
  return newEmployee;
};

export const updateEmployee = async (employee: Employee): Promise<Employee> => {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    throw new Error("No user logged in, cannot update employee");
  }
  
  try {
    // Split name into first and last name
    const nameParts = employee.name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');
    
    // Update in Supabase
    const { error } = await supabase
      .from('employees')
      .update({
        first_name: firstName,
        last_name: lastName,
        email: employee.email,
        position: employee.position,
        department: employee.department,
        phone: employee.phone
      })
      .eq('id', employee.id);
      
    if (error) throw error;
    
    // Log activity
    await logActivity({
      action: "update",
      module: "employees",
      description: `Updated employee: ${employee.name}`,
      timestamp: new Date().toISOString(),
    });
    
    return employee;
  } catch (error) {
    console.error("Error updating employee in Supabase:", error);
    
    // Fallback to localStorage with user-specific key
    const employees = await getEmployees();
    const index = employees.findIndex((e) => e.id === employee.id);
    
    if (index !== -1) {
      employees[index] = employee;
      localStorage.setItem(getUserSpecificKey(userId, "employees"), JSON.stringify(employees));
      
      // Log activity
      logActivity({
        action: "update",
        module: "employees",
        description: `Updated employee: ${employee.name}`,
        timestamp: new Date().toISOString(),
      });
    }
    
    return employee;
  }
};

export const deleteEmployee = async (id: string): Promise<boolean> => {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    throw new Error("No user logged in, cannot delete employee");
  }
  
  try {
    // Delete from Supabase
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    // Log activity
    await logActivity({
      action: "delete",
      module: "employees",
      description: `Deleted employee with ID: ${id}`,
      timestamp: new Date().toISOString(),
    });
    
    return true;
  } catch (error) {
    console.error("Error deleting employee from Supabase:", error);
    
    // Fallback to localStorage with user-specific key
    const employees = await getEmployees();
    const index = employees.findIndex((e) => e.id === id);
    
    if (index !== -1) {
      const deletedEmployee = employees[index];
      employees.splice(index, 1);
      localStorage.setItem(getUserSpecificKey(userId, "employees"), JSON.stringify(employees));
      
      // Log activity
      logActivity({
        action: "delete",
        module: "employees",
        description: `Deleted employee: ${deletedEmployee.name}`,
        timestamp: new Date().toISOString(),
      });
      
      return true;
    }
    
    return false;
  }
};

// Leave request operations with user-specific keys
export const getLeaveRequests = async (): Promise<LeaveRequest[]> => {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    return [];
  }
  
  const leaveRequests = localStorage.getItem(getUserSpecificKey(userId, "leaveRequests"));
  return leaveRequests ? JSON.parse(leaveRequests) : [];
};

export const addLeaveRequest = async (leaveRequest: Omit<LeaveRequest, "id" | "status">): Promise<LeaveRequest> => {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    throw new Error("No user logged in, cannot add leave request");
  }
  
  const leaveRequests = await getLeaveRequests();
  const newLeaveRequest = {
    ...leaveRequest,
    id: Date.now().toString(),
    status: "pending" as LeaveStatus,
  };
  
  leaveRequests.push(newLeaveRequest);
  localStorage.setItem(getUserSpecificKey(userId, "leaveRequests"), JSON.stringify(leaveRequests));
  
  // Log activity
  logActivity({
    action: "create",
    module: "leave",
    description: `New leave request by ${leaveRequest.employeeName}`,
    timestamp: new Date().toISOString(),
  });
  
  return newLeaveRequest;
};

export const updateLeaveStatus = async (id: string, status: LeaveStatus): Promise<LeaveRequest | null> => {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    return null;
  }
  
  const leaveRequests = await getLeaveRequests();
  const index = leaveRequests.findIndex((lr) => lr.id === id);
  
  if (index !== -1) {
    leaveRequests[index].status = status;
    localStorage.setItem(getUserSpecificKey(userId, "leaveRequests"), JSON.stringify(leaveRequests));
    
    // Log activity
    logActivity({
      action: "update",
      module: "leave",
      description: `${status.charAt(0).toUpperCase() + status.slice(1)} leave request for ${leaveRequests[index].employeeName}`,
      timestamp: new Date().toISOString(),
    });
    
    return leaveRequests[index];
  }
  
  return null;
};

// Payroll operations with user-specific keys
export const getPayrollData = async (): Promise<PayrollData[]> => {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    return [];
  }
  
  const payrollData = localStorage.getItem(getUserSpecificKey(userId, "payrollData"));
  return payrollData ? JSON.parse(payrollData) : [];
};

export const updatePayrollStatus = async (id: string, status: PayrollStatus, paymentDate?: string): Promise<PayrollData | null> => {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    return null;
  }
  
  const payrollData = await getPayrollData();
  const index = payrollData.findIndex((p) => p.id === id);
  
  if (index !== -1) {
    payrollData[index].status = status;
    if (paymentDate) {
      payrollData[index].paymentDate = paymentDate;
    }
    
    localStorage.setItem(getUserSpecificKey(userId, "payrollData"), JSON.stringify(payrollData));
    
    // Log activity
    logActivity({
      action: "update",
      module: "payroll",
      description: `Updated payroll status to ${status} for ${payrollData[index].employeeName}`,
      timestamp: new Date().toISOString(),
    });
    
    return payrollData[index];
  }
  
  return null;
};

export const processPayroll = async (ids: string[]): Promise<PayrollData[]> => {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    return [];
  }
  
  const payrollData = await getPayrollData();
  const today = new Date().toISOString().split('T')[0];
  const processed: PayrollData[] = [];
  
  ids.forEach(id => {
    const index = payrollData.findIndex((p) => p.id === id);
    if (index !== -1 && (payrollData[index].status === "processing" || payrollData[index].status === "pending")) {
      payrollData[index].status = "paid";
      payrollData[index].paymentDate = today;
      processed.push(payrollData[index]);
    }
  });
  
  if (processed.length > 0) {
    localStorage.setItem(getUserSpecificKey(userId, "payrollData"), JSON.stringify(payrollData));
    
    // Log activity
    logActivity({
      action: "process",
      module: "payroll",
      description: `Processed payroll for ${processed.length} employee(s)`,
      timestamp: new Date().toISOString(),
    });
  }
  
  return processed;
};

// Activity logging with user-specific keys
export const getActivityLogs = async (): Promise<ActivityLog[]> => {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    return [];
  }
  
  const logs = localStorage.getItem(getUserSpecificKey(userId, "activityLogs"));
  return logs ? JSON.parse(logs) : [];
};

export const logActivity = async (log: Omit<ActivityLog, "id">): Promise<ActivityLog> => {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    // If no user is logged in, still create the log but don't persist it
    return {
      ...log,
      id: Date.now().toString(),
    };
  }
  
  const logs = await getActivityLogs();
  const newLog = {
    ...log,
    id: Date.now().toString(),
  };
  
  logs.unshift(newLog); // Add to beginning of array for chronological order
  
  // Keep only last 100 logs to prevent localStorage from getting too large
  const trimmedLogs = logs.slice(0, 100);
  localStorage.setItem(getUserSpecificKey(userId, "activityLogs"), JSON.stringify(trimmedLogs));
  
  return newLog;
};

// Initialize data on app start
export const initializeApp = () => {
  initializeLocalStorage();
};
