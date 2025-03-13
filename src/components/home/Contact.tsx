
import GlassCard from "@/components/GlassCard";
import AnimatedButton from "@/components/AnimatedButton";

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-secondary/50">
      <div className="hr-container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Get in Touch</h2>
            <p className="text-lg text-muted-foreground">
              Have questions or need help? Our team is here for you
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="animate-slide-up">
              <GlassCard>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-muted-foreground">support@hrflow.com</p>
                    </div>
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-muted-foreground">+1 (555) 123-4567</p>
                    </div>
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-muted-foreground">
                        123 HR Street, Suite 456<br />
                        San Francisco, CA 94103
                      </p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
            
            <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <GlassCard>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Send us a message</h3>
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                      <input
                        id="name"
                        type="text"
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                      <input
                        id="email"
                        type="email"
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                        placeholder="Your email"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                      <textarea
                        id="message"
                        rows={4}
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                        placeholder="Your message"
                      ></textarea>
                    </div>
                    <AnimatedButton className="w-full" type="submit">
                      Send Message
                    </AnimatedButton>
                  </form>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
