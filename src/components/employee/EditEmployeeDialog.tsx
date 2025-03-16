
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, AlertCircle, Loader2 } from "lucide-react";
import { Employee } from "@/types/employee";
import { toast } from "@/hooks/use-toast";

interface EditEmployeeDialogProps {
  open: boolean;
  onClose: () => void;
  employee: Employee;
  onEmployeeUpdated: (employee: Employee) => void;
}

const MAX_IMAGE_SIZE_KB = 200; // 200KB max file size

const EditEmployeeDialog = ({ 
  open, 
  onClose, 
  employee,
  onEmployeeUpdated 
}: EditEmployeeDialogProps) => {
  const [name, setName] = useState(employee.name);
  const [position, setPosition] = useState(employee.position);
  const [department, setDepartment] = useState(employee.department);
  const [email, setEmail] = useState(employee.email);
  const [phone, setPhone] = useState(employee.phone);
  const [imageUrl, setImageUrl] = useState(employee.imageUrl || "");
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Reset form when employee changes
  useEffect(() => {
    setName(employee.name);
    setPosition(employee.position);
    setDepartment(employee.department);
    setEmail(employee.email);
    setPhone(employee.phone);
    setImageUrl(employee.imageUrl || "");
    setUploadError("");
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
      <DialogContent className="sm:max-w-md dark:bg-gray-800">
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
          
          <div className="grid gap-4 py-4">
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
                required
                className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
          </div>
          
          <DialogFooter>
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
