"use client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/Home/hero-section";
import FeatureCards from "@/components/Home/feature-cards";
import StatsSection from "@/components/Home/stats-section";
import FeaturesGrid from "@/components/Home/features-grid";
import AboutSection from "@/components/Home/about-section";
import CTASection from "@/components/Home/cta-section";
import BrandStrip from "@/components/Home/BrandStrip";
import InfiniteMovingCardsDemo from "@/components/Home/feedback";

export default function Home() {
  return (
    <>
      <div
        className="w-full text-white"
        style={{
          background: "linear-gradient(to bottom, #050020, #050020, #050020)",
          backgroundAttachment: "fixed", // keeps background fixed
          minHeight: "100vh",
        }}
      >
        <Navbar />
        <HeroSection />
        <BrandStrip />
        <FeatureCards />
        <StatsSection />
        <FeaturesGrid />
        <AboutSection />
        
        <CTASection />
        <Footer />
      </div>
    </>
  );
}
