import { motion, AnimatePresence } from "framer-motion";
import { Camera, CameraOff, Settings, Maximize2, Hand, Loader2, X } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

// Import ASL reference images
import aslA from "@/assets/asl/a.png";
import aslB from "@/assets/asl/b.png";
import aslC from "@/assets/asl/c.png";
import aslD from "@/assets/asl/d.png";
import aslE from "@/assets/asl/e.png";
import aslF from "@/assets/asl/f.png";
import aslG from "@/assets/asl/g.png";
import aslH from "@/assets/asl/h.png";
import aslI from "@/assets/asl/i.png";
import aslJ from "@/assets/asl/j.png";
import aslK from "@/assets/asl/k.png";
import aslL from "@/assets/asl/l.png";
import aslM from "@/assets/asl/m.png";
import aslN from "@/assets/asl/n.png";
import aslO from "@/assets/asl/o.png";
import aslP from "@/assets/asl/p.png";
import aslQ from "@/assets/asl/q.png";
import aslR from "@/assets/asl/r.png";
import aslS from "@/assets/asl/s.png";
import aslT from "@/assets/asl/t.png";
import aslU from "@/assets/asl/u.png";
import aslV from "@/assets/asl/v.png";
import aslW from "@/assets/asl/w.png";
import aslX from "@/assets/asl/x.png";
import aslY from "@/assets/asl/y.png";
import aslZ from "@/assets/asl/z.png";

// ASL alphabet reference map
const aslAlphabet: Record<string, string> = {
  A: aslA, B: aslB, C: aslC, D: aslD, E: aslE, F: aslF,
  G: aslG, H: aslH, I: aslI, J: aslJ, K: aslK, L: aslL,
  M: aslM, N: aslN, O: aslO, P: aslP, Q: aslQ, R: aslR,
  S: aslS, T: aslT, U: aslU, V: aslV, W: aslW, X: aslX,
  Y: aslY, Z: aslZ,
};

// Valid signs - only letters A-Z
const validSigns = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
  "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
  "U", "V", "W", "X", "Y", "Z"
];

