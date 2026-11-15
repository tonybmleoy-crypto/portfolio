import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, getSocialLinks } from "@/lib/content";
import { CaseShell } from "@/components/case/CaseShell";

export function generateStaticParams() {
  return Object.keys(getDictionary("ru").caseStudies).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = getDictionary("ru").caseStudies[slug];
  if (!caseStudy) return {};
  return {
    title: `${caseStudy.title} — Антон Лопатин`,
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

  return <CaseShell caseStudy={caseStudy} locale="ru" dict={dict} socialLinks={socialLinks} />;
}
