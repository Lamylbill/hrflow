
import GlassCard from "./GlassCard";
import { Users, Calendar, CreditCard, FileText, Search, BarChart } from "lucide-react";

const features = [
  {
    title: "Employee Database",
    description: "Centralize employee records with secure storage and easy access to important information.",
    icon: Users,
    color: "bg-hr-blue/10 text-hr-blue"
  },
  {
    title: "Leave Management",
    description: "Streamline leave requests with an automated approval system and calendar integration.",
    icon: Calendar,
    color: "bg-hr-purple/10 text-hr-purple"
  },
  {
    title: "Payroll Processing",
    description: "Automate salary calculations and maintain detailed payroll history for all employees.",
    icon: CreditCard,
    color: "bg-hr-teal/10 text-hr-teal"
  },
  {
    title: "Document Management",
    description: "Securely store, organize and retrieve HR-related documents with ease.",
    icon: FileText,
    color: "bg-hr-indigo/10 text-hr-indigo"
  },
  {
    title: "AI-Powered Search",
    description: "Find relevant information quickly with our intelligent search functionality.",
    icon: Search,
    color: "bg-hr-lightblue/10 text-hr-lightblue"
  },
  {
    title: "Advanced Reporting",
    description: "Generate detailed reports with natural language queries for data-driven decisions.",
    icon: BarChart,
    color: "bg-hr-slate/10 text-hr-slate"
  }
];

const Features = () => {
  return (
    <section className="py-20 bg-secondary/50">
      <div className="hr-container">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need to manage your HR operations</h2>
          <p className="text-lg text-muted-foreground">
            HRFlow combines powerful features with an intuitive interface, designed specifically for small to medium businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <GlassCard 
              key={feature.title} 
              className="animate-slide-up"
              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              hoverEffect
            >
              <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
