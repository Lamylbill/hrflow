
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Testimonials from "@/components/home/Testimonials";
import Pricing from "@/components/home/Pricing";
import About from "@/components/home/About";
import Contact from "@/components/home/Contact";
import CallToAction from "@/components/home/CallToAction";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />
        
        {/* Features Section with ID for navigation */}
        <section id="features">
          <Features />
        </section>
        
        {/* Testimonials Section */}
        <Testimonials />
        
        {/* Pricing Section */}
        <Pricing />
        
        {/* About Section */}
        <About />
        
        {/* Contact Section */}
        <Contact />
        
        {/* CTA Section */}
        <CallToAction />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
