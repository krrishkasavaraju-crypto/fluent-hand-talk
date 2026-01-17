import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Stethoscope, Briefcase, MessageCircle } from "lucide-react";

const modes = [
  { id: "classroom", label: "Classroom", icon: GraduationCap, color: "bg-primary" },
  { id: "hospital", label: "Hospital", icon: Stethoscope, color: "bg-accent" },
  { id: "interview", label: "Interview", icon: Briefcase, color: "bg-success" },
  { id: "casual", label: "Casual", icon: MessageCircle, color: "bg-warning" },
];

const ContextModeSelector = () => {
  const [activeMode, setActiveMode] = useState("casual");

  return (
    <div className="glass-panel rounded-xl p-2">
      <div className="flex items-center gap-1">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = activeMode === mode.id;
          
          return (
            <motion.button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive 
                  ? `${mode.color} text-white shadow-md` 
                  : 'hover:bg-secondary text-muted-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs font-medium hidden sm:inline">{mode.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default ContextModeSelector;
