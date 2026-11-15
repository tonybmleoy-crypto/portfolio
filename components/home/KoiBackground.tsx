"use client";

import { useEffect, useRef } from "react";

/**
 * Pixel koi swimming behind the home sections (Figma: "Фон с рыбами · B — Кои").
 *
 * One fixed canvas under the content that ignores the pointer. Drawn on an 8px
 * grid (7px squares, 1px gaps), so the fish move "by cells".
 *
 * What makes them feel alive:
 * - The spine is a chain of segments, each pulled along behind the one before
 *   it, so a turn travels down the body; a swimming wave rides on top of it and
 *   beats faster when the fish speeds up.
 * - Shading: darker cells at the flanks, lighter along the back, eyes, see-through
 *   fins and tail, pectoral fins that paddle.
 * - Behaviour: smooth wandering, soft turns away from the screen edges, a little
 *   personal space between fish.
 * - Feeding: a click on empty space drops a few crumbs with a ripple; each fish
 *   goes for the nearest crumb, eats it (small ripple) and calms down again.
 *
 * Colours come from --koi-body / --koi-spot and follow the theme. Reduced
 * motion: drawn once, still, and clicks do nothing. Hidden tab: paused.
 * Phones: two smaller fish at up to 30 fps; desktop: four.
 */

const CELL = 8;
const GAP = 0.5; // 7px squares with a 1px gap
const SEGMENTS = 18;

const CRUISE = [18, 28]; // px/s range while wandering
const CHASE_SPEED = 85; // px/s while going for food
const TURN_WANDER = 0.55; // rad/s, wandering
const TURN_CHASE = 2.4; // rad/s, at most while turning to food
const EDGE_MARGIN = 90; // px from the viewport edge where fish start turning back
const PERSONAL_SPACE = 110; // px between heads
const EAT_DISTANCE = 12; // px
const CRUMB_LIFE = 12; // s before an uneaten crumb fades away
const RIPPLE_TIME = 1.3; // s

/** Clicks on controls and on cards (anything on the card fill) drop nothing. */
const NO_DROP =
  "a, button, input, textarea, select, label, summary, dialog, [role='button'], [contenteditable='true'], .bg-surface";

type Shade = "fin" | "edge" | "mid" | "spine" | "spotEdge" | "spot" | "eye";
const PRIORITY: Record<Shade, number> = { fin: 1, edge: 2, mid: 3, spine: 4, spotEdge: 5, spot: 6, eye: 7 };
/** Alpha multipliers on top of the theme tokens. */
const ALPHA: Record<Shade, number> = { fin: 0.45, edge: 0.6, mid: 1, spine: 1.45, spotEdge: 0.75, spot: 1, eye: 3 };

interface Point {
  x: number;
  y: number;
}

interface Fish {
  spine: Point[]; // [0] is the head
  angle: number;
  speed: number;
  cruise: number;
  length: number; // px, head to tail root
  width: number; // px, half-width at the widest
  phase: number; // swimming wave
  wander: number; // noise seed
  spots: { u: number; v: number; ru: number; rv: number }[];
}

interface Crumb extends Point {
  born: number;
}

interface Ripple extends Point {
  born: number;
  radius: number;
}

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** "#rrggbbaa", "#rrggbb" or "rgba(r, g, b, a)" → [r, g, b, a]. */
function parseColour(value: string): [number, number, number, number] {
  const v = value.trim();
  if (v.startsWith("#")) {
    const hex = v.slice(1);
    const n = (i: number) => parseInt(hex.slice(i, i + 2), 16);
    return [n(0), n(2), n(4), hex.length >= 8 ? n(6) / 255 : 1];
  }
  const m = v.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0, 0];
  return [m[0], m[1], m[2], m[3] ?? 1];
}

/** Half-width of the body along the spine, u = 0 at the head, 1 at the tail root. */
function bodyProfile(u: number): number {
  if (u < 0.12) return 0.45 + 0.55 * Math.sqrt(u / 0.12);
  if (u < 0.36) return 1;
  return Math.max(0.16, 1 - 0.84 * ((u - 0.36) / 0.6));
}

