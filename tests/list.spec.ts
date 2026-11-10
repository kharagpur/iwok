import { expect, test, type Locator, type Page } from "@playwright/test";
import { formatPrice, menu, popularCodes } from "@/data/menu";

// "My list" (lib/list.ts, components/MyList.tsx): diners pick dishes on their phone, then read the list out to the
// server or over the phone. Nothing is ordered online. Runs on every device, like devices.spec.ts.

const popular = new Set<string>(popularCodes);
const all = menu.flatMap((c) => c.items);
// Dishes that appear once on the page (not also in Most ordered), so their buttons are unique.
const plain = all.filter((i) => i.code && i.price !== undefined && !i.sizes && !popular.has(i.code));
const first = plain[0];
const later = plain[plain.length - 1];
const sized = all.find((i) => i.sizes && !popular.has(i.code!))!;
const label = (i: (typeof all)[number]) => `${i.code} ${i.name}`;

const bar = (page: Page) => page.getByRole("button", { name: /^My list/ });
const listScreen = (page: Page) => page.getByRole("dialog", { name: "My list" });

async function tapOrClick(page: Page, locator: Locator) {
  await locator.scrollIntoViewIfNeeded();
  if (test.info().project.use.hasTouch) await locator.tap();
  else await locator.click();
}

async function add(page: Page, item: (typeof all)[number]) {
  await tapOrClick(page, page.getByRole("button", { name: `Add ${label(item)} to my list`, exact: true }));
}

