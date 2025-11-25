import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/Home/hero-section';
import FeatureCards from '@/components/Home/feature-cards';
import StatsSection from '@/components/Home/stats-section';
import FeaturesGrid from '@/components/Home/features-grid';
import AboutSection from '@/components/Home/about-section';
import CTASection from '@/components/Home/cta-section';
import BrandStrip from "@/components/Home/BrandStrip";

export default function Home() {
  return (
    <div className="min-h-screen text-white overflow-hidden" style={{background: 'linear-gradient(to bottom, #050020, #050020, #050020)'}}>
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
  );
}