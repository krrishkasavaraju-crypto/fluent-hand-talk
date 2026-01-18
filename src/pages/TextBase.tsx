import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Import all ASL letter images
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

const aslAlphabet: Record<string, string> = {
  A: aslA, B: aslB, C: aslC, D: aslD, E: aslE, F: aslF, G: aslG,
  H: aslH, I: aslI, J: aslJ, K: aslK, L: aslL, M: aslM, N: aslN,
  O: aslO, P: aslP, Q: aslQ, R: aslR, S: aslS, T: aslT, U: aslU,
  V: aslV, W: aslW, X: aslX, Y: aslY, Z: aslZ,
};

const TextBase = () => {
  const [text, setText] = useState("");
  const maxLength = 100;

  const processedLetters = text
    .toUpperCase()
    .split("")
    .map((char, index) => ({
      char,
      index,
      isLetter: /[A-Z]/.test(char),
      isSpace: char === " ",
    }));

  const letterCount = processedLetters.filter((l) => l.isLetter).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-foreground">Text Base</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setText("")}
              disabled={!text}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Text Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="bg-card rounded-2xl p-6 border border-border shadow-lg">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Type your text
              </h2>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, maxLength))}
                placeholder="Start typing to see ASL hand signs..."
                className="min-h-[200px] text-lg resize-none"
              />
              <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
                <span>
                  {text.length}/{maxLength} characters
                </span>
                <span>{letterCount} signs displayed</span>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-secondary/30 rounded-xl p-4 border border-border">
              <h3 className="font-medium text-foreground mb-2">How it works</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Type any text to see corresponding ASL hand signs</li>
                <li>• Only letters A-Z are converted to signs</li>
                <li>• Spaces and punctuation are shown as gaps</li>
              </ul>
            </div>
          </motion.div>

          {/* Right Panel - ASL Signs Display */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card rounded-2xl p-6 border border-border shadow-lg min-h-[300px]"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">
              ASL Hand Signs
            </h2>

            {processedLetters.length === 0 ? (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                <p>Your hand signs will appear here...</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                <AnimatePresence mode="popLayout">
                  {processedLetters.map(({ char, index, isLetter, isSpace }) => {
                    if (isSpace) {
                      return (
                        <motion.div
                          key={`space-${index}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="w-12 h-16"
                        />
                      );
                    }

                    if (!isLetter) {
                      return (
                        <motion.div
                          key={`char-${index}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="w-12 h-16 flex items-center justify-center bg-secondary/50 rounded-lg"
                        >
                          <span className="text-muted-foreground text-lg">
                            {char}
                          </span>
                        </motion.div>
                      );
                    }

                    const imageSrc = aslAlphabet[char];
                    return (
                      <motion.div
                        key={`letter-${index}`}
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -10 }}
                        transition={{ delay: index * 0.02 }}
                        className="flex flex-col items-center"
                      >
                        <div className="w-16 h-16 bg-secondary/30 rounded-xl p-1 border border-border hover:border-primary/50 transition-colors">
                          {imageSrc && (
                            <img
                              src={imageSrc}
                              alt={`ASL sign for ${char}`}
                              className="w-full h-full object-contain"
                            />
                          )}
                        </div>
                        <span className="text-xs font-medium text-muted-foreground mt-1">
                          {char}
                        </span>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TextBase;
