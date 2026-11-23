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
import {
  Airplane,
  ArrowLeft2,
  Bag2,
  Calendar,
  Car,
  Coffee,
  Health,
  Notification,
  Profile,
  ScanBarcode,
  Setting2,
  Teacher,
  type Icon,
} from "iconsax-react";
import { useEffect, useRef, useState } from "react";

/**
 * FinTrack case cover: the add-expense flow from the Figma screens, rebuilt in
 * code so the data can differ and change. Home → "Expense" → Add: type the
 * amount, pick a category, the Dynamic Island confirms, back on Home the
 * balance, the list and the side widgets update. Every loop adds the next
 * expense from POOL to the same feed, so the scene never resets.
 *
 * Scene units: 1em = 1/60 of the card width (a 60em × 40em, 3:2 stage).
 * Inside the phone the font-size is reset so 1em = 1pt of the 440pt Figma
 * frame, and every phone size below is the Figma value. Only leaf text
 * elements change font-size, so em sizes on containers keep their units.
 */

const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING: Transition = { type: "spring", stiffness: 260, damping: 32 };
const POP: Transition = { type: "spring", stiffness: 520, damping: 28 };
const BLUE = "#2f8ff0";

type Expense = { name: string; cat: number; amount: number; logo: string; letter: string };

const CATEGORIES: { name: string; spent: number; limit: number; icon: Icon }[] = [
  { name: "Food", spent: 842, limit: 1000, icon: Coffee },
  { name: "Transport", spent: 214, limit: 300, icon: Car },
  { name: "Health", spent: 96, limit: 200, icon: Health },
  { name: "Travel", spent: 1280, limit: 2000, icon: Airplane },
  { name: "Shops", spent: 367, limit: 500, icon: Bag2 },
  { name: "Education", spent: 49, limit: 100, icon: Teacher },
];

/** Already on the list before the first loop. */
const HISTORY: Expense[] = [
  { name: "Whole Foods", cat: 0, amount: 64.18, logo: "#00674b", letter: "W" },
  { name: "Uber", cat: 1, amount: 18.4, logo: "#000000", letter: "U" },
  { name: "Airbnb", cat: 3, amount: 412, logo: "#ff385c", letter: "A" },
  { name: "CVS Pharmacy", cat: 2, amount: 23.75, logo: "#cc0000", letter: "C" },
];

/** Added one per loop, in order, then again from the start. */
const POOL: Expense[] = [
  { name: "Blue Bottle", cat: 0, amount: 12.4, logo: "#0a63b0", letter: "B" },
  { name: "Lyft", cat: 1, amount: 23.1, logo: "#ff00bf", letter: "L" },
  { name: "Uniqlo", cat: 4, amount: 59.9, logo: "#e60012", letter: "U" },
  { name: "Trader Joe's", cat: 0, amount: 41.85, logo: "#c8102e", letter: "T" },
  { name: "Walgreens", cat: 2, amount: 8.99, logo: "#e31837", letter: "W" },
  { name: "Duolingo", cat: 5, amount: 12.99, logo: "#58cc02", letter: "D" },
];

const BALANCE = 24718.36;
const MONTH_EXPENSES = 3412;
const WEEK = [52.1, 38.2, 0, 0, 0, 0, 0];
const TODAY = 1;
const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const INCOME_BARS = [9, 14, 6, 11, 4, 8, 13, 10, 16, 7, 12, 15, 9, 5, 14, 11, 6, 13, 8, 15, 10, 7];
const SPEND_BARS = [5, 9, 12, 4, 8, 6, 10, 14, 7, 11, 5, 9, 13, 6, 8, 12, 4, 10, 7, 9, 11, 6];

type Touch = "expense" | "cat" | null;

/** One beat of a loop: what the scene shows and how long it holds. */
type Beat = {
  screen: "home" | "add";
  /** Characters of the amount typed so far. */
  typed: number;
  touch?: Touch;
  press?: boolean;
  /** The category of this loop's expense is selected on the Add screen. */
  cat?: boolean;
  toast?: boolean;
  /** This loop's expense is saved and shows on Home. */
  saved?: boolean;
  ms: number;
};

