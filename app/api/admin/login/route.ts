import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE } from "@/lib/admin/session";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!adminPassword || !sessionSecret) {
    return NextResponse.json({ error: "Admin panel is not configured on this deployment." }, { status: 500 });
  }

  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  if (typeof password !== "string" || !timingSafeEqual(password, adminPassword)) {
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }

  const token = await createSessionToken(sessionSecret);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

/** Avoids leaking password length/content through response-time differences. */
function timingSafeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  let mismatch = 0;
  for (let i = 0; i < bufA.length; i++) mismatch |= bufA[i] ^ bufB[i];
  return mismatch === 0;
}
