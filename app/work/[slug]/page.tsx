import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, getSocialLinks } from "@/lib/content";
import { Header } from "@/components/Header";
import { CaseStudyView } from "@/components/CaseStudyView";
import { Footer } from "@/components/Footer";

export function generateStaticParams() {
  return Object.keys(getDictionary("ru").caseStudies).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = getDictionary("ru").caseStudies[slug];
  if (!caseStudy) return {};
  return {
    title: `${caseStudy.title} — Anton Lopatin`,
    description: caseStudy.subtitle,
  };
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
  const socialLinks = getSocialLinks();

  return (
    <>
      <Header locale="ru" dict={dict} socialLinks={socialLinks} />
      <main className="flex-1">
        <CaseStudyView caseStudy={caseStudy} locale="ru" dict={dict} />
      </main>
      <Footer locale="ru" dict={dict} socialLinks={socialLinks} />
    </>
  );
}
