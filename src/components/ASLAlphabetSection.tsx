import { motion } from "framer-motion";

const alphabetSigns = [
  { letter: "A", description: "Fist with thumb beside" },
  { letter: "B", description: "Flat hand, thumb tucked" },
  { letter: "C", description: "Curved hand like C" },
  { letter: "D", description: "Index up, others touch thumb" },
  { letter: "E", description: "Fingers curled, thumb tucked" },
  { letter: "F", description: "OK sign, three fingers up" },
  { letter: "G", description: "Index and thumb point sideways" },
  { letter: "H", description: "Index and middle point sideways" },
  { letter: "I", description: "Pinky up, fist closed" },
  { letter: "J", description: "Pinky up, trace J shape" },
  { letter: "K", description: "Index, middle up, thumb between" },
  { letter: "L", description: "L shape with thumb and index" },
  { letter: "M", description: "Three fingers over thumb" },
  { letter: "N", description: "Two fingers over thumb" },
  { letter: "O", description: "Fingers touch thumb in O" },
  { letter: "P", description: "K hand pointing down" },
  { letter: "Q", description: "G hand pointing down" },
  { letter: "R", description: "Crossed index and middle" },
  { letter: "S", description: "Fist with thumb over fingers" },
  { letter: "T", description: "Thumb between index and middle" },
  { letter: "U", description: "Index and middle together up" },
  { letter: "V", description: "Peace sign" },
  { letter: "W", description: "Three fingers up spread" },
  { letter: "X", description: "Index finger hooked" },
  { letter: "Y", description: "Thumb and pinky extended" },
  { letter: "Z", description: "Index traces Z in air" },
];

const ASLAlphabetSection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            ASL Alphabet Reference
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Learn the American Sign Language alphabet—the foundation of fingerspelling and communication.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 lg:grid-cols-13 gap-3"
        >
          {alphabetSigns.map((sign, index) => (
            <motion.div
              key={sign.letter}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.02 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.1, y: -5 }}
              className="group relative"
            >
              <div className="aspect-square bg-card border border-border rounded-xl flex flex-col items-center justify-center p-2 shadow-sm hover:shadow-lg hover:border-primary/50 transition-all duration-300 cursor-pointer">
                <span className="text-2xl md:text-3xl font-bold text-primary group-hover:text-accent transition-colors">
                  {sign.letter}
                </span>
                <div className="w-10 h-10 md:w-12 md:h-12 mt-1 rounded-lg bg-muted/50 flex items-center justify-center">
                  <ASLHandIcon letter={sign.letter} />
                </div>
              </div>
              
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 border border-border">
                {sign.description}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground text-sm">
            Hover over each letter to see how to form the hand shape. Practice daily to build muscle memory!
          </p>
        </motion.div>
      </div>
    </section>
  );
};

