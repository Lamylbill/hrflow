
import React, { useState, useEffect } from "react";
import { PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Employee } from "@/types/employee";
import EmployeeCard from "@/components/EmployeeCard";
import { toast } from "@/hooks/use-toast";

interface EmployeeListProps {
  employees: Employee[];
  onAddEmployee: () => void;
  onDeleteEmployee: (id: string) => void;
  onEditEmployee: (id: string) => void;
  onViewDetails: (id: string) => void;
  isLoading: boolean;
}

const EmployeeList = ({
  employees,
  onAddEmployee,
  onDeleteEmployee,
  onEditEmployee,
  onViewDetails,
  isLoading
}: EmployeeListProps) => {
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(employees);
  const [searchQuery, setSearchQuery] = useState("");

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-10 w-10 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
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
        </div>
      </div>

      {filteredEmployees.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">No employees found</p>
          <Button onClick={onAddEmployee}>
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
              onDelete={onDeleteEmployee}
              onEdit={onEditEmployee}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default EmployeeList;
