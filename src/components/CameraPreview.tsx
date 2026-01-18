import { motion, AnimatePresence } from "framer-motion";
import { Camera, CameraOff, Settings, Maximize2, Hand, X, Loader2 } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useHandDetection } from "@/hooks/useHandDetection";

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

// ASL alphabet reference map - only these letters can be recognized
const aslAlphabet: Record<string, string> = {
  A: aslA, B: aslB, C: aslC, D: aslD, E: aslE, F: aslF,
  G: aslG, H: aslH, I: aslI, J: aslJ, K: aslK, L: aslL,
  M: aslM, N: aslN, O: aslO, P: aslP, Q: aslQ, R: aslR,
  S: aslS, T: aslT, U: aslU, V: aslV, W: aslW, X: aslX,
  Y: aslY, Z: aslZ,
};

const CameraPreview = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [recognizedSigns, setRecognizedSigns] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastGestureRef = useRef<string | null>(null);
  const gestureStabilityRef = useRef<number>(0);

  // Use the real hand detection hook
  const {
    isModelLoading,
    isModelLoaded,
    handDetected,
    currentGesture,
    confidence,
  } = useHandDetection({
    videoRef,
    canvasRef,
    isEnabled: isCameraOn,
  });

  // Add gesture to history with stability check
  useEffect(() => {
    if (currentGesture && handDetected) {
      if (currentGesture === lastGestureRef.current) {
        gestureStabilityRef.current += 1;
        // Only add to history if gesture is stable for 3 detections
        if (gestureStabilityRef.current === 3) {
          setRecognizedSigns(prev => {
            // Don't add duplicate consecutive letters
            if (prev[prev.length - 1] === currentGesture) {
              return prev;
            }
            const updated = [...prev, currentGesture];
            return updated.slice(-30); // Keep last 30 signs
          });
        }
      } else {
        gestureStabilityRef.current = 1;
        lastGestureRef.current = currentGesture;
      }
    } else {
      gestureStabilityRef.current = 0;
    }
  }, [currentGesture, handDetected]);

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
        setRecognizedSigns([]);
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

  const displaySign = currentGesture && aslAlphabet[currentGesture] ? currentGesture : null;
  const isUnrecognized = handDetected && !displaySign && currentGesture === null;

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
              style={{ transform: 'scaleX(-1)' }}
            />
            
            {/* Canvas for drawing hand landmarks */}
            <canvas 
              ref={canvasRef} 
              className={`absolute inset-0 w-full h-full pointer-events-none ${isCameraOn ? 'block' : 'hidden'}`}
              style={{ transform: 'scaleX(-1)' }}
            />

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
                      "A"
                    </div>
                  </motion.div>
                </div>
              </div>
            )}

            {/* Status indicators */}
            <div className="absolute top-4 left-4 flex items-center gap-3 flex-wrap">
              {/* Recording indicator */}
              <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm rounded-full px-3 py-1">
                <motion.div
                  animate={{ opacity: isRecording ? [1, 0.5, 1] : 1 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className={`w-3 h-3 rounded-full ${isRecording ? 'bg-destructive' : 'bg-muted-foreground'}`}
                />
                <span className="text-sm font-medium text-foreground/80">
                  {isRecording ? 'LIVE' : 'OFF'}
                </span>
              </div>

              {/* Model loading status */}
              {isCameraOn && isModelLoading && (
                <div className="flex items-center gap-2 bg-primary/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <Loader2 className="w-3 h-3 text-primary animate-spin" />
                  <span className="text-xs font-medium text-primary">Loading AI...</span>
                </div>
              )}

              {/* Model loaded indicator */}
              {isCameraOn && isModelLoaded && (
                <div className="flex items-center gap-2 bg-green-500/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs font-medium text-green-400">AI Ready</span>
                </div>
              )}
              
              {/* Hand detection status */}
              {isCameraOn && isModelLoaded && (
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-sm ${
                  handDetected 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-muted/50 text-muted-foreground'
                }`}>
                  <Hand className="w-3 h-3" />
                  <span className="text-xs font-medium">
                    {handDetected ? 'Hand detected' : 'No hand'}
                  </span>
                </div>
              )}
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
              {displaySign && isCameraOn && handDetected && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  className="absolute bottom-20 left-1/2 -translate-x-1/2"
                >
                  <div className="bg-primary text-primary-foreground px-6 py-3 rounded-xl shadow-lg">
                    <div className="flex items-center gap-3">
                      {aslAlphabet[displaySign] && (
                        <img 
                          src={aslAlphabet[displaySign]} 
                          alt={`ASL ${displaySign}`}
                          className="w-10 h-10 object-contain bg-white/20 rounded-lg p-1"
                        />
                      )}
                      <div>
                        <span className="text-2xl font-bold">"{displaySign}"</span>
                        <p className="text-xs text-primary-foreground/80">
                          {Math.round(confidence * 10)}% confidence
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {isUnrecognized && isCameraOn && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  className="absolute bottom-20 left-1/2 -translate-x-1/2"
                >
                  <div className="bg-amber-500/90 text-white px-6 py-3 rounded-xl shadow-lg">
                    <div className="flex items-center gap-2">
                      <X className="w-5 h-5" />
                      <span className="text-lg font-bold">Sign unavailable</span>
                    </div>
                    <p className="text-xs text-white/80 text-center mt-1">Try a supported letter</p>
                  </div>
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
                <p className="text-xs text-muted-foreground mt-1">
                  TensorFlow.js HandPose
                </p>
              </div>

              <div className="p-4 space-y-4">
                {/* Current sign with ASL reference */}
                <div className="text-center p-4 bg-primary/5 rounded-xl border border-primary/20">
                  {displaySign && handDetected ? (
                    <>
                      {aslAlphabet[displaySign] && (
                        <img 
                          src={aslAlphabet[displaySign]} 
                          alt={`ASL sign for ${displaySign}`}
                          className="w-16 h-16 mx-auto mb-2 object-contain"
                        />
                      )}
                      <motion.div
                        key={displaySign}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-2xl font-bold text-primary"
                      >
                        "{displaySign}"
                      </motion.div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {Math.round(confidence * 10)}% confidence
                      </p>
                    </>
                  ) : isUnrecognized ? (
                    <div className="text-amber-500">
                      <X className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm font-medium">Sign unavailable</p>
                      <p className="text-xs text-muted-foreground mt-1">Try: A, B, C, D, E, F, I, L, O, S, U, V, W, Y</p>
                    </div>
                  ) : isModelLoading ? (
                    <div className="text-muted-foreground">
                      <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-primary" />
                      <p className="text-sm">Loading AI model...</p>
                      <p className="text-xs mt-1">This may take a moment</p>
                    </div>
                  ) : handDetected ? (
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
                      <p className="text-sm">Analyzing sign...</p>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">
                      <Hand className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Show your hand to camera</p>
                      <p className="text-xs mt-1">Detection is automatic</p>
                    </div>
                  )}
                </div>

                {/* Supported letters */}
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    Supported: A, B, C, D, E, F, I, L, O, S, U, V, W, Y
                  </p>
                </div>

                {/* Translation history */}
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Translation</h4>
                  <div className="bg-secondary/30 rounded-lg p-3 min-h-[100px] max-h-[150px] overflow-y-auto">
                    {recognizedSigns.length > 0 ? (
                      <p className="text-sm text-foreground leading-relaxed tracking-wider font-mono">
                        {recognizedSigns.join("")}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        Detected letters will appear here...
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
              <span className="text-sm font-medium">Model Status</span>
              <span className={`text-sm ${isModelLoaded ? 'text-green-500' : 'text-muted-foreground'}`}>
                {isModelLoading ? 'Loading...' : isModelLoaded ? 'Loaded' : 'Not loaded'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Hand Detection</span>
              <span className={`text-sm ${handDetected ? 'text-green-500' : 'text-muted-foreground'}`}>
                {handDetected ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-4">
              <p>Using TensorFlow.js HandPose model with Fingerpose for gesture recognition.</p>
              <p className="mt-2">Currently supported letters: A, B, C, D, E, F, I, L, O, S, U, V, W, Y</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CameraPreview;
