import { NextResponse } from "next/server";
import { dictionaries, getDictionary, getMusicLinks, getSocialLinks } from "@/lib/content";

export const runtime = "nodejs";

/**
 * Everything the admin form needs, already merged with the current
 * overrides and split out by locale where the two differ.
 */
export async function GET() {
  const ru = getDictionary("ru");
  const en = getDictionary("en");

  // ru.home.projects already carries the saved order.
  const projects = ru.home.projects.map((ruProject) => {
    const enProject = en.home.projects.find((p) => p.slug === ruProject.slug)!;
    return {
      slug: ruProject.slug,
      available: ruProject.available,
      image: ruProject.image,
      tag: ruProject.tag,
      timeline: ruProject.timeline ?? "",
      users: ruProject.users ?? "",
      title: ruProject.title,
      description: { ru: ruProject.description, en: enProject.description },
    };
  });

  const cases = Object.keys(dictionaries.ru.caseStudies).map((slug) => {
    const ruCase = ru.caseStudies[slug];
    const enCase = en.caseStudies[slug];
    return {
      slug,
      title: ruCase.title,
      coverImage: ruCase.coverImage,
      coverWidth: ruCase.coverWidth ?? null,
      coverHeight: ruCase.coverHeight ?? null,
      subtitle: { ru: ruCase.subtitle ?? "", en: enCase.subtitle ?? "" },
    };
  });

  // Vercel injects this automatically for the project's production domain —
  // nothing to configure. Absent in local dev, where "the live site" doesn't apply.
  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

  return NextResponse.json({
    projects,
    cases,
    home: {
      bio: { ru: ru.home.bio, en: en.home.bio },
      aboutBio: { ru: ru.home.about.bio.join("\n\n"), en: en.home.about.bio.join("\n\n") },
      products: {
        label: { ru: ru.home.products.label, en: en.home.products.label },
        items: ru.home.products.items.map((item, i) => ({
          name: item.name,
          href: item.href,
          tagline: { ru: item.tagline, en: en.home.products.items[i]?.tagline ?? "" },
          badge: { ru: item.badge, en: en.home.products.items[i]?.badge ?? "" },
        })),
      },
    },
    social: getSocialLinks(),
    musicLinks: getMusicLinks(),
    siteUrl: productionHost ? `https://${productionHost}` : null,
  });
}
