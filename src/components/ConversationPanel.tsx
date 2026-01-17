import { motion } from "framer-motion";
import { Hand, Mic, Smile, AlertCircle, HelpCircle, Sparkles } from "lucide-react";

type EmotionType = "happy" | "urgent" | "confused" | "neutral";

interface Message {
  id: number;
  type: "signer" | "speaker";
  text: string;
  emotion?: EmotionType;
  timestamp: string;
}

const emotions: Record<EmotionType, { icon: typeof Smile; color: string; label: string }> = {
  happy: { icon: Smile, color: "text-success bg-success/10", label: "Happy" },
  urgent: { icon: AlertCircle, color: "text-destructive bg-destructive/10", label: "Urgent" },
  confused: { icon: HelpCircle, color: "text-warning bg-warning/10", label: "Confused" },
  neutral: { icon: Sparkles, color: "text-muted-foreground bg-muted", label: "Neutral" },
};

const sampleMessages: Message[] = [
  { id: 1, type: "speaker", text: "Hello! How can I help you today?", emotion: "happy", timestamp: "10:23 AM" },
  { id: 2, type: "signer", text: "I need help finding my classroom. I'm new here.", emotion: "confused", timestamp: "10:23 AM" },
  { id: 3, type: "speaker", text: "Of course! Which class are you looking for?", emotion: "happy", timestamp: "10:24 AM" },
  { id: 4, type: "signer", text: "Biology 101 with Professor Martinez", emotion: "neutral", timestamp: "10:24 AM" },
];

const ConversationPanel = () => {
  return (
    <div className="p-4 border-t border-border bg-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">Conversation</h3>
        <span className="text-xs text-muted-foreground">Live translation</span>
      </div>

      <div className="space-y-3 max-h-48 overflow-y-auto">
        {sampleMessages.map((message, index) => {
          const emotionData = message.emotion ? emotions[message.emotion] : null;
          const EmotionIcon = emotionData?.icon;
          
          return (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex gap-3 ${message.type === "signer" ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.type === "signer" 
                  ? "bg-primary/10 text-primary" 
                  : "bg-accent/10 text-accent"
              }`}>
                {message.type === "signer" ? (
                  <Hand className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </div>

              {/* Message bubble */}
              <div className={`flex-1 ${message.type === "signer" ? "text-right" : ""}`}>
                <div className={`inline-block max-w-[85%] ${
                  message.type === "signer" ? "text-left" : ""
                }`}>
                  {/* Emotion tag */}
                  {emotionData && EmotionIcon && (
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs mb-1 ${emotionData.color}`}>
                      <EmotionIcon className="w-3 h-3" />
                      <span>{emotionData.label}</span>
                    </div>
                  )}
                  
                  {/* Message content */}
                  <div className={`p-3 rounded-2xl ${
                    message.type === "signer"
                      ? "bg-primary text-primary-foreground rounded-tr-md"
                      : "bg-secondary text-secondary-foreground rounded-tl-md"
                  }`}>
                    <p className="text-sm">{message.text}</p>
                  </div>
                  
                  {/* Timestamp */}
                  <div className={`text-xs text-muted-foreground mt-1 ${
                    message.type === "signer" ? "text-right" : ""
                  }`}>
                    {message.type === "signer" ? "Signer" : "Speaker"} • {message.timestamp}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Typing indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-2 mt-3 pt-3 border-t border-border"
      >
        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
          <Hand className="w-3 h-3 text-primary" />
        </div>
        <div className="flex items-center gap-1">
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
            className="w-2 h-2 rounded-full bg-primary"
          />
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            className="w-2 h-2 rounded-full bg-primary"
          />
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
            className="w-2 h-2 rounded-full bg-primary"
          />
        </div>
        <span className="text-xs text-muted-foreground">Recognizing signs...</span>
      </motion.div>
    </div>
  );
};

export default ConversationPanel;
