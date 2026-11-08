// Prepares the site's photos (build plan step 3, redone for the modern design on 2026-11-08).
// Reads the full-size 2021 camera originals from the old site's repo history (github.com/kharagpur/iwok),
// colour-corrects them, crops tight so the food fills the frame, and writes small WebP files
// to public/images/ plus the site icons to app/. The originals never enter this repo.
//
// Usage:  npm run photos
// Reads from this repo's own history (it's a clone of kharagpur/iwok). Another clone can be given:
// npm run photos -- ~/path/to/clone

import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import sharp from "sharp";

const root = resolve(import.meta.dirname, "..");
const arg = process.argv[2] ?? root;
const source = resolve(arg.replace(/^~(?=$|\/)/, homedir()));
const sources = JSON.parse(readFileSync(join(root, "scripts", "photo-sources.json"), "utf8"));

const out = join(root, "public", "images");
const dishesOut = join(out, "dishes");
rmSync(dishesOut, { recursive: true, force: true });
mkdirSync(dishesOut, { recursive: true });

const git = (args) => execFileSync("git", ["-C", source, ...args], { maxBuffer: 128 * 1024 * 1024 });
// The 2021 web copies live on master (this branch no longer has the old files), so read them from there.
const fromRepo = (path) => git(["show", `origin/master:${path}`]);
// A dish's best source: the full-size original if the history has it, else the 2021 web copy.
const dishSource = (d) => (d.blob ? git(["cat-file", "-p", d.blob]) : fromRepo(d.file));

/**
 * Colour correction for the 2021 phone photos:
 * removes the bluish cast of the restaurant lights (balancing on the brightest pixels — plates and
 * tablecloth), stretches contrast a little, adds a touch of warmth and colour.
 */
async function graded(input) {
  const base = sharp(input).rotate(); // .rotate() applies the camera's orientation flag
  const { data, info } = await base.clone().resize(200).raw().toBuffer({ resolveWithObject: true });
  const px = [];
  for (let i = 0; i < data.length; i += info.channels) px.push([data[i], data[i + 1], data[i + 2]]);
  const lum = px.map((p) => (p[0] + p[1] + p[2]) / 3).sort((a, b) => a - b);
  const threshold = lum[Math.floor(lum.length * 0.7)];
  const bright = px.filter((p) => (p[0] + p[1] + p[2]) / 3 > threshold);
  const mean = [0, 1, 2].map((c) => bright.reduce((s, p) => s + p[c], 0) / bright.length);
  const target = (mean[0] + mean[1] + mean[2]) / 3;
  const gain = mean.map((v) => Math.pow(target / v, 0.6));
  const buf = await base
    .linear([gain[0] * 1.03, gain[1], gain[2] * 0.96], [0, 0, 0])
    .normalise({ lower: 0.5, upper: 99.5 })
    .modulate({ saturation: 1.15 })
    .linear(1.06, -6)
    .toBuffer();
  return buf;
}

/** Square crop zoomed in ~25% around the most interesting part, so the food fills the frame. */
async function tightSquare(buf, size, zoom = 0.78) {
  const big = Math.round(size / zoom);
  const scaled = await sharp(buf).resize(big, big, { fit: "cover", position: sharp.strategy.attention }).toBuffer();
  const off = Math.round((big - size) / 2);
  return sharp(scaled).extract({ left: off, top: off, width: size, height: size });
}

let count = 0;
const save = async (pipeline, file) => {
  await pipeline.toFile(file);
  count++;
};

// Dish photos: square, two sizes (320 px for small spots, 640 px for big cards and sharp screens).
const gradedDishes = {};
for (const [name, d] of Object.entries(sources.dishes)) {
  const buf = await graded(dishSource(d));
  gradedDishes[name] = buf;
  for (const size of [320, 640]) {
    await save((await tightSquare(buf, size)).webp({ quality: 74 }), join(dishesOut, `${name}-${size}.webp`));
  }
}

// Hero dish: the round photo in the red band, 640 and 960 px.
const heroBuf = gradedDishes[sources.hero];
for (const size of [640, 960]) {
  await save((await tightSquare(heroBuf, size, 0.85)).webp({ quality: 76 }), join(out, `hero-dish-${size}.webp`));
}

// Social sharing preview (Facebook, iMessage, Google): 1200 x 630 from the hero dish.
await save(
  sharp(heroBuf).resize(1200, 630, { fit: "cover", position: sharp.strategy.attention }).jpeg({ quality: 78 }),
  join(out, "og.jpg"),
);

// Logo (transparent background), three widths: header on phones, header on desktop, sharp screens.
const logo = git(["show", `${sources.logo.ref}:${sources.logo.path}`]);
for (const width of [240, 480, 720]) {
  await save(sharp(logo).resize({ width }).webp({ quality: 85 }), join(out, `logo-${width}.webp`));
}

// Site icons: the logo on white, square. Next.js picks up app/icon.png and app/apple-icon.png.
const square = (size) => {
  const inner = Math.round(size * 0.86);
  const pad = Math.round(size * 0.07);
  return sharp(logo)
    .resize(inner, inner, { fit: "contain", background: "#ffffff" })
    .extend({ top: pad, bottom: size - inner - pad, left: pad, right: size - inner - pad, background: "#ffffff" })
    .flatten({ background: "#ffffff" })
    .png({ palette: true, compressionLevel: 9 });
};
await save(square(512), join(root, "app", "icon.png"));
await save(square(180), join(root, "app", "apple-icon.png"));

console.log(`Wrote ${count} images from ${source}`);
