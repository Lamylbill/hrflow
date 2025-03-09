
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import AnimatedButton from "@/components/AnimatedButton";
import GlassCard from "@/components/GlassCard";
import { CheckCircle } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />
        
        {/* Features Section */}
        <Features />
        
        {/* Testimonials Section */}
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
        
        {/* Pricing Section */}
        <section className="py-20 bg-secondary/50">
          <div className="hr-container">
            <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Simple, transparent pricing</h2>
              <p className="text-lg text-muted-foreground">
                No hidden fees, no complicated tiers. Just affordable plans that scale with your business.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  name: "Starter",
                  price: "$9",
                  description: "Perfect for startups and small teams",
                  features: [
                    "Up to 10 employees",
                    "Basic employee management",
                    "Leave tracking",
                    "Document storage",
                    "Email support"
                  ]
                },
                {
                  name: "Pro",
                  price: "$29",
                  description: "Ideal for growing businesses",
                  features: [
                    "Up to 50 employees",
                    "Advanced employee management",
                    "Automated payroll",
                    "Leave management",
                    "Performance reviews",
                    "Priority support"
                  ],
                  popular: true
                },
                {
                  name: "Enterprise",
                  price: "$79",
                  description: "For established organizations",
                  features: [
                    "Unlimited employees",
                    "Custom workflows",
                    "Advanced reporting",
                    "API access",
                    "Dedicated account manager",
                    "24/7 phone & email support"
                  ]
                }
              ].map((plan, index) => (
                <GlassCard 
                  key={plan.name}
                  className={`animate-slide-up flex flex-col ${plan.popular ? 'border-primary/50 ring-1 ring-primary/20' : ''}`}
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  {plan.popular && (
                    <div className="px-3 py-1 text-xs font-semibold text-white bg-primary rounded-full absolute -top-3 right-4">
                      Most Popular
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-4xl font-extrabold">{plan.price}</span>
                      <span className="ml-1 text-muted-foreground">/month per employee</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                    
                    <ul className="mt-6 space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-8">
                      <AnimatedButton 
                        className="w-full"
                        variant={plan.popular ? "default" : "outline"}
                      >
                        Get started
                      </AnimatedButton>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20">
          <div className="hr-container">
            <div className="max-w-4xl mx-auto text-center animate-slide-up">
              <GlassCard className="py-12 px-6 md:px-12">
                <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to streamline your HR operations?</h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join thousands of businesses that trust HRFlow to manage their HR processes efficiently.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <AnimatedButton className="px-8 py-3 text-base font-medium">
                    Start your free trial
                  </AnimatedButton>
                  <AnimatedButton variant="outline" className="px-8 py-3 text-base font-medium">
                    Schedule a demo
                  </AnimatedButton>
                </div>
                
                <p className="mt-4 text-sm text-muted-foreground">
                  No credit card required. 14-day free trial.
                </p>
              </GlassCard>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
