import type { Metadata } from "next";
import { MedeoSans } from "medeo-font/sans";
import { MotionConfig } from "framer-motion";
import { Preloader } from "@/components/Preloader";
import { PostHogProvider } from "@/components/PostHogProvider";
import { themeInitScript } from "@/components/ThemeToggle";
import "./globals.css";

export const metadata: Metadata = {
  // Russian by default; the English pages set their own.
  title: "Антон Лопатин — продуктовый дизайнер",
  description:
    "Продуктовый дизайнер: финтех и e-commerce, исследования, рост конверсии, масштабируемые дизайн-системы.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ru"
      data-scroll-behavior="smooth"
      className={`${MedeoSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {/* English pages share this root layout, so switch <html lang> before first paint. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if(location.pathname==="/en"||location.pathname.indexOf("/en/")===0){document.documentElement.lang="en"}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col overflow-x-hidden bg-background text-foreground">
        <PostHogProvider />
        <MotionConfig reducedMotion="user">
          <Preloader text={{ ru: "Антон Лопатин", en: "Anton Lopatin" }} />
          {children}
        </MotionConfig>
      </body>
    </html>
  );
}
