import { expect, test, type Page } from "@playwright/test";

// Light and night themes: the site follows the phone's setting, visitors can pick Light / Dark / Auto,
// and every piece of text stays readable in both (WCAG AA contrast). Runs on every device.

const theme = (page: Page) => page.evaluate(() => document.documentElement.dataset.theme);
const pageColour = (page: Page) => page.evaluate(() => getComputedStyle(document.body).backgroundColor);

test("follows the phone's light or dark setting", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  expect(await theme(page)).toBe("dark");
  expect(await pageColour(page)).toBe("rgb(22, 35, 26)");

  await page.emulateMedia({ colorScheme: "light" });
  await expect.poll(() => theme(page), { message: "switches live when the phone changes" }).toBe("light");
  expect(await pageColour(page)).toBe("rgb(255, 255, 255)");
});

test("Light / Dark / Auto in the footer, remembered on reload", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const choices = page.getByRole("radiogroup", { name: "Theme" });
  await expect(choices.getByRole("radio", { name: "Auto" })).toHaveAttribute("aria-checked", "true");

  await choices.getByRole("radio", { name: "Dark" }).click();
  await expect.poll(() => theme(page)).toBe("dark");
  await page.reload();
  expect(await theme(page), "dark from the first paint after a reload").toBe("dark");
  await expect(choices.getByRole("radio", { name: "Dark" })).toHaveAttribute("aria-checked", "true");

  await choices.getByRole("radio", { name: "Auto" }).click();
  await expect.poll(() => theme(page)).toBe("light");
});

test("the header button switches the theme", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const button = page.getByRole("button", { name: "Switch to dark theme" });
  await button.click();
  await expect.poll(() => theme(page)).toBe("dark");
  await expect(page.getByRole("button", { name: "Switch to light theme" })).toBeVisible();
});

for (const [scheme, withList] of [["light", false], ["dark", false], ["light", true], ["dark", true]] as const) {
  test(`every text is readable in the ${scheme} theme${withList ? ", with My list open" : ""}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    if (withList) {
      // A list with a plain dish and a dish with sizes (lib/list.ts keeps it in localStorage).
      await page.addInitScript(() => localStorage.setItem("iwok-my-list", JSON.stringify([{ code: "A1", qty: 2 }, { code: "S1", size: "Large", qty: 1 }])));
    }
    await page.goto("/");
    if (withList) await page.getByRole("button", { name: /^My list/ }).click();
    // Open the FAQ answers so their text is checked too.
    await page.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true)));
    expect(await contrastFailures(page)).toEqual([]);
  });

  if (!withList) test(`pressed menu filters are readable in the ${scheme} theme`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto("/");
    const filters = page.getByRole("group", { name: "Show only" });
    for (const name of ["Vegetarian", "No spice", "Mild", "Medium", "Hot"]) await filters.getByRole("button", { name, exact: true }).click();
    await expect(filters.locator("[aria-pressed=true]")).toHaveCount(5);
    expect(await contrastFailures(page, "#menu [role=group]")).toEqual([]);
  });
}

/** Text whose colour is too close to the colour behind it (WCAG AA: 4.5:1, or 3:1 for large text). */
function contrastFailures(page: Page, within = "body") {
  return page.evaluate((within) => {
      const rgb = (c: string) => (c.match(/[\d.]+/g) ?? []).map(Number);
      const lum = ([r, g, b]: number[]) => {
        const f = (v: number) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
      };
      // The colour behind an element: the nearest ancestor with a solid background, including a
      // painted ::before layer (the menu bar's red "Pop" face sits on one).
      const behind = (el: Element) => {
        for (let e: Element | null = el; e; e = e.parentElement) {
          const face = getComputedStyle(e, "::before");
          const f = rgb(face.backgroundColor);
          if (face.content !== "none" && Number(face.opacity) > 0.5 && f.length >= 3 && (f[3] ?? 1) > 0.5) return f;
          const c = rgb(getComputedStyle(e).backgroundColor);
          if (c.length >= 3 && (c[3] ?? 1) > 0.5) return c;
        }
        return [255, 255, 255];
      };
      const out: string[] = [];
      for (const el of document.querySelectorAll(`${within} *`)) {
        if (el.closest("svg, [aria-hidden='true'], .sr-only")) continue;
        const text = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent ?? "").join("").trim();
        if (!text) continue;
        const box = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        if (box.width < 2 || box.height < 2 || style.visibility === "hidden") continue;
        const fg = rgb(style.color);
        const [a, b] = [lum(fg), lum(behind(el))];
        const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
        const size = parseFloat(style.fontSize);
        const large = size >= 24 || (size >= 18.66 && Number(style.fontWeight) >= 700);
        if (ratio < (large ? 3 : 4.5)) out.push(`"${text.slice(0, 30)}" ${ratio.toFixed(2)}:1`);
      }
      return [...new Set(out)];
  }, within);
}
