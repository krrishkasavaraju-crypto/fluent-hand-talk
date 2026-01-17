import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import SafetyAlertsPanel from "@/components/SafetyAlertsPanel";
import EmergencySignPanel from "@/components/EmergencySignPanel";
import ASLAlphabetSection from "@/components/ASLAlphabetSection";
import CommunitySection from "@/components/CommunitySection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <SafetyAlertsPanel />
        <EmergencySignPanel />
        <ASLAlphabetSection />
        <CommunitySection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