// SVG hand icons for each letter
const ASLHandIcon = ({ letter }: { letter: string }) => {
  const iconPaths: Record<string, React.ReactNode> = {
    A: (
      <svg viewBox="0 0 32 32" className="w-full h-full text-foreground">
        <circle cx="16" cy="18" r="8" fill="currentColor" opacity="0.2" />
        <path d="M12 22c0-4 2-8 4-8s4 4 4 8" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="10" cy="16" r="2" fill="currentColor" />
      </svg>
    ),
    B: (
      <svg viewBox="0 0 32 32" className="w-full h-full text-foreground">
        <rect x="10" y="8" width="12" height="16" rx="2" fill="currentColor" opacity="0.2" />
        <path d="M12 24V10M15 24V10M18 24V10M21 24V10" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    C: (
      <svg viewBox="0 0 32 32" className="w-full h-full text-foreground">
        <path d="M20 8c-6 0-10 4-10 8s4 8 10 8" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    ),
    D: (
      <svg viewBox="0 0 32 32" className="w-full h-full text-foreground">
        <circle cx="16" cy="20" r="6" fill="currentColor" opacity="0.2" />
        <path d="M16 6v10" stroke="currentColor" strokeWidth="2" />
        <circle cx="16" cy="20" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    ),
    E: (
      <svg viewBox="0 0 32 32" className="w-full h-full text-foreground">
        <path d="M10 16c0 4 3 8 6 8s6-4 6-8-3-4-6-4-6 0-6 4z" fill="currentColor" opacity="0.2" />
        <path d="M12 14c2-2 4-2 6 0M12 18c2 2 4 2 6 0" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    F: (
      <svg viewBox="0 0 32 32" className="w-full h-full text-foreground">
        <circle cx="14" cy="20" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M16 8v8M19 8v8M22 8v8" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    G: (
      <svg viewBox="0 0 32 32" className="w-full h-full text-foreground">
        <path d="M8 16h12M8 16l4-4M8 16l4 4" stroke="currentColor" strokeWidth="2" />
        <circle cx="22" cy="16" r="3" fill="currentColor" opacity="0.3" />
      </svg>
    ),
    H: (
      <svg viewBox="0 0 32 32" className="w-full h-full text-foreground">
        <path d="M8 14h16M8 18h16" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    I: (
      <svg viewBox="0 0 32 32" className="w-full h-full text-foreground">
        <circle cx="16" cy="20" r="6" fill="currentColor" opacity="0.2" />
        <path d="M20 8v10" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    J: (
      <svg viewBox="0 0 32 32" className="w-full h-full text-foreground">
        <path d="M20 8v10c0 4-4 6-8 4" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    ),
    K: (
      <svg viewBox="0 0 32 32" className="w-full h-full text-foreground">
        <path d="M14 8v16M14 16l6-6M14 16l6 6" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    L: (
      <svg viewBox="0 0 32 32" className="w-full h-full text-foreground">
        <path d="M12 8v16h10" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    ),
    M: (
      <svg viewBox="0 0 32 32" className="w-full h-full text-foreground">
        <circle cx="16" cy="18" r="8" fill="currentColor" opacity="0.2" />
        <path d="M10 20c2-4 4-4 6 0c2-4 4-4 6 0" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    ),
    N: (
      <svg viewBox="0 0 32 32" className="w-full h-full text-foreground">
        <circle cx="16" cy="18" r="8" fill="currentColor" opacity="0.2" />
        <path d="M12 20c2-4 4-4 8 0" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    ),
    O: (
      <svg viewBox="0 0 32 32" className="w-full h-full text-foreground">
        <circle cx="16" cy="16" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    ),
    P: (
      <svg viewBox="0 0 32 32" className="w-full h-full text-foreground">
        <path d="M14 8v16M14 12h4c3 0 4 2 4 4s-1 4-4 4h-4" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    ),
    Q: (
      <svg viewBox="0 0 32 32" className="w-full h-full text-foreground">
        <circle cx="16" cy="14" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M20 18l4 6" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    R: (
      <svg viewBox="0 0 32 32" className="w-full h-full text-foreground">
        <path d="M14 16l6-6M14 16l6 6" stroke="currentColor" strokeWidth="2" />
        <path d="M13 10h6" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    S: (
      <svg viewBox="0 0 32 32" className="w-full h-full text-foreground">
        <circle cx="16" cy="16" r="8" fill="currentColor" opacity="0.2" />
        <ellipse cx="16" cy="16" rx="6" ry="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    ),
    T: (
      <svg viewBox="0 0 32 32" className="w-full h-full text-foreground">
        <circle cx="16" cy="18" r="7" fill="currentColor" opacity="0.2" />
        <path d="M16 12v8" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="16" r="2" fill="currentColor" />
      </svg>
    ),
    U: (
      <svg viewBox="0 0 32 32" className="w-full h-full text-foreground">
        <path d="M12 8v12c0 3 2 4 4 4s4-1 4-4V8" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    ),
    V: (
      <svg viewBox="0 0 32 32" className="w-full h-full text-foreground">
        <path d="M10 8l6 16l6-16" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    ),
    W: (
      <svg viewBox="0 0 32 32" className="w-full h-full text-foreground">
        <path d="M8 8l4 16l4-12l4 12l4-16" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    ),
    X: (
      <svg viewBox="0 0 32 32" className="w-full h-full text-foreground">
        <path d="M10 8l12 16M22 8l-12 16" stroke="currentColor" strokeWidth="2" />
        <path d="M14 14c2 0 4 2 4 4" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    ),
    Y: (
      <svg viewBox="0 0 32 32" className="w-full h-full text-foreground">
        <path d="M10 8l6 10v6M22 8l-6 10" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    ),
    Z: (
      <svg viewBox="0 0 32 32" className="w-full h-full text-foreground">
        <path d="M10 10h12l-12 12h12" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    ),
  };

  return iconPaths[letter] || <div className="w-full h-full bg-muted rounded" />;
};

export default ASLAlphabetSection;
