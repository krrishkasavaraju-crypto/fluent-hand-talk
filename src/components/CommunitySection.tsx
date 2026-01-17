import { motion } from "framer-motion";
import { Globe, CheckCircle, Users, MessageSquare, ThumbsUp, HelpCircle } from "lucide-react";

const dialects = [
  { name: "ASL (American)", flag: "🇺🇸", active: true },
  { name: "BSL (British)", flag: "🇬🇧", active: true },
  { name: "Black ASL", flag: "✊🏿", active: true },
  { name: "Auslan", flag: "🇦🇺", active: true },
  { name: "LSF (French)", flag: "🇫🇷", active: false },
  { name: "DGS (German)", flag: "🇩🇪", active: false },
];

const CommunitySection = () => {
  return (
    <section id="community" className="py-24 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Community correction demo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="order-2 lg:order-1"
          >
            {/* Correction dialog */}
            <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
              {/* Header */}
              <div className="bg-warning/10 border-b border-warning/20 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-warning flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-warning-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Help us improve!</h3>
                    <p className="text-sm text-muted-foreground">Low confidence detection (72%)</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <p className="text-foreground mb-4">
                  We detected the sign but aren't sure. Did you mean:
                </p>

                {/* Options */}
                <div className="space-y-2 mb-6">
                  {[
                    { label: "Appointment", votes: 12 },
                    { label: "Meeting", votes: 8 },
                    { label: "Class", votes: 3 },
                  ].map((option, index) => (
                    <motion.button
                      key={option.label}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                        index === 0 
                          ? "bg-primary/10 border-primary/30" 
                          : "bg-secondary/50 border-border hover:border-primary/20"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {index === 0 && <CheckCircle className="w-5 h-5 text-primary" />}
                        <span className="font-medium text-foreground">{option.label}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{option.votes} votes</span>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Other input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter other meaning..."
                    className="flex-1 px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <button className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                    Submit
                  </button>
                </div>

                <p className="text-xs text-muted-foreground mt-4 text-center">
                  Your corrections help train the model and improve accuracy for everyone
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="order-1 lg:order-2"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Users className="w-4 h-4" />
              Community Powered
            </div>
            
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Built with Deaf communities,{" "}
              <span className="bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
                not just for them
              </span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8">
              Community corrections, regional signs, and human interpreter backup when AI isn't enough. Your input makes the translation better for everyone.
            </p>

            {/* Dialect selector preview */}
            <div className="mb-8">
              <h4 className="font-medium text-foreground mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Regional Dialects
              </h4>
              <div className="flex flex-wrap gap-2">
                {dialects.map((dialect) => (
                  <motion.div
                    key={dialect.name}
                    whileHover={{ scale: 1.05 }}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all cursor-pointer ${
                      dialect.active
                        ? "bg-primary/10 border-primary/30 text-foreground"
                        : "bg-muted/50 border-border text-muted-foreground"
                    }`}
                  >
                    <span>{dialect.flag}</span>
                    <span className="text-sm font-medium">{dialect.name}</span>
                    {!dialect.active && (
                      <span className="text-xs bg-warning/20 text-warning px-2 py-0.5 rounded-full">
                        Coming soon
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Human escalation */}
            <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Human Interpreter Backup</h4>
                  <p className="text-sm text-muted-foreground">
                    When confidence is low, connect instantly to a certified human interpreter. Never feel stuck in an important conversation.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