const CameraPreview = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recognizedSigns, setRecognizedSigns] = useState<string[]>([]);
  const [currentSign, setCurrentSign] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Simulated AI hand sign detection with validation
  const detectHandSigns = useCallback(() => {
    if (!isCameraOn) return;

    // Simulate detection - 80% chance of valid sign, 20% chance of invalid
    const isValidDetection = Math.random() > 0.2;
    
    if (isValidDetection) {
      const randomSign = validSigns[Math.floor(Math.random() * validSigns.length)];
      setCurrentSign(randomSign);
      
      // Add to recognized signs history
      setRecognizedSigns(prev => {
        const updated = [...prev, randomSign];
        return updated.slice(-10); // Keep last 10 signs
      });
    } else {
      // Invalid sign detected
      setCurrentSign("INVALID");
    }
  }, [isCameraOn]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isCameraOn && isAnalyzing) {
      interval = setInterval(() => {
        detectHandSigns();
      }, 2500); // Detect every 2.5 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCameraOn, isAnalyzing, detectHandSigns]);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraOn(true);
        setIsRecording(true);
        setIsAnalyzing(true);
        setRecognizedSigns([]);
        setCurrentSign(null);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
    setIsRecording(false);
    setIsAnalyzing(false);
    setCurrentSign(null);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(console.error);
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(console.error);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <>
      <div ref={containerRef} className="relative flex gap-4">
        {/* Main camera container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={`relative bg-card rounded-2xl shadow-xl overflow-hidden border border-border flex-1 ${isFullscreen ? 'h-screen' : ''}`}
        >
          {/* Camera viewport */}
          <div className={`relative bg-gradient-to-br from-secondary to-muted ${isFullscreen ? 'h-full' : 'aspect-[4/3]'}`}>
            {/* Video element for webcam */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`absolute inset-0 w-full h-full object-cover ${isCameraOn ? 'block' : 'hidden'}`}
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Placeholder when camera is off */}
            {!isCameraOn && (
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
            )}

            {/* Recording indicator */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <motion.div
                animate={{ opacity: isRecording ? [1, 0.5, 1] : 1 }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className={`w-3 h-3 rounded-full ${isRecording ? 'bg-destructive' : 'bg-muted-foreground'}`}
              />
              <span className="text-sm font-medium text-foreground/80">
                {isRecording ? 'LIVE' : 'OFF'}
              </span>
            </div>


            {/* Camera controls */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button 
                onClick={() => setShowSettings(true)}
                className="p-2 rounded-lg bg-background/50 backdrop-blur-sm hover:bg-background/70 transition-colors"
              >
                <Settings className="w-4 h-4 text-foreground/70" />
              </button>
              <button 
                onClick={toggleFullscreen}
                className="p-2 rounded-lg bg-background/50 backdrop-blur-sm hover:bg-background/70 transition-colors"
              >
                <Maximize2 className="w-4 h-4 text-foreground/70" />
              </button>
            </div>

            {/* Current detected sign overlay */}
            <AnimatePresence>
              {currentSign && isCameraOn && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  className="absolute bottom-20 left-1/2 -translate-x-1/2"
                >
                  {currentSign === "INVALID" ? (
                    <div className="bg-destructive text-destructive-foreground px-6 py-3 rounded-xl shadow-lg">
                      <div className="flex items-center gap-2">
                        <X className="w-5 h-5" />
                        <span className="text-lg font-bold">Hand sign not recognized</span>
                      </div>
                      <p className="text-xs text-destructive-foreground/80 text-center mt-1">Please try again</p>
                    </div>
                  ) : (
                    <div className="bg-primary text-primary-foreground px-6 py-3 rounded-xl shadow-lg">
                      <div className="flex items-center gap-2">
                        <Hand className="w-5 h-5" />
                        <span className="text-lg font-bold">"{currentSign}"</span>
                      </div>
                      <p className="text-xs text-primary-foreground/80 text-center mt-1">Sign detected</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Camera toggle buttons */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
              {!isCameraOn ? (
                <Button
                  onClick={startCamera}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Start Camera
                </Button>
              ) : (
                <Button
                  onClick={stopCamera}
                  variant="destructive"
                  className="shadow-lg"
                >
                  <CameraOff className="w-4 h-4 mr-2" />
                  Stop Camera
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Sign Recognition Panel - Shows when camera is on */}
        <AnimatePresence>
          {isCameraOn && (
            <motion.div
              initial={{ opacity: 0, x: 20, width: 0 }}
              animate={{ opacity: 1, x: 0, width: 280 }}
              exit={{ opacity: 0, x: 20, width: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-card rounded-2xl border border-border overflow-hidden shadow-xl"
            >
              <div className="bg-primary/10 px-4 py-3 border-b border-primary/20">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Hand className="w-4 h-4 text-primary" />
                  Sign Recognition
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Letter detection (A-Z)</p>
              </div>

              <div className="p-4 space-y-4">
                {/* Current sign with ASL reference */}
                <div className="text-center p-4 bg-primary/5 rounded-xl border border-primary/20">
                  {currentSign && currentSign !== "INVALID" ? (
                    <>
                      {aslAlphabet[currentSign.toUpperCase()] && (
                        <img 
                          src={aslAlphabet[currentSign.toUpperCase()]} 
                          alt={`ASL sign for ${currentSign}`}
                          className="w-16 h-16 mx-auto mb-2 object-contain"
                        />
                      )}
                      <motion.div
                        key={currentSign}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-2xl font-bold text-primary"
                      >
                        "{currentSign}"
                      </motion.div>
                      <p className="text-xs text-muted-foreground mt-1">95% confidence</p>
                    </>
                  ) : currentSign === "INVALID" ? (
                    <div className="text-destructive">
                      <X className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm font-medium">Sign not recognized</p>
                      <p className="text-xs text-muted-foreground mt-1">Please try again</p>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">
                      <motion.div
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="flex justify-center gap-1 mb-2"
                      >
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </motion.div>
                      <p className="text-sm">Waiting for signs...</p>
                    </div>
                  )}
                </div>

                {/* Translation history */}
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Translation</h4>
                  <div className="bg-secondary/30 rounded-lg p-3 min-h-[100px] max-h-[150px] overflow-y-auto">
                    {recognizedSigns.length > 0 ? (
                      <p className="text-sm text-foreground leading-relaxed">
                        {recognizedSigns.filter(s => s !== "INVALID").join(" ")}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        Detected signs will appear here...
                      </p>
                    )}
                  </div>
                </div>

                {/* Clear button */}
                {recognizedSigns.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setRecognizedSigns([])}
                  >
                    Clear Translation
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Glow effect */}
        <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-2xl -z-10 opacity-50" />
      </div>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Camera Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Camera Quality</span>
              <select className="px-3 py-2 rounded-lg border border-border bg-background text-sm">
                <option>480p</option>
                <option>720p</option>
                <option>1080p</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Detection Sensitivity</span>
              <select className="px-3 py-2 rounded-lg border border-border bg-background text-sm">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Mirror Video</span>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CameraPreview;