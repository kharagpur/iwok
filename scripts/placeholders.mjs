// Tiny blurred previews ("placeholders") for the photos people see first: the round hero photo and the dish photos.
// Each is a 16 px WebP, inlined in the page as a data URL (about 150 bytes), and shown as the photo's background
// until the real photo arrives, so a slow phone shows the food's colours at once instead of an empty space.
// Made from the finished photos in public/images, so it runs after them: `npm run photos` calls it at the end,
// and `npm run placeholders` runs it on its own.

import { readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import sharp from "sharp";

export async function writePlaceholders(root = resolve(import.meta.dirname, "..")) {
  const images = join(root, "public", "images");
  const tiny = async (file) => {
    const buf = await sharp(file).resize(16, 16, { fit: "cover" }).webp({ quality: 50 }).toBuffer();
    return `data:image/webp;base64,${buf.toString("base64")}`;
  };
  const out = { hero: await tiny(join(images, "hero-dish-640.webp")) };
  const dishes = readdirSync(join(images, "dishes")).filter((f) => f.endsWith("-320.webp")).sort();
  for (const f of dishes) out[f.replace("-320.webp", "")] = await tiny(join(images, "dishes", f));
  writeFileSync(join(root, "data", "placeholders.json"), JSON.stringify(out, null, 1) + "\n");
  return Object.keys(out).length;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(`Wrote ${await writePlaceholders()} placeholders to data/placeholders.json`);
}
