
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ComplianceSection from "@/components/home/Compliance";
import About from "@/components/home/About";
import Pricing from "@/components/home/Pricing";
import Testimonials from "@/components/home/Testimonials";
import Contact from "@/components/home/Contact";
import CallToAction from "@/components/home/CallToAction";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  // Scroll to the section based on the hash in the URL
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        // Add offset for the fixed header on mobile
        const yOffset = isMobile ? -60 : -100;
        const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
        
        window.scrollTo({
          top: y,
          behavior: "smooth"
        });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location, isMobile]);

  // On mobile, ensure optimal spacing between sections
  const sectionClasses = isMobile ? "space-y-6" : "space-y-0";

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className={`flex-1 pt-14 md:pt-16 ${sectionClasses}`}>
        <Hero />
        <Features />
        <ComplianceSection />
        <About />
        <Pricing />
        <Testimonials />
        <Contact />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
