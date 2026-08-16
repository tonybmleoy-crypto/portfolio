export type Locale = "ru" | "en";

export interface NavLink {
  label: string;
  href: string;
}

export interface ProjectCard {
  slug: string;
  title: string;
  tag: string;
  description: string;
  image: string;
  category: "product" | "graphic";
  available: boolean;
  timeline?: string;
  users?: string;
}

export interface HomeContent {
  role: string;
  bio: string;
  ctaLabel: string;
  sectionsNav: { projects: string; about: string };
  projects: ProjectCard[];
  viewCase: string;
  comingSoon: string;
  timelineLabel: string;
  usersLabel: string;
  about: {
    heading: string;
    bio: string[];
    contactHeading: string;
  };
  contactTitle: string;
}

export type TextParagraph = string | { text: string; muted?: boolean };

export type Section =
  | { type: "lead"; body: string }
  | { type: "text"; heading?: string; body: TextParagraph[] }
  | { type: "list"; heading?: string; intro?: string; items: string[] }
  | { type: "quote"; text: string; author?: string }
  | {
      type: "numbered";
      heading?: string;
      style?: "cards";
      items: { number: string; title: string; body: string }[];
    }
  | {
      type: "image";
      src: string;
      alt: string;
      caption?: string;
      shadow?: boolean;
      width?: number;
      height?: number;
      flush?: boolean;
    }
  | {
      type: "imageGrid";
      size?: "sm";
      /** Fit every tile into one square box so mixed-aspect images line up. */
      equalHeight?: boolean;
      images: { src: string; alt: string; width: number; height: number }[];
    }
  | { type: "stats"; items: { value: string; label: string }[] }
  | { type: "highlight"; label?: string; body: string }
  | { type: "insight"; label: string; body: string }
  | { type: "tips"; heading: string; items: string[] }
  | { type: "table"; heading?: string; columns: string[]; rows: string[][] }
  | { type: "prototype"; caption?: string; href?: string; hrefLabel?: string };

export interface CaseStudy {
  slug: string;
  title: string;
  subtitle?: string;
  coverImage: string;
  coverWidth?: number;
  coverHeight?: number;
  coverPlain?: boolean;
  /** Put the intro text and the cover mockup side by side in two equal columns. */
  coverSide?: boolean;
  coverVideo?: { mp4: string; webm?: string; width: number; height: number };
  role?: string;
  sections: Section[];
}

export interface Dictionary {
  nav: { cv: string; behance: string; linkedin: string; telegram: string; back: string };
  home: HomeContent;
  caseStudies: Record<string, CaseStudy>;
}
