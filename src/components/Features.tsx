
import GlassCard from "./GlassCard";
import { Users, Calendar, CreditCard, FileText, Search, BarChart, Building, DollarSign, Shield, Award, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const features = [
  {
    title: "Employee Management",
    description: "Centralize employee records with secure storage and easy access to personnel information.",
    icon: Users,
    color: "bg-hr-blue/10 text-hr-blue",
    link: "/employees"
  },
  {
    title: "Leave Management",
    description: "Streamline leave requests with an automated approval system aligned with SG/MY employment regulations.",
    icon: Calendar,
    color: "bg-hr-purple/10 text-hr-purple",
    link: "/leave"
  },
  {
    title: "Payroll Processing",
    description: "Automate salary calculations with CPF (SG) and EPF (MY) contribution calculations built-in.",
    icon: DollarSign,
    color: "bg-hr-teal/10 text-hr-teal",
    link: "/payroll"
  },
  {
    title: "Compliance Dashboard",
    description: "Stay compliant with MOM, IRAS (Singapore) and LHDN, SOCSO (Malaysia) regulations automatically.",
    icon: Shield,
    color: "bg-hr-indigo/10 text-hr-indigo",
    link: "/dashboard"
  },
  {
    title: "AI-Powered Insights",
    description: "Generate reports and gain insights using natural language queries for data-driven HR decisions.",
    icon: Search,
    color: "bg-hr-lightblue/10 text-hr-lightblue",
    link: "/dashboard"
  },
  {
    title: "Performance Management",
    description: "Track employee performance, conduct reviews, and manage career development plans.",
    icon: Award,
    color: "bg-hr-slate/10 text-hr-slate",
    link: "/dashboard"
  }
];

const Features = () => {
  const isMobile = useIsMobile();
  
  // For mobile, show only the 3 most important features initially
  const initialFeatures = isMobile ? features.slice(0, 3) : features;
  
  return (
    <section className="py-10 md:py-20 bg-secondary/50" id="features">
      <div className="hr-container">
        <div className="text-center max-w-3xl mx-auto mb-6 md:mb-16 animate-slide-up px-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 md:mb-4">HR Management for Singapore & Malaysia SMEs</h2>
          <p className="text-sm md:text-lg text-muted-foreground">
            {isMobile 
              ? "Built for SG/MY regulations and business requirements" 
              : "Simplify HR workflows with tools designed for small to medium businesses in Singapore and Malaysia, ensuring full regulatory compliance."}
          </p>
        </div>

        {/* Initial Features - All on desktop, 3 most important on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 px-3 md:px-0">
          {initialFeatures.map((feature, index) => (
            <Link 
              to={feature.link} 
              key={feature.title}
              className="block transition-transform hover:scale-[1.01]"
            >
              <GlassCard 
                className="animate-slide-up h-full"
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                hoverEffect
              >
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg ${feature.color} flex items-center justify-center mb-3 md:mb-4`}>
                  <feature.icon className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-1 md:mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm md:text-base">
                  {isMobile ? feature.description.split('.')[0] + '.' : feature.description}
                </p>
              </GlassCard>
            </Link>
          ))}
        </div>

        {/* Mobile-specific "See more features" button */}
        {isMobile && (
          <div className="text-center mt-4 px-3">
            <Link to="/login?signup=true" className="inline-block w-full">
              <button className="w-full bg-secondary hover:bg-secondary/70 text-foreground font-medium py-3 rounded-lg transition-colors border border-border text-sm">
                See all features
              </button>
            </Link>
          </div>
        )}

        {/* Compliance indicators */}
        <div className="mt-8 md:mt-16 text-center px-4 md:px-0">
          <div className="inline-block px-4 md:px-6 py-2 md:py-3 border border-border rounded-lg bg-background/80 overflow-x-auto w-full max-w-full md:w-auto">
            <div className="flex flex-wrap md:flex-nowrap justify-center items-center gap-4 text-xs md:text-sm whitespace-nowrap">
              <div className="flex items-center">
                <BookOpen className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 text-primary flex-shrink-0" />
                <span>CPF/EPF Compliant</span>
              </div>
              {!isMobile && <div className="hidden md:block h-4 w-px bg-border"></div>}
              <div className="flex items-center">
                <Shield className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 text-primary flex-shrink-0" />
                <span>MOM/MOHR Aligned</span>
              </div>
              {!isMobile && <div className="hidden md:block h-4 w-px bg-border"></div>}
              <div className="flex items-center">
                <Building className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 text-primary flex-shrink-0" />
                <span>IRAS/LHDN Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
