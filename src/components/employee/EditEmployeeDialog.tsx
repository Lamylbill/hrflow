import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, AlertCircle, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Employee } from "@/types/employee";
import { toast } from "@/hooks/use-toast";

interface EditEmployeeDialogProps {
  open: boolean;
  onClose: () => void;
  employee: Employee;
  onEmployeeUpdated: (employee: Employee) => void;
}

const MAX_IMAGE_SIZE_KB = 5120; // 5MB max file size for profile photos

const EditEmployeeDialog = ({ 
  open, 
  onClose, 
  employee,
  onEmployeeUpdated 
}: EditEmployeeDialogProps) => {
  // Basic info
  const [name, setName] = useState(employee.name);
  const [position, setPosition] = useState(employee.position);
  const [department, setDepartment] = useState(employee.department);
  const [email, setEmail] = useState(employee.email);
  const [phone, setPhone] = useState(employee.phone || "");
  const [imageUrl, setImageUrl] = useState(employee.imageUrl || "");

  // Personal info
  const [dateOfBirth, setDateOfBirth] = useState(employee.dateOfBirth || "");
  const [gender, setGender] = useState(employee.gender || "");
  const [nationality, setNationality] = useState(employee.nationality || "");
  const [address, setAddress] = useState(employee.address || "");

  // Employment details
  const [employeeId, setEmployeeId] = useState(employee.employeeId || "");
  const [employmentType, setEmploymentType] = useState(employee.employmentType || "Full-time");
  const [hireDate, setHireDate] = useState(employee.hireDate || "");
  const [workLocation, setWorkLocation] = useState(employee.workLocation || "");
  const [managerName, setManagerName] = useState(employee.managerName || "");
  const [status, setStatus] = useState(employee.status || "Active");

  // Compensation & payroll
  const [salary, setSalary] = useState(employee.salary?.toString() || "");
  const [payFrequency, setPayFrequency] = useState(employee.payFrequency || "Monthly");
  const [overtimeEligible, setOvertimeEligible] = useState(employee.overtimeEligible || false);
  const [bonusEligible, setBonusEligible] = useState(employee.bonusEligible || false);
  const [taxId, setTaxId] = useState(employee.taxId || "");
  const [bankAccountDetails, setBankAccountDetails] = useState(employee.bankAccountDetails || "");

  // Emergency contact
  const [emergencyContactName, setEmergencyContactName] = useState(employee.emergencyContactName || "");
  const [emergencyContactRelationship, setEmergencyContactRelationship] = useState(employee.emergencyContactRelationship || "");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(employee.emergencyContactPhone || "");
  const [emergencyContactEmail, setEmergencyContactEmail] = useState(employee.emergencyContactEmail || "");
  const [secondaryEmergencyContact, setSecondaryEmergencyContact] = useState(employee.secondaryEmergencyContact || "");

  // Other info
  const [healthInsurance, setHealthInsurance] = useState(employee.healthInsurance || "");
  const [dentalVisionCoverage, setDentalVisionCoverage] = useState(employee.dentalVisionCoverage || "");
  const [retirementPlan, setRetirementPlan] = useState(employee.retirementPlan || "");
  const [ptoBalance, setPtoBalance] = useState(employee.ptoBalance?.toString() || "");
  const [workSchedule, setWorkSchedule] = useState(employee.workSchedule || "Fixed");
  
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  // Create type-safe handler functions for select components
  const handleEmploymentTypeChange = (value: string) => {
    setEmploymentType(value as 'Full-time' | 'Part-time' | 'Contract');
  };

  const handleStatusChange = (value: string) => {
    setStatus(value as 'Active' | 'On Leave' | 'Terminated');
  };

  const handlePayFrequencyChange = (value: string) => {
    setPayFrequency(value as 'Monthly' | 'Bi-Weekly' | 'Weekly');
  };

  const handleWorkScheduleChange = (value: string) => {
    setWorkSchedule(value as 'Fixed' | 'Flexible' | 'Remote');
  };

  // Reset form when employee changes
  useEffect(() => {
    // Basic info
    setName(employee.name);
    setPosition(employee.position);
    setDepartment(employee.department);
    setEmail(employee.email);
    setPhone(employee.phone || "");
    setImageUrl(employee.imageUrl || "");
    
    // Personal info
    setDateOfBirth(employee.dateOfBirth || "");
    setGender(employee.gender || "");
    setNationality(employee.nationality || "");
    setAddress(employee.address || "");
    
    // Employment details
    setEmployeeId(employee.employeeId || "");
    setEmploymentType(employee.employmentType || "Full-time");
    setHireDate(employee.hireDate || "");
    setWorkLocation(employee.workLocation || "");
    setManagerName(employee.managerName || "");
    setStatus(employee.status || "Active");
    
    // Compensation & payroll
    setSalary(employee.salary?.toString() || "");
    setPayFrequency(employee.payFrequency || "Monthly");
    setOvertimeEligible(employee.overtimeEligible || false);
    setBonusEligible(employee.bonusEligible || false);
    setTaxId(employee.taxId || "");
    setBankAccountDetails(employee.bankAccountDetails || "");
    
    // Emergency contact
    setEmergencyContactName(employee.emergencyContactName || "");
    setEmergencyContactRelationship(employee.emergencyContactRelationship || "");
    setEmergencyContactPhone(employee.emergencyContactPhone || "");
    setEmergencyContactEmail(employee.emergencyContactEmail || "");
    setSecondaryEmergencyContact(employee.secondaryEmergencyContact || "");
    
    // Other info
    setHealthInsurance(employee.healthInsurance || "");
    setDentalVisionCoverage(employee.dentalVisionCoverage || "");
    setRetirementPlan(employee.retirementPlan || "");
    setPtoBalance(employee.ptoBalance?.toString() || "");
    setWorkSchedule(employee.workSchedule || "Fixed");
    
    setUploadError("");
    setActiveTab("basic");
  }, [employee]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedEmployee: Employee = {
      ...employee,
      name,
      position,
      department,
      email,
      phone,
      imageUrl: imageUrl || undefined,
      
      // Personal info
      dateOfBirth,
      gender,
      nationality,
      address,
      
      // Employment details
      employeeId,
      employmentType: employmentType as 'Full-time' | 'Part-time' | 'Contract',
      hireDate,
      workLocation,
      managerName,
      status: status as 'Active' | 'On Leave' | 'Terminated',
      
      // Compensation & payroll
      salary: salary ? parseFloat(salary) : undefined,
      payFrequency: payFrequency as 'Monthly' | 'Bi-Weekly' | 'Weekly',
      overtimeEligible,
      bonusEligible,
      taxId,
      bankAccountDetails,
      
      // Emergency contact
      emergencyContactName,
      emergencyContactRelationship,
      emergencyContactPhone,
      emergencyContactEmail,
      secondaryEmergencyContact,
      
      // Other info
      healthInsurance,
      dentalVisionCoverage,
      retirementPlan,
      ptoBalance: ptoBalance ? parseFloat(ptoBalance) : undefined,
      workSchedule: workSchedule as 'Fixed' | 'Flexible' | 'Remote'
    };
    
    onEmployeeUpdated(updatedEmployee);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError("");
    
    if (file) {
      setIsUploading(true);
      
      // Check file size (convert to KB)
      const fileSizeKB = file.size / 1024;
      if (fileSizeKB > MAX_IMAGE_SIZE_KB) {
        setUploadError(`Image too large. Maximum size is ${MAX_IMAGE_SIZE_KB}KB.`);
        setIsUploading(false);
        return;
      }
      
      // Convert to base64 for storage
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImageUrl(base64String);
        setIsUploading(false);
        toast({
          title: "Image uploaded",
          description: "Employee photo has been updated.",
        });
      };
      reader.onerror = () => {
        setUploadError("Failed to read the image file");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl("");
    toast({
      title: "Image removed",
      description: "Employee photo has been removed.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Edit Employee</DialogTitle>
          <DialogDescription className="dark:text-gray-300">
            Make changes to the employee information.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col items-center mb-4">
            <Avatar className="h-20 w-20 mb-2">
              <AvatarImage src={imageUrl} alt={name} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                {name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex gap-2 items-center">
              <div className="relative">
                <Button variant="outline" size="sm" type="button" className="text-xs dark:bg-gray-700 dark:text-white">
                  <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isUploading}
                  />
                  {isUploading ? (
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  ) : (
                    <Camera className="mr-1 h-3 w-3" />
                  )}
                  Upload Photo
                </Button>
              </div>
              
              {imageUrl && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  type="button" 
                  className="text-xs dark:bg-gray-700 dark:text-white"
                  onClick={handleRemoveImage}
                >
                  Remove
                </Button>
              )}
            </div>
            
            {uploadError && (
              <div className="text-xs text-destructive flex items-center mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                {uploadError}
              </div>
            )}
            
            <div className="text-xs text-muted-foreground mt-1 dark:text-gray-400">
              Maximum size: {MAX_IMAGE_SIZE_KB}KB
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="employment">Employment</TabsTrigger>
              <TabsTrigger value="compensation">Compensation</TabsTrigger>
              <TabsTrigger value="other">Other Info</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="dark:text-gray-200">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="position" className="dark:text-gray-200">Position</Label>
                    <Input
                      id="position"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      required
                      className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="department" className="dark:text-gray-200">Department</Label>
                    <Input
                      id="department"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      required
                      className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="email" className="dark:text-gray-200">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="phone" className="dark:text-gray-200">Phone</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="personal" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dateOfBirth" className="dark:text-gray-200">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="gender" className="dark:text-gray-200">Gender</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger className="dark:bg-gray-700 dark:text-white dark:border-gray-600">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                      <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="nationality" className="dark:text-gray-200">Nationality</Label>
                  <Input
                    id="nationality"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address" className="dark:text-gray-200">Address</Label>
                <Textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
            </TabsContent>

            <TabsContent value="employment" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="employeeId" className="dark:text-gray-200">Employee ID</Label>
                  <Input
                    id="employeeId"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="employmentType" className="dark:text-gray-200">Employment Type</Label>
                  <Select value={employmentType} onValueChange={handleEmploymentTypeChange}>
                    <SelectTrigger className="dark:bg-gray-700 dark:text-white dark:border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="hireDate" className="dark:text-gray-200">Hire Date</Label>
                  <Input
                    id="hireDate"
                    type="date"
                    value={hireDate}
                    onChange={(e) => setHireDate(e.target.value)}
                    className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="workLocation" className="dark:text-gray-200">Work Location</Label>
                  <Input
                    id="workLocation"
                    value={workLocation}
                    onChange={(e) => setWorkLocation(e.target.value)}
                    className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="managerName" className="dark:text-gray-200">Manager</Label>
                  <Input
                    id="managerName"
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="status" className="dark:text-gray-200">Status</Label>
                  <Select value={status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="dark:bg-gray-700 dark:text-white dark:border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="On Leave">On Leave</SelectItem>
                      <SelectItem value="Terminated">Terminated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="compensation" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="salary" className="dark:text-gray-200">Salary/Rate</Label>
                  <Input
                    id="salary"
                    type="number"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="payFrequency" className="dark:text-gray-200">Pay Frequency</Label>
                  <Select value={payFrequency} onValueChange={handlePayFrequencyChange}>
                    <SelectTrigger className="dark:bg-gray-700 dark:text-white dark:border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="Bi-Weekly">Bi-Weekly</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="overtimeEligible" className="dark:text-gray-200">Overtime Eligible</Label>
                  <Select
                    value={overtimeEligible ? "true" : "false"}
                    onValueChange={(value) => setOvertimeEligible(value === "true")}
                  >
                    <SelectTrigger className="dark:bg-gray-700 dark:text-white dark:border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="bonusEligible" className="dark:text-gray-200">Bonus Eligible</Label>
                  <Select
                    value={bonusEligible ? "true" : "false"}
                    onValueChange={(value) => setBonusEligible(value === "true")}
                  >
                    <SelectTrigger className="dark:bg-gray-700 dark:text-white dark:border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="taxId" className="dark:text-gray-200">Tax ID</Label>
                  <Input
                    id="taxId"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="bankAccountDetails" className="dark:text-gray-200">Bank Account Details</Label>
                  <Input
                    id="bankAccountDetails"
                    value={bankAccountDetails}
                    onChange={(e) => setBankAccountDetails(e.target.value)}
                    className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="other" className="space-y-4">
              <div className="grid gap-4">
                <h4 className="text-sm font-medium dark:text-gray-200">Emergency Contacts</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="emergencyContactName" className="dark:text-gray-200">Contact Name</Label>
                    <Input
                      id="emergencyContactName"
                      value={emergencyContactName}
                      onChange={(e) => setEmergencyContactName(e.target.value)}
                      className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="emergencyContactRelationship" className="dark:text-gray-200">Relationship</Label>
                    <Input
                      id="emergencyContactRelationship"
                      value={emergencyContactRelationship}
                      onChange={(e) => setEmergencyContactRelationship(e.target.value)}
                      className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="emergencyContactPhone" className="dark:text-gray-200">Contact Phone</Label>
                    <Input
                      id="emergencyContactPhone"
                      value={emergencyContactPhone}
                      onChange={(e) => setEmergencyContactPhone(e.target.value)}
                      className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="emergencyContactEmail" className="dark:text-gray-200">Contact Email</Label>
                    <Input
                      id="emergencyContactEmail"
                      type="email"
                      value={emergencyContactEmail}
                      onChange={(e) => setEmergencyContactEmail(e.target.value)}
                      className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                  </div>
                  
                  <div className="grid gap-2 col-span-2">
                    <Label htmlFor="secondaryEmergencyContact" className="dark:text-gray-200">Secondary Contact</Label>
                    <Input
                      id="secondaryEmergencyContact"
                      value={secondaryEmergencyContact}
                      onChange={(e) => setSecondaryEmergencyContact(e.target.value)}
                      className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                  </div>
                </div>

                <h4 className="text-sm font-medium dark:text-gray-200">Benefits & Attendance</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="healthInsurance" className="dark:text-gray-200">Health Insurance</Label>
                    <Input
                      id="healthInsurance"
                      value={healthInsurance}
                      onChange={(e) => setHealthInsurance(e.target.value)}
                      className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="dentalVisionCoverage" className="dark:text-gray-200">Dental & Vision</Label>
                    <Input
                      id="dentalVisionCoverage"
                      value={dentalVisionCoverage}
                      onChange={(e) => setDentalVisionCoverage(e.target.value)}
                      className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="retirementPlan" className="dark:text-gray-200">Retirement Plan</Label>
                    <Input
                      id="retirementPlan"
                      value={retirementPlan}
                      onChange={(e) => setRetirementPlan(e.target.value)}
                      className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="ptoBalance" className="dark:text-gray-200">PTO Balance</Label>
                    <Input
                      id="ptoBalance"
                      type="number"
                      value={ptoBalance}
                      onChange={(e) => setPtoBalance(e.target.value)}
                      className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="workSchedule" className="dark:text-gray-200">Work Schedule</Label>
                    <Select value={workSchedule} onValueChange={handleWorkScheduleChange}>
                      <SelectTrigger className="dark:bg-gray-700 dark:text-white dark:border-gray-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fixed">Fixed</SelectItem>
                        <SelectItem value="Flexible">Flexible</SelectItem>
                        <SelectItem value="Remote">Remote</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose} className="dark:bg-gray-700 dark:text-white">
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEmployeeDialog;
