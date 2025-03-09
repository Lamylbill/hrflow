
import { CreditCard, Wallet, PiggyBank } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { PayrollData } from "@/types/payroll";
import { formatCurrency } from "@/utils/formatters";

interface PayrollStatsProps {
  payrollData: PayrollData[];
}

const PayrollStats = ({ payrollData }: PayrollStatsProps) => {
  // Calculate total payments
  const totalSalaries = payrollData.reduce((sum, item) => sum + item.salary / 12, 0);
  const totalBonuses = payrollData.reduce((sum, item) => sum + item.bonus, 0);
  const totalDeductions = payrollData.reduce((sum, item) => sum + item.deductions, 0);
  
  // Stats
  const payrollStats = [
    {
      title: "Monthly Salaries",
      amount: totalSalaries,
      icon: Wallet,
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    },
    {
      title: "Total Bonuses",
      amount: totalBonuses,
      icon: PiggyBank,
      color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    },
    {
      title: "Total Deductions",
      amount: totalDeductions,
      icon: CreditCard,
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {payrollStats.map((stat, index) => (
        <GlassCard 
          key={stat.title} 
          className="animate-slide-up" 
          style={{ animationDelay: `${0.05 * index}s` }}
        >
          <div className="flex items-center">
            <div
              className={`p-3 rounded-lg mr-4 ${stat.color}`}
            >
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <p className="text-2xl font-semibold">{formatCurrency(stat.amount)}</p>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
};

export default PayrollStats;
