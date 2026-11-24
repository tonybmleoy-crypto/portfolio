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
  /** CSS object-position for the wide cover crop on the home page, e.g. "50% 0%". */
  coverPosition?: string;
}

/** A UI concept shown in the playground grid. */
export interface Concept {
  slug: string;
  title: string;
  /**
   * "phone" puts each screen into an iPhone mockup on a blurred stage made
   * from the first screen; "scene" fills the tile edge to edge.
   */
  kind: "phone" | "scene";
  /**
   * CSS background for a phone tile instead of the blurred first screen. Use
   * it when the screens are so dark that the blur sinks into the page.
   */
  stage?: string;
  /** Screens in display order; a phone tile fits up to two. */
  screens: string[];
  /**
   * Live HTML screens under /public, by phone: `live[i]` replaces
   * `screens[i]` in the mockup (null keeps the image). A phone may be live
   * only, with no image behind it; then the tile needs a `stage`.
   */
  live?: (string | null)[];
  /**
   * Columns out of 12 on sm+ screens. The spans of each row must add up to 12,
   * e.g. 7+5, 4+4+4, 4+8; all rows share one height, so phones keep one size.
   * A scene reads best at span 8, where the tile is about square.
   */
  span: 4 | 5 | 6 | 7 | 8 | 12;
  /** Opens this case study when set. */
  caseSlug?: string;
}

export interface HomeContent {
  /** Name as written in this locale (Cyrillic on the Russian site). */
  name: string;
  role: string;
  bio: string;
  ctaLabel: string;
  /** Own products shown under the bio, with an external link each. */
  products: { label: string; items: { name: string; tagline: string; badge: string; href: string }[] };
  sectionsNav: { projects: string; playground: string; about: string };
  resumeLabel: string;
  contactDialog: { title: string; close: string; copy: string; copied: string };
  /** Case page chrome: the contents list, the next-case block and image zoom. */
  caseNav: { back: string; top: string; contents: string; decision: string; quote: string; insights: string; summary: string; next: string; keepScrolling: string; zoom: string; closeZoom: string };
  playground: { emptyTitle: string; emptyBody: string };
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
  /** Name line in the site footer, e.g. "Антон Лопатин, продуктовый дизайнер". */
  footerName: string;
}

export type TextParagraph = string | { text: string; muted?: boolean };

export type Section =
  | { type: "lead"; body: string }
  | { type: "chapter"; title: string }
  | { type: "facts"; items: { label: string; value: string }[] }
  | {
      type: "text";
      heading?: string;
      body: TextParagraph[];
      /**
       * "decision": a key design decision (card, orange "Decision" tag).
       * "research": findings from research (card, blue "Insights" tag).
       * Plain narrative on the page otherwise.
       */
      tone?: "decision" | "research";
    }
  | { type: "list"; heading?: string; intro?: string; items: string[] }
  | { type: "quote"; text: string; author?: string }
  | {
      type: "numbered";
      heading?: string;
      /** "decision": the list is a set of design decisions (orange tag). */
      tone?: "decision";
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
      images: { src: string; alt: string; width: number; height: number; caption?: string }[];
    }
  | { type: "stats"; items: { value: string; label: string }[] }
  | { type: "highlight"; label?: string; body: string }
  | { type: "insight"; label: string; body: string }
  | { type: "tips"; heading: string; items: string[]; /** "decision": orange tag instead of the neutral one. */ tone?: "decision" }
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
  nav: { cv: string; behance: string; linkedin: string; telegram: string; email: string; back: string };
  home: HomeContent;
  caseStudies: Record<string, CaseStudy>;
}
