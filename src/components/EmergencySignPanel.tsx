import { motion } from "framer-motion";
import { AlertTriangle, MapPin, Send, Phone, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const emergencySigns = [
  { sign: "HELP", gesture: "Wave hands above head" },
  { sign: "DANGER", gesture: "Crossed arms, push away" },
  { sign: "CALL 911", gesture: "Phone gesture + tap three times" },
  { sign: "MEDICAL", gesture: "Tap chest twice" },
];

const EmergencySignPanel = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-destructive/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive text-sm font-medium mb-4">
              <Shield className="w-4 h-4" />
              Emergency Features
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Silent Emergency{" "}
              <span className="bg-gradient-to-r from-destructive to-accent bg-clip-text text-transparent">
                Signing
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Predefined emergency signs that auto-send alerts to trusted contacts with your location—no sound needed.
            </p>
          </div>

          {/* Emergency demo card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative bg-card rounded-2xl border border-destructive/20 overflow-hidden shadow-xl"
          >
            {/* Alert banner */}
            <div className="bg-destructive/10 border-b border-destructive/20 px-6 py-4">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-10 h-10 rounded-full bg-destructive flex items-center justify-center"
                >
                  <AlertTriangle className="w-5 h-5 text-destructive-foreground" />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-foreground">Emergency Sign Detected</h3>
                  <p className="text-sm text-muted-foreground">Sign: "HELP" recognized with 98% confidence</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 p-6">
              {/* Left - What's happening */}
              <div className="space-y-4">
                <h4 className="font-medium text-foreground flex items-center gap-2">
                  <Send className="w-4 h-4 text-primary" />
                  Automatic Alert Sent
                </h4>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-success/10 border border-success/20">
                    <Phone className="w-5 h-5 text-success mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">SMS sent to Emergency Contacts</p>
                      <p className="text-sm text-muted-foreground">Mom, Partner, Emergency Services</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Location Shared</p>
                      <p className="text-sm text-muted-foreground">123 Main St, Apt 4B, New York</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-accent/10 border border-accent/20">
                    <Users className="w-5 h-5 text-accent mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Video Clip Attached</p>
                      <p className="text-sm text-muted-foreground">Last 10 seconds recorded</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Emergency signs list */}
              <div>
                <h4 className="font-medium text-foreground mb-4">Recognized Emergency Signs</h4>
                <div className="space-y-2">
                  {emergencySigns.map((item, index) => (
                    <motion.div
                      key={item.sign}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div>
                        <span className="font-medium text-foreground">{item.sign}</span>
                        <p className="text-xs text-muted-foreground">{item.gesture}</p>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Button variant="hero" className="w-full mt-4">
                  Configure Emergency Contacts
                </Button>
              </div>
            </div>

            {/* Footer note */}
            <div className="bg-muted/50 px-6 py-4 text-center">
              <p className="text-sm text-muted-foreground">
                <span className="text-primary font-medium">Privacy First:</span> Emergency features are opt-in and you control who receives alerts
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default EmergencySignPanel;
