// Resizes the old site's photos for the web (build plan step 3).
// Reads originals straight from a clone of github.com/kharagpur/iwok, so they never enter this repo,
// and writes small WebP files to public/images/ plus the site icons to app/.
//
// Usage:  npm run photos -- ~/dev/iwok-published
// (any clone of kharagpur/iwok works; the logo comes from its Feature--Website-Redesign branch)

import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import sharp from "sharp";

const root = resolve(import.meta.dirname, "..");
const arg = process.argv[2] ?? join(homedir(), "dev", "iwok-published");
const source = resolve(arg.replace(/^~(?=$|\/)/, homedir()));
const sources = JSON.parse(readFileSync(join(root, "scripts", "photo-sources.json"), "utf8"));

const out = join(root, "public", "images");
const dishesOut = join(out, "dishes");
rmSync(dishesOut, { recursive: true, force: true });
mkdirSync(dishesOut, { recursive: true });

const fromRepo = (path) => readFileSync(join(source, path));
const fromBranch = ({ ref, path }) =>
  execFileSync("git", ["-C", source, "show", `${ref}:${path}`], { maxBuffer: 64 * 1024 * 1024 });

// .rotate() applies the camera's orientation flag, so sideways phone photos come out upright.
const webp = (input) => sharp(input).rotate();

let count = 0;
async function save(pipeline, file) {
  await pipeline.toFile(file);
  count++;
}

// Dish photos: 4:3, cropped around the most interesting part, at two widths
// (320 px for small cards, 640 px for larger cards and sharp phone screens).
for (const [name, path] of Object.entries(sources.dishes)) {
  const input = fromRepo(path);
  for (const width of [320, 640]) {
    await save(
      webp(input)
        .resize(width, Math.round((width * 3) / 4), { fit: "cover", position: sharp.strategy.attention })
        .webp({ quality: 72 }),
      join(dishesOut, `${name}-${width}.webp`),
    );
  }
}

// Hero collage and the static map: keep their shape, two widths each.
for (const [name, widths] of [["hero", [960, 1920]], ["map", [640, 1280]]]) {
  const input = fromRepo(sources[name]);
  for (const width of widths) {
    await save(
      webp(input).resize({ width, withoutEnlargement: true }).webp({ quality: 70 }),
      join(out, `${name}-${width}.webp`),
    );
  }
}

// Logo (transparent background), two widths.
const logo = fromBranch(sources.logo);
for (const width of [240, 480]) {
  await save(sharp(logo).resize({ width }).webp({ quality: 85 }), join(out, `logo-${width}.webp`));
}

// Social sharing preview (Facebook, iMessage, Google): 1200 x 630 JPEG from the hero collage.
await save(
  webp(fromRepo(sources.hero)).resize(1200, 630, { fit: "cover" }).jpeg({ quality: 78 }),
  join(out, "og.jpg"),
);

// Site icons: the logo on white, square. Next.js picks up app/icon.png and app/apple-icon.png.
const square = (size) =>
  sharp(logo)
    .resize(Math.round(size * 0.86), Math.round(size * 0.86), { fit: "contain", background: "#ffffff" })
    .extend({
      top: Math.round(size * 0.07),
      bottom: size - Math.round(size * 0.86) - Math.round(size * 0.07),
      left: Math.round(size * 0.07),
      right: size - Math.round(size * 0.86) - Math.round(size * 0.07),
      background: "#ffffff",
    })
    .flatten({ background: "#ffffff" })
    .png({ palette: true, compressionLevel: 9 });
await save(square(512), join(root, "app", "icon.png"));
await save(square(180), join(root, "app", "apple-icon.png"));

console.log(`Wrote ${count} images from ${source}`);
