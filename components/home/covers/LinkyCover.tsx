"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * Linky case cover built from layers instead of a flat PNG, so it can play
 * the product's core loop: a chat reply, Ctrl Alt V opens the launcher, the
 * selection moves to a link, Enter pastes it, the message is sent.
 *
 * The stage is a 60em × 40em (3:2) scene whose em is 1/60 of the card width,
 * so the whole picture scales with the card. Only leaf text elements change
 * font-size, so em paddings and sizes on containers stay in scene units.
 */

const ITEMS = [
  { title: "Portfolio", sub: "behance.net/tony-design", tint: "#fde3cc", kind: "link" },
  { title: "Book a 30-min call", sub: "cal.com/tony/30min", tint: "#d4f1e1", kind: "link" },
  { title: "GitHub", sub: "github.com/tony", tint: "#d8e7fd", kind: "link" },
  { title: "Quick reply", sub: "Thanks! I'll get back to you within a day.", tint: "#e6defc", kind: "text" },
] as const;

const PASTED = ITEMS[1].sub;

/** One beat of the loop: what the scene shows and how long it holds. */
type Beat = { open: boolean; sel: number; pressed: boolean; typed: boolean; sent: boolean; ms: number };

const BEATS: Beat[] = [
  { open: false, sel: 0, pressed: false, typed: false, sent: false, ms: 1100 },
  { open: true, sel: 0, pressed: false, typed: false, sent: false, ms: 900 },
  { open: true, sel: 1, pressed: false, typed: false, sent: false, ms: 1000 },
  { open: true, sel: 1, pressed: true, typed: false, sent: false, ms: 260 },
  { open: false, sel: 1, pressed: false, typed: true, sent: false, ms: 1100 },
  { open: false, sel: 1, pressed: false, typed: false, sent: true, ms: 2400 },
];

/** Still frame for reduced motion: the launcher open on the first link, as in the original cover. */
const STILL: Beat = { open: true, sel: 0, pressed: false, typed: false, sent: false, ms: 0 };

const EASE = [0.22, 1, 0.36, 1] as const;

