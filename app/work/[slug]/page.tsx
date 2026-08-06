import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/content";
import { Header } from "@/components/Header";
import { CaseStudyView } from "@/components/CaseStudyView";
import { Footer } from "@/components/Footer";

export function generateStaticParams() {
  return Object.keys(getDictionary("ru").caseStudies).map((slug) => ({ slug }));
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dict = getDictionary("ru");
  const caseStudy = dict.caseStudies[slug];
  if (!caseStudy) notFound();

  return (
    <>
      <Header locale="ru" dict={dict} />
      <main className="flex-1">
        <CaseStudyView caseStudy={caseStudy} locale="ru" dict={dict} />
      </main>
      <Footer dict={dict} />
    </>
  );
}
