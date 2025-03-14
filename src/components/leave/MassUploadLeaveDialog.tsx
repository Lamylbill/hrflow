
import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Download, X, FileText, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { LeaveRequest } from "@/types/leave";
import { addLeaveRequest } from "@/utils/localStorage";

interface MassUploadLeaveDialogProps {
  open: boolean;
  onClose: () => void;
  onLeaveUploaded: () => void;
}

export function MassUploadLeaveDialog({ 
  open, 
  onClose, 
  onLeaveUploaded 
}: MassUploadLeaveDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (selectedFile) {
      if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith('.csv')) {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV file.",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
      setUploadSuccess(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    const droppedFile = e.dataTransfer.files[0];
    
    if (droppedFile) {
      if (droppedFile.type !== "text/csv" && !droppedFile.name.endsWith('.csv')) {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV file.",
          variant: "destructive",
        });
        return;
      }
      
      setFile(droppedFile);
      setUploadSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      // Read the CSV file
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        const rows = text.split('\n');
        const headers = rows[0].split(',');
        
        // Map CSV indices to our fields
        const employeeNameIndex = headers.findIndex(h => h.toLowerCase().includes('employeename') || h.toLowerCase().includes('employee name'));
        const leaveTypeIndex = headers.findIndex(h => h.toLowerCase().includes('leavetype') || h.toLowerCase().includes('leave type') || h.toLowerCase().includes('type'));
        const startDateIndex = headers.findIndex(h => h.toLowerCase().includes('startdate') || h.toLowerCase().includes('start date'));
        const endDateIndex = headers.findIndex(h => h.toLowerCase().includes('enddate') || h.toLowerCase().includes('end date'));
        const reasonIndex = headers.findIndex(h => h.toLowerCase().includes('reason'));
        
        if (employeeNameIndex === -1 || leaveTypeIndex === -1 || startDateIndex === -1 || endDateIndex === -1) {
          throw new Error("CSV file is missing required columns: EmployeeName, LeaveType, StartDate, EndDate");
        }
        
        // Skip header row
        const leaveRequests: Omit<LeaveRequest, "id" | "status">[] = [];
        
        for (let i = 1; i < rows.length; i++) {
          if (!rows[i].trim()) continue; // Skip empty rows
          
          const values = rows[i].split(',');
          
          const leaveRequest = {
            employeeName: values[employeeNameIndex].trim(),
            type: values[leaveTypeIndex].trim(),
            startDate: values[startDateIndex].trim(),
            endDate: values[endDateIndex].trim(),
            reason: reasonIndex !== -1 ? values[reasonIndex]?.trim() : undefined,
          };
          
          // Skip if any required field is missing
          if (!leaveRequest.employeeName || !leaveRequest.type || !leaveRequest.startDate || !leaveRequest.endDate) {
            continue;
          }
          
          // Validate dates
          try {
            new Date(leaveRequest.startDate);
            new Date(leaveRequest.endDate);
          } catch (e) {
            continue; // Skip if dates are invalid
          }
          
          leaveRequests.push(leaveRequest);
        }
        
        // Add all leave requests
        for (const leave of leaveRequests) {
          await addLeaveRequest(leave);
        }
        
        toast({
          title: "Upload successful",
          description: `${leaveRequests.length} leave requests have been added.`,
        });
        
        setUploadSuccess(true);
        onLeaveUploaded();
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error("Error uploading leave requests:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload leave requests. Please check your file format.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadLeaveTemplate = () => {
    // Create a template CSV string
    const csvContent = `EmployeeName,LeaveType,StartDate,EndDate,Reason\nJohn Doe,Annual Leave,2023-06-01,2023-06-05,Family vacation\nJane Smith,Sick Leave,2023-06-10,2023-06-11,Doctor's appointment`;
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leave_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Template downloaded",
      description: "Leave request template has been downloaded.",
    });
  };

  const resetUpload = () => {
    setFile(null);
    setUploadSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Mass Upload Leave Requests</DialogTitle>
          <DialogDescription>
            Upload a CSV file with leave request information.
          </DialogDescription>
        </DialogHeader>
        
        {uploadSuccess ? (
          <div className="py-6 flex flex-col items-center text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">Upload Successful</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your leave requests have been successfully added to the system.
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={resetUpload}>
                Upload Another File
              </Button>
              <Button onClick={onClose}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div 
              className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".csv"
                className="hidden"
              />
              
              {file ? (
                <div className="flex flex-col items-center">
                  <FileText className="h-10 w-10 text-primary mb-3" />
                  <p className="text-sm font-medium mb-1">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      resetUpload();
                    }}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-sm font-medium mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    CSV files only, max 5MB
                  </p>
                </div>
              )}
            </div>
            
            <div className="text-sm space-y-2">
              <p className="font-medium">The CSV file should contain the following columns:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground text-xs">
                <li>EmployeeName (required)</li>
                <li>LeaveType (required)</li>
                <li>StartDate (required, YYYY-MM-DD format)</li>
                <li>EndDate (required, YYYY-MM-DD format)</li>
                <li>Reason (optional)</li>
              </ul>
              <div className="flex justify-center mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={(e) => {
                    e.preventDefault();
                    downloadLeaveTemplate();
                  }}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download Template
                </Button>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpload} 
                disabled={!file || isUploading}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