export function LinkyCover() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-15% 0px" });
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);

  const playing = inView && !reduce;

  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(() => setStep((s) => (s + 1) % BEATS.length), BEATS[step].ms);
    return () => clearTimeout(id);
  }, [playing, step]);

  const beat = reduce ? STILL : BEATS[step];

  return (
    <div
      ref={ref}
      aria-hidden
      className="absolute inset-0 select-none overflow-hidden [container-type:inline-size]"
    >
      <div className="absolute inset-0 text-[#101012]" style={{ fontSize: "calc(100cqw / 60)" }}>
        {/* Chat window: the app Linky pastes into. */}
        <div className="absolute left-[3em] top-[2.6em] flex h-[34.8em] w-[37em] flex-col rounded-[2.2em] bg-white p-[2.2em] shadow-[0_0.2em_0.6em_rgba(16,16,18,0.04),0_1.6em_4em_rgba(16,16,18,0.08)]">
          <div className="flex items-center gap-[1.1em]">
            <div className="size-[3.2em] rounded-full bg-[linear-gradient(135deg,#ffb23f,#ff7a1a)]" />
            <div className="leading-tight">
              <div className="text-[1.45em] font-medium">Anna Petrova</div>
              <div className="text-[1.2em] text-[#1b9a52]">online</div>
            </div>
            <div className="ml-auto flex gap-[1.4em] text-[#9a9aa2]">
              <span className="block h-[0.12em] w-[1em] self-center bg-current" />
              <span className="block size-[0.95em] rounded-[0.15em] border-[0.12em] border-current" />
              <span className="relative block size-[1em] before:absolute before:left-1/2 before:top-0 before:h-full before:w-[0.12em] before:-translate-x-1/2 before:rotate-45 before:bg-current after:absolute after:left-1/2 after:top-0 after:h-full after:w-[0.12em] after:-translate-x-1/2 after:-rotate-45 after:bg-current" />
            </div>
          </div>

          <div className="mt-[2.4em] flex flex-1 flex-col items-start gap-[0.9em]">
            <Bubble>Hey! Loved your work on the dashboard.</Bubble>
            <Bubble>Could you send your portfolio? And your calendar for a call?</Bubble>
            <AnimatePresence>
              {beat.sent && (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, y: "0.8em", scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.25 } }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="origin-bottom-right self-end rounded-[1.6em] rounded-br-[0.5em] bg-[#101012] px-[1.5em] py-[1em] text-white"
                >
                  <span className="text-[1.3em] leading-snug">
                    Sure! Here you go: <span className="text-[#ffb562] underline underline-offset-2">{PASTED}</span>
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Composer. */}
          <div className="flex h-[4.6em] items-center rounded-full bg-[#f1f1f3] pl-[1.8em] pr-[0.6em]">
            <span className="min-w-0 flex-1 truncate text-[1.35em]">
              {!beat.sent && "Sure! Here you go: "}
              {beat.typed && (
                <motion.span
                  initial={{ backgroundColor: "rgba(255,138,42,0.35)" }}
                  animate={{ backgroundColor: "rgba(255,138,42,0)" }}
                  transition={{ duration: 0.9 }}
                  className="rounded-[0.2em] text-[#c4551f]"
                >
                  {PASTED}
                </motion.span>
              )}
              <span className="ml-px inline-block h-[1.1em] w-[0.08em] translate-y-[0.18em] animate-[linky-caret_1s_steps(1)_infinite] bg-[#101012]" />
            </span>
            <motion.span
              animate={{ scale: beat.sent ? [1, 0.88, 1] : 1 }}
              transition={{ duration: 0.3 }}
              className="grid size-[3.4em] place-items-center rounded-full bg-[#101012] text-white"
            >
              <Arrow />
            </motion.span>
          </div>
        </div>

        {/* Launcher: Linky itself, floating over the chat. */}
        <AnimatePresence>
          {beat.open && (
            <motion.div
              key="launcher"
              initial={{ opacity: 0, scale: 0.96, y: "0.8em" }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.18 } }}
              transition={{ duration: 0.4, ease: EASE }}
              className="absolute left-[17em] top-[9.4em] w-[39.5em] origin-bottom-left rounded-[2em] border-[0.1em] border-white/80 bg-[rgba(244,244,246,0.86)] p-[1.2em] shadow-[0_0.4em_1em_rgba(16,16,18,0.06),0_2.4em_5em_rgba(16,16,18,0.16)] backdrop-blur-[1.2em]"
            >
              <div className="flex items-center gap-[1em] px-[0.8em] pb-[1.1em] pt-[0.4em]">
                <Search />
                <span className="flex-1 text-[1.55em] text-[#9a9aa2]">Search links &amp; snippets</span>
                <span className="rounded-full bg-[#f3e2cf] px-[0.9em] py-[0.25em]">
                  <span className="text-[1.05em] text-[#7a6450]">Ctrl Alt V</span>
                </span>
              </div>
              <div className="flex gap-[0.6em] px-[0.4em] pb-[1em]">
                {["All", "Work", "Dev", "Design", "Replies"].map((c, i) => (
                  <span
                    key={c}
                    className={`rounded-full px-[1.2em] py-[0.55em] ${i === 0 ? "bg-[#101012] text-white" : "bg-white/70 shadow-[0_0_0_0.1em_rgba(0,0,0,0.05)]"}`}
                  >
                    <span className="text-[1.2em]">{c}</span>
                  </span>
                ))}
              </div>

              <div className="relative">
                {/* The selection pill slides between rows. */}
                <motion.div
                  className="absolute inset-x-0 top-0 h-[5.2em] rounded-[1.4em] bg-white shadow-[0_0.2em_0.8em_rgba(16,16,18,0.08)]"
                  animate={{ y: `${beat.sel * 5.2}em`, scale: beat.pressed ? 0.985 : 1 }}
                  transition={{ duration: 0.35, ease: EASE }}
                />
                {ITEMS.map((item, i) => {
                  const active = i === beat.sel;
                  return (
                    <div key={item.title} className="relative flex h-[5.2em] items-center gap-[1.2em] px-[0.8em]">
                      <span className="grid size-[3.4em] shrink-0 place-items-center rounded-full text-[#2a2a30]" style={{ background: item.tint }}>
                        {item.kind === "link" ? <LinkIcon /> : <Lines />}
                      </span>
                      <span className="min-w-0 flex-1 leading-tight">
                        <span className="block text-[1.35em]">{item.title}</span>
                        <span className="block truncate text-[1.15em] text-[#9a9aa2]">{item.sub}</span>
                      </span>
                      {active ? (
                        <span className="flex items-center gap-[0.8em]">
                          <span className="text-[1.2em] text-[#6a6a72]">Paste</span>
                          <motion.span
                            animate={{ scale: active && beat.pressed ? 0.86 : 1 }}
                            transition={{ duration: 0.15 }}
                            className="grid size-[3em] place-items-center rounded-full bg-[#101012] text-white"
                          >
                            <Enter />
                          </motion.span>
                        </span>
                      ) : (
                        <span className="mr-[0.4em] grid size-[2.4em] place-items-center rounded-full bg-[#f6e6d6]">
                          <span className="text-[1.1em] text-[#7a6450]">{i + 1}</span>
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-[0.8em] px-[0.8em] pb-[0.2em] pt-[1em] text-[#6a6a72]">
                <span className="text-[1.25em]">+ Save from clipboard</span>
                <span className="ml-auto text-[1.1em] text-[#a2a2aa]">↑↓ navigate · ↵ paste · esc close</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Bubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[24em] rounded-[1.6em] rounded-bl-[0.5em] bg-[#f1f1f3] px-[1.5em] py-[1em]">
      <span className="text-[1.3em] leading-snug">{children}</span>
    </div>
  );
}

const svg = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function Search() {
  return (
    <svg viewBox="0 0 24 24" className="size-[2em] text-[#4a4a52]" {...svg}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[1.6em]" {...svg}>
      <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
      <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
    </svg>
  );
}

function Lines() {
  return (
    <svg viewBox="0 0 24 24" className="size-[1.6em]" {...svg}>
      <path d="M5 7h14M5 12h14M5 17h9" />
    </svg>
  );
}

function Enter() {
  return (
    <svg viewBox="0 0 24 24" className="size-[1.4em]" {...svg}>
      <path d="M19 6v5a3 3 0 0 1-3 3H6" />
      <path d="m10 10-4 4 4 4" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" className="size-[1.6em]" {...svg}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
