import Link from "next/link";
import { VodokachkaFlow } from "@/components/vodokachka/VodokachkaFlow";

export default function VodokachkaFlowPreviewPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 bg-[#f2f2f2] px-6 py-16">
      <Link
        href="/"
        className="inline-flex w-min items-center justify-center gap-1 whitespace-nowrap rounded-[28px] bg-white px-4 py-2 text-sm text-foreground shadow-[0_1px_2px_rgba(16,16,18,0.06)] transition-colors hover:bg-white/70"
      >
        ← На главную
      </Link>
      <VodokachkaFlow />
      <p className="max-w-sm text-center text-sm text-black/40">
        Кликабельный прототип флоу VODOKACHKA — превью, не привязано к навигации сайта.
      </p>
    </main>
  );
}