function beatsFor(amount: string): Beat[] {
  const n = amount.length;
  const typing = Array.from({ length: n }, (_, i): Beat => ({ screen: "add", typed: i + 1, ms: i === n - 1 ? 450 : 130 }));
  return [
    { screen: "home", typed: 0, ms: 1300 },
    { screen: "home", typed: 0, touch: "expense", ms: 380 },
    { screen: "home", typed: 0, touch: "expense", press: true, ms: 220 },
    { screen: "add", typed: 0, ms: 650 },
    ...typing,
    { screen: "add", typed: n, touch: "cat", ms: 380 },
    { screen: "add", typed: n, touch: "cat", press: true, cat: true, ms: 420 },
    { screen: "add", typed: n, cat: true, toast: true, ms: 950 },
    { screen: "home", typed: n, cat: true, toast: true, saved: true, ms: 1400 },
    { screen: "home", typed: n, cat: true, saved: true, ms: 1800 },
  ];
}

const money = (n: number, digits = 2) =>
  n.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });

const sum = (xs: Expense[]) => xs.reduce((s, e) => s + e.amount, 0);

export function FintrackCover() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-15% 0px" });
  const reduce = useReducedMotion();
  const [{ loop, step }, setPos] = useState({ loop: 0, step: 0 });

  const current = POOL[loop % POOL.length];
  const amountText = money(current.amount);
  const beats = beatsFor(amountText);
  // Reduced motion: a still frame with the first expense just saved.
  const beat = reduce ? beats[beats.length - 1] : beats[step];

  const playing = inView && !reduce;

  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(
      () => setPos((p) => (p.step + 1 < beats.length ? { loop: p.loop, step: p.step + 1 } : { loop: p.loop + 1, step: 0 })),
      beats[step].ms,
    );
    return () => clearTimeout(id);
  }, [playing, step, beats]);

  // Everything saved so far, newest last, each with a stable id for the list.
  const added = Array.from({ length: loop + (beat.saved ? 1 : 0) }, (_, i) => ({ ...POOL[i % POOL.length], id: `n${i}` }));
  const total = sum(added);
  const catSpent = (c: number) => CATEGORIES[c].spent + sum(added.filter((e) => e.cat === c));
  const list = [...added.reverse(), ...HISTORY.map((e) => ({ ...e, id: e.name }))].slice(0, 5);

  return (
    <div
      ref={ref}
      aria-hidden
      className="absolute inset-0 select-none overflow-hidden [container-type:inline-size]"
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, system-ui, sans-serif',
      }}
    >
      <div className="absolute inset-0 text-white" style={{ fontSize: "calc(100cqw / 60)" }}>
        <BudgetWidget cat={current.cat} spent={catSpent(current.cat)} />
        <WeekWidget today={WEEK[TODAY] + total} />

        {/* Phone: 464pt wide with the bezel, scaled to 23em of the scene. */}
        <div className="absolute left-[18.5em] top-[2.4em] w-[23em]">
          <div style={{ fontSize: "calc(23em / 464)" }}>
            <div className="rounded-[70em] bg-[#0a0a0b] p-[12em] shadow-[0_0_0_1.5em_#3a3a3f,0_40em_90em_rgba(0,0,0,0.55)]">
              <div className="relative h-[960em] overflow-hidden rounded-[58em] bg-[#161618]">
                <motion.div
                  className="absolute inset-0"
                  animate={{ x: beat.screen === "home" ? "0%" : "-28%", opacity: beat.screen === "home" ? 1 : 0.5 }}
                  transition={SPRING}
                >
                  <HomeScreen beat={beat} list={list} balance={BALANCE - total} monthExpenses={MONTH_EXPENSES + total} />
                </motion.div>
                <motion.div
                  className="absolute inset-0 shadow-[-20em_0_40em_rgba(0,0,0,0.4)]"
                  initial={false}
                  animate={{ x: beat.screen === "add" ? "0%" : "102%" }}
                  transition={SPRING}
                >
                  <AddScreen beat={beat} amount={amountText} cat={current.cat} catSpent={catSpent} />
                </motion.div>

                <Island open={!!beat.toast} expense={current} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ——— Screens ——— */

