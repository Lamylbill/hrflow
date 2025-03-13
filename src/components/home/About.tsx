
import GlassCard from "@/components/GlassCard";

const About = () => {
  return (
    <section id="about" className="py-20">
      <div className="hr-container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-3xl font-bold tracking-tight mb-4">About HRFlow</h2>
            <p className="text-lg text-muted-foreground">
              We're on a mission to simplify HR management for small and medium businesses
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h3 className="text-2xl font-semibold mb-4">Our Story</h3>
              <p className="text-muted-foreground mb-6">
                Founded in 2023, HRFlow began with a simple idea: HR management shouldn't be complex 
                or expensive for small businesses. Our team of HR professionals and software engineers 
                joined forces to create a solution that combines powerful functionality with simplicity.
              </p>
              <p className="text-muted-foreground">
                Today, HRFlow serves thousands of businesses worldwide, helping them save time and 
                focus on what matters most—their people and their business growth.
              </p>
            </div>
            
            <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <GlassCard>
                <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 rounded-lg flex items-center justify-center">
                  <p className="text-center text-muted-foreground p-6">
                    Company image or video will appear here
                  </p>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
