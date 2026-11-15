import type { Metadata } from "next";
import { getDictionary, getMusicLinks, MUSIC_TRACK } from "@/lib/content";
import { AboutPanel } from "@/components/home/AboutPanel";

export const metadata: Metadata = { title: "Обо мне — Антон Лопатин" };

export default function AboutPage() {
  return (
    <section className="scroll-mt-[76px] lg:scroll-mt-24">
      <AboutPanel content={getDictionary("ru").home} musicTrack={MUSIC_TRACK} musicLinks={getMusicLinks()} />
    </section>
  );
}
