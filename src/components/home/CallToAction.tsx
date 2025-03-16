
import { Link } from "react-router-dom";
import AnimatedButton from "@/components/AnimatedButton";
import GlassCard from "@/components/GlassCard";
import { useIsMobile } from "@/hooks/use-mobile";

const CallToAction = () => {
  const isMobile = useIsMobile();
  
  return (
    <section className="py-12 md:py-20">
      <div className="hr-container">
        <div className="max-w-4xl mx-auto text-center animate-slide-up">
          <GlassCard className="py-8 md:py-12 px-4 md:px-12">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 md:mb-4">Ready to streamline your HR operations?</h2>
            <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto">
              {isMobile 
                ? "Join thousands of businesses using HRFlow today." 
                : "Join thousands of businesses that trust HRFlow to manage their HR processes efficiently."}
            </p>
            <div className={`flex flex-col gap-3 ${isMobile ? 'px-2' : 'sm:flex-row justify-center gap-4'}`}>
              <Link to="/login?signup=true" className="w-full">
                <AnimatedButton className={`w-full ${isMobile ? 'py-3.5' : 'px-8 py-3'} text-base font-medium`}>
                  Start your free trial
                </AnimatedButton>
              </Link>
              <a href="#contact" className="w-full">
                <AnimatedButton variant="outline" className={`w-full ${isMobile ? 'py-3.5' : 'px-8 py-3'} text-base font-medium`}>
                  Schedule a demo
                </AnimatedButton>
              </a>
            </div>
            
            <p className="mt-4 text-sm text-muted-foreground">
              No credit card required. 14-day free trial.
            </p>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
