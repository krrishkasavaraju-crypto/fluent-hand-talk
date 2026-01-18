import Header from "@/components/Header";
import SafetyAlertsPanel from "@/components/SafetyAlertsPanel";
import EmergencySignPanel from "@/components/EmergencySignPanel";
import Footer from "@/components/Footer";

const Safety = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <SafetyAlertsPanel />
        <EmergencySignPanel />
      </main>
      <Footer />
    </div>
  );
};

export default Safety;