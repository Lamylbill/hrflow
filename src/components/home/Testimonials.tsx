
import GlassCard from "@/components/GlassCard";

const Testimonials = () => {
  return (
    <section className="py-20">
      <div className="hr-container">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Trusted by growing businesses</h2>
          <p className="text-lg text-muted-foreground">
            See why companies choose HRFlow to streamline their HR operations
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <GlassCard key={i} className="animate-slide-up" style={{ animationDelay: `${0.1 * i}s` }}>
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-foreground italic mb-4">
                    "HRFlow has transformed how we manage our team. The intuitive interface and powerful features have saved us countless hours every month."
                  </p>
                </div>
                <div className="flex items-center mt-4 pt-4 border-t border-border">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-medium">JD</span>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium">Jane Doe</h4>
                    <p className="text-xs text-muted-foreground">HR Manager, Acme Inc</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
