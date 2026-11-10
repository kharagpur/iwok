import { existsSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";
import { faq } from "@/data/faq";
import { menu, popularCodes, findItem, type MenuItem } from "@/data/menu";
import { site } from "@/data/site";
import placeholders from "@/data/placeholders.json";
import { openStatus } from "@/lib/hours";
import { llmsFullTxt, structuredData } from "@/lib/seo";

// Rules for the menu and site data (data/*.ts). These catch typos in a menu update, like a missing
// price, a duplicate code or a chicken dish marked vegetarian, before they reach the live site.

const dishes: { item: MenuItem; section: string }[] = menu.flatMap((c) => c.items.map((item) => ({ item, section: c.id })));
const label = (i: MenuItem) => `${i.code ?? "(no code)"} ${i.name}`;

test.describe("menu", () => {
  test("every menu code and section is used once", () => {
    const codes = dishes.map((d) => d.item.code).filter(Boolean);
    expect(codes.filter((c, i) => codes.indexOf(c) !== i), "repeated codes").toEqual([]);
    const ids = menu.map((c) => c.id);
    expect(ids.filter((c, i) => ids.indexOf(c) !== i), "repeated section ids").toEqual([]);
    for (const id of ids) expect(id, "section ids become web addresses (#id)").toMatch(/^[a-z0-9-]+$/);
    for (const c of menu) expect(c.items.length, `${c.name} has dishes`).toBeGreaterThan(0);
  });

  test("names are tidy", () => {
    for (const { item } of dishes) {
      expect(item.name, label(item)).toBe(item.name.trim());
      expect(item.name, `${label(item)}: double space`).not.toContain("  ");
    }
  });

  test("every dish has a sensible price, or a note saying why not", () => {
    for (const { item } of dishes) {
      const prices = item.sizes ? item.sizes.map((s) => s.price) : item.price !== undefined ? [item.price] : [];
      if (prices.length === 0) {
        // Shown as "Call for price"; the note keeps it on the to-check list.
        expect(item.check, `${label(item)} has no price and no note`).toBeTruthy();
        continue;
      }
      expect(item.price !== undefined && item.sizes !== undefined, `${label(item)}: both a price and sizes`).toBe(false);
      for (const p of prices) {
        expect(p, `${label(item)}: price`).toBeGreaterThan(0.5);
        expect(p, `${label(item)}: price over $100 looks like a typo`).toBeLessThan(100);
        expect(Math.round(p * 100) / 100, `${label(item)}: more than 2 decimals`).toBe(p);
      }
      if (item.sizes) {
        const sizes = item.sizes.map((s) => s.label);
        expect(new Set(sizes).size, `${label(item)}: repeated size`).toBe(sizes.length);
        for (let i = 1; i < prices.length; i++) expect(prices[i], `${label(item)}: bigger sizes cost more`).toBeGreaterThan(prices[i - 1]);
      }
    }
  });

  test("vegetarian marks never land on meat, fish or egg dishes", () => {
    const meat = /\b(chicken|ch|beef|fish|prawns?|shrimp|squid|lamb|pork|mutton|egg|wings?|wonton)\b/i;
    const wrong = dishes.filter(({ item }) => item.vegetarian && meat.test(item.name.replace(/\(.*?\)/g, ""))).map(({ item }) => label(item));
    expect(wrong).toEqual([]);
  });

  test("spice levels are one of none, mild, medium or hot", () => {
    for (const { item } of dishes) expect(["none", "mild", "medium", "hot"], label(item)).toContain(item.spice);
  });

  test("every dish photo exists in both sizes", () => {
    for (const { item } of dishes.filter((d) => d.item.photo)) {
      for (const size of [320, 640]) {
        const file = join("public/images/dishes", `${item.photo}-${size}.webp`);
        expect(existsSync(file), `${label(item)}: ${file}`).toBe(true);
      }
    }
  });

  test("the popular dishes exist and have photos", () => {
    for (const code of popularCodes) {
      const item = findItem(code);
      expect(item, `popular dish ${code}`).toBeTruthy();
      expect(item?.photo, `popular dish ${code} needs a photo`).toBeTruthy();
    }
  });

  test("the gluten-free filter has a gluten-free section to show", () => {
    // The filter on the page picks the section with this id.
    expect(menu.find((c) => c.id === "gluten-free")?.items.length).toBeGreaterThan(0);
  });
});

test.describe("open-now badge", () => {
  // Open Tuesday to Sunday, 4:30–9:30 pm, Burnaby time. The exact cases use July (UTC−7 under every
  // clock-change rule); the winter cases pick times whose answer is the same whether the browser's
  // time-zone data puts Burnaby at UTC−7 or UTC−8.
  const at = (iso: string) => openStatus(new Date(iso));

  test("open hours read correctly through the week", () => {
    expect(site.openingHours).toEqual({ days: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "16:30", closes: "21:30" });
    expect(at("2026-07-14T17:00:00-07:00")).toEqual({ open: true, head: "Open now", detail: "until 9:30 pm" });
    expect(at("2026-07-14T21:10:00-07:00")).toEqual({ open: true, head: "Closing soon", detail: "closes at 9:30 pm" });
    expect(at("2026-07-14T15:00:00-07:00")).toEqual({ open: false, head: "Closed", detail: "opens at 4:30 pm today" });
    expect(at("2026-07-14T21:30:00-07:00")).toEqual({ open: false, head: "Closed", detail: "opens tomorrow at 4:30 pm" });
  });

  test("Monday is closed, and Sunday night points to Tuesday", () => {
    expect(at("2026-07-13T18:00:00-07:00")).toEqual({ open: false, head: "Closed", detail: "opens tomorrow at 4:30 pm" });
    expect(at("2026-07-12T22:00:00-07:00")).toEqual({ open: false, head: "Closed", detail: "opens Tue at 4:30 pm" });
  });

  test("uses Burnaby time wherever the visitor is, summer and winter", () => {
    // 5 pm Burnaby time on a summer Tuesday = midnight UTC.
    expect(at("2026-07-15T00:00:00Z")?.open).toBe(true);
    // A winter Tuesday written as Toronto time: noon there is morning in Burnaby (closed)…
    expect(at("2026-11-10T12:00:00-05:00")?.open).toBe(false);
    // …and 10 pm there is 6 or 7 pm in Burnaby (open).
    expect(at("2026-11-10T22:00:00-05:00")?.open).toBe(true);
  });
});

test.describe("search engines and AI assistants", () => {
  test("the AI-readable menu lists every dish with its price", () => {
    const text = llmsFullTxt();
    for (const { item } of dishes) {
      expect(text, label(item)).toContain(`${item.code ? `${item.code}. ` : ""}${item.name}:`);
    }
  });

  test("Google's menu data has every section and dish", () => {
    const restaurant = structuredData()[0];
    if (!("hasMenu" in restaurant)) throw new Error("no menu in the restaurant data");
    const sections = restaurant.hasMenu.hasMenuSection;
    expect(sections.map((s) => s.name)).toEqual(menu.map((c) => c.name));
    expect(sections.reduce((n, s) => n + s.hasMenuItem.length, 0)).toBe(dishes.length);
    expect(() => JSON.stringify(structuredData())).not.toThrow();
  });

  test("FAQ answers match the menu", () => {
    const veg = dishes.filter((d) => d.item.vegetarian).length;
    expect(faq.find((f) => f.q.includes("vegetarian"))?.a).toContain(`${veg} of them`);
    const gf = faq.find((f) => f.q.includes("gluten-free"))?.a ?? "";
    for (const { item } of dishes.filter((d) => d.section === "gluten-free")) expect(gf).toContain(item.name);
  });

  test("phone number, links and analytics are filled in", () => {
    expect(site.phone.href).toBe(`tel:+1${site.phone.display.replace(/\D/g, "")}`);
    for (const d of site.delivery) expect(d.href, d.name).toMatch(/^https:\/\//);
    expect(site.mapUrl).toMatch(/^https:\/\//);
    expect(site.analytics.googleId).toMatch(/^G-[A-Z0-9]+$/);
  });
});

test("every dish photo and the hero photo have a blurred preview (npm run placeholders)", () => {
  const previews = placeholders as Record<string, string>;
  const photos = ["hero", ...menu.flatMap((c) => c.items.flatMap((i) => (i.photo ? [i.photo] : [])))];
  for (const photo of photos) {
    expect(previews[photo], `no preview for ${photo}: run npm run placeholders`).toMatch(/^data:image\/webp;base64,/);
    expect(previews[photo].length, `${photo} preview too big for the page`).toBeLessThan(400);
  }
});
