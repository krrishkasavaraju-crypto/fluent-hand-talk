import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Play,
  Pause,
  Upload,
  Send,
  Volume2,
  Loader2,
  AlertCircle,
  Info,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MeetingTimeline } from "@/components/MeetingTimeline";
import { processTranscript, type MeetingConcept } from "@/lib/gemini";
import { ASL_INTENTS } from "@/types/meeting";
import { cn } from "@/lib/utils";

const MeetingCompanion = () => {
  const [transcript, setTranscript] = useState("");
  const [concepts, setConcepts] = useState<MeetingConcept[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewedIndices, setViewedIndices] = useState<Set<number>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [summary, setSummary] = useState("");

  // Process transcript when submitted
  const handleProcessTranscript = useCallback(async () => {
    if (!transcript.trim()) {
      setError("Please enter a transcript");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const result = await processTranscript(transcript);
      setConcepts(result.concepts);
      setSummary(result.summary);
      setActiveIndex(0);
      setViewedIndices(new Set());
      setIsPlaying(true);
      setError(null);
    } catch (err) {
      console.error("Error processing transcript:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to process transcript.";
      if (errorMessage.includes("VITE_GEMINI_API_KEY")) {
        setError(
          "API key not configured. Please set VITE_GEMINI_API_KEY in your .env file. See README.md for setup instructions."
        );
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsProcessing(false);
    }
  }, [transcript]);

  // Auto-advance through concepts when playing
  useEffect(() => {
    if (!isPlaying || concepts.length === 0) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = prev + 1;
        if (next >= concepts.length) {
          setIsPlaying(false);
          return prev;
        }
        setViewedIndices((prev) => new Set([...prev, prev]));
        return next;
      });
    }, 5000); // 5 seconds per concept

    return () => clearInterval(interval);
  }, [isPlaying, concepts.length]);

  // Mark concept as viewed when it becomes active
  useEffect(() => {
    if (concepts.length > 0 && activeIndex < concepts.length) {
      setViewedIndices((prev) => new Set([...prev, activeIndex]));
    }
  }, [activeIndex, concepts.length]);

  const handleConceptClick = (index: number) => {
    setActiveIndex(index);
    setViewedIndices((prev) => new Set([...prev, index]));
  };

  const handleASLIntent = async (intent: typeof ASL_INTENTS[0]) => {
    // Optional: Send intent message via ElevenLabs for Deaf-hearing collaboration
    const elevenLabsKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    
    if (elevenLabsKey) {
      try {
        const { textToSpeech, playAudio } = await import("@/lib/elevenlabs");
        const audioBlob = await textToSpeech(intent.message, {
          apiKey: elevenLabsKey,
        });
        playAudio(audioBlob);
      } catch (error) {
        console.error("Error with ElevenLabs:", error);
        // Fallback: show message
        alert(intent.message);
      }
    } else {
      // Fallback: show message if API key not configured
      alert(intent.message);
    }
  };

  const activeConcept = concepts[activeIndex];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-xl font-bold text-foreground">
              ASL Meeting Companion
            </h1>
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
              <Info className="w-3 h-3" />
              <span>Prototype</span>
            </div>
          </div>
          <div className="w-20" /> {/* Spacer */}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 grid lg:grid-cols-2 gap-6 p-6 overflow-hidden">
          {/* Left Panel: Simplified Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col bg-card rounded-2xl border border-border overflow-hidden"
          >
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Simplified Explanation
              </h2>
              <p className="text-sm text-muted-foreground">
                ASL-friendly visual language layer (not literal translation)
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {concepts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-2">
                    Enter a meeting transcript to begin
                  </p>
                  <p className="text-sm text-muted-foreground/70">
                    The system will segment it into meaningful ideas and provide
                    ASL-friendly explanations
                  </p>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  {activeConcept && (
                    <motion.div
                      key={activeConcept.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      {/* Intent Badge */}
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{activeConcept.icon}</div>
                        <div>
                          <div className="text-sm font-medium text-foreground capitalize">
                            {activeConcept.intent.replace("_", " ")}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Concept {activeIndex + 1} of {concepts.length}
                          </div>
                        </div>
                      </div>

                      {/* Simplified Text */}
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          Explanation
                        </h3>
                        <p className="text-foreground leading-relaxed">
                          {activeConcept.simplifiedText}
                        </p>
                      </div>

                      {/* Key Points */}
                      {activeConcept.keyPoints.length > 0 && (
                        <div className="space-y-2">
                          <h3 className="text-sm font-semibold text-foreground">
                            Key Points
                          </h3>
                          <ul className="space-y-2">
                            {activeConcept.keyPoints.map((point, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-sm text-foreground"
                              >
                                <span className="text-primary mt-1">•</span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Original Text (Collapsed) */}
                      <details className="mt-4">
                        <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                          View original text
                        </summary>
                        <p className="mt-2 text-sm text-muted-foreground italic">
                          {activeConcept.text}
                        </p>
                      </details>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>

            {/* Controls */}
            {concepts.length > 0 && (
              <div className="p-4 border-t border-border flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (activeIndex > 0) {
                      setActiveIndex(activeIndex - 1);
                    }
                  }}
                  disabled={activeIndex === 0}
                >
                  Previous
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Play
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (activeIndex < concepts.length - 1) {
                      setActiveIndex(activeIndex + 1);
                    }
                  }}
                  disabled={activeIndex === concepts.length - 1}
                >
                  Next
                </Button>
              </div>
            )}
          </motion.div>

          {/* Right Panel: ASL Video */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col bg-card rounded-2xl border border-border overflow-hidden"
          >
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground mb-2">
                ASL Explanation Video
              </h2>
              <p className="text-sm text-muted-foreground">
                Conceptual explanation (not word-for-word translation)
              </p>
            </div>

            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-secondary/20 to-muted/20 p-6">
              {concepts.length === 0 ? (
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Play className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">
                    ASL explanation videos will appear here
                  </p>
                </div>
              ) : activeConcept ? (
                <div className="w-full max-w-md space-y-4">
                  {/* Placeholder Video Area */}
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl border-2 border-dashed border-primary/30 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">{activeConcept.icon}</div>
                      <p className="text-sm text-muted-foreground">
                        ASL Explanation Video
                      </p>
                      <p className="text-xs text-muted-foreground/70 mt-1">
                        Video ID: {activeConcept.aslVideoId}
                      </p>
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="text-center space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      {activeConcept.simplifiedText}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      This is a placeholder. In production, this would show a
                      pre-recorded ASL explanation video.
                    </p>
                  </div>
                </div>
              ) : null}
            </div>

            {/* ASL Intent Buttons */}
            {concepts.length > 0 && (
              <div className="p-4 border-t border-border">
                <div className="text-xs font-medium text-muted-foreground mb-3">
                  Quick Actions
                </div>
                <div className="flex gap-2 flex-wrap">
                  {ASL_INTENTS.map((intent) => (
                    <Button
                      key={intent.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handleASLIntent(intent)}
                      className="flex-1 min-w-[100px]"
                    >
                      <span className="mr-2">{intent.icon}</span>
                      {intent.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Input Panel */}
        <div className="bg-card border-t border-border p-6">
          <div className="container mx-auto max-w-4xl">
            <div className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </motion.div>
              )}

              <div className="flex gap-3">
                <Textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Paste meeting transcript or enter live captions here..."
                  className="min-h-[100px] resize-none"
                  disabled={isProcessing}
                />
                <Button
                  onClick={handleProcessTranscript}
                  disabled={isProcessing || !transcript.trim()}
                  className="self-end"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Process
                    </>
                  )}
                </Button>
              </div>

              {summary && (
                <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  <strong>Summary:</strong> {summary}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timeline */}
        {concepts.length > 0 && (
          <MeetingTimeline
            concepts={concepts}
            activeIndex={activeIndex}
            viewedIndices={viewedIndices}
            onConceptClick={handleConceptClick}
          />
        )}
      </div>
    </div>
  );
};

export default MeetingCompanion;
