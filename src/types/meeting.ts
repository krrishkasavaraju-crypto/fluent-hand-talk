import { IntentType, MeetingConcept } from "@/lib/gemini";

export interface TimelineItem {
  concept: MeetingConcept;
  position: number;
  isActive: boolean;
  isViewed: boolean;
}

export interface ASLIntent {
  id: string;
  label: string;
  message: string;
  icon: string;
}

export const ASL_INTENTS: ASLIntent[] = [
  {
    id: "repeat",
    label: "Repeat",
    message: "Could you please repeat that?",
    icon: "↻",
  },
  {
    id: "slow-down",
    label: "Slow Down",
    message: "Could you please speak more slowly?",
    icon: "⏱",
  },
  {
    id: "clarify",
    label: "Clarify",
    message: "Could you please clarify that point?",
    icon: "❓",
  },
];
