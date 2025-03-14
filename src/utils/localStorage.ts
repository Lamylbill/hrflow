// Helper functions for managing data persistence in localStorage and Supabase

// Types
import { Employee } from "@/types/employee";
import { LeaveRequest, LeaveStatus } from "@/types/leave";
import { PayrollData, PayrollStatus } from "@/types/payroll";
import { ActivityLog } from "@/types/activity";
import { supabase } from "@/integrations/supabase/client";

// Initialize with empty data for all users
export const initializeLocalStorage = async () => {
  // Check if we're in a production environment and a user is logged in
  const { data: sessionData } = await supabase.auth.getSession();
  const isLoggedIn = !!sessionData.session;
  
  // Initialize with empty arrays for all data types if they don't exist
  if (!localStorage.getItem("employees")) {
    localStorage.setItem("employees", JSON.stringify([]));
  }

  if (!localStorage.getItem("leaveRequests")) {
    localStorage.setItem("leaveRequests", JSON.stringify([]));
  }

  if (!localStorage.getItem("payrollData")) {
    localStorage.setItem("payrollData", JSON.stringify([]));
  }

  if (!localStorage.getItem("activityLogs")) {
    localStorage.setItem("activityLogs", JSON.stringify([]));
  }
};

// Employee CRUD operations - Now correctly handling promises
export const getEmployees = async (): Promise<Employee[]> => {
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
  
  // Fallback to localStorage
  const employees = localStorage.getItem("employees");
  return employees ? JSON.parse(employees) : [];
};

export const addEmployee = async (employee: Omit<Employee, "id">): Promise<Employee> => {
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
  
  // Fallback to localStorage
  const employees = await getEmployees();
  const newEmployee = {
    ...employee,
    id: Date.now().toString(),
  };
  
  employees.push(newEmployee);
  localStorage.setItem("employees", JSON.stringify(employees));
  
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
    
    // Fallback to localStorage
    const employees = await getEmployees();
    const index = employees.findIndex((e) => e.id === employee.id);
    
    if (index !== -1) {
      employees[index] = employee;
      localStorage.setItem("employees", JSON.stringify(employees));
      
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
    
    // Fallback to localStorage
    const employees = await getEmployees();
    const index = employees.findIndex((e) => e.id === id);
    
    if (index !== -1) {
      const deletedEmployee = employees[index];
      employees.splice(index, 1);
      localStorage.setItem("employees", JSON.stringify(employees));
      
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

// Leave request operations
export const getLeaveRequests = (): LeaveRequest[] => {
  const leaveRequests = localStorage.getItem("leaveRequests");
  return leaveRequests ? JSON.parse(leaveRequests) : [];
};

export const addLeaveRequest = (leaveRequest: Omit<LeaveRequest, "id" | "status">): LeaveRequest => {
  const leaveRequests = getLeaveRequests();
  const newLeaveRequest = {
    ...leaveRequest,
    id: Date.now().toString(),
    status: "pending" as LeaveStatus,
  };
  
  leaveRequests.push(newLeaveRequest);
  localStorage.setItem("leaveRequests", JSON.stringify(leaveRequests));
  
  // Log activity
  logActivity({
    action: "create",
    module: "leave",
    description: `New leave request by ${leaveRequest.employeeName}`,
    timestamp: new Date().toISOString(),
  });
  
  return newLeaveRequest;
};

export const updateLeaveStatus = (id: string, status: LeaveStatus): LeaveRequest | null => {
  const leaveRequests = getLeaveRequests();
  const index = leaveRequests.findIndex((lr) => lr.id === id);
  
  if (index !== -1) {
    leaveRequests[index].status = status;
    localStorage.setItem("leaveRequests", JSON.stringify(leaveRequests));
    
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

// Payroll operations
export const getPayrollData = (): PayrollData[] => {
  const payrollData = localStorage.getItem("payrollData");
  return payrollData ? JSON.parse(payrollData) : [];
};

export const updatePayrollStatus = (id: string, status: PayrollStatus, paymentDate?: string): PayrollData | null => {
  const payrollData = getPayrollData();
  const index = payrollData.findIndex((p) => p.id === id);
  
  if (index !== -1) {
    payrollData[index].status = status;
    if (paymentDate) {
      payrollData[index].paymentDate = paymentDate;
    }
    
    localStorage.setItem("payrollData", JSON.stringify(payrollData));
    
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

export const processPayroll = (ids: string[]): PayrollData[] => {
  const payrollData = getPayrollData();
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
    localStorage.setItem("payrollData", JSON.stringify(payrollData));
    
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

// Activity logging
export const getActivityLogs = (): ActivityLog[] => {
  const logs = localStorage.getItem("activityLogs");
  return logs ? JSON.parse(logs) : [];
};

export const logActivity = (log: Omit<ActivityLog, "id">): ActivityLog => {
  const logs = getActivityLogs();
  const newLog = {
    ...log,
    id: Date.now().toString(),
  };
  
  logs.unshift(newLog); // Add to beginning of array for chronological order
  
  // Keep only last 100 logs to prevent localStorage from getting too large
  const trimmedLogs = logs.slice(0, 100);
  localStorage.setItem("activityLogs", JSON.stringify(trimmedLogs));
  
  return newLog;
};

// Initialize data on app start
export const initializeApp = () => {
  initializeLocalStorage();
};
