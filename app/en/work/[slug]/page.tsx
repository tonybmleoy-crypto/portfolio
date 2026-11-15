import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, getSocialLinks } from "@/lib/content";
import { CaseShell } from "@/components/case/CaseShell";

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

  return <CaseShell caseStudy={caseStudy} locale="en" dict={dict} socialLinks={socialLinks} />;
}
