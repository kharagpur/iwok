import { expect, test, type Page } from "@playwright/test";
import { menu } from "@/data/menu";

// The page on popular phones, tablets and a laptop (projects in playwright.config.ts). Every test runs on
// every device, so the site behaves the same everywhere.

const dishCount = menu.reduce((n, c) => n + c.items.length, 0);
const countOf = (keep: (i: (typeof menu)[number]["items"][number], section: string) => boolean) =>
  menu.reduce((n, c) => n + c.items.filter((i) => keep(i, c.id)).length, 0);

const sectionBar = (page: Page) => page.getByRole("navigation", { name: "Menu sections" });

async function open(page: Page) {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
}

/** Scrolls straight to an element (no smooth scrolling), leaving room for the sticky bar. */
async function jumpTo(page: Page, selector: string, offset = 80) {
  await page.evaluate(
    ([sel, off]) => {
      const el = document.querySelector(sel as string)!;
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - (off as number), behavior: "instant" });
    },
    [selector, offset],
  );
}

async function tapOrClick(page: Page, locator: ReturnType<Page["locator"]>) {
  if (test.info().project.use.hasTouch) await locator.tap();
  else await locator.click();
}

test.beforeEach(async ({ page }) => {
  // Fail on any script error in the page.
  page.on("pageerror", (err) => {
    throw err;
  });
});

test("the page only scrolls up and down, never sideways", async ({ page }) => {
  await open(page);
  for (const where of ["#top", "#menu", "#find-us"]) {
    await jumpTo(page, where, 0);
    const sideways = await page.evaluate(async () => {
      window.scrollTo({ left: 400, top: window.scrollY, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 50));
      return { extra: document.documentElement.scrollWidth - document.documentElement.clientWidth, scrollX: window.scrollX };
    });
    expect(sideways, `at ${where}`).toEqual({ extra: 0, scrollX: 0 });
  }
});

test("nothing pokes out past the screen edge", async ({ page }) => {
  await open(page);
  // Elements wider than the screen are fine inside something that clips or scrolls them
  // (the swipeable popular dishes, the section bar); anything else would widen the page.
  const loose = await page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    const contained = (el: Element) => {
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        if (getComputedStyle(p).overflowX !== "visible") return true;
      }
      return false;
    };
    return [...document.body.querySelectorAll("*")]
      .filter((el) => {
        const box = el.getBoundingClientRect();
        return box.width > 0 && (box.right > width + 1 || box.left < -1) && !contained(el);
      })
      .map((el) => `<${el.tagName.toLowerCase()} class="${el.getAttribute("class")?.slice(0, 60)}">`);
  });
  expect(loose).toEqual([]);
});

