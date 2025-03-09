
import { ArrowRight, Users, Calendar, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedButton from "./AnimatedButton";
import GlassCard from "./GlassCard";

const Hero = () => {
  // Core features with direct links
  const coreFeatures = [
    {
      title: "Employee Database",
      description: "Manage your team members efficiently",
      icon: Users,
      color: "bg-hr-blue/10 text-hr-blue border-hr-blue/20",
      link: "/employees"
    },
    {
      title: "Leave Management",
      description: "Handle leave requests and approvals",
      icon: Calendar,
      color: "bg-hr-purple/10 text-hr-purple border-hr-purple/20",
      link: "/leave"
    },
    {
      title: "Payroll Processing",
      description: "Process salaries and payments",
      icon: DollarSign,
      color: "bg-hr-teal/10 text-hr-teal border-hr-teal/20",
      link: "/payroll"
    }
  ];

  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="hr-container">
        <div className="max-w-4xl mx-auto text-center space-y-6 animate-slide-down">
          <div className="inline-block mb-4">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary animate-fade-in">
              <span className="px-2">AI-Powered HR Management for SMEs</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground animate-slide-up" style={{ animationDelay: "0.2s" }}>
            Streamline your HR workflows with <span className="text-primary">HRFlow</span>
          </h1>
          
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: "0.3s" }}>
            The all-in-one HR platform designed specifically for small to medium businesses.
            Simplify employee management, automate payroll, and enhance productivity.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <Link to="/dashboard">
              <AnimatedButton className="w-full sm:w-auto px-8 py-3 text-base font-medium">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </AnimatedButton>
            </Link>
            <Link to="/employees">
              <AnimatedButton variant="outline" className="w-full sm:w-auto px-8 py-3 text-base font-medium">
                Explore Features
              </AnimatedButton>
            </Link>
          </div>
        </div>

        {/* Core Features Quick Access */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {coreFeatures.map((feature, index) => (
            <Link
              to={feature.link}
              key={feature.title}
              className="animate-slide-up block"
              style={{ animationDelay: `${0.6 + index * 0.1}s` }}
            >
              <GlassCard className="h-full hover:scale-[1.02] transition-transform border border-border/50 hover:border-border">
                <div className="flex flex-col items-center text-center p-2">
                  <div className={`w-16 h-16 rounded-full ${feature.color} flex items-center justify-center mb-4 border border-opacity-20 ${feature.color.includes('border') ? '' : 'border-current'}`}>
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                  <div className="mt-4 flex items-center text-primary font-medium">
                    Explore <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>

        <div className="mt-16 md:mt-24 relative max-w-6xl mx-auto px-4 animate-scale-in" style={{ animationDelay: "0.6s" }}>
          <div className="glass-card overflow-hidden rounded-2xl shadow-2xl">
            <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="text-3xl font-semibold text-primary mb-4">Dashboard Preview</div>
                <p className="text-muted-foreground">Interactive dashboard visualization will appear here</p>
              </div>
            </div>
          </div>
          
          {/* Abstract decorative elements */}
          <div className="absolute -z-10 top-1/3 -left-4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -z-10 bottom-1/4 -right-20 w-80 h-80 bg-hr-blue/5 rounded-full blur-[100px]"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
