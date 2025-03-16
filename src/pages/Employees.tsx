import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Search, Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Employee } from "@/types/employee";
import NavbarLoggedIn from "@/components/NavbarLoggedIn";
import AddEmployeeDialog from "@/components/employee/AddEmployeeDialog";
import EmployeeCard from "@/components/EmployeeCard";
import EmployeeDetailsDialog from "@/components/employee/EmployeeDetailsDialog";
import EditEmployeeDialog from "@/components/employee/EditEmployeeDialog";
import MassUploadDialog from "@/components/employee/MassUploadDialog";
import { getEmployees, addEmployee, deleteEmployee, updateEmployee } from "@/utils/localStorage";
import { EventTypes, emitEvent } from "@/utils/eventBus";
import { toast } from "@/hooks/use-toast";

const Employees = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
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
        setFilteredEmployees(data);
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

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredEmployees(employees);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = employees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(query) ||
        employee.position.toLowerCase().includes(query) ||
        employee.department.toLowerCase().includes(query) ||
        employee.email.toLowerCase().includes(query)
    );

    setFilteredEmployees(filtered);
  }, [searchQuery, employees]);

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

  const downloadEmployeeTemplate = () => {
    const csvContent = `Name,Position,Department,Email,Phone,EmployeeID,HireDate,Gender,DateOfBirth,Nationality,Address,EmploymentType,WorkLocation,ManagerName,Status,Salary,PayFrequency,EmergencyContactName,EmergencyContactRelationship,EmergencyContactPhone,EmergencyContactEmail\nJohn Doe,Manager,Engineering,john.doe@example.com,+1-555-123-4567,EMP001,2023-01-15,Male,1980-05-10,American,123 Main St,Full-time,Headquarters,Jane Smith,Active,75000,Monthly,Mary Doe,Spouse,+1-555-987-6543,mary.doe@example.com\nJane Smith,Developer,Engineering,jane.smith@example.com,+1-555-987-6543,EMP002,2023-02-01,Female,1985-08-22,Canadian,456 Oak Ave,Full-time,Remote,John Doe,Active,65000,Monthly,Jack Smith,Spouse,+1-555-123-7890,jack.smith@example.com`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employee_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Template downloaded",
      description: "Employee template has been downloaded.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <NavbarLoggedIn />
      <main className="container max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 pt-24">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="h-10 w-10 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
              <div>
                <h1 className="text-2xl font-bold">Employees</h1>
                <p className="text-muted-foreground">
                  Manage your company's employees
                </p>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search employees..."
                    className="pl-8 w-full md:w-[300px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={downloadEmployeeTemplate}>
                    <Download className="mr-2 h-4 w-4" />
                    Template
                  </Button>
                  <Button variant="outline" onClick={() => setIsMassUploading(true)}>
                    <Upload className="mr-2 h-4 w-4" />
                    Mass Upload
                  </Button>
                  <Button onClick={() => setIsAddingEmployee(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Employee
                  </Button>
                </div>
              </div>
            </div>

            {filteredEmployees.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">No employees found</p>
                <Button onClick={() => setIsAddingEmployee(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add your first employee
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEmployees.map((employee) => (
                  <EmployeeCard
                    key={employee.id}
                    employee={employee}
                    onDelete={handleDeleteEmployee}
                    onEdit={handleEdit}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}
          </>
        )}
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
