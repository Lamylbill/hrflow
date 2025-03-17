import { useEffect, useState } from "react";
import { Users, UserPlus, Mail, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Employee } from "@/types/employee";
import { getEmployees } from "@/utils/localStorage";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const EmployeesTabContent = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userId } = useAuth();

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setIsLoading(true);
        
        // First try to get employees from Supabase
        if (userId) {
          const { data: supabaseEmployees, error } = await supabase
            .from('employees')
            .select('*')
            .eq('user_id', userId);
          
          if (error) {
            console.error("Error loading employees from Supabase:", error);
            // Fall back to localStorage if Supabase fails
            const localData = await getEmployees();
            setEmployees(localData);
          } else if (supabaseEmployees && supabaseEmployees.length > 0) {
            console.log("Loaded employees from Supabase:", supabaseEmployees.length);
            
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
              employmentType: (emp.employment_type as 'Full-time' | 'Part-time' | 'Contract') || 'Full-time',
              hireDate: emp.hire_date || new Date().toISOString().split('T')[0],
              workLocation: emp.work_location || '',
              managerName: emp.manager_name || '',
              status: (emp.status as 'Active' | 'On Leave' | 'Terminated') || 'Active',
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
              workSchedule: (emp.work_schedule as 'Fixed' | 'Flexible' | 'Remote') || 'Fixed',
              user_id: emp.user_id
            }));
            
            setEmployees(formattedEmployees);
          } else {
            // No data in Supabase, try localStorage
            const localData = await getEmployees();
            setEmployees(localData);
          }
        } else {
          // No user ID, just use localStorage
          const localData = await getEmployees();
          setEmployees(localData);
        }
      } catch (error) {
        console.error("Error loading employees:", error);
        toast({
          title: "Error loading data",
          description: "Could not load employee data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadEmployees();
    
    // Set up realtime subscription for live updates
    let channel: any;
    if (userId) {
      channel = supabase
        .channel('public:employees:user_id=eq.' + userId)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'employees',
            filter: `user_id=eq.${userId}`
          },
          (payload) => {
            console.log("EmployeeTabContent: Realtime update detected:", payload);
            loadEmployees(); // Reload employees when data changes
          }
        )
        .subscribe((status: string) => {
          console.log("EmployeeTabContent: Supabase realtime subscription status:", status);
        });
    }
    
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [userId]);

  const departmentCounts = employees.reduce((acc, employee) => {
    acc[employee.department] = (acc[employee.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const departments = Object.keys(departmentCounts).map(name => ({
    name,
    count: departmentCounts[name]
  }));

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow-sm">
      {isLoading ? (
        <div className="text-center py-8">Loading employee data...</div>
      ) : employees.length === 0 ? (
        <div className="text-center py-8">
          <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No employees yet</h3>
          <p className="text-gray-500 mb-4">Get started by adding your first employee</p>
          <Button className="mx-auto">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Employee Overview</h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Mail className="mr-2 h-4 w-4" />
                Email All
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-700 font-medium">Total Employees</p>
              <p className="text-3xl font-bold mt-2">{employees.length}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-700 font-medium">Departments</p>
              <p className="text-3xl font-bold mt-2">{departments.length}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-purple-700 font-medium">New This Month</p>
              <p className="text-3xl font-bold mt-2">0</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Recent Employees</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees.slice(0, 5).map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {employee.name.split(" ").map(n => n[0]).join("")}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.position}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {employee.department}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {employees.length > 5 && (
                <div className="px-6 py-3 bg-gray-50 text-center">
                  <Button variant="link" size="sm">View all employees</Button>
                </div>
              )}
            </div>
          </div>

          {departments.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Department Distribution</h3>
              <div className="space-y-3">
                {departments.map((dept) => (
                  <div key={dept.name} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{dept.name}</span>
                      <span>
                        {dept.count} employee{dept.count !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="relative pt-1">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                        <div
                          style={{
                            width: `${(dept.count / employees.length) * 100}%`
                          }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EmployeesTabContent;
