"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

export function CoverVideo({
  mp4,
  webm,
  width,
  height,
  poster,
}: {
  mp4: string;
  webm?: string;
  width: number;
  height: number;
  poster: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    if (reduceMotion) {
      video.pause();
      return;
    }

    // React never serializes `muted` to an HTML attribute, so the server markup
    // reads as unmuted and the browser blocks autoplay. Set it on the element
    // and start playback ourselves.
    video.muted = true;
    video.play().catch(() => {
      // Autoplay can still be refused (data saver, battery saver). The poster stays.
    });
  }, [reduceMotion]);

  return (
    <video
      ref={ref}
      autoPlay={!reduceMotion}
      loop
      muted
      playsInline
      poster={poster}
      width={width}
      height={height}
      className="h-auto w-full object-contain"
    >
      {webm && <source src={webm} type="video/webm" />}
      <source src={mp4} type="video/mp4" />
    </video>
  );
}
