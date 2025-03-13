
import { Link } from "react-router-dom";
import AnimatedButton from "@/components/AnimatedButton";
import GlassCard from "@/components/GlassCard";

const CallToAction = () => {
  return (
    <section className="py-20">
      <div className="hr-container">
        <div className="max-w-4xl mx-auto text-center animate-slide-up">
          <GlassCard className="py-12 px-6 md:px-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to streamline your HR operations?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of businesses that trust HRFlow to manage their HR processes efficiently.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/login?signup=true">
                <AnimatedButton className="px-8 py-3 text-base font-medium">
                  Start your free trial
                </AnimatedButton>
              </Link>
              <a href="#contact">
                <AnimatedButton variant="outline" className="px-8 py-3 text-base font-medium">
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
