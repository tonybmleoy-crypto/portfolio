import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, getSocialLinks } from "@/lib/content";
import { Header } from "@/components/Header";
import { CaseStudyView } from "@/components/CaseStudyView";
import { Footer } from "@/components/Footer";

export function generateStaticParams() {
  return Object.keys(getDictionary("en").caseStudies).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = getDictionary("en").caseStudies[slug];
  if (!caseStudy) return {};
  return {
    title: `${caseStudy.title} — Anton Lopatin`,
    description: caseStudy.subtitle,
  };
}

export default async function WorkPageEn({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dict = getDictionary("en");
  const caseStudy = dict.caseStudies[slug];
  if (!caseStudy) notFound();
  const socialLinks = getSocialLinks();

  return (
    <>
      <Header locale="en" dict={dict} socialLinks={socialLinks} />
      <main className="flex-1">
        <CaseStudyView caseStudy={caseStudy} locale="en" dict={dict} />
      </main>
      <Footer locale="en" dict={dict} socialLinks={socialLinks} />
    </>
  );
}
