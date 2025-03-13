
import { useState, useEffect } from "react";
import { PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Employee } from "@/types/employee";
import NavbarLoggedIn from "@/components/NavbarLoggedIn";
import { AddEmployeeDialog } from "@/components/employee/AddEmployeeDialog";
import EmployeeCard from "@/components/EmployeeCard";
import { getEmployees } from "@/utils/localStorage";
import { addEmployee, deleteEmployee, updateEmployee } from "@/utils/localStorage";
import { toast } from "@/hooks/use-toast";

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);

  // Fetch employees on mount
  useEffect(() => {
    const fetchEmployees = async () => {
      const data = await getEmployees();
      setEmployees(data);
      setFilteredEmployees(data);
    };
    
    fetchEmployees();
  }, []);

  // Filter employees when search query changes
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
      const newEmployee = await addEmployee(employee);
      const updatedEmployees = await getEmployees();
      setEmployees(updatedEmployees);
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
      await deleteEmployee(id);
      const updatedEmployees = await getEmployees();
      setEmployees(updatedEmployees);
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

  return (
    <div className="min-h-screen bg-background">
      <NavbarLoggedIn />
      <main className="container max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Employees</h1>
            <p className="text-muted-foreground">
              Manage your company's employees
            </p>
          </div>
          <div className="flex space-x-2">
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
            <AddEmployeeDialog onEmployeeAdd={handleAddEmployee} />
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
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Employees;
