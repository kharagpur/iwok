# Indian Wok website

The official website for Indian Wok, an Indian-Chinese restaurant in Burnaby, British Columbia, live at **[indianwok.ca](https://indianwok.ca)**. It's built with Next.js as a static export and published with GitHub Pages.

## Getting started

1. Install [Node.js](https://nodejs.org) 20.9 or newer (`node -v` to check).
2. In Terminal: `cd` into this folder, then run `npm install`.
3. Once per computer, for the tests: `npm run test:setup`.

## Commands

Run these in Terminal from this folder.

| Command | What it does | When |
| --- | --- | --- |
| `npm install` | Downloads the packages in `package.json` into `node_modules/` | First time; after a pull or branch switch that changed `package.json`; when a command says *not found* or *Cannot find module* |
| `npm run dev` | Live preview at http://localhost:3000; reloads as code changes | While changing code |
| `npm start` | Builds the site, then serves the finished copy at http://localhost:4000 (also on your Wi-Fi, for a phone) | To see exactly what will go live |
| `npm run build` | Builds the finished site into `out/` (also checks the code for type errors) | Rarely on its own: `npm start` and `npm test` both build first |
| `npm test` | Builds, then runs every test (phones, tablets, laptop, menu data, links): a few minutes | Before every push |
| `npm test -- --project=data` | Builds, then only the menu, hours and FAQ checks: seconds | After a menu, price or hours change |
| `npm test -- --project="iPhone SE"` | Builds, then the tests on one device (names in `playwright.config.ts`) | To recheck one device that failed |
| `npm run test:report` | Opens the last test results in the browser, with a recording of any failed test | After a red test |
| `npm run test:setup` | Downloads the test browsers (Chrome's and Safari's engines) | Once per computer, and again if a test says a browser is missing |
| `npm run lint` | Checks the code for common mistakes | Before a push |
| `npm run photos` | Re-makes the dish photos and icons in `public/images/`, then the blurred previews | After adding or swapping a dish photo |
| `npm run placeholders` | Re-makes only the blurred previews shown while photos load (`data/placeholders.json`) | If the data tests say a photo has no preview |

Press **Ctrl + C** to stop `npm run dev` or `npm start`.

## Tests

The tests in `tests/` check the site on popular screens: iPhone SE, iPhone 15 Pro, iPhone 15 Pro Max held sideways and iPad Mini (Safari's engine); Pixel 7, Galaxy S24, Galaxy S9+, Galaxy Tab S9 and the 280 px Galaxy Fold cover screen (Chrome's engine); and a laptop.

- **Devices** (`devices.spec.ts`): no sideways scrolling, sticky section bar, tapping a section, filters (diet and spice), size prices on the right, dish photo popup with the Call button on screen, the Call / Order / Directions bar, the footer (trimmed on phones), tap and text sizes.
- **Menu and data** (`data.spec.ts`): every dish priced or noted, sane prices, no vegetarian mark on a meat, fish or egg dish, photos exist, opening hours, FAQ and Google data match the menu.
- **Light and night themes** (`theme.spec.ts`, on every device): follows the phone's setting, the Light / Dark / Auto choice in the footer is remembered, the header button switches, and every piece of text is readable in both themes.
- **Order list** (`list.spec.ts`, on every device): + adds a dish and − takes it off, sizes for soups and rice, the list screen in menu order with the estimated total, kept after a reload, Clear list, Share list, the photo popup and Most ordered buttons, and the bar never covering the page.
- **Whole site** (`site.spec.ts`): every link, picture and script loads, Google data, robots, sitemap and llms files, the 404 page.

**When to run them:**

1. **Before every push** of a branch: `npm test`. Green here means GitHub's check will almost certainly be green too.
2. **After a menu, price or hours change:** `npm test -- --project=data` catches a missing price, a duplicate code or a meat dish marked vegetarian in seconds. Then the full `npm test` before pushing.
3. **After pulling someone else's changes** or switching branches: `npm install`, then `npm test`.
4. **Not needed** just to look at the site: use `npm run dev` or `npm start`.

GitHub also runs every test on every pull request (the **Test** check), so anything missed locally is still caught before it goes live. When a test fails because the site rightly changed (say a new menu section), update the test in the same change.

**`npm run build` fails with `Cannot find module '@playwright/test'` and `Failed to type check`?** The test tools aren't installed yet: run `npm install`, then build again.

## Making a change

The live site is `master`: **merging into `master` publishes indianwok.ca** (GitHub Actions, about 2 minutes). Nobody commits to `master` directly.

1. Start a branch from an up-to-date `master`: `git switch master && git pull && git switch -c feature/<short-name>` (or `fix/<short-name>` for a bug fix).
2. Make the change, preview it (`npm run dev`), run `npm test`, commit.
3. Push the branch (`git push -u origin <branch-name>`) and open a pull request into `master` on GitHub.
4. Wait for the **Test** check to turn green. The repo owner reviews and merges; then check indianwok.ca on your phone.

**Using Claude Code here:** it reads `CLAUDE.md` (the project rules and common tasks) on its own, so there's nothing to set up. `.claude/settings.json` lets it run the tests without asking, asks before any push, and blocks force-pushes, pushes to `master` and merges. Keep personal Claude settings in `CLAUDE.local.md` or `.claude/settings.local.json`; Git ignores both.

To undo a merged change, open its pull request on GitHub and click **Revert**.

## Where things are

| To change | Edit |
| --- | --- |
| Menu: dishes, prices, sizes, spice, vegetarian marks, most-ordered list | `data/menu.ts` |
| Hours, phone, address, delivery and social links, reviews, our story | `data/site.ts` (hours are in two places there: `hours` and `openingHours`) |
| FAQ | `data/faq.ts` |
| Page sections | `components/` |
| Colours and fonts | `app/globals.css` |
