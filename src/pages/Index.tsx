
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

const Index = () => {
  const location = useLocation();

  // Scroll to the section based on the hash in the URL
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />
      <ComplianceSection />
      <About />
      <Pricing />
      <Testimonials />
      <Contact />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;
