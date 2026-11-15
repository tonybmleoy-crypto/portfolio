import type { Metadata } from "next";
import { getDictionary } from "@/lib/content";
import { CaseList } from "@/components/home/CaseList";

export const metadata: Metadata = {
  title: "Anton Lopatin — Product Designer",
  description:
    "Product designer with experience in fintech and e-commerce. Product discovery, conversion optimization, scalable design systems.",
};

export default function HomePageEn() {
  return (
    <section className="scroll-mt-[76px] lg:scroll-mt-24">
      <CaseList locale="en" content={getDictionary("en").home} />
    </section>
  );
}
