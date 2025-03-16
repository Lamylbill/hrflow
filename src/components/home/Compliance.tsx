
import { Shield, CheckCircle, FileText, Building, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ComplianceSection = () => {
  return (
    <section className="py-12 md:py-20 bg-background" id="compliance">
      <div className="hr-container">
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12 items-center px-4 md:px-0">
          <div className="w-full lg:w-1/2 space-y-4 md:space-y-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
              <Shield className="h-4 w-4 mr-2" />
              <span>Regulatory Compliance</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Stay Compliant with Singapore & Malaysia Regulations
            </h2>
            
            <p className="text-base md:text-lg text-muted-foreground">
              HRFlow ensures your business stays up-to-date with all necessary regulatory 
              requirements for both Singapore and Malaysia, saving you time and reducing compliance risks.
            </p>
            
            <ul className="space-y-3 mt-4 md:mt-6">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm md:text-base">Automated CPF (Singapore) and EPF (Malaysia) contribution calculations</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm md:text-base">Built-in employment law compliance for both countries</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm md:text-base">Tax filing preparation for IRAS (Singapore) and LHDN (Malaysia)</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm md:text-base">Statutory leave entitlement monitoring and calculations</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm md:text-base">Regular updates to reflect the latest regulatory changes</span>
              </li>
            </ul>
            
            <div className="pt-4 flex flex-wrap gap-3">
              <Link to="/login?signup=true">
                <Button size="lg" className="text-sm h-10 px-4 md:h-11 md:px-6">
                  Get Started
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="text-sm h-10 px-4 md:h-11 md:px-6">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
            <div className="bg-card rounded-lg p-4 md:p-6 shadow-sm border border-border">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 md:mb-4">
                <Building className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
              <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">CPF/EPF Compliance</h3>
              <p className="text-sm md:text-base text-muted-foreground">Automated calculation and reporting for Central Provident Fund (SG) and Employees Provident Fund (MY).</p>
            </div>
            
            <div className="bg-card rounded-lg p-4 md:p-6 shadow-sm border border-border">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 md:mb-4">
                <FileText className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
              <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">Tax Documentation</h3>
              <p className="text-sm md:text-base text-muted-foreground">Simplified IRAS and LHDN-ready reports and filing assistance for tax submissions.</p>
            </div>
            
            <div className="bg-card rounded-lg p-4 md:p-6 shadow-sm border border-border">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 md:mb-4">
                <Shield className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
              <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">Employment Laws</h3>
              <p className="text-sm md:text-base text-muted-foreground">Built-in compliance with Employment Act (SG) and Employment Act (MY) regulations.</p>
            </div>
            
            <div className="bg-card rounded-lg p-4 md:p-6 shadow-sm border border-border">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 md:mb-4">
                <Clock className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
              <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">Working Hours & Leave</h3>
              <p className="text-sm md:text-base text-muted-foreground">Statutory leave entitlement tracking and working hour monitoring for both countries.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComplianceSection;
