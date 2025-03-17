
import { useState, useEffect } from "react";
import NavbarLoggedIn from "@/components/NavbarLoggedIn";
import Footer from "@/components/Footer";
import GlassCard from "@/components/GlassCard";
import AnimatedButton from "@/components/AnimatedButton";
import { Download, Plus, Filter, Search } from "lucide-react";
import PayrollTable from "@/components/payroll/PayrollTable";
import PayrollStats from "@/components/payroll/PayrollStats";
import { PayrollData } from "@/types/payroll";
import { Employee } from "@/types/employee";
import { getPayrollData, processPayroll, getEmployees } from "@/utils/localStorage";
import { toast } from "@/hooks/use-toast";

const Payroll = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMonth, setFilterMonth] = useState("Current Month");
  const [payrollData, setPayrollData] = useState<PayrollData[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [pendingPayrollCount, setPendingPayrollCount] = useState(0);

  useEffect(() => {
    // Load payroll data from localStorage
    loadPayrollData();
  }, []);

  const loadPayrollData = async () => {
    try {
      // Load both payroll data and employees to properly calculate actual salaries
      const [payrollItems, employeesList] = await Promise.all([
        getPayrollData(),
        getEmployees()
      ]);
      
      setEmployees(employeesList);
      
      // Update payroll data with correct salary information
      const updatedPayrollData = payrollItems.map(payroll => {
        const employee = employeesList.find(emp => emp.id === payroll.employeeId);
        
        if (employee && employee.salary) {
          // Calculate monthly salary based on pay frequency
          let monthlySalary = 0;
          
          if (employee.payFrequency === 'Monthly') {
            monthlySalary = employee.salary / 12; // Annual to monthly
          } else if (employee.payFrequency === 'Bi-Weekly') {
            monthlySalary = (employee.salary / 26) * 2; // Bi-weekly to monthly equivalent
          } else if (employee.payFrequency === 'Weekly') {
            monthlySalary = (employee.salary / 52) * 4.33; // Weekly to monthly equivalent
          } else {
            monthlySalary = employee.salary / 12; // Default to monthly
          }
            
          // Calculate actual values
          const bonus = payroll.bonus || 0;
          const deductions = payroll.deductions || 0;
          const netPay = monthlySalary + bonus - deductions;
          
          return {
            ...payroll,
            salary: employee.salary,
            netPay: netPay,
            amount: netPay
          };
        }
        
        return payroll;
      });
      
      setPayrollData(updatedPayrollData);
      console.log("Updated payroll data:", updatedPayrollData);
      
      // Count pending and processing items
      const pendingCount = updatedPayrollData.filter(p => p.status === "pending" || p.status === "processing").length;
      setPendingPayrollCount(pendingCount);
    } catch (error) {
      console.error("Error loading payroll data:", error);
      toast({
        title: "Error Loading Data",
        description: "Failed to load payroll data. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter payroll data by search term
  const filteredPayrollData = payrollData.filter((payroll) =>
    payroll.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payroll.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payroll.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRunPayroll = async () => {
    // Get all pending and processing payroll items
    const pendingProcessingIds = payrollData
      .filter(p => p.status === "pending" || p.status === "processing")
      .map(p => p.id);
    
    if (pendingProcessingIds.length === 0) {
      toast({
        title: "No Payroll to Process",
        description: "There are no pending or processing payroll items to run",
        variant: "destructive",
      });
      return;
    }
    
    // Process the payroll
    try {
      const processed = await processPayroll(pendingProcessingIds);
      
      if (processed.length > 0) {
        toast({
          title: "Payroll Processed",
          description: `Successfully processed ${processed.length} payroll items`,
        });
        
        // Refresh the data
        loadPayrollData();
      }
    } catch (error) {
      console.error("Error processing payroll:", error);
      toast({
        title: "Error Processing Payroll",
        description: "An error occurred while processing the payroll",
        variant: "destructive",
      });
    }
  };
  
  // Function to export payroll data as CSV
  const handleExportPayroll = () => {
    try {
      // Create CSV content
      let csvContent = "Employee Name,Position,Salary,Bonus,Deductions,Net Pay,Status,Payment Date\n";
      
      payrollData.forEach((item) => {
        // Format date properly if it exists
        const paymentDate = item.paymentDate ? new Date(item.paymentDate).toISOString().split('T')[0] : "Pending";
        
        // Escape fields that might contain commas
        const escapedName = `"${item.employeeName.replace(/"/g, '""')}"`;
        const escapedPosition = `"${item.position.replace(/"/g, '""')}"`;
        
        csvContent += `${escapedName},${escapedPosition},${item.salary},${item.bonus},${item.deductions},${item.netPay},${item.status},${paymentDate}\n`;
      });
      
      // Create blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `payroll_data_${new Date().toISOString().split('T')[0]}.csv`);
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Successful",
        description: "Payroll data has been exported to CSV",
      });
    } catch (error) {
      console.error("Error exporting payroll data:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the payroll data",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavbarLoggedIn />

      <main className="flex-grow pt-24 pb-12 page-transition">
        <div className="hr-container">
          {/* Page header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Payroll Management</h1>
              <p className="text-muted-foreground mt-1">
                Process employee salaries and manage payment records
              </p>
            </div>

            <div className="flex gap-2 mt-4 md:mt-0">
              <AnimatedButton 
                variant="outline" 
                className="flex items-center"
                onClick={handleExportPayroll}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </AnimatedButton>
              <AnimatedButton 
                className="flex items-center"
                onClick={handleRunPayroll}
              >
                <Plus className="h-4 w-4 mr-2" />
                Run Payroll
              </AnimatedButton>
            </div>
          </div>

          {/* Payroll stats */}
          <PayrollStats payrollData={payrollData} />

          {/* Filters */}
          <GlassCard className="mb-6 animate-slide-up" style={{ animationDelay: "0.15s" }}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by employee name or ID..."
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
                    value={filterMonth}
                    onChange={(e) => setFilterMonth(e.target.value)}
                  >
                    <option value="Current Month">Current Month</option>
                    <option value="Previous Month">Previous Month</option>
                    <option value="Last Quarter">Last Quarter</option>
                    <option value="Year to Date">Year to Date</option>
                  </select>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Payroll table */}
          <PayrollTable 
            payrollData={filteredPayrollData} 
            onPayrollUpdate={loadPayrollData}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Payroll;
