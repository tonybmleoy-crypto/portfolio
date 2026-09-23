import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { processUpload } from "@/lib/admin/image";
import { commitFileToGitHub, isProductionHost } from "@/lib/admin/github";

export const runtime = "nodejs";

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15MB in, well under 1MB out after compression

export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are accepted." }, { status: 400 });
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "That file is too large (max 15MB)." }, { status: 400 });
  }

  const inputBuffer = Buffer.from(await file.arrayBuffer());

  let processed: Awaited<ReturnType<typeof processUpload>>;
  try {
    processed = await processUpload(inputBuffer);
  } catch {
    return NextResponse.json({ error: "Couldn't read that as an image." }, { status: 400 });
  }

  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  const repoPath = `public/images/admin-uploads/${filename}`;
  const publicPath = `/images/admin-uploads/${filename}`;

  try {
    if (isProductionHost()) {
      await commitFileToGitHub({
        filePath: repoPath,
        content: new Uint8Array(processed.buffer),
        message: `Add uploaded image ${filename}`,
      });
    } else {
      const dir = path.join(process.cwd(), "public/images/admin-uploads");
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, filename), processed.buffer);
    }
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Upload failed." }, { status: 500 });
  }

  return NextResponse.json({
    path: publicPath,
    width: processed.width,
    height: processed.height,
  });
}
