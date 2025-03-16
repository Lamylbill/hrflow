
import GlassCard from "./GlassCard";
import { Users, Calendar, CreditCard, FileText, Search, BarChart, Building, DollarSign, Shield, Award, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

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
  return (
    <section className="py-20 bg-secondary/50" id="features">
      <div className="hr-container">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
          <h2 className="text-3xl font-bold tracking-tight mb-4">HR Management Tailored for Singapore & Malaysia SMEs</h2>
          <p className="text-lg text-muted-foreground">
            Simplify HR workflows with comprehensive tools designed specifically for small to medium businesses
            in Singapore and Malaysia, ensuring full regulatory compliance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
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
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </GlassCard>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block px-6 py-3 border border-border rounded-lg bg-background/80">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2 text-primary" />
                <span>CPF/EPF Compliant</span>
              </div>
              <div className="hidden sm:block h-4 w-px bg-border"></div>
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2 text-primary" />
                <span>MOM/MOHR Aligned</span>
              </div>
              <div className="hidden sm:block h-4 w-px bg-border"></div>
              <div className="flex items-center">
                <Building className="h-4 w-4 mr-2 text-primary" />
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