function makeFish(count: number, w: number, h: number, small: boolean): Fish[] {
  const random = rng(11);
  return Array.from({ length: count }, (_, i) => {
    const length = (small ? 120 : 170) + random() * 40;
    const angle = random() * Math.PI * 2;
    const x = ((i + 0.5) / count) * w;
    const y = (0.25 + random() * 0.5) * h;
    const step = length / (SEGMENTS - 1);
    const spine = Array.from({ length: SEGMENTS }, (_, k) => ({
      x: x - Math.cos(angle) * step * k,
      y: y - Math.sin(angle) * step * k,
    }));
    const cruise = CRUISE[0] + random() * (CRUISE[1] - CRUISE[0]);
    return {
      spine,
      angle,
      speed: cruise,
      cruise,
      length,
      width: length * 0.12,
      phase: random() * Math.PI * 2,
      wander: random() * 1000,
      spots: Array.from({ length: 2 + Math.floor(random() * 2) }, () => ({
        u: 0.08 + random() * 0.55,
        v: (random() - 0.5) * 1.2,
        ru: 0.07 + random() * 0.08,
        rv: 0.45 + random() * 0.4,
      })),
    };
  });
}

/** Smooth noise in [-1, 1]: a few incommensurate sines. */
function noise(t: number) {
  return (Math.sin(t) + Math.sin(t * 1.73 + 1.3) * 0.6 + Math.sin(t * 0.47 + 4.1) * 0.8) / 2.4;
}

function turnTowards(current: number, target: number, maxStep: number) {
  const diff = Math.atan2(Math.sin(target - current), Math.cos(target - current));
  return current + Math.max(-maxStep, Math.min(maxStep, diff));
}

