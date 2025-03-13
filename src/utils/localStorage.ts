// Helper functions for managing data persistence in localStorage and Supabase

// Types
import { Employee } from "@/types/employee";
import { LeaveRequest, LeaveStatus } from "@/types/leave";
import { PayrollData, PayrollStatus } from "@/types/payroll";
import { ActivityLog } from "@/types/activity";
import { supabase } from "@/integrations/supabase/client";

// Initialize default data only for first-time setup or development
export const initializeLocalStorage = async () => {
  // Check if we're in a production environment and a user is logged in
  const { data: sessionData } = await supabase.auth.getSession();
  const isLoggedIn = !!sessionData.session;
  
  // Only initialize if data doesn't exist AND we're either in development OR not logged in
  if (!localStorage.getItem("employees")) {
    const defaultEmployees: Employee[] = [
      {
        id: "1",
        name: "John Smith",
        position: "Senior Developer",
        department: "Engineering",
        email: "john.smith@example.com",
        phone: "+1 (555) 123-4567",
      },
      {
        id: "2",
        name: "Emily Johnson",
        position: "Product Manager",
        department: "Product",
        email: "emily.johnson@example.com",
        phone: "+1 (555) 234-5678",
      },
      {
        id: "3",
        name: "Michael Brown",
        position: "UI Designer",
        department: "Design",
        email: "michael.brown@example.com",
        phone: "+1 (555) 345-6789",
      },
      {
        id: "4",
        name: "Jessica Williams",
        position: "Marketing Specialist",
        department: "Marketing",
        email: "jessica.williams@example.com",
        phone: "+1 (555) 456-7890",
      },
      {
        id: "5",
        name: "Robert Jones",
        position: "Sales Representative",
        department: "Sales",
        email: "robert.jones@example.com",
        phone: "+1 (555) 567-8901",
      },
      {
        id: "6",
        name: "Sarah Miller",
        position: "HR Coordinator",
        department: "HR",
        email: "sarah.miller@example.com",
        phone: "+1 (555) 678-9012",
      },
      {
        id: "7",
        name: "David Davis",
        position: "Frontend Developer",
        department: "Engineering",
        email: "david.davis@example.com",
        phone: "+1 (555) 789-0123",
      },
      {
        id: "8",
        name: "Jennifer Garcia",
        position: "Content Writer",
        department: "Marketing",
        email: "jennifer.garcia@example.com",
        phone: "+1 (555) 890-1234",
      },
      {
        id: "9",
        name: "Thomas Wilson",
        position: "Backend Developer",
        department: "Engineering",
        email: "thomas.wilson@example.com",
        phone: "+1 (555) 901-2345",
      },
    ];
    
    // For development or first-time setup only
    localStorage.setItem("employees", JSON.stringify(defaultEmployees));
    
    // Only initialize Supabase if we're not in production with a logged-in user
    if (!isLoggedIn) {
      // Also initialize in Supabase if table is empty
      const { count } = await supabase
        .from('employees')
        .select('*', { count: 'exact', head: true });
        
      if (count === 0) {
        // Convert local employee format to Supabase format
        const supabaseEmployees = defaultEmployees.map(emp => ({
          first_name: emp.name.split(' ')[0],
          last_name: emp.name.split(' ').slice(1).join(' '),
          email: emp.email,
          position: emp.position,
          department: emp.department,
          phone: emp.phone,
          hire_date: new Date().toISOString().split('T')[0], // Today as fallback
          status: 'active'
        }));
        
        await supabase.from('employees').insert(supabaseEmployees);
      }
    }
  }

  if (!localStorage.getItem("leaveRequests")) {
    const defaultLeaveRequests: LeaveRequest[] = [
      {
        id: "1",
        employeeName: "John Smith",
        type: "Annual Leave",
        status: "approved",
        startDate: "2023-06-10",
        endDate: "2023-06-15",
        reason: "Family vacation",
      },
      {
        id: "2",
        employeeName: "Emily Johnson",
        type: "Sick Leave",
        status: "pending",
        startDate: "2023-06-12",
        endDate: "2023-06-13",
        reason: "Doctor's appointment",
      },
      {
        id: "3",
        employeeName: "Michael Brown",
        type: "Personal Leave",
        status: "rejected",
        startDate: "2023-06-20",
        endDate: "2023-06-22",
        reason: "Personal matters",
      },
      {
        id: "4",
        employeeName: "Jessica Williams",
        type: "Annual Leave",
        status: "approved",
        startDate: "2023-06-25",
        endDate: "2023-06-30",
        reason: "Summer holiday",
      },
      {
        id: "5",
        employeeName: "Robert Jones",
        type: "Work from Home",
        status: "pending",
        startDate: "2023-06-13",
        endDate: "2023-06-14",
        reason: "Home repairs",
      },
      {
        id: "6",
        employeeName: "Sarah Miller",
        type: "Sick Leave",
        status: "approved",
        startDate: "2023-06-15",
        endDate: "2023-06-16",
        reason: "Not feeling well",
      },
      {
        id: "7",
        employeeName: "David Davis",
        type: "Annual Leave",
        status: "pending",
        startDate: "2023-07-01",
        endDate: "2023-07-05",
        reason: "Family event",
      },
      {
        id: "8",
        employeeName: "Jennifer Garcia",
        type: "Personal Leave",
        status: "approved",
        startDate: "2023-06-18",
        endDate: "2023-06-19",
        reason: "Personal matters",
      },
      {
        id: "9",
        employeeName: "Thomas Wilson",
        type: "Work from Home",
        status: "pending",
        startDate: "2023-06-14",
        endDate: "2023-06-15",
        reason: "Internet installation",
      },
    ];
    localStorage.setItem("leaveRequests", JSON.stringify(defaultLeaveRequests));
  }

  if (!localStorage.getItem("payrollData")) {
    const defaultPayrollData: PayrollData[] = [
      {
        id: "1",
        employeeName: "John Smith",
        employeeId: "EMP001",
        position: "Senior Developer",
        salary: 85000,
        bonus: 2000,
        deductions: 1200,
        netPay: 7025,
        paymentDate: "2023-06-30",
        status: "paid"
      },
      {
        id: "2",
        employeeName: "Emily Johnson",
        employeeId: "EMP002",
        position: "Product Manager",
        salary: 92000,
        bonus: 3000,
        deductions: 1500,
        netPay: 7792,
        paymentDate: "2023-06-30",
        status: "paid"
      },
      {
        id: "3",
        employeeName: "Michael Brown",
        employeeId: "EMP003",
        position: "UI Designer",
        salary: 72000,
        bonus: 0,
        deductions: 950,
        netPay: 5925,
        paymentDate: "2023-06-30",
        status: "paid"
      },
      {
        id: "4",
        employeeName: "Jessica Williams",
        employeeId: "EMP004",
        position: "Marketing Specialist",
        salary: 65000,
        bonus: 1500,
        deductions: 850,
        netPay: 5429,
        paymentDate: "2023-06-30",
        status: "paid"
      },
      {
        id: "5",
        employeeName: "Robert Jones",
        employeeId: "EMP005",
        position: "Sales Representative",
        salary: 68000,
        bonus: 5000,
        deductions: 980,
        netPay: 6002,
        paymentDate: "2023-06-30",
        status: "paid"
      },
      {
        id: "6",
        employeeName: "Sarah Miller",
        employeeId: "EMP006",
        position: "HR Coordinator",
        salary: 62000,
        bonus: 1000,
        deductions: 820,
        netPay: 5182,
        paymentDate: "2023-06-30",
        status: "pending"
      },
      {
        id: "7",
        employeeName: "David Davis",
        employeeId: "EMP007",
        position: "Frontend Developer",
        salary: 78000,
        bonus: 1500,
        deductions: 1050,
        netPay: 6538,
        paymentDate: "",
        status: "processing"
      },
      {
        id: "8",
        employeeName: "Jennifer Garcia",
        employeeId: "EMP008",
        position: "Content Writer",
        salary: 60000,
        bonus: 800,
        deductions: 750,
        netPay: 5004,
        paymentDate: "",
        status: "processing"
      },
      {
        id: "9",
        employeeName: "Thomas Wilson",
        employeeId: "EMP009",
        position: "Backend Developer",
        salary: 82000,
        bonus: 1800,
        deductions: 1150,
        netPay: 6888,
        paymentDate: "",
        status: "draft"
      }
    ];
    localStorage.setItem("payrollData", JSON.stringify(defaultPayrollData));
  }

  if (!localStorage.getItem("activityLogs")) {
    const defaultActivityLogs: ActivityLog[] = [];
    localStorage.setItem("activityLogs", JSON.stringify(defaultActivityLogs));
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
