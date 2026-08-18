"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp2 } from "iconsax-react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed right-6 bottom-6 z-40 sm:right-8 sm:bottom-8"
        >
          <motion.button
            type="button"
            aria-label="Scroll to top"
            onClick={() => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.1, transition: { type: "spring", bounce: 0, duration: 0.25 } }}
            whileTap={{ scale: 0.94, transition: { type: "spring", bounce: 0, duration: 0.15 } }}
            style={{ boxShadow: "var(--float-shadow)" }}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--float-bg)] text-foreground backdrop-blur-xl backdrop-saturate-150 transition-shadow duration-200 hover:shadow-[var(--float-shadow-hover)]"
          >
            <ArrowUp2 color="currentColor" size={20} variant="Linear" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