export function KoiBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let fish: Fish[] = [];
    let crumbs: Crumb[] = [];
    let ripples: Ripple[] = [];
    let body: [number, number, number, number] = [0, 0, 0, 0];
    let spot: [number, number, number, number] = [0, 0, 0, 0];
    let raf = 0;
    let last = 0;
    let time = 0;

    const readColours = () => {
      const style = getComputedStyle(document.documentElement);
      body = parseColour(style.getPropertyValue("--koi-body"));
      spot = parseColour(style.getPropertyValue("--koi-spot"));
    };

    const fill = (shade: Shade) => {
      const [r, g, b, a] = shade === "spot" || shade === "spotEdge" ? spot : body;
      return `rgba(${r}, ${g}, ${b}, ${Math.min(1, a * ALPHA[shade])})`;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const small = width < 1024;
      const count = small ? 2 : 4;
      if (fish.length !== count) fish = makeFish(count, width, height, small);
    };

    // ---------- drawing ----------

    const size = CELL - GAP * 2;

    const drawFish = (f: Fish) => {
      const cells = new Map<string, Shade>();
      const put = (x: number, y: number, shade: Shade) => {
        const key = Math.round(x / CELL) + "," + Math.round(y / CELL);
        const had = cells.get(key);
        if (!had || PRIORITY[shade] > PRIORITY[had]) cells.set(key, shade);
      };

      const n = f.spine.length;
      const beat = f.phase;
      const sway = (u: number) => f.width * 0.55 * Math.sin(beat - u * 5.5) * Math.pow(u, 1.4);
      const half = CELL / 2;

      // Body: walk the spine in half-cell steps, fill across it.
      for (let i = 0; i < n - 1; i++) {
        const a = f.spine[i];
        const b = f.spine[i + 1];
        const segLen = Math.hypot(a.x - b.x, a.y - b.y) || 1;
        const tx = (a.x - b.x) / segLen;
        const ty = (a.y - b.y) / segLen;
        const nx = -ty;
        const ny = tx;
        const subSteps = Math.max(1, Math.ceil(segLen / half));
        for (let s = 0; s < subSteps; s++) {
          const k = s / subSteps;
          const u = (i + k) / (n - 1);
          const cx = a.x + (b.x - a.x) * k;
          const cy = a.y + (b.y - a.y) * k;
          const w = f.width * bodyProfile(u);
          const off = sway(u);
          for (let y = -w; y <= w + 0.01; y += half) {
            const v = y / f.width;
            const flank = Math.abs(y) / w;
            const inSpot = u > 0.05 && u < 0.8 && f.spots.some((p) => ((u - p.u) / p.ru) ** 2 + ((v - p.v) / p.rv) ** 2 < 1);
            const shade: Shade = inSpot ? (flank > 0.75 ? "spotEdge" : "spot") : flank > 0.72 ? "edge" : flank < 0.3 ? "spine" : "mid";
            put(cx + nx * (y + off), cy + ny * (y + off), shade);
          }

          // Eyes, just behind the snout.
          if (i === 0 && s === Math.floor(subSteps * 0.7)) {
            for (const side of [1, -1]) put(cx + nx * (side * w * 0.6 + off), cy + ny * (side * w * 0.6 + off), "eye");
          }

          // Pectoral fins: swept back, paddling slowly.
          if (Math.abs(u - 0.22) < 0.5 / (n - 1) && s === 0) {
            const reach = f.width * (1.3 + 0.35 * Math.sin(time * 3.2 + f.wander));
            for (const side of [1, -1]) {
              for (let r = 0; r <= reach; r += half) {
                const outward = w + r * 0.8;
                const back = r * 0.7;
                for (let t = 0; t <= (1 - r / reach) * CELL * 1.5; t += half) {
                  put(cx - tx * (back + t) + nx * side * outward, cy - ty * (back + t) + ny * side * outward, "fin");
                }
              }
            }
          }
        }
      }

      // Tail fan beyond the last segment: forked, see-through, following the wave.
      const a = f.spine[n - 2];
      const b = f.spine[n - 1];
      const len = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      const tx = (a.x - b.x) / len;
      const ty = (a.y - b.y) / len;
      const nx = -ty;
      const ny = tx;
      const tailLength = f.length * 0.3;
      for (let d = 0; d <= tailLength; d += half) {
        const p = d / tailLength;
        const spread = f.width * (0.2 + 1.05 * p);
        const off = sway(1 + p * 0.35);
        for (let y = -spread; y <= spread + 0.01; y += half) {
          if (p > 0.55 && Math.abs(y) < spread * 0.38 * ((p - 0.55) / 0.45)) continue; // fork
          put(b.x - tx * d + nx * (y + off), b.y - ty * d + ny * (y + off), "fin");
        }
      }

      for (const [key, shade] of cells) {
        const [gx, gy] = key.split(",").map(Number);
        ctx.fillStyle = fill(shade);
        ctx.fillRect(gx * CELL + GAP, gy * CELL + GAP, size, size);
      }
    };

    const drawRipples = () => {
      ripples = ripples.filter((r) => time - r.born < RIPPLE_TIME);
      const [r, g, b, a] = body;
      for (const ripple of ripples) {
        const p = (time - ripple.born) / RIPPLE_TIME;
        const radius = Math.max(CELL * 0.6, (1 - Math.pow(1 - p, 3)) * ripple.radius);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.min(1, a * 1.6 * (1 - p))})`;
        const seen = new Set<string>();
        const steps = Math.max(8, Math.ceil((2 * Math.PI * radius) / (CELL * 0.6)));
        for (let i = 0; i < steps; i++) {
          const angle = (i / steps) * Math.PI * 2;
          const gx = Math.round((ripple.x + Math.cos(angle) * radius) / CELL);
          const gy = Math.round((ripple.y + Math.sin(angle) * radius) / CELL);
          const key = gx + "," + gy;
          if (seen.has(key)) continue;
          seen.add(key);
          ctx.fillRect(gx * CELL + GAP, gy * CELL + GAP, size, size);
        }
      }
    };

    const drawCrumbs = () => {
      const [r, g, b, a] = spot;
      for (const c of crumbs) {
        const age = time - c.born;
        const fade = Math.min(1, (CRUMB_LIFE - age) / 2);
        // Crumbs bob a little as they float.
        const bob = Math.sin(age * 2 + c.x) * 1.5;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.min(1, a * 2.6 * fade)})`;
        ctx.fillRect(Math.round(c.x / CELL) * CELL + GAP, Math.round((c.y + bob) / CELL) * CELL + GAP, size, size);
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      drawRipples();
      drawCrumbs();
      for (const f of fish) drawFish(f);
    };

    // ---------- behaviour ----------

    const step = (dt: number) => {
      time += dt;
      crumbs = crumbs.filter((c) => time - c.born < CRUMB_LIFE);

      for (const f of fish) {
        const head = f.spine[0];

        // Nearest crumb, if any.
        let food: Crumb | null = null;
        let foodDist = Infinity;
        for (const c of crumbs) {
          const d = Math.hypot(c.x - head.x, c.y - head.y);
          if (d < foodDist) {
            foodDist = d;
            food = c;
          }
        }

        let targetSpeed = f.cruise;
        if (food) {
          f.angle = turnTowards(f.angle, Math.atan2(food.y - head.y, food.x - head.x), TURN_CHASE * dt);
          targetSpeed = f.cruise + (CHASE_SPEED - f.cruise) * Math.min(1, foodDist / 160);
          if (foodDist < EAT_DISTANCE) {
            crumbs = crumbs.filter((c) => c !== food);
            ripples.push({ x: food.x, y: food.y, born: time, radius: 28 });
          }
        } else {
          // Wander: smooth noise on the heading.
          f.angle += noise(time * 0.35 + f.wander) * TURN_WANDER * dt;

          // Turn back softly near the edges, towards the middle of the screen.
          const nearEdge =
            head.x < EDGE_MARGIN || head.x > width - EDGE_MARGIN || head.y < EDGE_MARGIN || head.y > height - EDGE_MARGIN;
          if (nearEdge) f.angle = turnTowards(f.angle, Math.atan2(height / 2 - head.y, width / 2 - head.x), 0.9 * dt);

          // Keep a little distance from the others.
          for (const other of fish) {
            if (other === f) continue;
            const o = other.spine[0];
            const d = Math.hypot(o.x - head.x, o.y - head.y);
            if (d > 0 && d < PERSONAL_SPACE) {
              f.angle = turnTowards(f.angle, Math.atan2(head.y - o.y, head.x - o.x), 0.6 * dt * (1 - d / PERSONAL_SPACE));
            }
          }
        }

        // Ease the speed; the tail beats faster when the fish is faster.
        f.speed += (targetSpeed - f.speed) * Math.min(1, dt * 1.5);
        f.phase += dt * (2 + f.speed * 0.06);

        head.x += Math.cos(f.angle) * f.speed * dt;
        head.y += Math.sin(f.angle) * f.speed * dt;

        // Every segment is pulled along behind the one before it.
        const segment = f.length / (SEGMENTS - 1);
        for (let i = 1; i < f.spine.length; i++) {
          const prev = f.spine[i - 1];
          const cur = f.spine[i];
          const dx = cur.x - prev.x;
          const dy = cur.y - prev.y;
          const d = Math.hypot(dx, dy) || 1;
          cur.x = prev.x + (dx / d) * segment;
          cur.y = prev.y + (dy / d) * segment;
        }
      }
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const minGap = width < 768 ? 1000 / 30 : 0;
      if (last && now - last < minGap) return;
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      step(dt);
      draw();
    };

    const start = () => {
      cancelAnimationFrame(raf);
      last = 0;
      if (reduceMotion.matches || document.hidden) {
        draw();
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    // ---------- input ----------

    // `click`, not pointerdown: a finger that scrolls the page drops nothing.
    const onClick = (e: MouseEvent) => {
      if (reduceMotion.matches) return;
      if (e.target instanceof Element && e.target.closest(NO_DROP)) return;
      ripples.push({ x: e.clientX, y: e.clientY, born: time, radius: 90 });
      const random = rng(Math.floor(time * 1000));
      const count = 3 + Math.floor(random() * 3);
      for (let i = 0; i < count; i++) {
        crumbs.push({ x: e.clientX + (random() - 0.5) * 48, y: e.clientY + (random() - 0.5) * 48, born: time });
      }
    };

    readColours();
    resize();
    start();

    const onResize = () => {
      resize();
      draw();
    };
    const onVisibility = () => (document.hidden ? cancelAnimationFrame(raf) : start());
    const themeObserver = new MutationObserver(() => {
      readColours();
      draw();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    window.addEventListener("resize", onResize);
    window.addEventListener("click", onClick);
    document.addEventListener("visibilitychange", onVisibility);
    reduceMotion.addEventListener("change", start);

    return () => {
      cancelAnimationFrame(raf);
      themeObserver.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("click", onClick);
      document.removeEventListener("visibilitychange", onVisibility);
      reduceMotion.removeEventListener("change", start);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-0 h-full w-full" />;
}
