
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PayrollData, PayrollStatus } from "@/types/payroll";
import { formatCurrency } from "@/utils/formatters";
import GlassCard from "@/components/GlassCard";
import { updatePayrollStatus } from "@/utils/localStorage";
import { toast } from "@/hooks/use-toast";

interface PayrollTableProps {
  payrollData: PayrollData[];
  onPayrollUpdate?: () => void;
}

const PayrollTable = ({ payrollData, onPayrollUpdate }: PayrollTableProps) => {
  const statusStyles: Record<PayrollStatus, string> = {
    paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    processing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    draft: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  };

  const statusLabels: Record<PayrollStatus, string> = {
    paid: "Paid",
    pending: "Pending",
    processing: "Processing",
    draft: "Draft",
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleViewPayroll = (payroll: PayrollData) => {
    toast({
      title: "Viewing Payroll",
      description: `Viewing details for ${payroll.employeeName}'s payroll`,
    });
  };

  const handleUpdateStatus = (id: string, status: PayrollStatus) => {
    const today = new Date().toISOString().split('T')[0];
    const updated = updatePayrollStatus(id, status, status === "paid" ? today : undefined);
    
    if (updated) {
      toast({
        title: "Payroll Updated",
        description: `Status updated to ${status} for ${updated.employeeName}`,
      });
      
      if (onPayrollUpdate) {
        onPayrollUpdate();
      }
    }
  };

  const getNextStatus = (currentStatus: PayrollStatus): PayrollStatus | null => {
    switch (currentStatus) {
      case "draft":
        return "processing";
      case "processing":
        return "pending";
      case "pending":
        return "paid";
      default:
        return null;
    }
  };

  return (
    <GlassCard className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">EMPLOYEE</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">POSITION</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">SALARY</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">BONUS</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">DEDUCTIONS</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">NET PAY</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground">STATUS</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground">PAYMENT DATE</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {payrollData.length > 0 ? (
              payrollData.map((payroll, index) => {
                const nextStatus = getNextStatus(payroll.status);
                
                return (
                  <tr 
                    key={payroll.id} 
                    className={`border-b border-border hover:bg-secondary/20 transition-colors ${
                      index % 2 === 0 ? "bg-secondary/5" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-sm">{payroll.employeeName}</p>
                        <p className="text-xs text-muted-foreground">{payroll.employeeId}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{payroll.position}</td>
                    <td className="px-4 py-3 text-sm text-right">{formatCurrency(payroll.salary / 12)}</td>
                    <td className="px-4 py-3 text-sm text-right">{formatCurrency(payroll.bonus)}</td>
                    <td className="px-4 py-3 text-sm text-right">{formatCurrency(payroll.deductions)}</td>
                    <td className="px-4 py-3 text-sm text-right font-medium">{formatCurrency(payroll.netPay)}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        className={cn(
                          "px-2 py-0.5 text-xs font-medium",
                          statusStyles[payroll.status]
                        )}
                      >
                        {statusLabels[payroll.status]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-center">{formatDate(payroll.paymentDate)}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center space-x-2">
                        <button 
                          className="text-xs text-primary hover:text-primary/80 font-medium"
                          onClick={() => handleViewPayroll(payroll)}
                        >
                          View
                        </button>
                        
                        {nextStatus && (
                          <button 
                            className="text-xs text-green-600 hover:text-green-700 font-medium"
                            onClick={() => handleUpdateStatus(payroll.id, nextStatus)}
                          >
                            {nextStatus === "paid" ? "Pay" : 
                             nextStatus === "pending" ? "Approve" : 
                             nextStatus === "processing" ? "Process" : "Move"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="px-4 py-6 text-center text-muted-foreground">
                  No payroll data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
};

export default PayrollTable;
