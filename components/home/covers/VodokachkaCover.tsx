"use client";

import { AnimatePresence, animate, motion, useInView, useMotionValue, useReducedMotion, useTransform, type Transition } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * VODOKACHKA case cover, staged the way a showtime demo is: one real flow on a
 * phone over a soft gradient, a tap ring on every touch, no captions, and a
 * loop that returns to where it started. Menu → open the ossobuko → "Add" →
 * cart → pay → success → "Back to menu", and the next order begins.
 *
 * The phone is larger than the card, so the camera reframes like showtime's
 * crop-top / crop-bottom layouts: the top of the screen while browsing and on
 * success, the bottom while a sheet or the cart bar is in play.
 *
 * Scene units: 1em = 1/60 of the card width (a 60em × 40em, 3:2 stage).
 * Inside the phone 1em = 1pt of the 440 × 956pt Figma frame; only leaf text
 * elements change font-size, so em sizes on containers keep their units.
 */

const EASE = [0.22, 1, 0.36, 1] as const;
const SHEET: Transition = { type: "spring", stiffness: 300, damping: 34 };
const CAMERA: Transition = { type: "spring", stiffness: 70, damping: 20 };
const POP: Transition = { type: "spring", stiffness: 520, damping: 28 };
const ORANGE = "#f26b1d";
const INK = "#141414";
const GREY = "#a3a3a3";

/** Phone geometry in scene em: 440pt screen + 12pt bezel each side. */
const PHONE_W = 28;
const PT = PHONE_W / 464;
const PHONE_H = (956 + 24) * PT;
/** Phone top in scene em: crop-top, the success screen's middle, crop-bottom. */
const FRAMING = { top: 2.4, mid: -6, bottom: 40 - 2.4 - PHONE_H };

const PRICE = 800;

/** Where each touch lands on the 440 × 956pt screen. */
const TOUCHES = {
  dish: { x: 340, y: 486 },
  add: { x: 306, y: 912 },
  cart: { x: 346, y: 890 },
  pay: { x: 220, y: 898 },
  back: { x: 220, y: 638 },
} as const;
type Touch = keyof typeof TOUCHES;

type Beat = {
  screen: "menu" | "success";
  sheet: "dish" | "checkout" | null;
  /** The ossobuko is in the cart. */
  added: boolean;
  paying?: boolean;
  touch?: Touch;
  press?: boolean;
  ms: number;
};

/** A touch: the ring lands (380ms), presses in (220ms), and lifts with the next beat. */
const tap = (base: Omit<Beat, "ms" | "touch" | "press">, touch: Touch): Beat[] => [
  { ...base, touch, ms: 380 },
  { ...base, touch, press: true, ms: 220 },
];

const MENU: Omit<Beat, "ms"> = { screen: "menu", sheet: null, added: false };

const BEATS: Beat[] = [
  { ...MENU, ms: 1300 },
  ...tap(MENU, "dish"),
  { ...MENU, sheet: "dish", ms: 1700 },
  ...tap({ ...MENU, sheet: "dish" }, "add"),
  { ...MENU, added: true, ms: 1500 },
  ...tap({ ...MENU, added: true }, "cart"),
  { ...MENU, added: true, sheet: "checkout", ms: 1500 },
  ...tap({ ...MENU, added: true, sheet: "checkout" }, "pay"),
  { ...MENU, added: true, sheet: "checkout", paying: true, ms: 800 },
  { screen: "success", sheet: null, added: true, ms: 2200 },
  ...tap({ screen: "success", sheet: null, added: true }, "back"),
];

/** Reduced motion: the dish card, the screen that sells the redesign. */
const STILL: Beat = { ...MENU, sheet: "dish", ms: 0 };

const rub = (n: number) => `${n.toLocaleString("ru-RU")} ₽`;

