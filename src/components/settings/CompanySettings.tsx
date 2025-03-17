
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const CompanySettings = () => {
  // Company settings state
  const [companyName, setCompanyName] = useState(localStorage.getItem("companyName") || "");
  const [companyAddress, setCompanyAddress] = useState(localStorage.getItem("companyAddress") || "");
  const [companyPhone, setCompanyPhone] = useState(localStorage.getItem("companyPhone") || "");
  const [companyEmail, setCompanyEmail] = useState(localStorage.getItem("companyEmail") || "");
  const [companyWebsite, setCompanyWebsite] = useState(localStorage.getItem("companyWebsite") || "");
  const [companyRegNumber, setCompanyRegNumber] = useState(localStorage.getItem("companyRegNumber") || "");
  const [companyTaxId, setCompanyTaxId] = useState(localStorage.getItem("companyTaxId") || "");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to localStorage
    localStorage.setItem("companyName", companyName);
    localStorage.setItem("companyAddress", companyAddress);
    localStorage.setItem("companyPhone", companyPhone);
    localStorage.setItem("companyEmail", companyEmail);
    localStorage.setItem("companyWebsite", companyWebsite);
    localStorage.setItem("companyRegNumber", companyRegNumber);
    localStorage.setItem("companyTaxId", companyTaxId);
    
    toast({
      title: "Company settings updated",
      description: "Your company information has been saved.",
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter company name"
            />
          </div>
          <div>
            <Label htmlFor="companyRegNumber">Registration Number</Label>
            <Input
              id="companyRegNumber"
              value={companyRegNumber}
              onChange={(e) => setCompanyRegNumber(e.target.value)}
              placeholder="Enter registration number"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="companyAddress">Address</Label>
          <Textarea
            id="companyAddress"
            value={companyAddress}
            onChange={(e) => setCompanyAddress(e.target.value)}
            placeholder="Enter company address"
            className="resize-none"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="companyEmail">Email</Label>
            <Input
              id="companyEmail"
              type="email"
              value={companyEmail}
              onChange={(e) => setCompanyEmail(e.target.value)}
              placeholder="Enter company email"
            />
          </div>
          <div>
            <Label htmlFor="companyPhone">Phone</Label>
            <Input
              id="companyPhone"
              value={companyPhone}
              onChange={(e) => setCompanyPhone(e.target.value)}
              placeholder="Enter company phone"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="companyWebsite">Website</Label>
            <Input
              id="companyWebsite"
              value={companyWebsite}
              onChange={(e) => setCompanyWebsite(e.target.value)}
              placeholder="Enter company website"
            />
          </div>
          <div>
            <Label htmlFor="companyTaxId">Tax ID</Label>
            <Input
              id="companyTaxId"
              value={companyTaxId}
              onChange={(e) => setCompanyTaxId(e.target.value)}
              placeholder="Enter tax ID"
            />
          </div>
        </div>
      </div>
      
      <Button type="submit">Save Company Settings</Button>
    </form>
  );
};

export default CompanySettings;
