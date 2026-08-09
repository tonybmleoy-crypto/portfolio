import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MotionConfig } from "framer-motion";
import { Preloader } from "@/components/Preloader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Anton Lopatin — Product Designer",
  description:
    "Product designer with experience in fintech and e-commerce. Product discovery, conversion optimization, scalable design systems.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ru"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden bg-background text-foreground">
        <MotionConfig reducedMotion="user">
          <Preloader text="Anton Lopatin — Product Designer" />
          {children}
        </MotionConfig>
      </body>
    </html>
  );
}
