
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

const Employees = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [isMassUploading, setIsMassUploading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      console.log("Employees page: Fetching employee data");
      const data = await getEmployees();
      console.log("Employees page: Employee data fetched", data);
      
      if (Array.isArray(data)) {
        setEmployees(data);
      } else {
        console.error("Invalid employee data format:", data);
        toast({
          title: "Data Error",
          description: "Received invalid employee data format. Try refreshing the page.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast({
        title: "Error",
        description: "Failed to load employees. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEmployee = async (employee: Omit<Employee, "id">) => {
    try {
      await addEmployee(employee);
      await fetchEmployees();
      
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
      await deleteEmployee(id);
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
    const employee = employees.find(e => e.id === id);
    if (employee) {
      setSelectedEmployee(employee);
      setIsEditing(true);
    }
  };

  const handleEmployeeUpdate = async (updatedEmployee: Employee) => {
    try {
      await updateEmployee(updatedEmployee);
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
