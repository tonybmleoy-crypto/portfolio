"use client";

import Image from "next/image";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Add, ArrowDown2, ArrowLeft2, CloseCircle, Minus, Reserve, Sms, TickCircle } from "iconsax-react";

// ---------------------------------------------------------------------------
// Brand tokens — VODOKACHKA's own palette, scoped to this component only.
// ---------------------------------------------------------------------------
const ORANGE = "#f46811";
const ORANGE_DISABLED = "#f9b388";
const DISH_PRICE = 800;

const SPRING_UI = { type: "spring", bounce: 0, duration: 0.35 } as const;
const SPRING_TAP = { type: "spring", bounce: 0, duration: 0.15 } as const;
const SPRING_SHEET = { type: "spring", bounce: 0.16, duration: 0.32 } as const;
const SHEET_TRAVEL = 760;

/** Apple's momentum-projection helper — see WWDC18 "Designing Fluid Interfaces". */
function project(velocity: number, decelerationRate = 0.998) {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------
function IconSignal(props: { className?: string }) {
  return (
    <svg viewBox="0 0 20 12" fill="none" className={props.className} aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={i * 5} y={9 - i * 2.5} width="3.4" height={3 + i * 2.5} rx="0.8" fill="currentColor" />
      ))}
    </svg>
  );
}
function IconWifi(props: { className?: string }) {
  return (
    <svg viewBox="0 0 20 14" fill="none" className={props.className} aria-hidden>
      <path
        d="M1 5.5c5-5 13-5 18 0M4 8.5c3.6-3.4 8.4-3.4 12 0M7.3 11.3a4 4 0 0 1 5.4 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="10" cy="13.2" r="1" fill="currentColor" />
    </svg>
  );
}
function IconBattery(props: { className?: string }) {
  return (
    <svg viewBox="0 0 25 12" fill="none" className={props.className} aria-hidden>
      <rect x="0.75" y="0.75" width="20.5" height="10.5" rx="2.5" stroke="currentColor" strokeWidth="1.1" opacity="0.4" />
      <rect x="2.25" y="2.25" width="17.5" height="7.5" rx="1.5" fill="currentColor" />
      <path d="M22.5 4v4a1.6 1.6 0 0 0 1-1.5V5.5A1.6 1.6 0 0 0 22.5 4Z" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Device chrome
// ---------------------------------------------------------------------------
function StatusBar({ light }: { light?: boolean }) {
  const tone = light ? "text-white" : "text-[#0b0b0c]";
  return (
    <div className={`relative z-30 flex items-center justify-between px-7 pt-3.5 pb-1 text-[15px] font-semibold ${tone}`}>
      <span className="tabular-nums tracking-tight">9:41</span>
      <div className="flex items-center gap-1.5">
        <IconSignal className="h-3 w-4" />
        <IconWifi className="h-3.5 w-4" />
        <IconBattery className="h-3 w-[25px]" />
      </div>
    </div>
  );
}

function HomeIndicator({ light }: { light?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-1.5 z-40 flex justify-center">
      <div className={`h-1 w-32 rounded-full ${light ? "bg-white/80" : "bg-black/70"}`} />
    </div>
  );
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-[336px] shrink-0 select-none [@media(max-width:420px)]:origin-top [@media(max-width:420px)]:scale-[0.84]">
      <div className="relative rounded-[52px] bg-[#111214] p-[11px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.35),0_10px_24px_-8px_rgba(0,0,0,0.25)]">
        <div className="relative h-[700px] w-full overflow-hidden rounded-[42px] bg-white">
          <div className="pointer-events-none absolute left-1/2 top-[11px] z-40 h-[26px] w-[92px] -translate-x-1/2 rounded-full bg-black" />
          {children}
        </div>
      </div>
      {/* side buttons */}
      <div className="absolute -right-[2px] top-[150px] h-14 w-[3px] rounded-r-sm bg-[#0c0d0e]" />
      <div className="absolute -left-[2px] top-[120px] h-8 w-[3px] rounded-l-sm bg-[#0c0d0e]" />
      <div className="absolute -left-[2px] top-[168px] h-14 w-[3px] rounded-l-sm bg-[#0c0d0e]" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
type MenuItem = {
  id: string;
  title: string;
  price: number;
  weight: string;
  image: string;
  soldOut?: boolean;
};

const HOT_ITEMS: MenuItem[] = [
  {
    id: "steak",
    title: "Стейк из сибаса, бейби картофель",
    price: 530,
    weight: "140 г",
    image: "/images/vodokachka/thumb-steak.png",
    soldOut: true,
  },
  {
    id: "ossobuko",
    title: "Оссобуко, картофельное пюре",
    price: DISH_PRICE,
    weight: "260 г",
    image: "/images/vodokachka/thumb-ossobuko.png",
  },
  {
    id: "kotlety",
    title: "Котлеты из индейки, пюре",
    price: 800,
    weight: "260 г",
    image: "/images/vodokachka/thumb-kotlety.png",
  },
];

const DESSERT_ITEMS: MenuItem[] = [
  {
    id: "kirpich",
    title: "Кирпич",
    price: 420,
    weight: "100 г",
    image: "/images/vodokachka/thumb-kirpich.png",
  },
];

const TABS = [
  { id: "all", label: "Все" },
  { id: "starters", label: "Закуски" },
  { id: "salads", label: "Салаты" },
  { id: "soups", label: "Супы" },
  { id: "hot", label: "Горячее" },
] as const;
type TabId = (typeof TABS)[number]["id"];

// ---------------------------------------------------------------------------
// Generic drag-to-dismiss bottom sheet
// ---------------------------------------------------------------------------
function Sheet({
  open,
  onClose,
  children,
  z = 50,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  z?: number;
}) {
  const reduced = useReducedMotion();
  const y = useMotionValue(SHEET_TRAVEL);
  const scrimOpacity = useTransform(y, [0, SHEET_TRAVEL], [1, 0]);
  const pointerEvents = useTransform(y, (v) => (v < SHEET_TRAVEL - 8 ? "auto" : "none"));

  useEffect(() => {
    if (reduced) {
      y.set(open ? 0 : SHEET_TRAVEL);
      return;
    }
    const controls = animate(y, open ? 0 : SHEET_TRAVEL, SPRING_SHEET);
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, reduced]);

  function handleDragEnd(_: unknown, info: PanInfo) {
    const current = y.get();
    const projected = current + project(info.velocity.y);
    const shouldClose = projected > SHEET_TRAVEL * 0.45;
    const target = shouldClose ? SHEET_TRAVEL : 0;
    animate(y, target, { ...SPRING_SHEET, velocity: info.velocity.y });
    if (shouldClose) onClose();
  }

  return (
    <>
      <motion.div
        style={{ opacity: scrimOpacity, pointerEvents, zIndex: z }}
        onClick={onClose}
        className="absolute inset-0 bg-black/45 backdrop-blur-[1px]"
      />
      <motion.div
        style={{ y, pointerEvents, touchAction: "none", zIndex: z + 1 }}
        drag={reduced ? false : "y"}
        dragConstraints={{ top: 0, bottom: SHEET_TRAVEL }}
        dragElastic={{ top: 0.2, bottom: 0 }}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        className="absolute inset-x-0 bottom-0 flex max-h-[92%] flex-col rounded-t-[28px] bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.12)]"
      >
        <div className="flex shrink-0 cursor-grab justify-center pt-2.5 pb-1 active:cursor-grabbing">
          <div className="h-1.5 w-9 rounded-full bg-black/15" />
        </div>
        {children}
      </motion.div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Screens
// ---------------------------------------------------------------------------
function PressButton({
  children,
  className,
  onClick,
  disabled,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      transition={SPRING_TAP}
      className={className}
      style={style}
    >
      {children}
    </motion.button>
  );
}

function CoverScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[#171006]">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 70% at 50% 0%, rgba(120,70,30,0.35) 0%, rgba(23,16,6,0.85) 55%, #100a04 100%)",
        }}
      />
      <div className="relative z-10 flex h-full flex-col">
        <StatusBar light />
        <div className="flex flex-1 flex-col px-7 pt-16">
          <div className="text-center">
            <p className="text-[11px] font-medium tracking-[0.18em] text-white/70">ВСЁ НА КРАНАХ И ЕДА</p>
            <h1
              className="mt-2 text-[40px] font-black uppercase leading-none text-white"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif", letterSpacing: "-0.01em" }}
            >
              Водокачка
            </h1>
            <p className="mt-2 text-[11px] font-medium tracking-[0.1em] text-white/60">
              ТЮМЕНЬ / 25 ОКТЯБРЯ 23-Б
              <br />
              ESTD 1864
            </p>
          </div>

          <div className="mt-auto pb-8">
            <h2 className="text-[22px] font-semibold leading-[1.15] text-white">
              Хотим немного рассказать о месте, которое ты сегодня выбрал
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-white/70">
              Это здание появилось в 1864 году и стало первой водонасосной станцией в Западной Сибири. Оно долго время
              было заброшено, но после реставрации в 2022 году у нас появилась возможность открыть здесь бар с кухней и
              напитками со всего света.
            </p>

            <PressButton
              onClick={onStart}
              className="mt-6 w-full rounded-full bg-white py-4 text-[15px] font-semibold text-[#171006]"
            >
              Смотреть меню
            </PressButton>
            <p className="mt-3 text-center text-[11px] leading-snug text-white/50">
              Осмотрись и не забудь заглянуть в круглый зал, чтобы увидеть первый в России интерактивный бар
            </p>
          </div>
        </div>
        <HomeIndicator light />
      </div>
    </div>
  );
}

function MenuRow({
  item,
  onOpen,
}: {
  item: MenuItem;
  onOpen: (item: MenuItem) => void;
}) {
  return (
    <div className={`flex items-center gap-3 py-3.5 ${item.soldOut ? "opacity-60" : ""}`}>
      <div className="min-w-0 flex-1">
        <p className="text-[14.5px] font-medium leading-snug text-[#101012]">{item.title}</p>
        <p className="mt-1 text-[13px] text-[#101012]">
          {item.soldOut ? <span className="text-black/35">{item.price} ₽</span> : `${item.price} ₽`}{" "}
          <span className="text-black/35">{item.weight}</span>
        </p>
        {item.soldOut ? (
          <p className="mt-2 text-[13px] text-black/35">Закончилось</p>
        ) : (
          <PressButton
            onClick={() => onOpen(item)}
            className="mt-2 flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-[#101012]"
          >
            <Add color="currentColor" variant="Linear" className="h-4 w-4" />
          </PressButton>
        )}
      </div>
      <button
        type="button"
        disabled={item.soldOut}
        onClick={() => onOpen(item)}
        className="relative h-[74px] w-[92px] shrink-0 overflow-hidden rounded-2xl"
      >
        <Image src={item.image} alt={item.title} fill sizes="92px" className="object-cover" quality={90} />
      </button>
    </div>
  );
}

function CartBar({ total, onOpenCart }: { total: number; onOpenCart: () => void }) {
  return (
    <div className="flex items-center justify-between border-t border-black/[0.06] bg-white/90 px-5 py-3.5 backdrop-blur-md">
      <div className="relative h-6 overflow-hidden text-[15px] font-semibold text-[#101012]">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={total}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={SPRING_UI}
            className="block tabular-nums"
          >
            {total} ₽
          </motion.span>
        </AnimatePresence>
      </div>
      <PressButton
        onClick={onOpenCart}
        disabled={total === 0}
        className="flex items-center gap-1.5 rounded-full bg-black/[0.05] px-4 py-2 text-[14px] font-medium text-[#101012] disabled:opacity-40"
      >
        Корзина
        <Reserve color="currentColor" variant="Linear" className="h-3.5 w-3.5" />
      </PressButton>
    </div>
  );
}

function MenuScreen({
  tab,
  onTab,
  onBack,
  onOpenDish,
  cartTotal,
  onOpenCart,
}: {
  tab: TabId;
  onTab: (t: TabId) => void;
  onBack: () => void;
  onOpenDish: (item: MenuItem) => void;
  cartTotal: number;
  onOpenCart: () => void;
}) {
  const showHot = tab === "all" || tab === "hot";
  const showDesserts = tab === "all";
  const showEmpty = !showHot && !showDesserts;

  return (
    <div className="flex h-full flex-col bg-white">
      <StatusBar />
      <div className="flex items-center px-3 pt-1 pb-2">
        <PressButton onClick={onBack} className="flex h-9 w-9 items-center justify-center rounded-full text-[#101012]">
          <ArrowLeft2 color="currentColor" variant="Linear" className="h-5 w-5" />
        </PressButton>
        <h1 className="flex-1 text-center text-[17px] font-semibold text-[#101012]">Меню</h1>
        <div className="w-9" />
      </div>

      <div className="flex gap-5 overflow-x-auto px-5 pb-3 text-[14.5px] font-medium text-[#101012]/55 [scrollbar-width:none]">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => onTab(t.id)}
            className="relative whitespace-nowrap pb-1"
          >
            {tab === t.id && (
              <motion.span
                layoutId="tab-pill"
                transition={{ type: "spring", bounce: 0.15, duration: 0.35 }}
                className="absolute inset-0 -z-10 -mx-2.5 -my-1 rounded-full"
                style={{ background: ORANGE }}
              />
            )}
            <span className={tab === t.id ? "relative px-2.5 py-1 font-semibold text-white" : "relative px-2.5 py-1"}>
              {t.label}
            </span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-2 [scrollbar-width:none]">
        {showHot && (
          <div className="rounded-[22px] bg-[#fafafa] px-4">
            <p className="pt-4 text-[16px] font-semibold text-[#101012]">Горячее</p>
            <div className="divide-y divide-black/[0.06]">
              {HOT_ITEMS.map((item) => (
                <MenuRow key={item.id} item={item} onOpen={onOpenDish} />
              ))}
            </div>
          </div>
        )}

        {showDesserts && (
          <div className="mt-4 rounded-[22px] bg-[#fafafa] px-4">
            <p className="pt-4 text-[16px] font-semibold text-[#101012]">Десерты</p>
            <div className="divide-y divide-black/[0.06]">
              {DESSERT_ITEMS.map((item) => (
                <MenuRow key={item.id} item={item} onOpen={onOpenDish} />
              ))}
            </div>
          </div>
        )}

        {showEmpty && (
          <div className="flex h-[320px] items-center justify-center text-center text-[13.5px] text-black/35">
            Скоро добавим блюда
            <br />в этот раздел
          </div>
        )}
      </div>

      <CartBar total={cartTotal} onOpenCart={onOpenCart} />
      <HomeIndicator />
    </div>
  );
}

function QtyStepper({
  qty,
  onChange,
  min = 0,
}: {
  qty: number;
  onChange: (q: number) => void;
  min?: number;
}) {
  if (qty <= 0) {
    return (
      <PressButton
        onClick={() => onChange(1)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-[#101012]"
      >
        <Add color="currentColor" variant="Linear" className="h-4 w-4" />
      </PressButton>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={SPRING_UI}
      className="flex items-center gap-3 rounded-full border border-black/10 px-1"
    >
      <PressButton
        onClick={() => onChange(Math.max(min, qty - 1))}
        className="flex h-8 w-8 items-center justify-center rounded-full text-[#101012]"
      >
        <Minus color="currentColor" variant="Linear" className="h-4 w-4" />
      </PressButton>
      <span className="w-4 text-center text-[14px] font-semibold tabular-nums text-[#101012]">{qty}</span>
      <PressButton
        onClick={() => onChange(qty + 1)}
        className="flex h-8 w-8 items-center justify-center rounded-full text-[#101012]"
      >
        <Add color="currentColor" variant="Linear" className="h-4 w-4" />
      </PressButton>
    </motion.div>
  );
}

function DishSheetContent({
  qty,
  onQty,
  onAdd,
}: {
  qty: number;
  onQty: (q: number) => void;
  onAdd: () => void;
}) {
  const total = Math.max(qty, 1) * DISH_PRICE;
  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-5 pb-5">
      <div className="relative -mx-5 h-[220px] overflow-hidden">
        <Image
          src="/images/vodokachka/hero-ossobuko.png"
          alt="Оссобуко, картофельное пюре"
          fill
          sizes="336px"
          className="object-cover"
          quality={90}
          priority
        />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
        <span className="absolute bottom-3 left-4 rounded-full bg-black/55 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
          Хит недели
        </span>
      </div>

      <div className="pt-4">
        <h2 className="text-[19px] font-semibold text-[#101012]">Оссобуко, картофельное пюре</h2>
        <p className="mt-1 text-[13px] text-black/40">260 г</p>

        <div className="mt-4 border-t border-black/[0.06] pt-3">
          <div className="flex items-center justify-between">
            <p className="text-[14.5px] font-medium text-[#101012]">Подробнее о блюде</p>
            <ArrowDown2 color="currentColor" variant="Linear" className="h-4 w-4 rotate-180 text-black/40" />
          </div>
          <p className="mt-2 text-[13.5px] leading-relaxed text-black/55">
            Классическое итальянское блюдо, где нежное оссобуко из говядины, томленое с овощами и вином, подается с
            кремовым картофельным пюре, которое отлично впитывает ароматный соус.
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <QtyStepper qty={qty} onChange={onQty} />
        <PressButton
          onClick={onAdd}
          style={{ background: ORANGE }}
          className="flex-1 rounded-full py-3.5 text-[15px] font-semibold text-white"
        >
          Добавить · {total} ₽
        </PressButton>
      </div>
    </div>
  );
}

function CheckoutContent({
  qty,
  onQty,
  agreeFee,
  onAgreeFee,
  agreeTerms,
  onAgreeTerms,
  onPay,
  onClose,
}: {
  qty: number;
  onQty: (q: number) => void;
  agreeFee: boolean;
  onAgreeFee: (v: boolean) => void;
  agreeTerms: boolean;
  onAgreeTerms: (v: boolean) => void;
  onPay: () => void;
  onClose: () => void;
}) {
  const total = qty * DISH_PRICE;
  const canPay = agreeFee && agreeTerms;

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-5 pb-6">
      <div className="flex items-center justify-between pb-1">
        <h2 className="text-[18px] font-semibold text-[#101012]">
          {qty} блюдо на {total} ₽
        </h2>
        <PressButton onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-black/[0.05] text-[#101012]">
          <CloseCircle color="currentColor" variant="Linear" className="h-4 w-4" />
        </PressButton>
      </div>

      <div className="flex items-center gap-3 border-b border-black/[0.06] py-4">
        <div className="min-w-0 flex-1">
          <p className="text-[14.5px] font-medium text-[#101012]">Оссобуко, картофельное пюре</p>
          <p className="mt-1 text-[13px] text-black/40">{DISH_PRICE} ₽ · 260 г</p>
          <div className="mt-2">
            <QtyStepper qty={qty} onChange={(q) => onQty(Math.max(1, q))} min={1} />
          </div>
        </div>
        <div className="relative h-[68px] w-[84px] shrink-0 overflow-hidden rounded-2xl">
          <Image src="/images/vodokachka/thumb-ossobuko.png" alt="" fill sizes="84px" className="object-cover" quality={90} />
        </div>
      </div>

      <button type="button" className="flex items-center justify-between py-4 text-left">
        <span className="flex items-center gap-2.5 text-[14px] text-[#101012]">
          <Sms color="currentColor" variant="Linear" className="h-4 w-4 text-black/40" />
          Отправить чек на почту
        </span>
        <ArrowDown2 color="currentColor" variant="Linear" className="h-4 w-4 text-black/40" />
      </button>

      <div className="flex flex-col gap-3 border-t border-black/[0.06] pt-4">
        <label className="flex cursor-pointer items-start gap-2.5">
          <Checkbox checked={agreeFee} onChange={onAgreeFee} />
          <span className="text-[12px] leading-relaxed text-black/55">
            Я согласен(-а) заплатить лицензионное вознаграждение 3 ₽ за доступ к платформе *****, функционал «оплата
            заказа»
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-2.5">
          <Checkbox checked={agreeTerms} onChange={onAgreeTerms} />
          <span className="text-[12px] leading-relaxed text-black/55">
            Я ознакомлен(-а) и согласен(-а) с условиями Лицензионного соглашения нетмонет и Политикой
            конфиденциальности и обработки персональных данных платформы ********* и даю согласие на обработку своих
            персональных данных
          </span>
        </label>
      </div>

      <PressButton
        onClick={canPay ? onPay : undefined}
        disabled={!canPay}
        style={{ background: canPay ? ORANGE : ORANGE_DISABLED }}
        className="mt-5 w-full rounded-full py-4 text-[15px] font-semibold text-white transition-colors duration-200"
      >
        Оплатить заказ · {total} ₽
      </PressButton>
    </div>
  );
}

function Checkbox({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <PressButton
      onClick={() => onChange(!checked)}
      className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border ${
        checked ? "border-transparent" : "border-black/20"
      }`}
    >
      <span
        className="flex h-full w-full items-center justify-center rounded-[5px]"
        style={{ background: checked ? ORANGE : "transparent" }}
      >
        <AnimatePresence>
          {checked && (
            <motion.span
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={SPRING_UI}
            >
              <TickCircle color="currentColor" variant="Linear" className="h-3 w-3 text-white" />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </PressButton>
  );
}

function SuccessContent({ qty, onBack }: { qty: number; onBack: () => void }) {
  const total = qty * DISH_PRICE;
  return (
    <div className="flex flex-1 flex-col items-center px-6 pb-6 pt-2 text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.4, duration: 0.5 }}
      >
        <Image src="/images/vodokachka/cheetah.png" alt="" width={200} height={150} className="h-[120px] w-auto" />
      </motion.div>
      <h2 className="mt-2 text-[19px] font-semibold text-[#101012]">Оплата прошла успешно!</h2>
      <p className="mt-1 text-[14px] text-black/50">Мы уже начали готовить ваш заказ</p>

      <div className="mt-6 flex w-full items-center gap-3 rounded-2xl bg-[#fafafa] p-3">
        <div className="relative h-[64px] w-[78px] shrink-0 overflow-hidden rounded-xl">
          <Image src="/images/vodokachka/thumb-ossobuko.png" alt="" fill sizes="78px" className="object-cover" quality={90} />
        </div>
        <div className="text-left">
          <p className="text-[14px] font-medium text-[#101012]">Оссобуко, картофельное пюре</p>
          <p className="mt-1 text-[13px] text-black/40">{total} ₽ · 260 г</p>
        </div>
      </div>

      <PressButton onClick={onBack} className="mt-6 w-full rounded-full bg-black/[0.05] py-4 text-[15px] font-semibold text-[#101012]">
        Назад к меню
      </PressButton>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Root flow
// ---------------------------------------------------------------------------
export function VodokachkaFlow() {
  const reduced = useReducedMotion();
  const [view, setView] = useState<"cover" | "menu">("cover");
  const [tab, setTab] = useState<TabId>("all");

  const [dishOpen, setDishOpen] = useState(false);
  const [dishQty, setDishQty] = useState(0);

  const [cartQty, setCartQty] = useState(0);

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [agreeFee, setAgreeFee] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [paid, setPaid] = useState(false);

  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
  }, []);

  function openDish() {
    setDishQty(0);
    setDishOpen(true);
  }
  function commitDish() {
    setCartQty(Math.max(dishQty, 1));
    setDishOpen(false);
  }
  function closeCheckout() {
    setCheckoutOpen(false);
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => {
      setPaid(false);
      setAgreeFee(false);
    }, 380);
  }
  function backToMenuAfterPay() {
    setCheckoutOpen(false);
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => {
      setPaid(false);
      setAgreeFee(false);
      setCartQty(0);
    }, 380);
  }

  return (
    <PhoneFrame>
      <div className="relative h-full w-full overflow-hidden">
        <AnimatePresence initial={false}>
          {view === "cover" ? (
            <motion.div
              key="cover"
              initial={reduced ? { opacity: 0 } : { x: "-30%", opacity: 0.6 }}
              animate={{ x: 0, opacity: 1 }}
              exit={reduced ? { opacity: 0 } : { x: "-30%", opacity: 0.6 }}
              transition={reduced ? { duration: 0.15 } : SPRING_UI}
              className="absolute inset-0"
            >
              <CoverScreen onStart={() => setView("menu")} />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={reduced ? { opacity: 0 } : { x: "100%" }}
              animate={{ x: 0, opacity: 1 }}
              exit={reduced ? { opacity: 0 } : { x: "100%" }}
              transition={reduced ? { duration: 0.15 } : SPRING_UI}
              className="absolute inset-0"
            >
              <MenuScreen
                tab={tab}
                onTab={setTab}
                onBack={() => setView("cover")}
                onOpenDish={openDish}
                cartTotal={cartQty * DISH_PRICE}
                onOpenCart={() => setCheckoutOpen(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <Sheet open={dishOpen} onClose={() => setDishOpen(false)} z={50}>
          <DishSheetContent qty={dishQty} onQty={setDishQty} onAdd={commitDish} />
        </Sheet>

        <Sheet open={checkoutOpen} onClose={closeCheckout} z={60}>
          <AnimatePresence mode="wait" initial={false}>
            {paid ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={SPRING_UI}
                className="flex flex-1 flex-col"
              >
                <SuccessContent qty={cartQty} onBack={backToMenuAfterPay} />
              </motion.div>
            ) : (
              <motion.div
                key="checkout"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={SPRING_UI}
                className="flex flex-1 flex-col"
              >
                <CheckoutContent
                  qty={Math.max(cartQty, 1)}
                  onQty={setCartQty}
                  agreeFee={agreeFee}
                  onAgreeFee={setAgreeFee}
                  agreeTerms={agreeTerms}
                  onAgreeTerms={setAgreeTerms}
                  onPay={() => setPaid(true)}
                  onClose={closeCheckout}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Sheet>
      </div>
    </PhoneFrame>
  );
}
