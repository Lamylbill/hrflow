import { useState } from "react";
import NavbarLoggedIn from "@/components/NavbarLoggedIn";
import Footer from "@/components/Footer";
import GlassCard from "@/components/GlassCard";
import AnimatedButton from "@/components/AnimatedButton";
import { Download, Plus, Filter, Search } from "lucide-react";
import PayrollTable from "@/components/payroll/PayrollTable";
import PayrollStats from "@/components/payroll/PayrollStats";
import { PayrollData } from "@/types/payroll";

const Payroll = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMonth, setFilterMonth] = useState("Current Month");

  // Mock payroll data
  const payrollData: PayrollData[] = [
    {
      id: "1",
      employeeName: "John Smith",
      employeeId: "EMP001",
      position: "Senior Developer",
      salary: 85000,
      bonus: 2000,
      deductions: 1200,
      netPay: 7025,
      paymentDate: "2023-06-30",
      status: "paid"
    },
    {
      id: "2",
      employeeName: "Emily Johnson",
      employeeId: "EMP002",
      position: "Product Manager",
      salary: 92000,
      bonus: 3000,
      deductions: 1500,
      netPay: 7792,
      paymentDate: "2023-06-30",
      status: "paid"
    },
    {
      id: "3",
      employeeName: "Michael Brown",
      employeeId: "EMP003",
      position: "UI Designer",
      salary: 72000,
      bonus: 0,
      deductions: 950,
      netPay: 5925,
      paymentDate: "2023-06-30",
      status: "paid"
    },
    {
      id: "4",
      employeeName: "Jessica Williams",
      employeeId: "EMP004",
      position: "Marketing Specialist",
      salary: 65000,
      bonus: 1500,
      deductions: 850,
      netPay: 5429,
      paymentDate: "2023-06-30",
      status: "paid"
    },
    {
      id: "5",
      employeeName: "Robert Jones",
      employeeId: "EMP005",
      position: "Sales Representative",
      salary: 68000,
      bonus: 5000,
      deductions: 980,
      netPay: 6002,
      paymentDate: "2023-06-30",
      status: "paid"
    },
    {
      id: "6",
      employeeName: "Sarah Miller",
      employeeId: "EMP006",
      position: "HR Coordinator",
      salary: 62000,
      bonus: 1000,
      deductions: 820,
      netPay: 5182,
      paymentDate: "2023-06-30",
      status: "pending"
    },
    {
      id: "7",
      employeeName: "David Davis",
      employeeId: "EMP007",
      position: "Frontend Developer",
      salary: 78000,
      bonus: 1500,
      deductions: 1050,
      netPay: 6538,
      paymentDate: "",
      status: "processing"
    },
    {
      id: "8",
      employeeName: "Jennifer Garcia",
      employeeId: "EMP008",
      position: "Content Writer",
      salary: 60000,
      bonus: 800,
      deductions: 750,
      netPay: 5004,
      paymentDate: "",
      status: "processing"
    },
    {
      id: "9",
      employeeName: "Thomas Wilson",
      employeeId: "EMP009",
      position: "Backend Developer",
      salary: 82000,
      bonus: 1800,
      deductions: 1150,
      netPay: 6888,
      paymentDate: "",
      status: "draft"
    }
  ];

  // Filter payroll data by search term
  const filteredPayrollData = payrollData.filter((payroll) =>
    payroll.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payroll.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payroll.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <AnimatedButton className="flex items-center">
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
          <PayrollTable payrollData={filteredPayrollData} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Payroll;
