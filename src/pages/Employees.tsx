
import { useState, useEffect } from "react";
import NavbarLoggedIn from "@/components/NavbarLoggedIn";
import Footer from "@/components/Footer";
import EmployeeCard from "@/components/EmployeeCard";
import GlassCard from "@/components/GlassCard";
import AnimatedButton from "@/components/AnimatedButton";
import { Search, Plus, Filter, ArrowUpDown } from "lucide-react";
import { getEmployees, deleteEmployee } from "@/utils/localStorage";
import { Employee } from "@/types/employee";
import { toast } from "@/hooks/use-toast";
import AddEmployeeDialog from "@/components/employee/AddEmployeeDialog";

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    // Load employees from localStorage
    setEmployees(getEmployees());
  }, []);

  // Get unique departments
  const departments = ["All", ...new Set(employees.map((emp) => emp.department))];

  // Filter employees by search term and department
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      selectedDepartment === "All" || employee.department === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  // Sort employees
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "department") {
      return a.department.localeCompare(b.department);
    } else if (sortBy === "position") {
      return a.position.localeCompare(b.position);
    }
    return 0;
  });

  const handleDeleteEmployee = (id: string) => {
    const deletedSuccessfully = deleteEmployee(id);
    if (deletedSuccessfully) {
      setEmployees(getEmployees());
      toast({
        title: "Employee Deleted",
        description: "The employee has been removed successfully",
        variant: "default",
      });
    }
  };

  const handleEmployeeAdded = () => {
    setEmployees(getEmployees());
    setDialogOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavbarLoggedIn />

      <main className="flex-grow pt-24 pb-12 page-transition">
        <div className="hr-container">
          {/* Page header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Employees</h1>
              <p className="text-muted-foreground mt-1">
                Manage your team members and their information
              </p>
            </div>

            <AnimatedButton 
              className="mt-4 md:mt-0 flex items-center"
              onClick={() => setDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </AnimatedButton>
          </div>

          {/* Filters */}
          <GlassCard className="mb-6 animate-slide-up">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-4">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select
                    className="pl-9 pr-8 py-2 rounded-lg border border-border bg-transparent appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select
                    className="pl-9 pr-8 py-2 rounded-lg border border-border bg-transparent appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="name">Sort by Name</option>
                    <option value="department">Sort by Department</option>
                    <option value="position">Sort by Position</option>
                  </select>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Employee grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedEmployees.length > 0 ? (
              sortedEmployees.map((employee, index) => (
                <div 
                  key={employee.id} 
                  className="animate-slide-up" 
                  style={{ animationDelay: `${0.05 * index}s` }}
                >
                  <EmployeeCard 
                    employee={employee} 
                    onDelete={handleDeleteEmployee}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-muted-foreground">
                  No employees found matching your criteria
                </div>
                <button
                  className="mt-4 text-primary hover:underline"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedDepartment("All");
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
          
          {/* Pagination - simplified since we're using localStorage */}
          {filteredEmployees.length > 0 && (
            <div className="mt-8 flex justify-center">
              <div className="flex space-x-1">
                <button className="px-3 py-1 rounded-md text-sm border border-border hover:bg-secondary transition-colors">
                  Previous
                </button>
                {[1].map((page) => (
                  <button
                    key={page}
                    className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm"
                  >
                    {page}
                  </button>
                ))}
                <button className="px-3 py-1 rounded-md text-sm border border-border hover:bg-secondary transition-colors">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      
      {/* Add Employee Dialog */}
      <AddEmployeeDialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        onEmployeeAdded={handleEmployeeAdded}
      />
    </div>
  );
};

export default Employees;
