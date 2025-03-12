
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { addEmployee } from "@/utils/localStorage";
import { toast } from "@/hooks/use-toast";

interface AddEmployeeDialogProps {
  open: boolean;
  onClose: () => void;
  onEmployeeAdded: () => void;
}

const AddEmployeeDialog = ({ open, onClose, onEmployeeAdded }: AddEmployeeDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    department: "",
    email: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.position || !formData.department) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Add employee to localStorage
    addEmployee(formData);
    
    // Show success message
    toast({
      title: "Employee Added",
      description: `${formData.name} has been added successfully`,
    });
    
    // Reset form and close dialog
    setFormData({
      name: "",
      position: "",
      department: "",
      email: "",
      phone: "",
    });
    
    // Call the callback to refresh the employee list
    onEmployeeAdded();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>
            Fill in the employee details. Required fields are marked with *.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name *
              </Label>
              <input
                id="name"
                name="name"
                className="col-span-3 px-3 py-2 border border-border rounded-md"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="position" className="text-right">
                Position *
              </Label>
              <input
                id="position"
                name="position"
                className="col-span-3 px-3 py-2 border border-border rounded-md"
                value={formData.position}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                Department *
              </Label>
              <select
                id="department"
                name="department"
                className="col-span-3 px-3 py-2 border border-border rounded-md bg-transparent"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
                <option value="Product">Product</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <input
                id="email"
                name="email"
                type="email"
                className="col-span-3 px-3 py-2 border border-border rounded-md"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <input
                id="phone"
                name="phone"
                className="col-span-3 px-3 py-2 border border-border rounded-md"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Employee</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployeeDialog;
