"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

function ChevronUpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="m5 15 7-7 7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
            whileHover={{
              scale: 1.1,
              boxShadow:
                "inset 0px 1px 0px 0px rgba(255,255,255,0.7), 0px 1px 2px rgba(16,16,18,0.04), 0px 4px 8px rgba(16,16,18,0.06), 0px 12px 20px rgba(16,16,18,0.1), 0px 24px 48px rgba(16,16,18,0.16)",
              transition: { type: "spring", bounce: 0, duration: 0.25 },
            }}
            whileTap={{ scale: 0.94, transition: { type: "spring", bounce: 0, duration: 0.15 } }}
            style={{
              boxShadow:
                "inset 0px 1px 0px 0px rgba(255,255,255,0.6), 0px 1px 2px rgba(16,16,18,0.04), 0px 4px 8px rgba(16,16,18,0.04), 0px 12px 12px rgba(16,16,18,0.02), 0px 24px 24px rgba(16,16,18,0.01)",
            }}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-white/70 text-foreground backdrop-blur-xl backdrop-saturate-150"
          >
            <ChevronUpIcon />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
