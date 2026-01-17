import { motion } from "framer-motion";
import { Camera, Settings, Maximize2 } from "lucide-react";
import { useState } from "react";
import ContextModeSelector from "./ContextModeSelector";
import ConversationPanel from "./ConversationPanel";

const CameraPreview = () => {
  const [isRecording, setIsRecording] = useState(true);

  return (
    <div className="relative">
      {/* Main camera container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative bg-card rounded-2xl shadow-xl overflow-hidden border border-border"
      >
        {/* Camera viewport */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-secondary to-muted">
          {/* Simulated camera feed background */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Person silhouette */}
              <div className="w-32 h-40 rounded-t-full bg-muted-foreground/20" />
              <div className="w-20 h-24 mx-auto -mt-2 rounded-full bg-muted-foreground/20" />
              
              {/* Hand detection overlay */}
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-0 right-0 w-16 h-16 border-2 border-primary rounded-lg"
              >
                <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                  "Hello"
                </div>
              </motion.div>
            </div>
          </div>

          {/* Recording indicator */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <motion.div
              animate={{ opacity: isRecording ? [1, 0.5, 1] : 1 }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className={`w-3 h-3 rounded-full ${isRecording ? 'bg-destructive' : 'bg-muted-foreground'}`}
            />
            <span className="text-sm font-medium text-foreground/80">
              {isRecording ? 'LIVE' : 'PAUSED'}
            </span>
          </div>

          {/* Camera controls */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button className="p-2 rounded-lg bg-background/50 backdrop-blur-sm hover:bg-background/70 transition-colors">
              <Settings className="w-4 h-4 text-foreground/70" />
            </button>
            <button className="p-2 rounded-lg bg-background/50 backdrop-blur-sm hover:bg-background/70 transition-colors">
              <Maximize2 className="w-4 h-4 text-foreground/70" />
            </button>
          </div>

          {/* Context mode selector */}
          <div className="absolute bottom-4 left-4 right-4">
            <ContextModeSelector />
          </div>
        </div>

        {/* Conversation panel below camera */}
        <ConversationPanel />
      </motion.div>

      {/* Glow effect */}
      <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-2xl -z-10 opacity-50" />
    </div>
  );
};

export default CameraPreview;
