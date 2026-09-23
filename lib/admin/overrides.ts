import "server-only";
import fs from "node:fs";
import path from "node:path";

/**
 * Everything the admin panel is allowed to touch. Deliberately shallow:
 * case-study body content (paragraphs, quotes, stats, image grids) stays
 * out of this file and gets edited as code, because it needs editorial
 * judgment, not a text box.
 */
export interface ContentOverrides {
  projects?: Record<
    string,
    {
      available?: boolean;
      image?: string;
      tag?: string;
      timeline?: string;
      users?: string;
      description?: { ru?: string; en?: string };
    }
  >;
  cases?: Record<
    string,
    {
      title?: string;
      coverImage?: string;
      coverWidth?: number;
      coverHeight?: number;
      subtitle?: { ru?: string; en?: string };
    }
  >;
  home?: {
    bio?: { ru?: string; en?: string };
    /** Paragraphs joined by a blank line. */
    aboutBio?: { ru?: string; en?: string };
  };
  social?: {
    telegram?: string;
    behance?: string;
    linkedin?: string;
    email?: string;
    phone?: string;
    cv?: { ru?: string; en?: string };
  };
  musicLinks?: { label: string; href: string }[];
}

export const OVERRIDES_FILENAME = "content-overrides.json";
const OVERRIDES_PATH = path.join(process.cwd(), OVERRIDES_FILENAME);

export function readOverrides(): ContentOverrides {
  try {
    const raw = fs.readFileSync(OVERRIDES_PATH, "utf8");
    return JSON.parse(raw) as ContentOverrides;
  } catch {
    return {};
  }
}

/** Only used by the local (non-Vercel) save path; production commits via the GitHub API instead. */
export function writeOverridesToDisk(overrides: ContentOverrides) {
  fs.writeFileSync(OVERRIDES_PATH, JSON.stringify(overrides, null, 2) + "\n", "utf8");
}
