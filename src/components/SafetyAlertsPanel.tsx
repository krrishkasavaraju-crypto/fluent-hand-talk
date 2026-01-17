import { motion } from "framer-motion";
import { Bell, BellRing, Baby, Flame, Phone, AlertTriangle, Volume2 } from "lucide-react";
import { useState } from "react";

const alertTypes = [
  { id: "doorbell", icon: Bell, label: "Doorbell", color: "bg-primary" },
  { id: "baby", icon: Baby, label: "Baby Cry", color: "bg-accent" },
  { id: "fire", icon: Flame, label: "Fire Alarm", color: "bg-destructive" },
  { id: "phone", icon: Phone, label: "Phone Ring", color: "bg-success" },
  { id: "name", icon: Volume2, label: "Name Called", color: "bg-warning" },
];

const SafetyAlertsPanel = () => {
  const [activeAlert, setActiveAlert] = useState<string | null>("doorbell");
  const [enabledAlerts, setEnabledAlerts] = useState<string[]>(["doorbell", "fire", "phone"]);

  const toggleAlert = (id: string) => {
    if (enabledAlerts.includes(id)) {
      setEnabledAlerts(enabledAlerts.filter((a) => a !== id));
    } else {
      setEnabledAlerts([...enabledAlerts, id]);
    }
  };

  return (
    <section id="safety" className="py-24 bg-gradient-to-b from-secondary/20 to-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              <AlertTriangle className="w-4 h-4" />
              Safety & Independence
            </div>
            
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Your silent{" "}
              <span className="bg-gradient-to-r from-accent to-warning bg-clip-text text-transparent">
                lifeline
              </span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8">
              In emergencies and daily life, the app raises alerts, calls for help, and translates critical information—keeping you safe and independent.
            </p>

            {/* Alert toggles */}
            <div className="space-y-3">
              <h4 className="font-medium text-foreground mb-3">Sound Detection Alerts</h4>
              {alertTypes.map((alert) => {
                const Icon = alert.icon;
                const isEnabled = enabledAlerts.includes(alert.id);
                
                return (
                  <motion.button
                    key={alert.id}
                    onClick={() => toggleAlert(alert.id)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                      isEnabled 
                        ? "bg-card border-primary/30 shadow-md" 
                        : "bg-muted/50 border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${isEnabled ? alert.color : "bg-muted"} flex items-center justify-center transition-colors`}>
                        <Icon className={`w-5 h-5 ${isEnabled ? "text-white" : "text-muted-foreground"}`} />
                      </div>
                      <span className={`font-medium ${isEnabled ? "text-foreground" : "text-muted-foreground"}`}>
                        {alert.label}
                      </span>
                    </div>
                    <div className={`w-12 h-6 rounded-full p-1 transition-colors ${isEnabled ? "bg-primary" : "bg-muted"}`}>
                      <motion.div
                        animate={{ x: isEnabled ? 24 : 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="w-4 h-4 rounded-full bg-white shadow-sm"
                      />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Demo panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            {/* Phone mockup */}
            <div className="relative mx-auto w-72 bg-card rounded-[3rem] p-3 border-4 border-foreground/10 shadow-2xl">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-foreground/10 rounded-b-2xl" />
              
              {/* Screen */}
              <div className="bg-background rounded-[2.5rem] overflow-hidden">
                {/* Status bar */}
                <div className="h-8 bg-secondary/50 flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">ASL Bridge</span>
                </div>

                {/* Alert display */}
                <div className="p-6">
                  <motion.div
                    key={activeAlert}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                  >
                    {/* Pulsing alert icon */}
                    <div className="relative mx-auto w-24 h-24 mb-4">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-accent/30"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                        className="absolute inset-0 rounded-full bg-accent/20"
                      />
                      <div className="absolute inset-0 rounded-full bg-accent flex items-center justify-center">
                        <BellRing className="w-12 h-12 text-accent-foreground" />
                      </div>
                    </div>

                    <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                      Doorbell!
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Someone is at your door
                    </p>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      <button className="py-3 rounded-xl bg-success text-success-foreground font-medium">
                        View Camera
                      </button>
                      <button className="py-3 rounded-xl bg-secondary text-secondary-foreground font-medium">
                        Dismiss
                      </button>
                    </div>
                  </motion.div>

                  {/* Recent alerts */}
                  <div className="mt-6 pt-6 border-t border-border">
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">Recent Alerts</h4>
                    <div className="space-y-2">
                      {["Phone rang - 5 min ago", "Name called - 12 min ago"].map((alert, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-2 h-2 rounded-full bg-muted-foreground/50" />
                          {alert}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-warning/20 rounded-full blur-3xl -z-10 opacity-50" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SafetyAlertsPanel;
