import { motion } from "framer-motion";

// Import all ASL alphabet images
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

const alphabetSigns = [
  { letter: "A", description: "Fist with thumb beside", image: aslA },
  { letter: "B", description: "Flat hand, thumb tucked", image: aslB },
  { letter: "C", description: "Curved hand like C", image: aslC },
  { letter: "D", description: "Index up, others touch thumb", image: aslD },
  { letter: "E", description: "Fingers curled, thumb tucked", image: aslE },
  { letter: "F", description: "OK sign, three fingers up", image: aslF },
  { letter: "G", description: "Index and thumb point sideways", image: aslG },
  { letter: "H", description: "Index and middle point sideways", image: aslH },
  { letter: "I", description: "Pinky up, fist closed", image: aslI },
  { letter: "J", description: "Pinky up, trace J shape", image: aslJ },
  { letter: "K", description: "Index, middle up, thumb between", image: aslK },
  { letter: "L", description: "L shape with thumb and index", image: aslL },
  { letter: "M", description: "Three fingers over thumb", image: aslM },
  { letter: "N", description: "Two fingers over thumb", image: aslN },
  { letter: "O", description: "Fingers touch thumb in O", image: aslO },
  { letter: "P", description: "K hand pointing down", image: aslP },
  { letter: "Q", description: "G hand pointing down", image: aslQ },
  { letter: "R", description: "Crossed index and middle", image: aslR },
  { letter: "S", description: "Fist with thumb over fingers", image: aslS },
  { letter: "T", description: "Thumb between index and middle", image: aslT },
  { letter: "U", description: "Index and middle together up", image: aslU },
  { letter: "V", description: "Peace sign", image: aslV },
  { letter: "W", description: "Three fingers up spread", image: aslW },
  { letter: "X", description: "Index finger hooked", image: aslX },
  { letter: "Y", description: "Thumb and pinky extended", image: aslY },
  { letter: "Z", description: "Index traces Z in air", image: aslZ },
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
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 xl:grid-cols-13 gap-4"
        >
          {alphabetSigns.map((sign, index) => (
            <motion.div
              key={sign.letter}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.02 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative"
            >
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:border-primary/50 transition-all duration-300 cursor-pointer">
                <div className="relative aspect-square bg-white">
                  <img
                    src={sign.image}
                    alt={`ASL sign for letter ${sign.letter}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-md">
                    {sign.letter}
                  </div>
                </div>
              </div>
              
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 border border-border">
                <span className="font-semibold">{sign.letter}:</span> {sign.description}
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

export default ASLAlphabetSection;
