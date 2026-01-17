import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  MessageSquare, 
  Users, 
  Brain, 
  Shield, 
  Zap,
  Video,
  Phone,
  Building2
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Smart Conversations",
    description: "Real-time translation that understands context, turn-taking, and emotional tone for natural communication.",
    gradient: "from-primary to-primary/60",
  },
  {
    icon: Brain,
    title: "Context Awareness",
    description: "Switch between Classroom, Hospital, Interview, or Casual modes for domain-specific vocabulary.",
    gradient: "from-accent to-accent/60",
  },
  {
    icon: Users,
    title: "Learn & Communicate",
    description: "Mirror mode sign coach teaches hearing people how to sign correctly while communicating.",
    gradient: "from-success to-success/60",
  },
  {
    icon: Video,
    title: "Video Call Overlay",
    description: "Works seamlessly with Zoom, Meet, and Teams—translating in real-time without switching apps.",
    gradient: "from-primary to-accent",
  },
  {
    icon: Phone,
    title: "Voice Relay",
    description: "Make phone calls with ASL relay—sign into camera, speak to the world.",
    gradient: "from-accent to-warning",
  },
  {
    icon: Building2,
    title: "Public Spaces",
    description: "Transport and hospital modes for instant visual signed announcements.",
    gradient: "from-success to-primary",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            Powerful Features
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Everything you need for{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              seamless communication
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Works wherever you are: in class, on calls, or in stations and hospitals—without needing a human interpreter every time.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <Link to="/translate" key={feature.title}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="group relative bg-card rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 cursor-pointer h-full"
                >
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>

                  {/* Hover gradient */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Safety card only */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12"
        >
          <Link to="/translate">
            <div className="relative overflow-hidden bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl p-8 border border-accent/20 hover:border-accent/40 transition-all cursor-pointer">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                    <Shield className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      Safety First
                    </h3>
                    <p className="text-sm text-muted-foreground">Your silent lifeline</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  Silent emergency signing, sound-to-visual alerts for doorbells, alarms, and more. In emergencies, the app becomes your safety net.
                </p>
              </div>
              <Shield className="absolute -right-4 -bottom-4 w-32 h-32 text-accent/10" />
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
