import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import CommunitySection from "@/components/CommunitySection";
import SafetyAlertsPanel from "@/components/SafetyAlertsPanel";
import EmergencySignPanel from "@/components/EmergencySignPanel";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <CommunitySection />
        <SafetyAlertsPanel />
        <EmergencySignPanel />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
