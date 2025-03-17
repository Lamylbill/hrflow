
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Employee } from "@/types/employee";
import NavbarLoggedIn from "@/components/NavbarLoggedIn";
import AddEmployeeDialog from "@/components/employee/AddEmployeeDialog";
import EmployeeDetailsDialog from "@/components/employee/EmployeeDetailsDialog";
import EditEmployeeDialog from "@/components/employee/EditEmployeeDialog";
import MassUploadDialog from "@/components/employee/MassUploadDialog";
import EmployeeList from "@/components/employee/EmployeeList";
import EmployeeActions from "@/components/employee/EmployeeActions";
import { getEmployees, addEmployee, deleteEmployee, updateEmployee } from "@/utils/localStorage";
import { EventTypes, emitEvent } from "@/utils/eventBus";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Employees = () => {
  const navigate = useNavigate();
  const { userId, isAuthenticated } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [isMassUploading, setIsMassUploading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && userId) {
      fetchEmployees();

      // Subscribe to realtime updates for this user's employees - this addresses the cross-browser sync issue
      const channel = supabase
        .channel('employee-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'employees',
            filter: `user_id=eq.${userId}`
          },
          (payload) => {
            console.log('Realtime update received:', payload);
            fetchEmployees(); // Refresh employees when data changes
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [userId, isAuthenticated]);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      console.log("Employees page: Fetching employee data");
      
      // Try to get employees from Supabase first
      if (userId) {
        const { data: supabaseEmployees, error } = await supabase
          .from('employees')
          .select('*')
          .eq('user_id', userId);
        
        if (error) {
          console.error("Error fetching employees from Supabase:", error);
          // Fall back to localStorage if Supabase fails
          const localData = await getEmployees();
          setEmployees(localData);
        } else if (supabaseEmployees && supabaseEmployees.length > 0) {
          console.log("Employees page: Supabase employee data fetched", supabaseEmployees);
          
          // Map Supabase data to our Employee type
          const formattedEmployees: Employee[] = supabaseEmployees.map(emp => ({
            id: emp.id,
            name: `${emp.first_name} ${emp.last_name}`,
            position: emp.position,
            department: emp.department,
            email: emp.email,
            phone: emp.phone || '',
            gender: emp.gender || '',
            dateOfBirth: emp.date_of_birth || '',
            nationality: emp.nationality || '',
            address: emp.address || '',
            employeeId: emp.employee_id || '',
            // Fix type issue - cast to the proper enumerated type
            employmentType: (emp.employment_type as 'Full-time' | 'Part-time' | 'Contract') || 'Full-time',
            hireDate: emp.hire_date || new Date().toISOString().split('T')[0],
            workLocation: emp.work_location || '',
            managerName: emp.manager_name || '',
            // Fix type issue - cast to the proper enumerated type
            status: (emp.status as 'Active' | 'On Leave' | 'Terminated') || 'Active',
            // Fix type issue - cast to the proper enumerated type
            payFrequency: (emp.pay_frequency as 'Monthly' | 'Bi-Weekly' | 'Weekly') || 'Monthly',
            emergencyContactName: emp.emergency_contact_name || '',
            emergencyContactPhone: emp.emergency_contact_phone || '',
            emergencyContactRelationship: emp.emergency_contact_relationship || '',
            emergencyContactEmail: emp.emergency_contact_email || '',
            salary: emp.salary || 0,
            overtimeEligible: emp.overtime_eligible || false,
            bonusEligible: emp.bonus_eligible || false,
            taxId: emp.tax_id || '',
            bankAccountDetails: emp.bank_account_details || '',
            secondaryEmergencyContact: emp.secondary_emergency_contact || '',
            healthInsurance: emp.health_insurance || '',
            dentalVisionCoverage: emp.dental_vision_coverage || '',
            retirementPlan: emp.retirement_plan || '',
            // Fix type issue - cast to the proper enumerated type
            workSchedule: (emp.work_schedule as 'Fixed' | 'Flexible' | 'Remote') || 'Fixed',
            user_id: emp.user_id
          }));
          
          setEmployees(formattedEmployees);
        } else {
          // No data in Supabase, try localStorage
          const localData = await getEmployees();
          setEmployees(localData);
          
          // If we have local data but no Supabase data, try to sync it
          if (localData && localData.length > 0) {
            syncLocalEmployeesToSupabase(localData);
          }
        }
      } else {
        // No user ID, just use localStorage
        const localData = await getEmployees();
        setEmployees(localData);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast({
        title: "Data Error",
        description: "Failed to load employees. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to sync local employees to Supabase
  const syncLocalEmployeesToSupabase = async (localEmployees: Employee[]) => {
    if (!userId || !localEmployees || localEmployees.length === 0) return;
    
    try {
      console.log("Syncing local employees to Supabase");
      
      for (const emp of localEmployees) {
        const nameParts = emp.name.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ');
        
        // Check if this employee already exists in Supabase
        const { data: existingEmp, error: checkError } = await supabase
          .from('employees')
          .select('id')
          .eq('email', emp.email)
          .eq('user_id', userId);
          
        if (checkError) {
          console.error("Error checking for existing employee:", checkError);
          continue;
        }
        
        if (existingEmp && existingEmp.length > 0) {
          console.log(`Employee ${emp.email} already exists in Supabase, skipping`);
          continue;
        }
        
        // Insert the employee into Supabase
        const { error: insertError } = await supabase
          .from('employees')
          .insert({
            first_name: firstName,
            last_name: lastName,
            email: emp.email,
            position: emp.position,
            department: emp.department,
            phone: emp.phone,
            gender: emp.gender,
            date_of_birth: emp.dateOfBirth || null,
            nationality: emp.nationality,
            address: emp.address,
            employee_id: emp.employeeId,
            employment_type: emp.employmentType,
            hire_date: emp.hireDate || new Date().toISOString().split('T')[0], // Required field
            work_location: emp.workLocation,
            manager_name: emp.managerName,
            status: emp.status,
            pay_frequency: emp.payFrequency,
            emergency_contact_name: emp.emergencyContactName,
            emergency_contact_phone: emp.emergencyContactPhone,
            emergency_contact_relationship: emp.emergencyContactRelationship,
            emergency_contact_email: emp.emergencyContactEmail,
            salary: emp.salary,
            overtime_eligible: emp.overtimeEligible,
            bonus_eligible: emp.bonusEligible,
            tax_id: emp.taxId,
            bank_account_details: emp.bankAccountDetails,
            secondary_emergency_contact: emp.secondaryEmergencyContact,
            health_insurance: emp.healthInsurance,
            dental_vision_coverage: emp.dentalVisionCoverage,
            retirement_plan: emp.retirementPlan,
            work_schedule: emp.workSchedule,
            user_id: userId
          });
          
        if (insertError) {
          console.error(`Error syncing employee ${emp.email} to Supabase:`, insertError);
        } else {
          console.log(`Successfully synced employee ${emp.email} to Supabase`);
        }
      }
    } catch (error) {
      console.error("Error during employee sync:", error);
    }
  };

  const handleAddEmployee = async (employee: Omit<Employee, "id">) => {
    try {
      // Add employee to localStorage and get new employee with ID
      const newEmployee = await addEmployee(employee);
      
      // If we have a userId, also save to Supabase
      if (userId) {
        const nameParts = employee.name.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ');
        
        // Insert the employee into Supabase
        const { error: insertError } = await supabase
          .from('employees')
          .insert({
            id: newEmployee.id, // Use the same ID as in localStorage
            first_name: firstName,
            last_name: lastName,
            email: employee.email,
            position: employee.position,
            department: employee.department,
            phone: employee.phone,
            gender: employee.gender,
            date_of_birth: employee.dateOfBirth || null,
            nationality: employee.nationality,
            address: employee.address,
            employee_id: employee.employeeId,
            employment_type: employee.employmentType,
            hire_date: employee.hireDate || new Date().toISOString().split('T')[0],
            work_location: employee.workLocation,
            manager_name: employee.managerName,
            status: employee.status,
            pay_frequency: employee.payFrequency,
            emergency_contact_name: employee.emergencyContactName,
            emergency_contact_phone: employee.emergencyContactPhone,
            emergency_contact_relationship: employee.emergencyContactRelationship,
            emergency_contact_email: employee.emergencyContactEmail,
            salary: employee.salary,
            overtime_eligible: employee.overtimeEligible,
            bonus_eligible: employee.bonusEligible,
            tax_id: employee.taxId,
            bank_account_details: employee.bankAccountDetails,
            secondary_emergency_contact: employee.secondaryEmergencyContact,
            health_insurance: employee.healthInsurance,
            dental_vision_coverage: employee.dentalVisionCoverage,
            retirement_plan: employee.retirementPlan,
            work_schedule: employee.workSchedule,
            user_id: userId
          });
          
        if (insertError) {
          console.error("Error adding employee to Supabase:", insertError);
          // Still continue since we have it in localStorage
        }
      }
      
      await fetchEmployees(); // Refresh the list from the appropriate source
      
      emitEvent(EventTypes.EMPLOYEE_DATA_CHANGED, { action: 'add', employeeName: employee.name });
      
      toast({
        title: "Employee added",
        description: `${employee.name} has been added successfully.`,
      });
      setIsAddingEmployee(false);
    } catch (error) {
      console.error("Error adding employee:", error);
      toast({
        title: "Error",
        description: "Failed to add employee. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    try {
      const employeeToDelete = employees.find(e => e.id === id);
      
      // Delete from localStorage
      await deleteEmployee(id);
      
      // Also delete from Supabase if userId exists
      if (userId) {
        const { error } = await supabase
          .from('employees')
          .delete()
          .eq('id', id)
          .eq('user_id', userId);
          
        if (error) {
          console.error("Error deleting employee from Supabase:", error);
          // Still continue since we've deleted from localStorage
        }
      }
      
      await fetchEmployees();
      
      emitEvent(EventTypes.EMPLOYEE_DATA_CHANGED, { 
        action: 'delete', 
        employeeId: id,
        employeeName: employeeToDelete?.name 
      });
      
      toast({
        title: "Employee deleted",
        description: "Employee has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast({
        title: "Error",
        description: "Failed to delete employee. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (id: string) => {
    const employee = employees.find(e => e.id === id);
    if (employee) {
      setSelectedEmployee(employee);
      setIsViewingDetails(true);
    }
  };

  const handleEdit = (id: string) => {
    console.log("Editing employee with ID:", id);
    const employee = employees.find(e => e.id === id);
    if (employee) {
      setSelectedEmployee(employee);
      setIsEditing(true);
    } else {
      console.error("Employee not found with ID:", id);
    }
  };

  const handleEmployeeUpdate = async (updatedEmployee: Employee) => {
    try {
      console.log("Updating employee:", updatedEmployee);
      
      // Update in localStorage
      await updateEmployee(updatedEmployee);
      
      // If userId exists, also update in Supabase
      if (userId) {
        const nameParts = updatedEmployee.name.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ');
        
        const { error } = await supabase
          .from('employees')
          .update({
            first_name: firstName,
            last_name: lastName,
            email: updatedEmployee.email,
            position: updatedEmployee.position,
            department: updatedEmployee.department,
            phone: updatedEmployee.phone,
            gender: updatedEmployee.gender,
            date_of_birth: updatedEmployee.dateOfBirth || null,
            nationality: updatedEmployee.nationality,
            address: updatedEmployee.address,
            employee_id: updatedEmployee.employeeId,
            employment_type: updatedEmployee.employmentType,
            hire_date: updatedEmployee.hireDate,
            work_location: updatedEmployee.workLocation,
            manager_name: updatedEmployee.managerName,
            status: updatedEmployee.status,
            pay_frequency: updatedEmployee.payFrequency,
            emergency_contact_name: updatedEmployee.emergencyContactName,
            emergency_contact_phone: updatedEmployee.emergencyContactPhone,
            emergency_contact_relationship: updatedEmployee.emergencyContactRelationship,
            emergency_contact_email: updatedEmployee.emergencyContactEmail,
            salary: updatedEmployee.salary,
            overtime_eligible: updatedEmployee.overtimeEligible,
            bonus_eligible: updatedEmployee.bonusEligible,
            tax_id: updatedEmployee.taxId,
            bank_account_details: updatedEmployee.bankAccountDetails,
            secondary_emergency_contact: updatedEmployee.secondaryEmergencyContact,
            health_insurance: updatedEmployee.healthInsurance,
            dental_vision_coverage: updatedEmployee.dentalVisionCoverage,
            retirement_plan: updatedEmployee.retirementPlan,
            work_schedule: updatedEmployee.workSchedule,
            updated_at: new Date().toISOString()
          })
          .eq('id', updatedEmployee.id)
          .eq('user_id', userId);
          
        if (error) {
          console.error("Error updating employee in Supabase:", error);
          // Still continue since we've updated localStorage
        }
      }
      
      await fetchEmployees();
      
      emitEvent(EventTypes.EMPLOYEE_DATA_CHANGED, { 
        action: 'update', 
        employeeId: updatedEmployee.id,
        employeeName: updatedEmployee.name 
      });
      
      toast({
        title: "Employee updated",
        description: `${updatedEmployee.name}'s information has been updated.`,
      });
      setIsEditing(false);
      setSelectedEmployee(null);
    } catch (error) {
      console.error("Error updating employee:", error);
      toast({
        title: "Error",
        description: "Failed to update employee. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEmployeeAdded = async () => {
    await fetchEmployees();
    
    emitEvent(EventTypes.EMPLOYEE_DATA_CHANGED, { action: 'batch' });
    
    toast({
      title: "Success",
      description: "Employee(s) added successfully. Dashboard has been updated.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <NavbarLoggedIn />
      <main className="container max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 pt-24">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-end">
            <EmployeeActions 
              onAddEmployee={() => setIsAddingEmployee(true)}
              onMassUpload={() => setIsMassUploading(true)} 
            />
          </div>
          
          <EmployeeList 
            employees={employees}
            onAddEmployee={() => setIsAddingEmployee(true)}
            onDeleteEmployee={handleDeleteEmployee}
            onEditEmployee={handleEdit}
            onViewDetails={handleViewDetails}
            isLoading={isLoading}
          />
        </div>
      </main>
      
      <AddEmployeeDialog 
        open={isAddingEmployee}
        onClose={() => setIsAddingEmployee(false)}
        onEmployeeAdded={handleEmployeeAdded}
      />
      
      {selectedEmployee && (
        <>
          <EmployeeDetailsDialog
            open={isViewingDetails}
            onClose={() => {
              setIsViewingDetails(false);
              setSelectedEmployee(null);
            }}
            employee={selectedEmployee}
            onEdit={handleEdit}
            onDelete={handleDeleteEmployee}
          />
          
          <EditEmployeeDialog
            open={isEditing}
            onClose={() => {
              setIsEditing(false);
              setSelectedEmployee(null);
            }}
            employee={selectedEmployee}
            onEmployeeUpdated={handleEmployeeUpdate}
          />
        </>
      )}
      
      <MassUploadDialog
        open={isMassUploading}
        onClose={() => setIsMassUploading(false)}
        onEmployeesUploaded={handleEmployeeAdded}
      />
    </div>
  );
};

export default Employees;
