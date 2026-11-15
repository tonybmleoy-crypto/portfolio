import type { Metadata } from "next";
import { getDictionary } from "@/lib/content";
import { concepts } from "@/lib/content/concepts";
import { ConceptGrid } from "@/components/home/ConceptGrid";

export const metadata: Metadata = { title: "Концепты — Anton Lopatin" };

export default function PlaygroundPage() {
  return (
    <section className="scroll-mt-[76px] lg:scroll-mt-24">
      <ConceptGrid locale="ru" concepts={concepts} labels={getDictionary("ru").home.playground} />
    </section>
  );
}
