"use client";

import { useEffect } from "react";
import { useAnimate, useReducedMotion } from "framer-motion";

export function Preloader({ text }: { text: string }) {
  const [scope, animate] = useAnimate();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let cancelled = false;
    const playSequence = async () => {
      try {
        if (reduceMotion) {
          await animate(".loader-text", { opacity: 1 }, { duration: 0.4, ease: "easeOut", delay: 0.1 });
          if (cancelled) return;
          await new Promise((resolve) => setTimeout(resolve, 500));
          if (cancelled) return;
          await animate(".loader-text", { opacity: 0 }, { duration: 0.3, ease: "easeIn" });
          if (cancelled) return;
          await animate(".preloader-overlay", { opacity: 0 }, { duration: 0.3, ease: "easeInOut" });
          if (cancelled) return;
          animate(".preloader-overlay", { display: "none" }, { duration: 0 });
          return;
        }
        await animate(
          ".loader-text",
          { opacity: 1, filter: "blur(0px)" },
          { duration: 1.5, ease: "easeOut", delay: 0.2 }
        );
        if (cancelled) return;
        await new Promise((resolve) => setTimeout(resolve, 800));
        if (cancelled) return;
        await animate(
          ".loader-text",
          { opacity: 0, filter: "blur(10px)" },
          { duration: 0.5, ease: "easeIn" }
        );
        if (cancelled) return;
        await animate(
          ".preloader-overlay",
          { opacity: 0, filter: "blur(20px)" },
          { duration: 1, ease: "easeInOut" }
        );
        if (cancelled) return;
        animate(".preloader-overlay", { display: "none" }, { duration: 0 });
      } catch {
        // component unmounted mid-sequence (e.g. React Strict Mode dev double-invoke) — ignore
      }
    };
    playSequence();
    return () => {
      cancelled = true;
    };
  }, [animate, reduceMotion]);

  return (
    <div ref={scope}>
      <div
        className="preloader-overlay"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000",
        }}
      >
        <span
          className="loader-text"
          style={{
            opacity: 0,
            filter: reduceMotion ? "none" : "blur(10px)",
            color: "#fff",
            fontSize: "clamp(20px, 3vw, 32px)",
            fontWeight: 500,
            letterSpacing: "-0.01em",
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
}
