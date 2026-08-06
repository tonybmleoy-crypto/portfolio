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
      className={className ?? "text-sm text-muted hover:text-foreground transition-colors"}
    >
      {locale === "ru" ? "EN" : "RU"}
    </Link>
  );
}
