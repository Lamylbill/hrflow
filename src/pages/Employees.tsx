import { useState } from "react";
import NavbarLoggedIn from "@/components/NavbarLoggedIn";
import Footer from "@/components/Footer";
import EmployeeCard from "@/components/EmployeeCard";
import GlassCard from "@/components/GlassCard";
import AnimatedButton from "@/components/AnimatedButton";
import { Search, Plus, Filter, ArrowUpDown } from "lucide-react";

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [sortBy, setSortBy] = useState("name");

  // Mock employee data
  const employees = [
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

            <AnimatedButton className="mt-4 md:mt-0 flex items-center">
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
                  <EmployeeCard employee={employee} />
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
          
          {/* Pagination */}
          {filteredEmployees.length > 0 && (
            <div className="mt-8 flex justify-center">
              <div className="flex space-x-1">
                <button className="px-3 py-1 rounded-md text-sm border border-border hover:bg-secondary transition-colors">
                  Previous
                </button>
                {[1, 2, 3].map((page) => (
                  <button
                    key={page}
                    className={`px-3 py-1 rounded-md text-sm ${
                      page === 1
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary transition-colors"
                    }`}
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
    </div>
  );
};

export default Employees;
