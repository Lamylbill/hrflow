
import { useState, useEffect } from "react";
import NavbarLoggedIn from "@/components/NavbarLoggedIn";
import Footer from "@/components/Footer";
import GlassCard from "@/components/GlassCard";
import AnimatedButton from "@/components/AnimatedButton";
import { Download, Plus, Filter, Search } from "lucide-react";
import PayrollTable from "@/components/payroll/PayrollTable";
import PayrollStats from "@/components/payroll/PayrollStats";
import { PayrollData } from "@/types/payroll";
import { getPayrollData, processPayroll } from "@/utils/localStorage";
import { toast } from "@/hooks/use-toast";

const Payroll = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMonth, setFilterMonth] = useState("Current Month");
  const [payrollData, setPayrollData] = useState<PayrollData[]>([]);

  useEffect(() => {
    // Load payroll data from localStorage
    loadPayrollData();
  }, []);

  const loadPayrollData = () => {
    setPayrollData(getPayrollData());
  };

  // Filter payroll data by search term
  const filteredPayrollData = payrollData.filter((payroll) =>
    payroll.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payroll.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payroll.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRunPayroll = () => {
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
    const processed = processPayroll(pendingProcessingIds);
    
    if (processed.length > 0) {
      toast({
        title: "Payroll Processed",
        description: `Successfully processed ${processed.length} payroll items`,
      });
      
      // Refresh the data
      loadPayrollData();
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
              <AnimatedButton variant="outline" className="flex items-center">
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
