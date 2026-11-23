"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type Transition,
} from "framer-motion";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * 7 Ponds case cover: the investor's path on the platform, rebuilt in code
 * from the Figma screens. A cursor invests in the open object (amount
 * popover, confirm), the funding ring, the investors count and the balance
 * update, then it opens the next object from the list. Every loop moves to
 * the next object and the sums keep adding up, so the scene never resets.
 *
 * Scene units: the stage is 1200 × 800 design px and 1em = 1 design px
 * (font-size = card width / 1200). Only leaf text elements change
 * font-size, so em sizes on containers keep their units.
 */

const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING: Transition = { type: "spring", stiffness: 240, damping: 30 };
const POP: Transition = { type: "spring", stiffness: 520, damping: 30 };
const TEAL = "#22b8a0";
const TEAL_BTN = "linear-gradient(180deg, #7fe0cc 0%, #1fa58c 100%)";
const MUTED = "#8a8a93";

type Obj = {
  name: string;
  place: string;
  photo: string;
  goal: number;
  raised: number;
  investors: number;
  yield: number;
  term: number;
};

const OBJECTS: Obj[] = [
  {
    name: "Вилла в Барвихе",
    place: "ул. Волхонка, Московская область",
    photo: "villa",
    goal: 40_000_000,
    raised: 32_400_000,
    investors: 180,
    yield: 15,
    term: 24,
  },
  {
    name: "Апартаменты в Сочи",
    place: "г. Сочи, Краснодарский край",
    photo: "sochi",
    goal: 18_000_000,
    raised: 11_700_000,
    investors: 94,
    yield: 12,
    term: 18,
  },
  {
    name: "Таунхаус в Новогорске",
    place: "пос. Новогорск, Московская область",
    photo: "novogorsk",
    goal: 25_000_000,
    raised: 21_250_000,
    investors: 141,
    yield: 14,
    term: 30,
  },
  {
    name: "Пентхаус на Арбате",
    place: "г. Москва, Арбат",
    photo: "arbat",
    goal: 60_000_000,
    raised: 27_600_000,
    investors: 203,
    yield: 11,
    term: 36,
  },
  {
    name: "Коттедж в Раздорах",
    place: "пос. Раздоры, Московская область",
    photo: "razdory",
    goal: 30_000_000,
    raised: 16_800_000,
    investors: 77,
    yield: 13,
    term: 24,
  },
];

const AMOUNTS = [500_000, 1_000_000, 2_000_000];
/** Which amount chip is picked on each loop, in order. */
const PICKS = [1, 2, 0, 1, 2];

const FREE = 11_520_722.5;
const PORTFOLIO = 65_358_150.65;

type Target = "invest" | "chip" | "confirm" | "next" | null;

type Beat = {
  /** Where the cursor goes during this beat; null keeps it where it is. */
  to: Target;
  press?: boolean;
  popover?: boolean;
  /** This loop's amount chip is selected. */
  chip?: boolean;
  /** This loop's investment is done and counted. */
  invested?: boolean;
  toast?: boolean;
  /** The next object is open. */
  switched?: boolean;
  ms: number;
};

const BEATS: Beat[] = [
  { to: null, ms: 1100 },
  { to: "invest", ms: 750 },
  { to: "invest", press: true, ms: 220 },
  { to: "chip", popover: true, ms: 700 },
  { to: "chip", popover: true, press: true, chip: true, ms: 260 },
  { to: "confirm", popover: true, chip: true, ms: 600 },
  { to: "confirm", popover: true, chip: true, press: true, ms: 240 },
  { to: null, invested: true, toast: true, ms: 1700 },
  { to: null, invested: true, ms: 500 },
  { to: "next", invested: true, ms: 800 },
  { to: "next", invested: true, press: true, ms: 220 },
  { to: null, invested: true, switched: true, ms: 1300 },
];

/** "1 234 567,50 ₽" with non-breaking group spaces. */
const rub = (n: number, digits = 0) =>
  `${n
    .toFixed(digits)
    .replace(".", ",")
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽`;

