import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Hand, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import PageNavigation from "./PageNavigation";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 glass-panel"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/">
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
                  <Hand className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-display font-bold text-xl text-foreground">
                  ASL Bridge
                </span>
              </motion.div>
            </Link>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
              <Button variant="hero" size="sm">
                Get Started Free
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pb-4"
            >
              <div className="flex flex-col gap-2 px-4">
                <Button variant="ghost" className="w-full">
                  Sign In
                </Button>
                <Button variant="hero" className="w-full">
                  Get Started Free
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.header>
      <PageNavigation />
    </>
  );
};

export default Header;