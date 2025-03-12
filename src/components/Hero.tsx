
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedButton from "./AnimatedButton";
import GlassCard from "./GlassCard";

const Hero = () => {
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
            <Link to="/login">
              <AnimatedButton className="w-full sm:w-auto px-8 py-3 text-base font-medium">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </AnimatedButton>
            </Link>
            <a href="#features">
              <AnimatedButton variant="outline" className="w-full sm:w-auto px-8 py-3 text-base font-medium">
                Explore Features
              </AnimatedButton>
            </a>
          </div>
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