type Row = Expense & { id: string };

function HomeScreen({ beat, list, balance, monthExpenses }: { beat: Beat; list: Row[]; balance: number; monthExpenses: number }) {
  return (
    <div className="h-full bg-[#161618]">
      <StatusBar />
      <div className="flex h-[48em] items-center justify-between px-[16em]">
        <RoundButton icon={Profile} />
        <div className="flex gap-[10em]">
          <RoundButton icon={Notification} />
          <RoundButton icon={Setting2} />
        </div>
      </div>

      <div className="mt-[54em] text-center">
        <span className="text-[15em] text-[#8e8e93]">Total Balance</span>
      </div>
      <div className="mt-[2em] flex h-[72em] items-center justify-center gap-[6em]">
        <span className="text-[60em] font-light leading-none text-[#6b6b70]">$</span>
        <span className="text-[56em] font-normal leading-none tracking-[-0.03em] tabular-nums">
          <Odometer text={money(balance).replace(/,/g, " ")} />
        </span>
      </div>

      <div className="mt-[19em] grid grid-cols-3 gap-[24em] px-[16em]">
        <motion.div
          animate={{ scale: beat.press && beat.touch === "expense" ? 0.92 : 1, backgroundColor: beat.touch === "expense" ? "#3a3a3e" : "#2a2a2d" }}
          transition={POP}
          className="relative flex h-[44em] items-center justify-center gap-[8em] rounded-full"
        >
          <DiagArrow down />
          <span className="text-[15em] font-medium">Expense</span>
          <TouchDot show={beat.touch === "expense"} press={!!beat.press} />
        </motion.div>
        <div className="flex h-[44em] items-center justify-center gap-[8em] rounded-full bg-[#2a2a2d]">
          <DiagArrow />
          <span className="text-[15em] font-medium">Income</span>
        </div>
        <div className="flex h-[44em] items-center justify-center gap-[8em] rounded-full bg-[#2a2a2d]">
          <IconBox icon={ScanBarcode} size={20} />
          <span className="text-[15em] font-medium">QR</span>
        </div>
      </div>

      <div className="mt-[16em] grid grid-cols-2 gap-[16em] px-[16em]">
        <StatCard title="Monthly Income" value="$6,850" note="+12% from last month" bars={INCOME_BARS} color={BLUE} />
        <StatCard
          title="Monthly Expenses"
          value={<Num value={monthExpenses} format={(n) => `$${money(n, 0)}`} />}
          note="−4% from last month"
          noteColor="#8e8e93"
          bars={SPEND_BARS}
          color="#6b6b70"
        />
      </div>

      <div className="mx-[16em] mt-[16em] rounded-[28em] border-[1em] border-white/[0.06] bg-[linear-gradient(180deg,#242427,#1d1d20)] p-[16em]">
        <div className="flex items-center justify-between">
          <span className="text-[26em] font-medium tracking-[-0.02em]">Last Expenses</span>
          <span className="text-[15em]" style={{ color: BLUE }}>
            See All
          </span>
        </div>
        <div className="mt-[20em]">
          <AnimatePresence initial={false}>
            {list.map((e) => (
              <motion.div
                key={e.id}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ ...SPRING, delay: 0.3 }}
                // Padded out past the card content so the highlight below is not clipped.
                className="-mx-[10em] overflow-hidden px-[10em]"
              >
                <div className="pb-[8em]">
                  <motion.div
                    initial={{ backgroundColor: "rgba(47,143,240,0.22)", y: "-14em", scale: 0.97 }}
                    animate={{ backgroundColor: "rgba(47,143,240,0)", y: "0em", scale: 1 }}
                    transition={{ backgroundColor: { duration: 1.4, delay: 1 }, y: { ...POP, delay: 0.3 }, scale: { ...POP, delay: 0.3 } }}
                    className="-mx-[10em] rounded-[16em] px-[10em]"
                  >
                    <ExpenseRow e={e} />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function AddScreen({
  beat,
  amount,
  cat,
  catSpent,
}: {
  beat: Beat;
  amount: string;
  cat: number;
  catSpent: (c: number) => number;
}) {
  const typing = beat.screen === "add" && !beat.cat;
  return (
    <div className="h-full bg-[#161618]">
      <StatusBar />
      <div className="grid h-[48em] grid-cols-[1fr_auto_1fr] items-center px-[16em]">
        <span className="grid size-[40em] place-items-center rounded-full bg-[#2a2a2d]">
          <IconBox icon={ArrowLeft2} size={22} />
        </span>
        <span className="text-[28em] font-semibold tracking-[-0.02em]">Add</span>
        <div className="flex justify-end gap-[10em]">
          <RoundButton icon={Notification} />
          <RoundButton icon={Setting2} />
        </div>
      </div>

      <div className="mx-[16em] mt-[29em] flex h-[56em] rounded-[18em] bg-[#202023] p-[4em]">
        <span className="grid flex-1 place-items-center rounded-[14em] bg-[linear-gradient(180deg,#3d9ef7,#1f80e4)]">
          <span className="text-[15em] font-semibold">Expense</span>
        </span>
        <span className="grid flex-1 place-items-center">
          <span className="text-[15em] font-medium text-[#8e8e93]">Income</span>
        </span>
      </div>

      <div className="mt-[24em] px-[16em]">
        <Label>Amount</Label>
        <Field active={typing}>
          <span className="text-[22em] text-[#6b6b70]">$</span>
          <span className="flex items-center">
            {amount
              .slice(0, beat.typed)
              .split("")
              .map((ch, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: "6em" }}
                  animate={{ opacity: 1, y: "0em" }}
                  transition={POP}
                  className="inline-block"
                >
                  <span className="text-[17em] tabular-nums">{ch}</span>
                </motion.span>
              ))}
            {beat.typed === 0 && <span className="text-[17em] text-[#6b6b70]">0.00</span>}
            {typing && (
              <span className="ml-[2em] inline-block h-[20em] w-[1.6em] animate-[linky-caret_1s_steps(1)_infinite]" style={{ background: BLUE }} />
            )}
          </span>
        </Field>
      </div>

      <div className="mt-[16em] px-[16em]">
        <Label>Date</Label>
        <Field>
          <span className="flex-1 text-[17em]">Tue, 17 Nov</span>
          <IconBox icon={Calendar} size={24} className="text-[#8e8e93]" />
        </Field>
      </div>

      <div className="mt-[24em] flex items-center justify-between px-[16em]">
        <span className="text-[26em] font-medium tracking-[-0.02em]">Categories</span>
        <span className="text-[15em]" style={{ color: BLUE }}>
          See All
        </span>
      </div>
      <div className="mt-[12em] grid grid-cols-3 gap-[12em] px-[16em]">
        {CATEGORIES.map((c, i) => {
          const selected = !!beat.cat && cat === i;
          const touched = beat.touch === "cat" && cat === i;
          return (
            <motion.div
              key={c.name}
              animate={{
                scale: touched && beat.press ? 0.94 : 1,
                borderColor: selected ? BLUE : "rgba(255,255,255,0.06)",
                backgroundColor: selected ? "rgba(47,143,240,0.16)" : "rgba(38,38,41,1)",
              }}
              transition={POP}
              className="relative h-[120em] rounded-[22em] border-[1.5em] p-[12em]"
            >
              <span className="grid size-[40em] place-items-center rounded-full bg-[#3a3a3e]">
                <IconBox icon={c.icon} size={22} />
              </span>
              <AnimatePresence>
                {selected && (
                  <motion.span
                    initial={{ scale: 0, rotate: -40 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, transition: { duration: 0.15 } }}
                    transition={POP}
                    className="absolute right-[12em] top-[12em] grid size-[24em] place-items-center rounded-full"
                    style={{ background: BLUE }}
                  >
                    <Check size={14} />
                  </motion.span>
                )}
              </AnimatePresence>
              <div className="mt-[12em] leading-tight">
                <div>
                  <span className="text-[15em] font-medium">{c.name}</span>
                </div>
                <div className="mt-[2em]">
                  <span className="text-[20em] font-semibold tabular-nums">${money(catSpent(i), 0)}</span>
                </div>
              </div>
              <TouchDot show={touched} press={!!beat.press} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/** The Dynamic Island, which grows into the "Expense added" toast. */
function Island({ open, expense }: { open: boolean; expense: Expense }) {
  return (
    <motion.div
      className="absolute left-1/2 top-[11em] z-20 flex -translate-x-1/2 items-center overflow-hidden rounded-[40em] bg-black"
      initial={false}
      animate={{ width: open ? "380em" : "124em", height: open ? "72em" : "36em" }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, filter: "blur(6px)", scale: 0.9 }}
            animate={{ opacity: 1, filter: "blur(0px)", scale: 1, transition: { delay: 0.12, duration: 0.3 } }}
            exit={{ opacity: 0, filter: "blur(6px)", scale: 0.9, transition: { duration: 0.15 } }}
            className="flex w-[380em] shrink-0 items-center gap-[12em] pl-[16em] pr-[24em]"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1, transition: { ...POP, delay: 0.2 } }}
              className="grid size-[40em] place-items-center rounded-full bg-[#2fb14a]"
            >
              <Check size={20} />
            </motion.span>
            <span className="flex-1 leading-tight">
              <span className="block text-[16em] font-semibold">Expense added</span>
              <span className="block text-[13em] text-[#8e8e93]">
                {expense.name} · −${money(expense.amount)}
              </span>
            </span>
            <span className="text-[16em] font-semibold" style={{ color: BLUE }}>
              Undo
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ——— Side widgets ——— */

const widget =
  "absolute w-[15em] rounded-[1.6em] border-[0.08em] border-white/10 bg-[rgba(40,40,44,0.72)] p-[1.4em] shadow-[0_1.2em_3em_rgba(0,0,0,0.35)] backdrop-blur-[1em]";

function BudgetWidget({ cat, spent }: { cat: number; spent: number }) {
  const c = CATEGORIES[cat];
  const pct = Math.min((spent / c.limit) * 100, 100);
  return (
    <div className={`${widget} left-[2em] top-[8em]`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={c.name}
          initial={{ opacity: 0, y: "0.6em", filter: "blur(4px)" }}
          animate={{ opacity: 1, y: "0em", filter: "blur(0px)" }}
          exit={{ opacity: 0, y: "-0.6em", filter: "blur(4px)" }}
          transition={{ duration: 0.4, ease: EASE }}
          className="flex items-center gap-[0.7em]"
        >
          <span className="grid size-[2.4em] place-items-center rounded-full bg-[#3a3a3e]">
            <IconBox icon={c.icon} size={1.3} />
          </span>
          <div className="leading-tight">
            <div className="text-[1.15em] font-medium">{c.name}</div>
            <div className="whitespace-nowrap text-[0.95em] text-[#8e8e93]">November budget</div>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="mt-[1.2em] flex items-baseline gap-[0.4em]">
        <span className="text-[1.7em] font-semibold tabular-nums">
          {/* Keyed by category so a switch jumps instead of counting across. */}
          <Num key={c.name} value={spent} format={(n) => `$${money(n)}`} />
        </span>
        <span className="whitespace-nowrap text-[1em] text-[#8e8e93]">of ${money(c.limit, 0)}</span>
      </div>
      <div className="mt-[0.8em] h-[0.5em] overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${BLUE}, #5fb0ff)` }}
          animate={{ width: `${pct}%` }}
          transition={SPRING}
        />
      </div>
      <div className="mt-[0.7em]">
        <span className="text-[0.95em] text-[#8e8e93] tabular-nums">
          <Num key={c.name} value={Math.max(c.limit - spent, 0)} format={(n) => `$${money(n)} left`} />
        </span>
      </div>
    </div>
  );
}

function WeekWidget({ today }: { today: number }) {
  const days = WEEK.map((v, i) => (i === TODAY ? today : v));
  const max = Math.max(60, today * 1.1);
  return (
    <div className={`${widget} right-[2em] top-[16em]`}>
      <div className="text-[0.95em] text-[#8e8e93]">Spent today</div>
      <div className="mt-[0.2em]">
        <span className="text-[1.7em] font-semibold tabular-nums">
          <Num value={today} format={(n) => `$${money(n)}`} />
        </span>
      </div>
      <div className="mt-[1em] flex h-[5.2em] items-end justify-between">
        {days.map((v, i) => (
          <div key={i} className="flex w-[1.3em] flex-col items-center gap-[0.4em]">
            <div className="flex h-[3.8em] w-full items-end overflow-hidden rounded-[0.35em] bg-white/[0.06]">
              <motion.div
                className="w-full rounded-[0.35em]"
                style={{ background: i === TODAY ? BLUE : "#55555b" }}
                animate={{ height: `${Math.max((v / max) * 100, v ? 8 : 0)}%` }}
                transition={SPRING}
              />
            </div>
            <span className={`text-[0.8em] ${i === TODAY ? "text-white" : "text-[#6b6b70]"}`}>{DAYS[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ——— Parts ——— */

/** Rolling digits: each digit is a 0–9 column that springs to its value. */
function Odometer({ text }: { text: string }) {
  const chars = text.split("");
  return (
    <span className="inline-flex">
      {chars.map((ch, i) => {
        // Keyed from the right so columns keep their place when the length changes.
        const key = chars.length - i;
        if (!/\d/.test(ch))
          return (
            <span key={key} className="whitespace-pre">
              {ch}
            </span>
          );
        return (
          <span key={key} className="relative inline-block h-[1em] overflow-hidden">
            <span className="invisible">0</span>
            <motion.span
              className="absolute inset-x-0 top-0 flex flex-col"
              initial={false}
              animate={{ y: `${-Number(ch)}em` }}
              transition={{ type: "spring", stiffness: 140, damping: 20, delay: (chars.length - i) * 0.03 }}
            >
              {"0123456789".split("").map((d) => (
                <span key={d} className="h-[1em] leading-none">
                  {d}
                </span>
              ))}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}

function Num({ value, format }: { value: number; format: (n: number) => string }) {
  const mv = useMotionValue(value);
  const text = useTransform(mv, format);
  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.9, ease: EASE });
    return () => controls.stop();
  }, [mv, value]);
  return <motion.span>{text}</motion.span>;
}

/** A finger tap: lands, presses in with a ripple, lifts off. */
function TouchDot({ show, press }: { show: boolean; press: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.span
          key="touch"
          initial={{ opacity: 0, scale: 1.6 }}
          animate={{ opacity: 1, scale: press ? 0.8 : 1 }}
          exit={{ opacity: 0, scale: 1.3, transition: { duration: 0.3 } }}
          transition={POP}
          className="pointer-events-none absolute left-1/2 top-1/2 -ml-[22em] -mt-[22em] size-[44em] rounded-full border-[2em] border-white/70 bg-white/25 shadow-[0_0_20em_rgba(255,255,255,0.35)]"
        >
          {press && (
            <motion.span
              initial={{ opacity: 0.6, scale: 1 }}
              animate={{ opacity: 0, scale: 2.4 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 rounded-full border-[2em] border-white/60"
            />
          )}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

function Check({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 24 24" style={{ width: `${size}em`, height: `${size}em` }} fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

function StatusBar() {
  return (
    <div className="flex h-[62em] items-center justify-between pl-[44em] pr-[34em] pt-[6em]">
      <span className="text-[17em] font-semibold">9:41</span>
      <div className="flex items-center gap-[7em]">
        <svg viewBox="0 0 18 12" className="h-[12em] w-[18em]" fill="white">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg viewBox="0 0 16 12" className="h-[12em] w-[16em]" fill="white">
          <path d="M8 2.3c2.3 0 4.4.9 6 2.4l1.2-1.3A10.4 10.4 0 0 0 8 .5C5.2.5 2.7 1.6.8 3.4L2 4.7a8.6 8.6 0 0 1 6-2.4Zm0 3.6c1.3 0 2.5.5 3.4 1.4l1.2-1.3A6.6 6.6 0 0 0 8 4.1c-1.8 0-3.4.7-4.6 1.9l1.2 1.3c.9-.9 2.1-1.4 3.4-1.4Zm0 3.5c-.6 0-1.1.2-1.5.6L8 11.5l1.5-1.5c-.4-.4-.9-.6-1.5-.6Z" />
        </svg>
        <svg viewBox="0 0 27 13" className="h-[13em] w-[27em]">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" fill="none" stroke="white" strokeOpacity="0.4" />
          <rect x="2" y="2" width="20" height="9" rx="2" fill="white" />
          <path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="white" fillOpacity="0.4" />
        </svg>
      </div>
    </div>
  );
}

function RoundButton({ icon }: { icon: Icon }) {
  return (
    <span className="grid size-[48em] place-items-center rounded-full bg-[#2a2a2d]">
      <IconBox icon={icon} size={22} />
    </span>
  );
}

/** An iconsax icon sized in the surrounding em units. */
function IconBox({ icon: I, size, className = "" }: { icon: Icon; size: number; className?: string }) {
  return (
    <span className={`block shrink-0 ${className}`} style={{ width: `${size}em`, height: `${size}em` }}>
      <I size="100%" color="currentColor" variant="Linear" />
    </span>
  );
}

function DiagArrow({ down = false }: { down?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="size-[18em]" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      {down ? <path d="M17 7 7 17M7 9v8h8" /> : <path d="M7 17 17 7M9 7h8v8" />}
    </svg>
  );
}

function StatCard({
  title,
  value,
  note,
  noteColor = "#34c759",
  bars,
  color,
}: {
  title: string;
  value: React.ReactNode;
  note: string;
  noteColor?: string;
  bars: number[];
  color: string;
}) {
  return (
    <div className="h-[161em] rounded-[24em] border-[1em] border-white/[0.06] bg-[linear-gradient(180deg,#26262a,#1d1d20)] p-[16em]">
      <div className="leading-tight">
        <div>
          <span className="text-[15em] font-medium">{title}</span>
        </div>
        <div className="mt-[4em]">
          <span className="text-[26em] font-semibold tabular-nums">{value}</span>
        </div>
        <div className="mt-[6em]">
          <span className="text-[11em]" style={{ color: noteColor }}>
            {note}
          </span>
        </div>
      </div>
      <div className="mt-[10em] flex h-[30em] items-end justify-between">
        {bars.map((h, i) => (
          <span key={i} className="block w-[3em] rounded-full" style={{ height: `${h * 1.8}em`, background: color }} />
        ))}
      </div>
    </div>
  );
}

function ExpenseRow({ e }: { e: Expense }) {
  return (
    <div className="flex h-[58em] items-center gap-[12em]">
      <span
        className="grid size-[40em] shrink-0 place-items-center rounded-full border-[1em] border-white/10"
        style={{ background: e.logo }}
      >
        <span className="text-[17em] font-bold">{e.letter}</span>
      </span>
      <div className="min-w-0 flex-1 leading-tight">
        <div className="truncate">
          <span className="text-[17em] font-medium">{e.name}</span>
        </div>
        <div className="mt-[2em]">
          <span className="text-[14em] text-[#8e8e93]">{CATEGORIES[e.cat].name}</span>
        </div>
      </div>
      <span className="text-[17em] font-semibold tabular-nums">−${money(e.amount)}</span>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-[10em]">
      <span className="text-[18em] font-semibold">{children}</span>
    </div>
  );
}

function Field({ children, active = false }: { children: React.ReactNode; active?: boolean }) {
  return (
    <div
      className="flex h-[64em] items-center gap-[12em] rounded-[20em] border-[1.5em] bg-[#232326] px-[20em] transition-colors duration-300"
      style={{ borderColor: active ? BLUE : "rgba(255,255,255,0.06)" }}
    >
      {children}
    </div>
  );
}