test.beforeEach(async ({ page }) => {
  page.on("pageerror", (err) => {
    throw err;
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("+ adds a dish; the bar shows how many and the estimated total; − takes it off again", async ({ page }) => {
  await expect(bar(page)).toBeHidden();
  await add(page, first);
  await expect(bar(page)).toBeVisible();
  await expect(bar(page)).toContainText("1 dish");
  await expect(bar(page)).toContainText(formatPrice(first.price!));
  await expect(bar(page)).toBeInViewport({ ratio: 1 });

  // The + turns into − 1 + right on the dish.
  await expect(page.getByRole("button", { name: `Add ${label(first)} to my list`, exact: true })).toHaveCount(0);
  await tapOrClick(page, page.getByRole("button", { name: `One more ${label(first)}`, exact: true }));
  await expect(bar(page)).toContainText("2 dishes");
  await expect(bar(page)).toContainText(formatPrice(first.price! * 2));

  await tapOrClick(page, page.getByRole("button", { name: `One less ${label(first)}`, exact: true }));
  await tapOrClick(page, page.getByRole("button", { name: `One less ${label(first)}`, exact: true }));
  await expect(bar(page)).toBeHidden();
  await expect(page.getByRole("button", { name: `Add ${label(first)} to my list`, exact: true })).toBeVisible();
});

test("a dish with sizes asks which size, and each size is its own line", async ({ page }) => {
  await add(page, sized);
  const picker = page.getByRole("dialog", { name: "Which size?" });
  await expect(picker).toBeVisible();
  await expect(picker).toBeInViewport({ ratio: 1 });
  const size = sized.sizes!.at(-1)!;
  await tapOrClick(page, picker.getByRole("button", { name: new RegExp(`^${size.label}`) }));
  await expect(picker).toBeHidden();
  await expect(bar(page)).toContainText(formatPrice(size.price));
  await expect(page.getByRole("group", { name: `${label(sized)}, ${size.label} in my list` })).toBeVisible();

  // Another size of the same dish.
  await tapOrClick(page, page.getByRole("button", { name: `Size of ${label(sized)}` }));
  await tapOrClick(page, picker.getByRole("button", { name: new RegExp(`^${sized.sizes![0].label}`) }));
  await expect(bar(page)).toContainText("2 dishes");
  await expect(bar(page)).toContainText(formatPrice(size.price + sized.sizes![0].price));
});

test("the list screen fits on screen, reads in menu order, and says it isn't an order", async ({ page }) => {
  // Added out of order: the later dish first.
  await add(page, later);
  await add(page, first);
  await tapOrClick(page, page.getByRole("button", { name: `One more ${label(first)}`, exact: true }));
  await tapOrClick(page, bar(page));

  const screen = listScreen(page);
  await expect(screen).toBeVisible();
  await expect(screen).toBeInViewport();
  await expect(screen.getByText("This isn't sent to the restaurant.")).toBeVisible();

  const lines = screen.locator("li p");
  await expect(lines).toHaveCount(2);
  await expect(lines.nth(0)).toHaveText(`2 × ${first.code} ${first.name}`);
  await expect(lines.nth(1)).toHaveText(`1 × ${later.code} ${later.name}`);
  await expect(screen).toContainText(`Estimated total${formatPrice(first.price! * 2 + later.price!)}`);
  await expect(screen).toContainText("3 dishes · before tax");
  await expect(screen.getByRole("link", { name: /Call to order/ })).toHaveAttribute("href", /^tel:\+1\d{10}$/);

  // Changes made on the list screen show on the menu too.
  await tapOrClick(page, screen.getByRole("button", { name: `Remove ${label(later)}`, exact: true }));
  await expect(lines).toHaveCount(1);
  await tapOrClick(page, screen.getByRole("button", { name: "Back to the menu" }));
  await expect(screen).toBeHidden();
  await expect(page.getByRole("button", { name: `Add ${label(later)} to my list`, exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
});

test("the list is still there after a reload; Clear list asks once more", async ({ page }) => {
  await add(page, first);
  await page.reload();
  await expect(bar(page)).toContainText("1 dish");

  await tapOrClick(page, bar(page));
  const screen = listScreen(page);
  await tapOrClick(page, screen.getByRole("button", { name: "Clear list" }));
  await expect(screen.locator("li p")).toHaveCount(1);
  await tapOrClick(page, screen.getByRole("button", { name: "Tap again to clear" }));
  await expect(screen).toContainText("Your list is empty");
  await page.keyboard.press("Escape");
  await expect(bar(page)).toBeHidden();
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(bar(page)).toBeHidden();
});

test("Add to my list from the dish photo, and from Most ordered", async ({ page }) => {
  const photoDish = all.find((i) => i.photo && !i.sizes && i.price !== undefined && !popular.has(i.code!))!;
  await tapOrClick(page, page.locator("#menu button[aria-haspopup='dialog']", { hasText: photoDish.name }).first());
  const popup = page.getByRole("dialog", { name: photoDish.name });
  await tapOrClick(page, popup.getByRole("button", { name: /Add to my list/ }));
  await expect(popup.getByRole("group", { name: `${label(photoDish)} in my list` })).toBeVisible();
  await expect(popup.getByRole("link", { name: /Call to order/ })).toBeInViewport({ ratio: 1 });
  await page.keyboard.press("Escape");

  const top = all.find((i) => i.code === popularCodes[0])!;
  await tapOrClick(page, page.getByRole("button", { name: `Add to my list: ${label(top)}` }));
  await expect(bar(page)).toContainText("2 dishes");
});

test("Share list copies the list as text when the phone can't share", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", { value: undefined });
    Object.defineProperty(navigator, "clipboard", { value: { writeText: async (t: string) => ((window as unknown as { copied: string }).copied = t) } });
  });
  await page.reload();
  await add(page, first);
  await tapOrClick(page, bar(page));
  await tapOrClick(page, listScreen(page).getByRole("button", { name: "Share list" }));
  await expect(listScreen(page)).toContainText("Copied");
  const text = await page.evaluate(() => (window as unknown as { copied: string }).copied);
  expect(text).toContain(`1 × ${label(first)} — ${formatPrice(first.price!)}`);
  expect(text).toContain(`Estimated total: ${formatPrice(first.price!)} before tax`);
});

test("the bar never hides the end of the page", async ({ page }) => {
  await add(page, first);
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
  const barTop = (await bar(page).boundingBox())!.y;
  const lowest = await page.evaluate(() => {
    const texts = [...document.querySelectorAll("footer *")].filter(
      (el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent!.trim()) && el.getBoundingClientRect().height > 0,
    );
    return Math.max(...texts.map((el) => el.getBoundingClientRect().bottom));
  });
  expect(lowest, "last text hidden behind the My list bar").toBeLessThanOrEqual(barTop);
});
