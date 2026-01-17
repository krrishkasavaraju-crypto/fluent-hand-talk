import { motion } from "framer-motion";
import { useState, useRef, useCallback } from "react";
import { 
  Camera, 
  CameraOff, 
  MessageSquare, 
  Mic, 
  Hand,
  Settings,
  GraduationCap,
  Building2,
  Stethoscope,
  Coffee,
  Send,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type ContextMode = "classroom" | "hospital" | "interview" | "casual";

const contextModes: { id: ContextMode; label: string; icon: typeof GraduationCap }[] = [
  { id: "classroom", label: "Classroom", icon: GraduationCap },
  { id: "hospital", label: "Hospital", icon: Stethoscope },
  { id: "interview", label: "Interview", icon: Building2 },
  { id: "casual", label: "Casual", icon: Coffee },
];

interface Message {
  id: number;
  type: "signer" | "speaker";
  text: string;
  timestamp: string;
}

const Translate = () => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [selectedMode, setSelectedMode] = useState<ContextMode>("casual");
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, type: "speaker", text: "Hello! How can I help you today?", timestamp: "10:23 AM" },
    { id: 2, type: "signer", text: "I need help finding my classroom. I'm new here.", timestamp: "10:23 AM" },
  ]);
  const [inputText, setInputText] = useState("");
  const [recognizedSign, setRecognizedSign] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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
        // Simulate sign recognition after camera starts
        setTimeout(() => {
          setRecognizedSign("Hello");
        }, 2000);
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
        <div className="grid lg:grid-cols-[280px_1fr_320px] gap-6 min-h-[calc(100vh-120px)]">
          {/* Left Sidebar - Options */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Context Mode */}
            <div className="bg-card rounded-2xl border border-border p-4">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Context Mode
              </h3>
              <div className="space-y-2">
                {contextModes.map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setSelectedMode(mode.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        selectedMode === mode.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary/50 hover:bg-secondary text-foreground"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card rounded-2xl border border-border p-4">
              <h3 className="font-semibold text-foreground mb-4">Quick Phrases</h3>
              <div className="space-y-2">
                {["Thank you", "Please repeat", "I understand", "Help me"].map((phrase) => (
                  <button
                    key={phrase}
                    onClick={() => {
                      const newMessage: Message = {
                        id: messages.length + 1,
                        type: "signer",
                        text: phrase,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      };
                      setMessages([...messages, newMessage]);
                    }}
                    className="w-full text-left px-4 py-2 rounded-lg bg-secondary/50 hover:bg-secondary text-sm text-foreground transition-colors"
                  >
                    {phrase}
                  </button>
                ))}
              </div>
            </div>
          </motion.aside>

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
                  {recognizedSign ? (
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="text-3xl font-bold text-primary mb-2"
                      >
                        "{recognizedSign}"
                      </motion.div>
                      <p className="text-sm text-muted-foreground">98% confidence</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={() => {
                          const newMessage: Message = {
                            id: messages.length + 1,
                            type: "signer",
                            text: recognizedSign,
                            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                          };
                          setMessages([...messages, newMessage]);
                          setRecognizedSign(null);
                          setTimeout(() => setRecognizedSign("Thank you"), 1500);
                        }}
                      >
                        Add to chat
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
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
