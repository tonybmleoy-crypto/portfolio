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

  const projects = dictionaries.ru.home.projects.map((base) => {
    const ruProject = ru.home.projects.find((p) => p.slug === base.slug)!;
    const enProject = en.home.projects.find((p) => p.slug === base.slug)!;
    return {
      slug: base.slug,
      available: ruProject.available,
      image: ruProject.image,
      tag: ruProject.tag,
      timeline: ruProject.timeline ?? "",
      users: ruProject.users ?? "",
      title: base.title,
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

  return NextResponse.json({
    projects,
    cases,
    home: {
      bio: { ru: ru.home.bio, en: en.home.bio },
      aboutBio: { ru: ru.home.about.bio.join("\n\n"), en: en.home.about.bio.join("\n\n") },
    },
    social: getSocialLinks(),
    musicLinks: getMusicLinks(),
  });
}
