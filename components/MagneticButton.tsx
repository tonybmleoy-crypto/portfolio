"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState } from "react";

export function MagneticButton({
  label,
  href,
  strength = 0.4,
  className,
}: {
  label: string;
  href: string;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const wrapX = useSpring(useMotionValue(0), { stiffness: 200, damping: 20, mass: 0.5 });
  const wrapY = useSpring(useMotionValue(0), { stiffness: 200, damping: 20, mass: 0.5 });
  const innerX = useSpring(useMotionValue(0), { stiffness: 250, damping: 18, mass: 0.3 });
  const innerY = useSpring(useMotionValue(0), { stiffness: 250, damping: 18, mass: 0.3 });

  function handleMouseMove(e: React.MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    setHovered(true);
    wrapX.set(dx * strength);
    wrapY.set(dy * strength);
    innerX.set(dx * strength * 0.3);
    innerY.set(dy * strength * 0.3);
  }

  function handleMouseLeave() {
    setHovered(false);
    wrapX.set(0);
    wrapY.set(0);
    innerX.set(0);
    innerY.set(0);
  }

  return (
    <div
      className={`inline-flex ${className ?? ""}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div ref={ref} style={{ x: wrapX, y: wrapY }} className="inline-flex">
        <motion.a
          href={href}
          target="_blank"
          rel="noreferrer"
          onTapStart={() => setClicked(true)}
          onTap={() => setClicked(false)}
          onTapCancel={() => setClicked(false)}
          animate={{ scale: clicked ? 0.93 : hovered ? 1.04 : 1 }}
          transition={{ type: "spring", bounce: 0, duration: clicked ? 0.15 : 0.3 }}
          className="hero-pill inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full px-8 py-3.5 text-base font-medium outline-none"
        >
          <motion.span style={{ x: innerX, y: innerY }} className="inline-flex items-center gap-2">
            {label}
          </motion.span>
        </motion.a>
      </motion.div>
    </div>
  );
}
