import Header from "@/components/Header";
import CommunitySection from "@/components/CommunitySection";
import Footer from "@/components/Footer";

const Feedback = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <CommunitySection />
      </main>
      <Footer />
    </div>
  );
};

export default Feedback;