export function VodokachkaCover() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-15% 0px" });
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const beat = reduce ? STILL : BEATS[step];
  const playing = inView && !reduce;

  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(() => setStep((s) => (s + 1) % BEATS.length), BEATS[step].ms);
    return () => clearTimeout(id);
  }, [playing, step]);

  const framing = beat.screen === "success" ? "mid" : !beat.sheet && !beat.added ? "top" : "bottom";

  return (
    <div
      ref={ref}
      aria-hidden
      className="absolute inset-0 select-none overflow-hidden [container-type:inline-size]"
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, system-ui, sans-serif',
      }}
    >
      <div className="absolute inset-0" style={{ fontSize: "calc(100cqw / 60)", color: INK }}>
        <motion.div
          className="absolute"
          style={{ left: `${(60 - PHONE_W) / 2}em`, width: `${PHONE_W}em` }}
          initial={false}
          animate={{ top: `${FRAMING[framing]}em` }}
          transition={reduce ? { duration: 0 } : CAMERA}
        >
          <div style={{ fontSize: `${PT}em` }}>
            <Phone>
              <motion.div
                className="absolute inset-0"
                animate={{ opacity: beat.screen === "menu" ? 1 : 0, scale: beat.screen === "menu" ? 1 : 0.96 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <MenuScreen added={beat.added} />
              </motion.div>

              <motion.div
                className="absolute inset-0 bg-black"
                initial={false}
                animate={{ opacity: beat.sheet ? 0.4 : 0 }}
                transition={{ duration: 0.35, ease: EASE }}
              />
              <Sheet open={beat.sheet === "dish"} top={366}>
                <DishSheet />
              </Sheet>
              <Sheet open={beat.sheet === "checkout"} top={257}>
                <CheckoutSheet paying={!!beat.paying} />
              </Sheet>

              {/* Always mounted so its photos are loaded before it shows. */}
              <motion.div
                className="absolute inset-0"
                initial={false}
                animate={beat.screen === "success" ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.04 }}
                transition={{ duration: beat.screen === "success" ? 0.5 : 0.35, ease: EASE }}
              >
                <SuccessScreen shown={beat.screen === "success"} />
              </motion.div>

              <TapRing touch={beat.touch} press={!!beat.press} />
            </Phone>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ——— Stage ——— */

function Phone({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative rounded-[72em] bg-[#0b0b0c] p-[12em] shadow-[0_0_0_2em_#4a4a4f,0_30em_70em_rgba(120,52,10,0.35),0_8em_20em_rgba(120,52,10,0.18)]">
      {/* Side buttons */}
      <span className="absolute -left-[4em] top-[180em] h-[60em] w-[3em] rounded-l-[2em] bg-[#4a4a4f]" />
      <span className="absolute -left-[4em] top-[260em] h-[60em] w-[3em] rounded-l-[2em] bg-[#4a4a4f]" />
      <span className="absolute -right-[4em] top-[220em] h-[96em] w-[3em] rounded-r-[2em] bg-[#4a4a4f]" />
      <div className="relative h-[956em] overflow-hidden rounded-[60em] bg-[#f6f6f6]">
        {children}
        {/* Dynamic Island */}
        <span className="absolute left-1/2 top-[11em] h-[37em] w-[126em] -translate-x-1/2 rounded-full bg-black" />
      </div>
    </div>
  );
}

function Sheet({ open, top, children }: { open: boolean; top: number; children: React.ReactNode }) {
  return (
    <motion.div
      className="absolute inset-x-0 bottom-0 overflow-hidden rounded-t-[36em] bg-white"
      style={{ top: `${top}em` }}
      initial={false}
      animate={{ y: open ? "0%" : "104%" }}
      transition={SHEET}
    >
      {children}
    </motion.div>
  );
}

/**
 * showtime-style touch indicator, placed by screen coordinates rather than by
 * element: a frosted disc lands, presses in, and lifts off with a ripple.
 */
function TapRing({ touch, press }: { touch?: Touch; press: boolean }) {
  const at = touch ? TOUCHES[touch] : null;
  return (
    <AnimatePresence>
      {at && (
        <motion.span
          key={touch}
          className="pointer-events-none absolute -ml-[28em] -mt-[28em] size-[56em]"
          style={{ left: `${at.x}em`, top: `${at.y}em` }}
          initial={{ opacity: 0, scale: 1.5 }}
          animate={{ opacity: 1, scale: press ? 0.82 : 1 }}
          exit={{ opacity: 0, scale: 1.15, transition: { duration: 0.35, ease: EASE } }}
          transition={POP}
        >
          {/* A dark hairline outside the white rim keeps the ring readable on white and on orange. */}
          <span className="absolute inset-0 rounded-full border-[3.5em] border-white bg-[rgba(30,30,34,0.3)] shadow-[0_0_0_1.5em_rgba(0,0,0,0.22),0_4em_16em_rgba(0,0,0,0.3)] backdrop-blur-[3em]" />
          {press && (
            <motion.span
              initial={{ opacity: 0.85, scale: 1 }}
              animate={{ opacity: 0, scale: 2.2 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="absolute inset-0 rounded-full border-[3em] border-white shadow-[0_0_0_1em_rgba(0,0,0,0.15)]"
            />
          )}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

/* ——— Screens ——— */

function MenuScreen({ added }: { added: boolean }) {
  return (
    <div className="relative h-full bg-[#f6f6f6]">
      <div className="rounded-b-[28em] bg-white pb-[16em] shadow-[0_4em_16em_rgba(0,0,0,0.04)]">
        <StatusBar />
        <div className="relative flex h-[56em] items-center justify-center">
          <span className="absolute left-[16em] grid size-[48em] place-items-center rounded-full bg-white shadow-[0_2em_10em_rgba(0,0,0,0.12)]">
            <svg viewBox="0 0 24 24" className="size-[22em]" fill="none" stroke={INK} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 5-7 7 7 7" />
            </svg>
          </span>
          <span className="text-[28em] font-semibold tracking-[-0.02em]">Меню</span>
        </div>
        <div className="mt-[6em] flex items-center gap-[10em] whitespace-nowrap pl-[24em]">
          <span className="rounded-full px-[14em] py-[8em] text-white" style={{ background: ORANGE }}>
            <span className="text-[17em] font-medium">Все</span>
          </span>
          {["Закуски", "Салаты", "Супы", "Горячее"].map((t) => (
            <span key={t} className="px-[14em] py-[8em]">
              <span className="text-[17em] font-medium">{t}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="mx-[17em] mt-[20em] rounded-[26em] bg-white">
        <div className="px-[16em] pt-[18em]">
          <span className="text-[22em] font-semibold tracking-[-0.01em]">Горячее</span>
        </div>
        <Dish name="Стейк из сибаса, бейби картофель" price="530 ₽" weight="140 г" photo="steak" soldOut />
        <Divider />
        <Dish name="Оссобуко, картофельное пюре" price="800 ₽" weight="260 г" photo="ossobuko" count={added ? 1 : 0} />
        <Divider />
        <Dish name="Котлеты из индейки, пюре" price="800 ₽" weight="260 г" photo="kotlety" />
      </div>

      <div className="mx-[17em] mt-[16em] rounded-[26em] bg-white">
        <div className="px-[16em] pt-[18em]">
          <span className="text-[22em] font-semibold tracking-[-0.01em]">Десерты</span>
        </div>
        <Dish name="Кирпич" price="420 ₽" weight="100 г" photo="kirpich" />
      </div>

      {/* Cart bar */}
      <div className="absolute inset-x-[17em] top-[858em] flex h-[64em] items-center justify-between rounded-[24em] bg-white pl-[20em] pr-[10em] shadow-[0_-2em_20em_rgba(0,0,0,0.08)]">
        <span className="text-[22em] font-semibold tabular-nums">
          <Num value={added ? PRICE : 0} format={(n) => rub(Math.round(n))} />
        </span>
        <motion.span
          className="relative flex h-[44em] items-center gap-[10em] rounded-full px-[18em] shadow-[0_2em_10em_rgba(0,0,0,0.1)]"
          initial={false}
          animate={{ backgroundColor: added ? ORANGE : "#ffffff", color: added ? "#ffffff" : INK }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <span className="text-[17em] font-medium">Корзина</span>
          <Cutlery />
          <AnimatePresence>
            {added && (
              <motion.span
                key="badge"
                className="absolute -right-[4em] -top-[6em] grid size-[22em] place-items-center rounded-full bg-[#141414] text-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ ...POP, delay: 0.25 }}
              >
                <span className="text-[12em] font-semibold">1</span>
              </motion.span>
            )}
          </AnimatePresence>
        </motion.span>
      </div>
    </div>
  );
}

function Dish({
  name,
  price,
  weight,
  photo,
  soldOut = false,
  count = 0,
}: {
  name: string;
  price: string;
  weight: string;
  photo: string;
  soldOut?: boolean;
  count?: number;
}) {
  return (
    <div className="flex gap-[16em] px-[16em] py-[18em]">
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-[17em] font-medium leading-[1.25]">{name}</span>
        <div className="mt-[8em] flex items-baseline gap-[10em]">
          <span className="text-[17em] font-medium">{price}</span>
          <span className="text-[13em]" style={{ color: GREY }}>
            {weight}
          </span>
        </div>
        <div className="mt-auto pt-[10em]">
          {soldOut ? (
            <span className="text-[15em] font-medium text-[#bdbdbd]">Закончилось</span>
          ) : (
            <Stepper count={count} />
          )}
        </div>
      </div>
      <div className={`relative h-[100em] w-[141em] shrink-0 overflow-hidden rounded-[16em] bg-[#222] ${soldOut ? "opacity-45 grayscale" : ""}`}>
        <Image src={`/images/vodokachka/thumb-${photo}.png`} alt="" fill sizes="80px" className="object-cover" />
      </div>
    </div>
  );
}

/** "+" until the dish is in the cart, then "− 1 +". */
function Stepper({ count }: { count: number }) {
  return (
    <span className="relative flex h-[38em] w-[119em] items-center justify-center overflow-hidden rounded-[14em] bg-white shadow-[0_2em_10em_rgba(0,0,0,0.12)]">
      <AnimatePresence initial={false} mode="popLayout">
        {count === 0 ? (
          <motion.span key="plus" initial={{ opacity: 0, y: "8em" }} animate={{ opacity: 1, y: "0em" }} exit={{ opacity: 0, y: "-8em" }} transition={{ duration: 0.25 }}>
            <PlusMinus plus />
          </motion.span>
        ) : (
          <motion.span
            key="count"
            className="flex w-[119em] items-center justify-between px-[14em]"
            initial={{ opacity: 0, y: "8em" }}
            animate={{ opacity: 1, y: "0em" }}
            exit={{ opacity: 0, y: "-8em" }}
            transition={{ duration: 0.25, delay: 0.25 }}
          >
            <PlusMinus />
            <span className="text-[16em] font-medium">{count}</span>
            <PlusMinus plus />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

function DishSheet() {
  return (
    <div className="flex h-full flex-col px-[16em] pt-[16em]">
      <div className="relative h-[300em] shrink-0 overflow-hidden rounded-[32em] bg-[#222]">
        <Image src="/images/vodokachka/hero-ossobuko.png" alt="" fill sizes="(max-width: 1024px) 50vw, 300px" className="object-cover" />
        <span className="absolute bottom-[16em] left-[14em] rounded-full bg-black/45 px-[14em] py-[7em] text-white backdrop-blur-[8em]">
          <span className="text-[13em] font-medium">Хит недели</span>
        </span>
      </div>
      <div className="px-[8em] pt-[18em]">
        <div className="text-[24em] font-semibold leading-tight tracking-[-0.015em]">Оссобуко, картофельное пюре</div>
        <div className="mt-[4em]">
          <span className="text-[13em]" style={{ color: GREY }}>
            260 г
          </span>
        </div>
        <div className="mt-[14em] h-[1em] bg-[#ececec]" />
        <div className="mt-[16em] flex items-center justify-between">
          <span className="text-[18em] font-medium">Подробнее о блюде</span>
          <svg viewBox="0 0 24 24" className="size-[18em]" fill="none" stroke={GREY} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 15 6-6 6 6" />
          </svg>
        </div>
        <div className="mt-[10em]">
          <p className="line-clamp-3 text-[12.5em] leading-[1.35] text-[#8a8a8a]">
            Классическое итальянское блюдо, где нежное оссобуко из говядины, томленое с овощами и вином, подаётся с кремовым картофельным пюре
          </p>
        </div>
      </div>
      {/* Pinned 24pt above the screen's bottom edge, where TOUCHES.add lands. */}
      <div className="mt-auto flex items-center justify-between gap-[50em] px-[8em] pb-[24em]">
        <span className="grid h-[40em] w-[119em] place-items-center rounded-[14em] bg-white shadow-[0_2em_10em_rgba(0,0,0,0.12)]">
          <PlusMinus plus />
        </span>
        <span className="grid h-[40em] flex-1 place-items-center rounded-full text-white" style={{ background: ORANGE }}>
          <span className="text-[17em] font-semibold">Добавить • 800 ₽</span>
        </span>
      </div>
    </div>
  );
}

function CheckoutSheet({ paying }: { paying: boolean }) {
  return (
    <div className="relative h-full">
      <div className="flex h-[80em] items-center justify-between pl-[16em] pr-[16em]">
        <span className="text-[24em] font-bold tracking-[-0.015em]">1 блюдо на 800 ₽</span>
        <span className="grid size-[44em] place-items-center rounded-full bg-white shadow-[0_2em_10em_rgba(0,0,0,0.12)]">
          <svg viewBox="0 0 24 24" className="size-[18em]" fill="none" stroke={INK} strokeWidth={2.4} strokeLinecap="round">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </span>
      </div>
      <div className="h-[1em] bg-[#ececec]" />
      <div className="flex gap-[16em] px-[16em] py-[18em]">
        <div className="flex flex-1 flex-col">
          <span className="text-[17em] font-medium leading-[1.25]">Оссобуко, картофельное пюре</span>
          <div className="mt-[8em] flex items-baseline gap-[10em]">
            <span className="text-[17em] font-medium">800 ₽</span>
            <span className="text-[13em]" style={{ color: GREY }}>
              260 г
            </span>
          </div>
          <div className="mt-[12em]">
            <Stepper count={1} />
          </div>
        </div>
        <div className="relative h-[100em] w-[141em] shrink-0 overflow-hidden rounded-[16em] bg-[#222]">
          <Image src="/images/vodokachka/thumb-ossobuko.png" alt="" fill sizes="80px" className="object-cover" />
        </div>
      </div>
      <div className="h-[1em] bg-[#ececec]" />
      <div className="flex h-[48em] items-center gap-[16em] px-[18em]">
        <svg viewBox="0 0 24 24" className="size-[22em]" fill="none" stroke={INK} strokeWidth={1.8} strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="14" rx="3" />
          <path d="m4 7 8 6 8-6" />
        </svg>
        <span className="flex-1 text-[16em] font-medium">Отправить чек на почту</span>
        <svg viewBox="0 0 24 24" className="size-[16em]" fill="none" stroke={INK} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
      <div className="h-[1em] bg-[#ececec]" />
      <div className="flex flex-col gap-[14em] px-[16em] pt-[24em]">
        {[
          "Я согласен(-а) заплатить лицензионное вознаграждение 3 ₽ за доступ к платформе, функционал «оплата заказа»",
          "Я ознакомлен(-а) и согласен(-а) с условиями Лицензионного соглашения и Политикой конфиденциальности",
        ].map((t) => (
          <div key={t} className="flex items-start gap-[12em]">
            <span className="mt-[2em] grid size-[20em] shrink-0 place-items-center rounded-[6em]" style={{ background: ORANGE }}>
              <svg viewBox="0 0 24 24" className="size-[14em]" fill="none" stroke="white" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 12.5 4.5 4.5L19 7.5" />
              </svg>
            </span>
            <span className="text-[12em] leading-[1.35] text-[#3a3a3a]">{t}</span>
          </div>
        ))}
      </div>
      <motion.div
        className="absolute inset-x-[16em] top-[614em] grid h-[54em] place-items-center rounded-full text-white"
        style={{ background: ORANGE }}
        animate={{ scale: paying ? 0.98 : 1 }}
        transition={POP}
      >
        <AnimatePresence mode="wait" initial={false}>
          {paying ? (
            <motion.span
              key="spin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, rotate: 360 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 0.15 }, rotate: { duration: 0.8, ease: "linear", repeat: Infinity } }}
              className="block size-[24em] rounded-full border-[3em] border-white/35 border-t-white"
            />
          ) : (
            <motion.span key="label" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <span className="text-[19em] font-semibold">Оплатить заказ • 800 ₽</span>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function SuccessScreen({ shown }: { shown: boolean }) {
  return (
    <div className="h-full bg-[#f6f6f6]">
      <StatusBar />
      <motion.div
        className="relative mx-auto mt-[40em] h-[158em] w-[210em]"
        initial={false}
        animate={shown ? { y: "0em", opacity: 1 } : { y: "24em", opacity: 0 }}
        transition={shown ? { type: "spring", stiffness: 200, damping: 16, delay: 0.15 } : { duration: 0 }}
      >
        <Image src="/images/vodokachka/cheetah.png" alt="" fill sizes="120px" className="object-contain" />
      </motion.div>
      <div className="mt-[44em] text-center">
        <div className="text-[28em] font-bold tracking-[-0.02em]">Оплата прошла успешно!</div>
        <div className="mt-[6em]">
          <span className="text-[16em] font-medium">Мы уже начали готовить ваш заказ</span>
        </div>
      </div>
      <div className="mx-[16em] mt-[44em] rounded-[28em] bg-white p-[8em] shadow-[0_4em_20em_rgba(0,0,0,0.05)]">
        <div className="flex gap-[16em] px-[12em] py-[18em]">
          <div className="flex flex-1 flex-col">
            <span className="text-[17em] font-medium leading-[1.25]">Оссобуко, картофельное пюре</span>
            <div className="mt-[8em] flex items-baseline gap-[10em]">
              <span className="text-[17em] font-medium">800 ₽</span>
              <span className="text-[13em]" style={{ color: GREY }}>
                260 г
              </span>
            </div>
          </div>
          <div className="relative h-[100em] w-[141em] shrink-0 overflow-hidden rounded-[16em] bg-[#222]">
            <Image src="/images/vodokachka/thumb-ossobuko.png" alt="" fill sizes="80px" className="object-cover" />
          </div>
        </div>
        <div className="grid h-[52em] place-items-center rounded-[22em] bg-white shadow-[0_2em_12em_rgba(0,0,0,0.1)]">
          <span className="text-[18em] font-medium">Назад к меню</span>
        </div>
      </div>
    </div>
  );
}

/* ——— Bits ——— */

function StatusBar() {
  return (
    <div className="flex h-[62em] items-center justify-between pl-[44em] pr-[34em] pt-[6em]">
      <span className="text-[17em] font-semibold">9:41</span>
      <div className="flex items-center gap-[7em]">
        <svg viewBox="0 0 18 12" className="h-[12em] w-[18em]" fill={INK}>
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg viewBox="0 0 16 12" className="h-[12em] w-[16em]" fill={INK}>
          <path d="M8 2.3c2.3 0 4.4.9 6 2.4l1.2-1.3A10.4 10.4 0 0 0 8 .5C5.2.5 2.7 1.6.8 3.4L2 4.7a8.6 8.6 0 0 1 6-2.4Zm0 3.6c1.3 0 2.5.5 3.4 1.4l1.2-1.3A6.6 6.6 0 0 0 8 4.1c-1.8 0-3.4.7-4.6 1.9l1.2 1.3c.9-.9 2.1-1.4 3.4-1.4Zm0 3.5c-.6 0-1.1.2-1.5.6L8 11.5l1.5-1.5c-.4-.4-.9-.6-1.5-.6Z" />
        </svg>
        <svg viewBox="0 0 27 13" className="h-[13em] w-[27em]">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" fill="none" stroke={INK} strokeOpacity="0.4" />
          <rect x="2" y="2" width="20" height="9" rx="2" fill={INK} />
          <path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill={INK} fillOpacity="0.4" />
        </svg>
      </div>
    </div>
  );
}

function Divider() {
  return <div className="h-[1em] bg-[#efefef]" />;
}

function PlusMinus({ plus = false }: { plus?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="block size-[20em]" fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round">
      <path d={plus ? "M12 4v16M4 12h16" : "M4 12h16"} />
    </svg>
  );
}

function Cutlery() {
  return (
    <svg viewBox="0 0 24 24" className="size-[22em]" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3v6a2 2 0 0 0 4 0V3M8 3v18M17 21V3c-2 1-3 3.5-3 7 0 2 1 3 3 3" />
    </svg>
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
