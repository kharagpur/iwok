import { expect, test } from "@playwright/test";
import { menu } from "@/data/menu";
import { site } from "@/data/site";

// Whole-site checks, run once on a laptop-sized browser: every link and picture works, and the files
// for Google and AI assistants are published.

test("every in-page link goes somewhere", async ({ page }) => {
  await page.goto("/");
  const missing = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')]
      .map((a) => a.getAttribute("href")!.slice(1))
      .filter((id) => id && !document.getElementById(id)),
  );
  expect(missing).toEqual([]);
});

test("every picture, font and script on the page loads", async ({ page, request }) => {
  await page.goto("/");
  const urls = await page.evaluate(() => {
    const out = new Set<string>();
    const add = (u: string | null) => u && out.add(new URL(u, location.href).href);
    document.querySelectorAll<HTMLImageElement>("img").forEach((img) => {
      add(img.getAttribute("src"));
      img.srcset?.split(",").forEach((s) => add(s.trim().split(" ")[0]));
    });
    document.querySelectorAll("link[href], script[src]").forEach((el) => add(el.getAttribute("href") ?? el.getAttribute("src")));
    return [...out].filter((u) => u.startsWith(location.origin));
  });
  expect(urls.length).toBeGreaterThan(20);
  const broken: string[] = [];
  for (const url of urls) {
    const res = await request.get(url);
    if (!res.ok()) broken.push(`${res.status()} ${url}`);
  }
  expect(broken).toEqual([]);
});

test("the menu on the page has every dish", async ({ page }) => {
  await page.goto("/");
  for (const c of menu) {
    const section = page.locator(`section#${c.id}`);
    await expect(section.getByRole("heading", { name: c.name })).toBeAttached();
    await expect(section.locator("li")).toHaveCount(c.items.length);
  }
});

test("Google's restaurant and FAQ data is on the page and valid", async ({ page }) => {
  await page.goto("/");
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const data = blocks.map((b) => JSON.parse(b));
  const types = data.map((d) => d["@type"]);
  expect(types).toEqual(["Restaurant", "FAQPage"]);
  expect(data[0].telephone).toBe(site.phone.schema);
  expect(data[0].hasMenu.hasMenuSection).toHaveLength(menu.length);
});

test("Google Analytics is on the page", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(`script[src*="googletagmanager.com/gtag/js?id=${site.analytics.googleId}"]`)).toBeAttached();
});

test("the files for search engines and AI assistants are published", async ({ request }) => {
  for (const path of ["/robots.txt", "/sitemap.xml", "/llms.txt", "/llms-full.txt", "/images/og.jpg"]) {
    expect((await request.get(path)).status(), path).toBe(200);
  }
  expect(await (await request.get("/robots.txt")).text()).toContain("Sitemap:");
  expect(await (await request.get("/sitemap.xml")).text()).toContain(site.url);
});

test("a wrong address shows the not-found page", async ({ page }) => {
  const res = await page.goto("/no-such-page");
  expect(res?.status()).toBe(404);
  await expect(page.getByText(/could not be found/i)).toBeVisible();
});
