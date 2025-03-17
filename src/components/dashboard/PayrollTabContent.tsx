
import { useEffect, useState } from "react";
import { DollarSign, CreditCard, Calendar, Download, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PayrollData, PayrollStatus } from "@/types/payroll";
import { getPayrollData, getEmployees } from "@/utils/localStorage";
import { formatCurrency } from "@/utils/formatters";
import { Employee } from "@/types/employee";

const PayrollTabContent = () => {
  const [payrollData, setPayrollData] = useState<PayrollData[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load payroll data and employees
    const loadData = async () => {
      try {
        const [payrollItems, employeeItems] = await Promise.all([
          getPayrollData(),
          getEmployees()
        ]);
        
        setEmployees(employeeItems);
        
        // Map payroll data with actual employee salaries where applicable
        const updatedPayrollData = payrollItems.map(payroll => {
          const employee = employeeItems.find(emp => emp.id === payroll.employeeId);
          
          let monthlySalary = 0;
          if (employee?.salary) {
            // If salary is defined for employee
            monthlySalary = employee.payFrequency === 'Bi-Weekly' || employee.payFrequency === 'Weekly' ? 
              employee.salary : employee.salary / 12;
              
            console.log(`Employee ${employee.name} has salary: ${employee.salary}, monthly: ${monthlySalary}`);
          }
          
          // Calculate updated values
          const bonus = payroll.bonus || 0;
          const deductions = payroll.deductions || 0;
          const netPay = monthlySalary + bonus - deductions;
          
          return {
            ...payroll,
            salary: employee?.salary || payroll.salary || 0,
            netPay: netPay || payroll.netPay,
            amount: netPay || payroll.amount || payroll.netPay
          };
        });
        
        setPayrollData(updatedPayrollData);
        console.log("Dashboard updated payroll data:", updatedPayrollData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Count by status
  const pendingCount = payrollData.filter(item => item.status === "pending").length;
  const processingCount = payrollData.filter(item => item.status === "processing").length;
  const paidCount = payrollData.filter(item => item.status === "paid").length;

  // Calculate totals
  const totalPending = payrollData
    .filter(item => item.status === "pending")
    .reduce((sum, item) => sum + (item.amount || item.netPay), 0);

  const totalPaid = payrollData
    .filter(item => item.status === "paid")
    .reduce((sum, item) => sum + (item.amount || item.netPay), 0);

  // Get current month data
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const currentMonthPayroll = payrollData.filter(item => {
    const paymentDate = item.paymentDate ? new Date(item.paymentDate) : null;
    return paymentDate && paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
  });

  const getStatusIcon = (status: PayrollStatus) => {
    switch (status) {
      case "paid": return <DollarSign className="h-5 w-5 text-green-500" />;
      case "processing": return <CreditCard className="h-5 w-5 text-blue-500" />;
      case "pending": default: return <Calendar className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow-sm">
      {isLoading ? (
        <div className="text-center py-8">Loading payroll data...</div>
      ) : payrollData.length === 0 ? (
        <div className="text-center py-8">
          <DollarSign className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No payroll data yet</h3>
          <p className="text-gray-500 mb-4">Add employees and process payroll to get started</p>
          <Button className="mx-auto">Process Payroll</Button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Payroll Management</h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button>
                <DollarSign className="mr-2 h-4 w-4" />
                Process Payroll
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-sm text-yellow-700 font-medium">Pending</p>
              <p className="text-3xl font-bold mt-2">{pendingCount}</p>
              <p className="text-sm text-yellow-600 mt-1">{formatCurrency(totalPending)}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-700 font-medium">Processing</p>
              <p className="text-3xl font-bold mt-2">{processingCount}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-700 font-medium">Paid</p>
              <p className="text-3xl font-bold mt-2">{paidCount}</p>
              <p className="text-sm text-green-600 mt-1">{formatCurrency(totalPaid)}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-purple-700 font-medium">This Month</p>
              <p className="text-3xl font-bold mt-2">{currentMonthPayroll.length}</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Recent Payroll</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payrollData.slice(0, 5).map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.employeeName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.period || `${new Date().getMonth() + 1}/${new Date().getFullYear()}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(Number(item.amount || item.netPay))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(item.status)}
                          <span className="ml-1 text-sm capitalize">{item.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.paymentDate ? new Date(item.paymentDate).toLocaleDateString() : 'Pending'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {payrollData.length > 5 && (
                <div className="px-6 py-3 bg-gray-50 text-center">
                  <Button variant="link" size="sm">View all payroll data</Button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Payroll Analysis</h3>
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <BarChart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Payroll analysis charts coming soon</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PayrollTabContent;
