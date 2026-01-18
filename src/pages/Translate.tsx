import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useCallback, useEffect } from "react";
import { 
  Camera, 
  CameraOff, 
  MessageSquare, 
  Mic, 
  Hand,
  Settings,
  Send,
  ArrowLeft,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Message {
  id: number;
  type: "signer" | "speaker";
  text: string;
  timestamp: string;
}

const Translate = () => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, type: "speaker", text: "Hello! How can I help you today?", timestamp: "10:23 AM" },
    { id: 2, type: "signer", text: "I need help finding my classroom. I'm new here.", timestamp: "10:23 AM" },
  ]);
  const [inputText, setInputText] = useState("");
  const [recognizedSign, setRecognizedSign] = useState<string | null>(null);
  const [recognizedSigns, setRecognizedSigns] = useState<string[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const simulatedSigns = [
    "Hello", "Thank you", "Please", "Help", "Yes", "No", 
    "Good", "Bad", "Friend", "Family", "Love", "Peace"
  ];

  const detectHandSigns = useCallback(() => {
    if (!isCameraOn) return;

    const randomSign = simulatedSigns[Math.floor(Math.random() * simulatedSigns.length)];
    setRecognizedSign(randomSign);
    setRecognizedSigns(prev => {
      const updated = [...prev, randomSign];
      return updated.slice(-10);
    });
  }, [isCameraOn]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isCameraOn && isAnalyzing) {
      interval = setInterval(() => {
        detectHandSigns();
      }, 2500);
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
        setIsAnalyzing(true);
        setRecognizedSigns([]);
        setRecognizedSign(null);
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
    setIsAnalyzing(false);
    setRecognizedSign(null);
  }, []);

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const newMessage: Message = {
      id: messages.length + 1,
      type: "speaker",
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([...messages, newMessage]);
    setInputText("");
  };

  const addSignToChat = () => {
    if (recognizedSigns.length === 0) return;
    const signText = recognizedSigns.join(" ");
    const newMessage: Message = {
      id: messages.length + 1,
      type: "signer",
      text: signText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([...messages, newMessage]);
    setRecognizedSigns([]);
    setRecognizedSign(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
          <h1 className="font-display text-xl font-bold text-foreground">Live Translation</h1>
          <button className="p-2 rounded-lg hover:bg-muted transition-colors">
            <Settings className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-[1fr_320px] gap-6 min-h-[calc(100vh-120px)]">
          {/* Main Chat Area */}
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col bg-card rounded-2xl border border-border overflow-hidden"
          >
            {/* Chat Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex gap-3 ${message.type === "signer" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === "signer" 
                      ? "bg-primary/10 text-primary" 
                      : "bg-accent/10 text-accent"
                  }`}>
                    {message.type === "signer" ? (
                      <Hand className="w-5 h-5" />
                    ) : (
                      <Mic className="w-5 h-5" />
                    )}
                  </div>
                  <div className={`flex-1 ${message.type === "signer" ? "text-right" : ""}`}>
                    <div className={`inline-block max-w-[80%] p-4 rounded-2xl ${
                      message.type === "signer"
                        ? "bg-primary text-primary-foreground rounded-tr-md"
                        : "bg-secondary text-secondary-foreground rounded-tl-md"
                    }`}>
                      <p>{message.text}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {message.type === "signer" ? "You" : "Speaker"} • {message.timestamp}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <Button onClick={sendMessage} className="px-6">
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </motion.main>

          {/* Right Sidebar - Camera & Recognition */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Camera Preview */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="relative aspect-[4/3] bg-gradient-to-br from-secondary to-muted">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`absolute inset-0 w-full h-full object-cover ${isCameraOn ? 'block' : 'hidden'}`}
                />
                
                {!isCameraOn && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="w-12 h-12 text-muted-foreground/40 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Camera is off</p>
                    </div>
                  </div>
                )}

                {/* Recording indicator */}
                {isCameraOn && (
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <motion.div
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-3 h-3 rounded-full bg-destructive"
                    />
                    <span className="text-xs font-medium text-foreground/80 bg-background/50 px-2 py-1 rounded-full backdrop-blur-sm">LIVE</span>
                  </div>
                )}

                {/* AI Analysis indicator */}
                {isCameraOn && isAnalyzing && (
                  <div className="absolute top-3 right-3 flex items-center gap-2 bg-primary/20 backdrop-blur-sm rounded-full px-3 py-1">
                    <Loader2 className="w-3 h-3 text-primary animate-spin" />
                    <span className="text-xs font-medium text-primary">AI</span>
                  </div>
                )}

                {/* Current detected sign overlay */}
                <AnimatePresence>
                  {recognizedSign && isCameraOn && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute bottom-16 left-1/2 -translate-x-1/2"
                    >
                      <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg">
                        <span className="font-bold">"{recognizedSign}"</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Camera Controls */}
              <div className="p-4">
                {!isCameraOn ? (
                  <Button onClick={startCamera} className="w-full">
                    <Camera className="w-4 h-4 mr-2" />
                    Start Camera
                  </Button>
                ) : (
                  <Button onClick={stopCamera} variant="destructive" className="w-full">
                    <CameraOff className="w-4 h-4 mr-2" />
                    Stop Camera
                  </Button>
                )}
              </div>
            </div>

            {/* Sign Recognition Panel */}
            {isCameraOn && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card rounded-2xl border border-primary/30 overflow-hidden"
              >
                <div className="bg-primary/10 px-4 py-3 border-b border-primary/20">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Hand className="w-4 h-4 text-primary" />
                    Sign Recognition
                  </h3>
                </div>
                <div className="p-4">
                  {/* Translation text */}
                  <div className="bg-secondary/30 rounded-lg p-3 min-h-[80px] max-h-[120px] overflow-y-auto mb-3">
                    {recognizedSigns.length > 0 ? (
                      <p className="text-sm text-foreground leading-relaxed">
                        {recognizedSigns.join(" ")}
                      </p>
                    ) : (
                      <div className="text-center py-2">
                        <motion.div
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="flex justify-center gap-1 mb-2"
                        >
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        </motion.div>
                        <p className="text-sm text-muted-foreground">Analyzing signs...</p>
                      </div>
                    )}
                  </div>

                  {recognizedSigns.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={addSignToChat}
                    >
                      Add to chat
                    </Button>
                  )}
                </div>
              </motion.div>
            )}

            {/* Voice Input */}
            <div className="bg-card rounded-2xl border border-border p-4">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Mic className="w-4 h-4" />
                Voice Input
              </h3>
              <Button variant="outline" className="w-full">
                <Mic className="w-4 h-4 mr-2" />
                Hold to Speak
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Your speech will be converted to sign language
              </p>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
};

export default Translate;