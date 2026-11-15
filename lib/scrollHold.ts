/**
 * Swallows the leftover of the scroll that opened the next case.
 *
 * The next case opens because the reader kept scrolling; a trackpad or a
 * flicked wheel keeps sending scroll input for a while after that (momentum).
 * Without a hold, that leftover lands on the new page and skips its beginning.
 *
 * Only the leftover is held, never a new intention to scroll:
 * - Momentum dies down: each event is about as strong as the last or weaker,
 *   arriving every frame. That is held.
 * - A new gesture after the page has changed starts after a pause, or gets
 *   stronger than the momentum it follows. The hold ends on that very event,
 *   so the reader's own scroll goes through at once, with no second try.
 * - Otherwise the hold ends after `idleMs` of quiet, and never lasts past `maxMs`.
 *
 * Cancelling events alone is not enough: Chrome sends the rest of a trackpad
 * gesture as non-cancelable wheel events. So while held the page itself doesn't
 * scroll (overflow: hidden on <html>; the router's jump to the top still works).
 *
 * Module state, so it carries across client-side navigation.
 */
let release: (() => void) | null = null;

/** Ignore new-gesture checks this long, while the page morph plays. */
const SETTLE_MS = 200;
/** A pause this long between events means the old gesture is over. */
const GAP_MS = 80;

export function holdScroll({ idleMs = 100, maxMs = 1200 } = {}) {
  release?.();
  const started = performance.now();
  const root = document.documentElement;
  const previousOverflow = root.style.overflow;
  root.style.overflow = "hidden";

  let idle = 0;
  let lastTime = started;
  let lastStrength = Infinity;

  const end = () => {
    root.style.overflow = previousOverflow;
    window.clearTimeout(idle);
    window.clearTimeout(cap);
    window.removeEventListener("wheel", onWheel, true);
    window.removeEventListener("touchstart", end, true);
    window.removeEventListener("keydown", end, true);
    release = null;
  };
  const arm = () => {
    window.clearTimeout(idle);
    idle = window.setTimeout(end, idleMs);
  };

  function onWheel(e: WheelEvent) {
    const now = performance.now();
    const strength = Math.abs(e.deltaY);
    const settled = now - started > SETTLE_MS;
    const fresh = now - lastTime > GAP_MS || strength > lastStrength * 1.4 + 2;
    lastTime = now;
    lastStrength = strength;
    if (settled && fresh) {
      // The reader is scrolling on purpose: let this event through.
      end();
      return;
    }
    if (e.cancelable) e.preventDefault();
    arm();
  }

  const cap = window.setTimeout(end, maxMs);
  // Capture phase, so this runs before anything else reacts to the wheel.
  window.addEventListener("wheel", onWheel, { capture: true, passive: false });
  // A new touch or a key press is always intentional.
  window.addEventListener("touchstart", end, { capture: true, passive: true });
  window.addEventListener("keydown", end, true);
  arm();
  release = end;
}
