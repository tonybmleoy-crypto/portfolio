import { NextRequest, NextResponse } from "next/server";
import { OVERRIDES_FILENAME, readOverrides, writeOverridesToDisk, type ContentOverrides } from "@/lib/admin/overrides";
import { commitFileToGitHub, isProductionHost } from "@/lib/admin/github";

export const runtime = "nodejs";

const VALID_SLUGS = new Set(["fintrack", "rentag", "7pr", "vodokachka"]);

/** Rejects anything that isn't a same-origin path or an http(s) URL. */
function isSafeUrl(value: unknown): value is string {
  return typeof value === "string" && (value.startsWith("/") || value.startsWith("http://") || value.startsWith("https://"));
}

function validate(body: unknown): body is ContentOverrides {
  if (typeof body !== "object" || body === null) return false;
  const o = body as Record<string, unknown>;

  if (o.projects !== undefined) {
    if (typeof o.projects !== "object" || o.projects === null) return false;
    for (const [slug, val] of Object.entries(o.projects as Record<string, unknown>)) {
      if (!VALID_SLUGS.has(slug)) return false;
      const p = val as Record<string, unknown>;
      if (p.image !== undefined && !isSafeUrl(p.image)) return false;
    }
  }

  if (o.cases !== undefined) {
    if (typeof o.cases !== "object" || o.cases === null) return false;
    for (const [slug, val] of Object.entries(o.cases as Record<string, unknown>)) {
      if (!VALID_SLUGS.has(slug)) return false;
      const c = val as Record<string, unknown>;
      if (c.coverImage !== undefined && !isSafeUrl(c.coverImage)) return false;
    }
  }

  if (o.social !== undefined) {
    const s = o.social as Record<string, unknown>;
    for (const key of ["telegram", "behance", "linkedin"]) {
      if (s[key] !== undefined && !isSafeUrl(s[key])) return false;
    }
  }

  if (o.musicLinks !== undefined) {
    if (!Array.isArray(o.musicLinks)) return false;
    for (const link of o.musicLinks) {
      if (typeof link?.label !== "string" || !isSafeUrl(link?.href)) return false;
    }
  }

  return true;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!validate(body)) {
    return NextResponse.json({ error: "That doesn't look like valid content overrides." }, { status: 400 });
  }

  // The form always sends the full overrides object it loaded plus its own
  // edits, so this is a replace, not a deep patch.
  const next: ContentOverrides = body;

  try {
    if (isProductionHost()) {
      await commitFileToGitHub({
        filePath: OVERRIDES_FILENAME,
        content: new TextEncoder().encode(JSON.stringify(next, null, 2) + "\n"),
        message: "Update content via admin panel",
      });
    } else {
      writeOverridesToDisk(next);
    }
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Save failed." }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    redeploying: isProductionHost(),
    current: readOverrides(),
  });
}
