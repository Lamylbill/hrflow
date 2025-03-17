
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Download, Eye, CheckCircle, AlertTriangle } from "lucide-react";
import { PayrollData } from "@/types/payroll";
import { formatCurrency } from "@/utils/formatters";
import { updatePayrollStatus } from "@/utils/localStorage";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PayrollTableProps {
  payrollData: PayrollData[];
  onPayrollUpdate: () => void;
}

const PayrollTable = ({ payrollData, onPayrollUpdate }: PayrollTableProps) => {
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [payrollToMarkPaid, setPayrollToMarkPaid] = useState<PayrollData | null>(null);

  const handleMarkAsPaid = async (id: string) => {
    setProcessingId(id);
    try {
      const today = new Date().toISOString().split('T')[0];
      const result = await updatePayrollStatus(id, "paid", today);
      
      if (result) {
        toast({
          title: "Payroll Marked as Paid",
          description: `Successfully marked payroll for ${result.employeeName} as paid.`,
        });
        onPayrollUpdate();
      }
    } catch (error) {
      console.error("Error updating payroll status:", error);
      toast({
        title: "Error",
        description: "Failed to update payroll status",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleConfirmMarkAsPaid = (payroll: PayrollData) => {
    setPayrollToMarkPaid(payroll);
  };

  const handleConfirmedMarkAsPaid = () => {
    if (payrollToMarkPaid) {
      handleMarkAsPaid(payrollToMarkPaid.id);
      setPayrollToMarkPaid(null);
    }
  };

  const handleDownload = (id: string) => {
    // Placeholder for download logic
    console.log(`Download payroll data for ${id}`);
  };

  const handleViewDetails = (id: string) => {
    // Placeholder for view details logic
    console.log(`View details for ${id}`);
  };

  return (
    <div className="relative overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Employee</TableHead>
            <TableHead>Salary</TableHead>
            <TableHead>Bonus</TableHead>
            <TableHead>Deductions</TableHead>
            <TableHead>Net Pay</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payrollData.map((payroll) => (
            <TableRow key={payroll.id}>
              <TableCell className="font-medium">{payroll.employeeName}</TableCell>
              <TableCell>{formatCurrency(payroll.salary)}</TableCell>
              <TableCell>{formatCurrency(payroll.bonus)}</TableCell>
              <TableCell>{formatCurrency(payroll.deductions)}</TableCell>
              <TableCell>{formatCurrency(payroll.netPay)}</TableCell>
              <TableCell>
                {payroll.status === "paid" ? (
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                    Paid
                  </div>
                ) : payroll.status === "pending" || payroll.status === "processing" ? (
                  "Pending"
                ) : (
                  "Draft"
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewDetails(payroll.id)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownload(payroll.id)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    {(payroll.status === "pending" || payroll.status === "processing") && (
                      <DropdownMenuItem 
                        onClick={() => handleConfirmMarkAsPaid(payroll)} 
                        disabled={processingId === payroll.id}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark as Paid
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {payrollData.length === 0 && (
        <div className="text-center py-4">
          No payroll data found.
        </div>
      )}

      {/* Mark as Paid confirmation dialog */}
      <AlertDialog open={!!payrollToMarkPaid} onOpenChange={() => setPayrollToMarkPaid(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
              Confirm Payment Action
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark this payroll as paid? This action will register a payment for 
              {payrollToMarkPaid ? ` ${payrollToMarkPaid.employeeName}` : ''} with today's date.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmedMarkAsPaid}>
              Confirm Payment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PayrollTable;
