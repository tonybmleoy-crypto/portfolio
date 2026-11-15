import { getDictionary } from "@/lib/content";
import { CaseList } from "@/components/home/CaseList";

export default function HomePageEn() {
  return (
    <section className="scroll-mt-[76px] lg:scroll-mt-24">
      <CaseList locale="en" content={getDictionary("en").home} />
    </section>
  );
}
