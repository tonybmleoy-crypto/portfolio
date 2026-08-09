"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Locale } from "@/lib/types";
import { alternateHref } from "@/lib/paths";

export function LanguageSwitcher({ locale, className }: { locale: Locale; className?: string }) {
  const pathname = usePathname();
  const href = alternateHref(locale, pathname);

  return (
    <Link
      href={href}
      className={className ?? "text-sm text-muted transition-[color,transform] duration-150 hover:text-foreground active:scale-[0.96] active:opacity-70"}
    >
      {locale === "ru" ? "EN" : "RU"}
    </Link>
  );
}
