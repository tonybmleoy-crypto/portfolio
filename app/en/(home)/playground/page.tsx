import type { Metadata } from "next";
import { getDictionary } from "@/lib/content";
import { concepts } from "@/lib/content/concepts";
import { ConceptGrid } from "@/components/home/ConceptGrid";

export const metadata: Metadata = { title: "Playground — Anton Lopatin" };

export default function PlaygroundPageEn() {
  return (
    <section className="scroll-mt-[76px] lg:scroll-mt-24">
      <ConceptGrid locale="en" concepts={concepts} labels={getDictionary("en").home.playground} zoomLabels={getDictionary("en").home.caseNav} />
    </section>
  );
}
