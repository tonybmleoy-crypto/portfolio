"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Pause, Play } from "iconsax-react";
import type { Track } from "@/lib/content";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function MusicPlayer({
  track,
  links,
}: {
  track: Track;
  links: { label: string; href: string }[];
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [time, setTime] = useState(0);
  const [scrubbing, setScrubbing] = useState(false);

  // Progress lives outside React so the bar can move every frame
  // without re-rendering the component.
  const progress = useMotionValue(0);
  const width = useTransform(progress, (v) => `${Math.min(100, Math.max(0, v * 100))}%`);

  useEffect(() => {
    if (!playing || scrubbing) return;
    let frame = 0;
    const tick = () => {
      const audio = audioRef.current;
      if (audio?.duration) progress.set(audio.currentTime / audio.duration);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, scrubbing, progress]);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) audio.pause();
    else void audio.play().catch(() => setPlaying(false));
  }

  function seekTo(clientX: number) {
    const bar = barRef.current;
    const audio = audioRef.current;
    if (!bar || !audio) return null;
    const rect = bar.getBoundingClientRect();
    const fraction = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    progress.set(fraction);
    if (audio.duration) setTime(fraction * audio.duration);
    return fraction;
  }

  return (
    <div
      className="rounded-[28px] p-[3px]"
      style={{ background: "var(--glass-outer-bg)", boxShadow: "var(--glass-outer-shadow)" }}
    >
      <div
        className="rounded-[25px] p-4 sm:p-5"
        style={{
          background: "var(--glass-inner-bg)",
          backdropFilter: "blur(24px) saturate(160%)",
          WebkitBackdropFilter: "blur(24px) saturate(160%)",
          boxShadow: "var(--glass-inner-inset)",
        }}
      >
        <div className="flex items-center gap-4">
          {track.cover && (
            <div className="relative size-14 shrink-0 overflow-hidden rounded-2xl shadow-card">
              <Image src={track.cover} alt="" fill sizes="56px" className="object-cover" />
            </div>
          )}

          <motion.button
            type="button"
            onClick={toggle}
            whileTap={{ scale: 0.92, transition: { type: "spring", bounce: 0, duration: 0.15 } }}
            aria-label={playing ? `Pause ${track.title}` : `Play ${track.title}`}
            aria-pressed={playing}
            className="flex size-12 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-transform duration-150"
          >
            {playing ? (
              <Pause color="currentColor" variant="Bold" size={20} />
            ) : (
              // Nudged right so the triangle reads as centred inside the circle.
              <Play color="currentColor" variant="Bold" size={20} className="translate-x-[1px]" />
            )}
          </motion.button>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{track.title}</p>
            {track.artist && <p className="truncate text-xs text-muted">{track.artist}</p>}
          </div>

          <span className="shrink-0 text-xs tabular-nums text-muted">
            {formatTime(time)} / {formatTime(duration)}
          </span>
        </div>

        {/* Scrubber. Pointer capture keeps the drag alive outside the bar. */}
        <div
          ref={barRef}
          role="slider"
          tabIndex={0}
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(time)}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            setScrubbing(true);
            seekTo(e.clientX);
          }}
          onPointerMove={(e) => {
            if (scrubbing) seekTo(e.clientX);
          }}
          onPointerUp={(e) => {
            const fraction = seekTo(e.clientX);
            const audio = audioRef.current;
            if (audio && fraction !== null && audio.duration) {
              audio.currentTime = fraction * audio.duration;
            }
            setScrubbing(false);
          }}
          onKeyDown={(e) => {
            const audio = audioRef.current;
            if (!audio?.duration) return;
            if (e.key === "ArrowRight") audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
            if (e.key === "ArrowLeft") audio.currentTime = Math.max(0, audio.currentTime - 5);
          }}
          className="mt-4 cursor-pointer touch-none py-2"
        >
          <div className="h-1 w-full overflow-hidden rounded-full bg-[color:var(--fill-quiet-hover)]">
            <motion.div className="h-full rounded-full bg-foreground" style={{ width }} />
          </div>
        </div>

        {links.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-[color:var(--fill-quiet)] px-3 py-1.5 text-xs font-medium transition-[background-color,transform] duration-150 hover:bg-[color:var(--fill-quiet-hover)] active:scale-[0.96]"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}

        {/* Never autoplays: sound only starts from a tap. */}
        <audio
          ref={audioRef}
          src={track.src}
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => {
            setPlaying(false);
            progress.set(0);
            setTime(0);
          }}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onTimeUpdate={(e) => {
            if (scrubbing) return;
            const audio = e.currentTarget;
            setTime(audio.currentTime);
            // The rAF loop only runs while playing, so keep the bar in step
            // when the position changes on pause (seek, reset, end of track).
            if (!playing && audio.duration) progress.set(audio.currentTime / audio.duration);
          }}
        />
      </div>
    </div>
  );
}
