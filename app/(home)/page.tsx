import { getDictionary } from "@/lib/content";
import { CaseList } from "@/components/home/CaseList";

// scroll-mt keeps the start of the column clear of the sticky tabs when
// switching sections scrolls the page back up.
export default function HomePage() {
  return (
    <section className="scroll-mt-[76px] lg:scroll-mt-24">
      <CaseList locale="ru" content={getDictionary("ru").home} />
    </section>
  );
}