/** "1,2 млн", "500 тыс." for the stat tiles. */
const short = (n: number) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(n % 1_000_000 ? 1 : 0).replace(".", ",")} млн`
    : n > 0
      ? `${Math.round(n / 1000)} тыс.`
      : "—";

export function SevenPondsCover() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-15% 0px" });
  const reduce = useReducedMotion();
  const [{ loop, step }, setPos] = useState({ loop: 0, step: 0 });

  const beat = reduce ? BEATS[8] : BEATS[step];
  const playing = inView && !reduce;

  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(
      () =>
        setPos((p) =>
          p.step + 1 < BEATS.length
            ? { loop: p.loop, step: p.step + 1 }
            : { loop: p.loop + 1, step: 0 },
        ),
      BEATS[step].ms,
    );
    return () => clearTimeout(id);
  }, [playing, step]);

  const N = OBJECTS.length;
  const objIndex = loop % N;
  const open = beat.switched ? (loop + 1) % N : objIndex;
  const pick = PICKS[loop % PICKS.length];

  // Every investment so far; the current one counts once it is confirmed.
  const done = Array.from(
    { length: loop + (beat.invested ? 1 : 0) },
    (_, i) => ({
      obj: i % N,
      amount: AMOUNTS[PICKS[i % PICKS.length]],
    }),
  );
  const mine = (o: number) =>
    done.filter((d) => d.obj === o).reduce((s, d) => s + d.amount, 0);
  const count = (o: number) => done.filter((d) => d.obj === o).length;
  const raised = (o: number) => OBJECTS[o].raised + mine(o);
  // Free money: spent on each investment, topped up when it runs low so the
  // balance never goes negative however long the loop plays.
  const free = done.reduce((f, d) => {
    const next = f < 2_500_000 ? f + 10_000_000 : f;
    return next - d.amount;
  }, FREE);

  // Cursor: measured from the element marked data-target, in design px.
  const [cursor, setCursor] = useState({ x: 640, y: 560 });
  useLayoutEffect(() => {
    const key = beat.to === "next" ? `obj${(loop + 1) % N}` : beat.to;
    const root = ref.current;
    const el =
      key && root ? root.querySelector(`[data-target="${key}"]`) : null;
    if (!el || !root) return;
    const r = el.getBoundingClientRect();
    const box = root.getBoundingClientRect();
    const k = 1200 / box.width;
    setCursor({
      x: (r.left - box.left + r.width * 0.55) * k,
      y: (r.top - box.top + r.height * 0.6) * k,
    });
  }, [beat.to, step, loop, N]);

  const o = OBJECTS[open];
  const pct = Math.min(raised(open) / o.goal, 1);

  return (
    <div
      ref={ref}
      aria-hidden
      className="absolute inset-0 select-none overflow-hidden [container-type:inline-size]"
      style={{
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      }}
    >
      <div
        className="absolute inset-0 text-white"
        style={{ fontSize: "calc(100cqw / 1200)" }}
      >
        {/* Open object: the main panel. */}
        <div className="absolute left-[318em] top-[56em] w-[590em] rounded-[32em] border-[1.5em] border-white/[0.07] bg-[#141418] p-[16em] shadow-[0_30em_80em_rgba(0,0,0,0.5)]">
          <div className="relative h-[330em] overflow-hidden rounded-[22em] bg-[#232328]">
            <AnimatePresence initial={false}>
              <motion.div
                key={o.photo}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <Image
                  src={`/images/7pr-cover/${o.photo}.jpg`}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 50vw, 330px"
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>

            <AnimatePresence>
              {beat.toast && (
                <motion.div
                  key="toast"
                  initial={{ opacity: 0, y: "-16em", scale: 0.95 }}
                  animate={{ opacity: 1, y: "0em", scale: 1 }}
                  exit={{
                    opacity: 0,
                    y: "-10em",
                    transition: { duration: 0.25 },
                  }}
                  transition={POP}
                  className="absolute left-[16em] top-[16em] flex items-center gap-[10em] rounded-full bg-[rgba(16,16,20,0.82)] py-[10em] pl-[10em] pr-[18em] backdrop-blur-[12em]"
                >
                  <span
                    className="grid size-[28em] place-items-center rounded-full"
                    style={{ background: TEAL }}
                  >
                    <Check />
                  </span>
                  <span className="text-[14em] font-medium">
                    Инвестиция {rub(AMOUNTS[pick])} оформлена
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={o.name}
              initial={{ opacity: 0, y: "14em", filter: "blur(6px)" }}
              animate={{ opacity: 1, y: "0em", filter: "blur(0px)" }}
              exit={{
                opacity: 0,
                y: "-8em",
                filter: "blur(6px)",
                transition: { duration: 0.2 },
              }}
              transition={{ duration: 0.5, ease: EASE }}
              className="px-[8em] pt-[20em]"
            >
              <div>
                <span className="text-[26em] font-semibold tracking-[-0.02em]">
                  {o.name}
                </span>
              </div>
              <div className="mt-[8em] flex items-center gap-[8em]">
                <Pin />
                <span className="text-[14em]" style={{ color: MUTED }}>
                  {o.place}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-[20em] grid grid-cols-4 gap-[10em] px-[8em]">
            <Tile
              label="Инвесторов"
              value={
                <Num
                  value={o.investors + count(open)}
                  format={(n) => `${Math.round(n)}`}
                />
              }
            />
            <Tile label="Доходность" value={`${o.yield}%`} />
            <Tile label="Мои вложения" value={short(mine(open))} />
            <Tile label="Срок" value={`${o.term} мес.`} />
          </div>

          <div className="relative mt-[20em] flex gap-[12em] px-[8em] pb-[8em]">
            <motion.div
              data-target="invest"
              animate={{
                scale: beat.press && beat.to === "invest" ? 0.95 : 1,
                filter:
                  beat.to === "invest" ? "brightness(1.12)" : "brightness(1)",
              }}
              transition={POP}
              className="grid h-[52em] flex-1 place-items-center rounded-full text-[#06231d]"
              style={{ background: TEAL_BTN }}
            >
              <span className="text-[16em] font-semibold">Инвестировать</span>
            </motion.div>
            <div className="grid h-[52em] flex-1 place-items-center rounded-full bg-white/[0.08]">
              <span className="text-[16em] font-medium">
                Скачать презентацию
              </span>
            </div>

            <AnimatePresence>
              {beat.popover && (
                <motion.div
                  key="popover"
                  initial={{ opacity: 0, y: "12em", scale: 0.96 }}
                  animate={{ opacity: 1, y: "0em", scale: 1 }}
                  exit={{
                    opacity: 0,
                    y: "8em",
                    scale: 0.97,
                    transition: { duration: 0.18 },
                  }}
                  transition={POP}
                  className="absolute bottom-[66em] left-[8em] z-20 w-[330em] origin-bottom-left rounded-[24em] border-[1.5em] border-white/10 bg-[#1d1d22] p-[18em] shadow-[0_20em_60em_rgba(0,0,0,0.55)]"
                >
                  <div>
                    <span className="text-[16em] font-semibold">
                      Сумма инвестиции
                    </span>
                  </div>
                  <div className="mt-[4em]">
                    <span className="text-[12em]" style={{ color: MUTED }}>
                      Доходность ~{o.yield}% годовых
                    </span>
                  </div>
                  <div className="mt-[14em] flex gap-[8em]">
                    {AMOUNTS.map((a, i) => {
                      const on = !!beat.chip && i === pick;
                      return (
                        <motion.span
                          key={a}
                          data-target={i === pick ? "chip" : undefined}
                          animate={{
                            scale:
                              on && beat.press && beat.to === "chip" ? 0.93 : 1,
                            backgroundColor: on
                              ? "rgba(34,184,160,0.18)"
                              : "rgba(255,255,255,0.06)",
                            borderColor: on ? TEAL : "rgba(255,255,255,0.08)",
                          }}
                          transition={POP}
                          className="grid h-[40em] flex-1 place-items-center rounded-full border-[1.5em]"
                        >
                          <span className="whitespace-nowrap text-[13em] font-medium tabular-nums">
                            {rub(a)}
                          </span>
                        </motion.span>
                      );
                    })}
                  </div>
                  <motion.div
                    data-target="confirm"
                    animate={{
                      scale: beat.press && beat.to === "confirm" ? 0.95 : 1,
                      opacity: beat.chip ? 1 : 0.45,
                    }}
                    transition={POP}
                    className="mt-[14em] grid h-[44em] place-items-center rounded-full text-[#06231d]"
                    style={{ background: TEAL_BTN }}
                  >
                    <span className="text-[14em] font-semibold">
                      Подтвердить
                    </span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Other objects: the list the cursor picks the next one from. */}
        <div className="absolute left-[34em] top-[96em] w-[300em] rounded-[26em] border-[1.5em] border-white/[0.07] bg-[rgba(20,20,24,0.9)] p-[12em] shadow-[0_24em_60em_rgba(0,0,0,0.45)] backdrop-blur-[12em]">
          <div className="px-[6em] pb-[10em] pt-[4em]">
            <span className="text-[16em] font-semibold">Другие объекты</span>
          </div>
          <div className="flex flex-col gap-[8em]">
            {OBJECTS.map((obj, i) => {
              const active = i === open;
              const p = Math.min(raised(i) / obj.goal, 1);
              const hovered = beat.to === "next" && i === (loop + 1) % N;
              return (
                <motion.div
                  key={obj.name}
                  data-target={`obj${i}`}
                  animate={{
                    borderColor: active
                      ? "rgba(34,184,160,0.7)"
                      : "rgba(255,255,255,0.05)",
                    backgroundColor: active
                      ? "rgba(34,184,160,0.1)"
                      : hovered
                        ? "rgba(255,255,255,0.07)"
                        : "rgba(255,255,255,0.03)",
                    scale: hovered && beat.press ? 0.97 : 1,
                  }}
                  transition={POP}
                  className="flex items-center gap-[12em] rounded-[16em] border-[1.5em] p-[8em]"
                >
                  <span className="relative h-[60em] w-[80em] shrink-0 overflow-hidden rounded-[10em] bg-[#2a2a30]">
                    <Image
                      src={`/images/7pr-cover/${obj.photo}.jpg`}
                      alt=""
                      fill
                      sizes="60px"
                      className="object-cover"
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate">
                      <span className="text-[13em] font-semibold">
                        {obj.name}
                      </span>
                    </div>
                    <div className="mt-[8em] h-[4em] overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: TEAL }}
                        animate={{ width: `${p * 100}%` }}
                        transition={SPRING}
                      />
                    </div>
                    <div className="mt-[6em] flex justify-between">
                      <span
                        className="text-[10em] tabular-nums"
                        style={{ color: MUTED }}
                      >
                        <Num value={raised(i)} format={(n) => rub(n)} />
                      </span>
                      <span
                        className="text-[10em] tabular-nums"
                        style={{ color: MUTED }}
                      >
                        {Math.round(p * 100)}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Balance. */}
        <div className="absolute left-[890em] top-[70em] w-[278em] overflow-hidden rounded-[26em] border-[1.5em] border-white/[0.08] bg-[#17171b] p-[20em] shadow-[0_24em_60em_rgba(0,0,0,0.45)]">
          <div className="pointer-events-none absolute -bottom-[60em] -right-[40em] size-[220em] rounded-full bg-[radial-gradient(closest-side,rgba(34,184,160,0.55),rgba(34,184,160,0))]" />
          <div className="relative">
            <span className="text-[13em]" style={{ color: MUTED }}>
              Свободно
            </span>
          </div>
          <div className="relative mt-[4em]">
            <span className="text-[24em] font-semibold tabular-nums tracking-[-0.02em]">
              <Num value={free} format={(n) => rub(n, 2)} />
            </span>
          </div>
          <div className="relative mt-[16em] flex gap-[8em]">
            <span
              className="grid h-[34em] flex-1 place-items-center rounded-full text-[#06231d]"
              style={{ background: TEAL_BTN }}
            >
              <span className="text-[12em] font-semibold">Пополнить</span>
            </span>
            <span className="grid h-[34em] flex-1 place-items-center rounded-full bg-white/10">
              <span className="text-[12em] font-medium">Вывести</span>
            </span>
          </div>
        </div>

        <PortfolioChart spent={done.map((d) => d.amount)} />

        {/* Funding ring of the open object. */}
        <div className="absolute left-[890em] top-[300em] w-[278em] rounded-[26em] border-[1.5em] border-white/[0.08] bg-[#17171b] p-[20em] shadow-[0_24em_60em_rgba(0,0,0,0.45)]">
          <div className="relative mx-auto size-[170em]">
            <svg viewBox="0 0 120 120" className="size-full -rotate-90">
              <defs>
                <linearGradient id="sp-ring" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#7fe0cc" />
                  <stop offset="100%" stopColor="#1fa58c" />
                </linearGradient>
              </defs>
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="8"
              />
              <motion.circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="url(#sp-ring)"
                strokeWidth="8"
                strokeLinecap="round"
                initial={false}
                animate={{ pathLength: pct }}
                transition={{ type: "spring", stiffness: 90, damping: 20 }}
              />
            </svg>
            <div className="absolute inset-0 grid place-items-center text-center">
              <div>
                <div>
                  <span className="text-[38em] font-semibold tabular-nums tracking-[-0.03em]">
                    <Num
                      value={pct * 100}
                      format={(n) => `${Math.round(n)}%`}
                    />
                  </span>
                </div>
                <div>
                  <span className="text-[12em]" style={{ color: MUTED }}>
                    {pct >= 1 ? "Собрано" : "Завершено"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-[16em]">
            <span className="text-[12em]" style={{ color: MUTED }}>
              Уже привлечено
            </span>
          </div>
          <div className="mt-[2em]">
            <span className="text-[16em] font-medium tabular-nums">
              <Num value={raised(open)} format={(n) => rub(n)} />
            </span>
          </div>
          <div className="mt-[10em]">
            <span className="text-[12em]" style={{ color: MUTED }}>
              Цель
            </span>
          </div>
          <div className="mt-[2em]">
            <span className="text-[16em] font-medium tabular-nums">
              {rub(o.goal)}
            </span>
          </div>
        </div>

        <Cursor
          x={cursor.x}
          y={cursor.y}
          press={!!beat.press}
          hidden={!!reduce}
        />
      </div>
    </div>
  );
}

/* ——— Parts ——— */

/** Portfolio value before the first loop, in millions, one point a month. */
const HISTORY = [
  52.4,
  54.1,
  53.2,
  56.8,
  55.9,
  58.7,
  58.1,
  60.9,
  60.2,
  62.8,
  63.9,
  PORTFOLIO / 1e6,
];
const CHART_W = 260;
const CHART_H = 96;

/** "Стоимость портфеля" line: every investment appends a point and the window slides. */
function PortfolioChart({ spent }: { spent: number[] }) {
  const series = [...HISTORY];
  for (const a of spent) series.push(series[series.length - 1] + a / 1e6);
  const pts = series.slice(-HISTORY.length);
  const min = Math.min(...pts) - 1;
  const max = Math.max(...pts) + 1;
  const xy = pts.map(
    (v, i) =>
      [
        (i / (pts.length - 1)) * CHART_W,
        CHART_H - ((v - min) / (max - min)) * CHART_H,
      ] as const,
  );
  // Smooth curve through the points (Catmull-Rom as cubic Béziers).
  let line = `M${xy[0][0]},${xy[0][1]}`;
  for (let i = 0; i < xy.length - 1; i++) {
    const [x0, y0] = xy[Math.max(i - 1, 0)];
    const [x1, y1] = xy[i];
    const [x2, y2] = xy[i + 1];
    const [x3, y3] = xy[Math.min(i + 2, xy.length - 1)];
    line += ` C${x1 + (x2 - x0) / 6},${y1 + (y2 - y0) / 6} ${x2 - (x3 - x1) / 6},${y2 - (y3 - y1) / 6} ${x2},${y2}`;
  }
  const area = `${line} L${CHART_W},${CHART_H} L0,${CHART_H} Z`;
  const [lx, ly] = xy[xy.length - 1];
  const total = PORTFOLIO + spent.reduce((s, a) => s + a, 0);

  return (
    <div className="absolute left-[34em] top-[578em] w-[300em] rounded-[26em] border-[1.5em] border-white/[0.07] bg-[rgba(20,20,24,0.9)] p-[20em] shadow-[0_24em_60em_rgba(0,0,0,0.45)]">
      <div>
        <span className="text-[13em]" style={{ color: MUTED }}>
          Стоимость портфеля
        </span>
      </div>
      <div className="mt-[4em]">
        <span className="text-[20em] font-semibold tabular-nums">
          <Num value={total} format={(n) => rub(n, 2)} />
        </span>
      </div>
      <svg
        viewBox={`-4 -8 ${CHART_W + 8} ${CHART_H + 12}`}
        className="mt-[14em] h-[100em] w-full overflow-visible"
      >
        <defs>
          <linearGradient id="sp-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={TEAL} stopOpacity="0.35" />
            <stop offset="100%" stopColor={TEAL} stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          initial={false}
          animate={{ d: area }}
          transition={SPRING}
          fill="url(#sp-area)"
        />
        <motion.path
          initial={false}
          animate={{ d: line }}
          transition={SPRING}
          fill="none"
          stroke={TEAL}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <motion.circle
          initial={false}
          animate={{ cx: lx, cy: ly }}
          transition={SPRING}
          r="5"
          fill="#0f2f29"
          stroke="#7fe0cc"
          strokeWidth="2.5"
        />
      </svg>
    </div>
  );
}

function Cursor({
  x,
  y,
  press,
  hidden,
}: {
  x: number;
  y: number;
  press: boolean;
  hidden: boolean;
}) {
  if (hidden) return null;
  return (
    <motion.div
      className="pointer-events-none absolute left-0 top-0 z-30"
      initial={false}
      animate={{ x: `${x}em`, y: `${y}em` }}
      transition={{ type: "spring", stiffness: 120, damping: 20, mass: 0.9 }}
    >
      <AnimatePresence>
        {press && (
          <motion.span
            key="ripple"
            initial={{ opacity: 0.7, scale: 0.4 }}
            animate={{ opacity: 0, scale: 1.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute -left-[22em] -top-[22em] size-[44em] rounded-full border-[2em] border-white/70"
          />
        )}
      </AnimatePresence>
      <motion.svg
        viewBox="0 0 24 24"
        className="size-[30em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
        animate={{ scale: press ? 0.82 : 1 }}
        transition={POP}
        style={{ transformOrigin: "3px 2px" }}
      >
        <path
          d="M4 2.5v17.2l4.6-4.4 2.9 6.6 3-1.3-2.9-6.5h6.3L4 2.5Z"
          fill="white"
          stroke="black"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </motion.svg>
    </motion.div>
  );
}

function Num({
  value,
  format,
}: {
  value: number;
  format: (n: number) => string;
}) {
  const mv = useMotionValue(value);
  const text = useTransform(mv, format);
  useEffect(() => {
    const controls = animate(mv, value, { duration: 1, ease: EASE });
    return () => controls.stop();
  }, [mv, value]);
  return <motion.span>{text}</motion.span>;
}

function Tile({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-[16em] border-[1.5em] border-white/[0.06] bg-white/[0.03] px-[14em] py-[12em]">
      <div>
        <span
          className="text-[20em] font-semibold tabular-nums"
          style={{ color: TEAL }}
        >
          {value}
        </span>
      </div>
      <div className="mt-[2em]">
        <span className="text-[12em]" style={{ color: MUTED }}>
          {label}
        </span>
      </div>
    </div>
  );
}

function Pin() {
  return (
    <svg viewBox="0 0 24 24" className="size-[16em] shrink-0" fill={TEAL}>
      <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z" />
    </svg>
  );
}

function Check() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-[16em]"
      fill="none"
      stroke="white"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}
