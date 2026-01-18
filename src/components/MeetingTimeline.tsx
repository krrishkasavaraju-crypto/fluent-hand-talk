import { motion } from "framer-motion";
import { MeetingConcept } from "@/lib/gemini";
import { cn } from "@/lib/utils";

interface TimelineItem {
  concept: MeetingConcept;
  index: number;
  isActive: boolean;
  isViewed: boolean;
  onClick: () => void;
}

interface MeetingTimelineProps {
  concepts: MeetingConcept[];
  activeIndex: number;
  viewedIndices: Set<number>;
  onConceptClick: (index: number) => void;
}

export function MeetingTimeline({
  concepts,
  activeIndex,
  viewedIndices,
  onConceptClick,
}: MeetingTimelineProps) {
  if (concepts.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-card border-t border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {concepts.map((concept, index) => (
            <TimelineItem
              key={concept.id}
              concept={concept}
              index={index}
              isActive={index === activeIndex}
              isViewed={viewedIndices.has(index)}
              onClick={() => onConceptClick(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function TimelineItem({ concept, index, isActive, isViewed, onClick }: TimelineItem) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-2 px-4 py-2 rounded-lg transition-all min-w-[120px]",
        isActive
          ? "bg-primary text-primary-foreground shadow-lg scale-105"
          : isViewed
          ? "bg-secondary/50 text-foreground hover:bg-secondary"
          : "bg-muted/50 text-muted-foreground hover:bg-muted"
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="text-2xl">{concept.icon}</div>
      <div className="text-xs font-medium text-center line-clamp-2">
        {concept.simplifiedText.substring(0, 40)}
        {concept.simplifiedText.length > 40 ? "..." : ""}
      </div>
      <div className="text-[10px] opacity-70 capitalize">{concept.intent}</div>
    </motion.button>
  );
}