test("Call / Order / Directions bar shows on phones only, and never hides the page's end", async ({ page }) => {
  await open(page);
  const bar = page.getByRole("navigation", { name: "Quick actions" });
  const width = page.viewportSize()!.width;
  if (width >= 768) {
    await expect(bar).toBeHidden();
    return;
  }
  await expect(bar).toBeVisible();
  await expect(bar.getByRole("link", { name: /Call/ })).toHaveAttribute("href", /^tel:\+1\d{10}$/);
  await expect(bar.getByRole("link", { name: /Order/ })).toHaveAttribute("href", "#order");
  await expect(bar.getByRole("link", { name: /Directions/ })).toHaveAttribute("href", /^https:\/\//);
  await expect(bar).toBeInViewport({ ratio: 1 });

  // At the very bottom of the page, the last line of text sits above the bar.
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
  const overlap = await page.evaluate((barTop) => {
    const texts = [...document.querySelectorAll("main *, footer *")].filter(
      (el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent!.trim()) && el.getBoundingClientRect().height > 0,
    );
    const last = texts.reduce((a, b) => (b.getBoundingClientRect().bottom > a.getBoundingClientRect().bottom ? b : a));
    return last.getBoundingClientRect().bottom - barTop;
  }, (await bar.boundingBox())!.y);
  expect(overlap, "last text hidden behind the bar").toBeLessThanOrEqual(0);
});

test("the section bar sticks to the top while you read the menu", async ({ page }) => {
  await open(page);
  for (const section of [menu[1].id, menu[Math.floor(menu.length / 2)].id, menu[menu.length - 1].id]) {
    await jumpTo(page, `#${section}`);
    await expect.poll(async () => Math.round((await sectionBar(page).boundingBox())!.y), { message: `at ${section}` }).toBe(0);
  }
});

test("tapping a section highlights it at once and scrolls the page there", async ({ page }) => {
  await open(page);
  await jumpTo(page, "#menu", 0);
  // A section near the end, so the page has a long way to travel.
  const target = menu[menu.length - 2];
  const chip = sectionBar(page).locator(`[data-section="${target.id}"]`);
  await chip.scrollIntoViewIfNeeded();
  await tapOrClick(page, chip);

  // The pill goes straight to the tapped section: no stopping at the sections on the way.
  await expect(chip).toHaveAttribute("aria-current", /.+/, { timeout: 150 });
  const heading = page.locator(`#${target.id}-h`);
  await expect(heading).toBeInViewport();
  await expect
    .poll(async () => {
      const gap = (await heading.boundingBox())!.y - ((await sectionBar(page).boundingBox())!.y + (await sectionBar(page).boundingBox())!.height);
      return gap >= 0 && gap < 60;
    }, { message: "section heading just below the bar" })
    .toBe(true);
  await expect(chip).toHaveAttribute("aria-current", /.+/);
  await expect(chip, "tapped section visible in the bar").toBeInViewport({ ratio: 0.9 });
});

test("scrolling through the menu moves the highlight along", async ({ page }) => {
  await open(page);
  for (const section of [menu[2], menu[5], menu[1]]) {
    // Section top just under the bar, where a reader's eye is.
    await jumpTo(page, `#${section.id}`, 60);
    await expect(sectionBar(page).locator(`[data-section="${section.id}"]`), section.name).toHaveAttribute("aria-current", /.+/);
  }
});

test("filters show the right dishes and clear again", async ({ page }) => {
  await open(page);
  await jumpTo(page, "#menu", 0);
  const filters = page.getByRole("group", { name: "Show only" });
  const count = page.locator("#menu [aria-live]").first();
  await expect(count).toContainText(`${dishCount} dishes`);

  const cases = [
    { name: "Vegetarian", n: countOf((i) => !!i.vegetarian) },
    { name: "Gluten-free", n: countOf((_, s) => s === "gluten-free") },
    { name: "No spice", n: countOf((i) => i.spice === "none") },
  ];
  for (const { name, n } of cases) {
    const button = filters.getByRole("button", { name });
    await tapOrClick(page, button);
    await expect(button).toHaveAttribute("aria-pressed", "true");
    await expect(count).toHaveText(`${n} of ${dishCount} dishes`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
    await tapOrClick(page, button);
    await expect(button).toHaveAttribute("aria-pressed", "false");
  }

  await tapOrClick(page, filters.getByRole("button", { name: "Vegetarian" }));
  await tapOrClick(page, page.getByRole("button", { name: "Clear filters" }));
  await expect(count).toContainText(`${dishCount} dishes`);
});

test("a dish photo opens fully on screen, with the Call button in reach, and closes", async ({ page }) => {
  await open(page);
  const dish = page.locator('#menu button[aria-haspopup="dialog"]').first();
  await dish.scrollIntoViewIfNeeded();
  await tapOrClick(page, dish);

  const popup = page.getByRole("dialog");
  await expect(popup).toBeVisible();
  await expect(popup).toBeInViewport({ ratio: 1 });
  await expect(popup.getByRole("heading")).toBeInViewport();
  // Phones held sideways too: the Call button must be on screen, not cut off below the photo.
  await expect(popup.getByRole("link", { name: /Call to order/ })).toBeInViewport({ ratio: 1 });

  await tapOrClick(page, popup.getByRole("button", { name: "Close" }));
  await expect(popup).toBeHidden();

  await tapOrClick(page, dish);
  await expect(popup).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(popup).toBeHidden();
});

test("buttons are big enough to tap", async ({ page }) => {
  await open(page);
  // Links inside sentences (a phone number in a paragraph) are exempt, as in the accessibility guidelines.
  const small = await page.evaluate(() =>
    [...document.querySelectorAll("a, button, summary")]
      .filter((el) => {
        const box = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        return box.width > 0 && style.display !== "inline" && style.visibility !== "hidden" && !el.hasAttribute("aria-haspopup") && box.height < 40;
      })
      .map((el) => `${el.textContent?.trim().slice(0, 30)} (${Math.round(el.getBoundingClientRect().height)} px)`),
  );
  expect(small).toEqual([]);

  // Dish names with a photo: the tap area reaches above and below the text line.
  const missed = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('#menu button[aria-haspopup="dialog"]')].slice(0, 12).filter((el) => {
      el.scrollIntoView({ block: "center", behavior: "instant" });
      const box = el.getBoundingClientRect();
      const hit = (y: number) => document.elementFromPoint(box.left + 4, y)?.closest("button") === el;
      return !(hit(box.top - 8) && hit(box.bottom + 8));
    }).map((el) => el.textContent),
  );
  expect(missed).toEqual([]);
});

test("text is large enough to read", async ({ page }) => {
  await open(page);
  const tiny = await page.evaluate(() =>
    [...document.querySelectorAll("body *")]
      .filter((el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent!.trim()))
      .filter((el) => el.getBoundingClientRect().width > 0 && parseFloat(getComputedStyle(el).fontSize) < 12)
      .map((el) => el.textContent?.trim().slice(0, 30)),
  );
  expect(tiny).toEqual([]);
});

test("the open-now badge shows today's status", async ({ page }) => {
  await open(page);
  await expect(page.locator("#top p[aria-live]").first()).toHaveText(/^(Open now|Closing soon|Closed)/);
});
