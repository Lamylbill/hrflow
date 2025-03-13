
import { Link } from "react-router-dom";
import AnimatedButton from "@/components/AnimatedButton";
import GlassCard from "@/components/GlassCard";
import { CheckCircle } from "lucide-react";

const pricingPlans = [
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
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 bg-secondary/50">
      <div className="hr-container">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Simple, transparent pricing</h2>
          <p className="text-lg text-muted-foreground">
            No hidden fees, no complicated tiers. Just affordable plans that scale with your business.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
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
                    onClick={() => window.location.href = `/login?signup=true&plan=${plan.name.toLowerCase()}`}
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
  );
};

export default Pricing;
