import sharp from "sharp";

/**
 * Resizes and compresses an uploaded image before it ever gets committed.
 * Uploads through the admin panel skip this at their peril: this project
 * has already shipped a 22MB cover photo and a 19MB PNG once each, both
 * caught by hand. This is the automatic version of that same check.
 */
export async function processUpload(buffer: Buffer, maxWidth = 2400): Promise<{ buffer: Buffer; width: number; height: number }> {
  const resized = sharp(buffer).rotate().resize({ width: maxWidth, withoutEnlargement: true }).jpeg({ quality: 85 });
  const output = await resized.toBuffer({ resolveWithObject: true });
  return {
    buffer: output.data,
    width: output.info.width,
    height: output.info.height,
  };
}
