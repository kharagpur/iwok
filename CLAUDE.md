# Indian Wok website

Static site for Indian Wok, an Indian-Chinese restaurant in Burnaby, British Columbia. Built with Next.js as a static export, published to GitHub Pages at indianwok.ca.

## Rules
- Public repository: never write personal names, family details, personal email addresses or notes from outside this repo into files, comments or commit messages. Describe changes plainly ("logo at half size on desktop").
- `output: 'export'` only: no server features (no API routes that read requests, no default next/image optimizer, no rewrites or redirects).
- Mobile-first; keep client JavaScript to a minimum; target high Lighthouse scores.
- Photos: resized ahead of time (WebP, the sizes shown); never ship the original 2021 files as-is.
- `public/CNAME` = indianwok.ca; the published folder must contain an empty `.nojekyll`.
- The menu is one data file; every section reads prices from it.
- Styling: Tailwind CSS v4 (utility classes; brand colours and fonts in `@theme` in `app/globals.css`). Night theme: the same colour names are redefined under `html[data-theme="dark"]` in `globals.css`; use colour names (`text-ember`, `bg-paper`, …), not fixed hex values, so both themes work. Theme switch code: `components/Theme.tsx` and `lib/theme.ts`.
- Design: white page, big logo on phones, red hero band, Bricolage Grotesque headings, text-first menu, sticky Call/Order/Directions bar on phones, and a red "Hungry?" band over a green footer at the end (`components/Footer.tsx`).
- Restaurant facts live in `data/site.ts`, questions in `data/faq.ts`; `lib/seo.ts` builds the structured data and llms.txt from them. Never hand-write a fact in a component.
- Photos come from the full-size 2021 originals in this repo's own history: `npm run photos` (scripts/photo-sources.json).
- **Live:** every merge into `master` builds and publishes indianwok.ca through GitHub Actions (`.github/workflows/deploy-pages.yml`). `Old_Website_CheckPoint` is the 2021 site, kept for rollback.
- **Never commit to `master`.** For every task, start a branch from an up-to-date `master` (`git switch master && git pull`): `feature/<short-name>` for something new, `fix/<short-name>` for a bug fix. Commit only there (one branch per task). Check lint, build and tests before each commit.
- **Pushing and merging:** push the branch and open a pull request only when the person you're working with asks. Never push to `master`, never force-push, never merge: the repo owner reviews each pull request and merges it on GitHub once the **Test** check is green, and merging is what publishes the site. Never delete a branch unless asked in those words ("delete the branch"). `.claude/settings.json` asks before any push and blocks force-pushes, pushes to `master` and merges.
- Personal preferences for Claude belong in your own `~/.claude/CLAUDE.md`, `CLAUDE.local.md` or `.claude/settings.local.json` (the last two are ignored by Git), never in this file.
- Commit messages: a short plain summary of the change.
- `npm install` must stay clean: ESLint 10; patched `minimatch`/`compression` pinned under `overrides` in package.json; `.npmrc` has `legacy-peer-deps=true` because the Next.js lint plugins haven't declared ESLint 10 support. Run `npm audit` after adding packages.
- Tests: `tests/` with Playwright — `data.spec.ts` (menu, hours, FAQ, search text), `devices.spec.ts` (every test on 4 iPhone/iPad and 5 Android/Fold screens plus a laptop), `site.spec.ts` (links, images, Google data, 404), `theme.spec.ts` (light/night themes and text contrast in both, on every device), `list.spec.ts` (*My list*, on every device). Run `npm test` before every commit and add or update a test with each change; when a test fails because the site rightly changed, update the test in the same commit. GitHub runs them on every pull request (`.github/workflows/test.yml`).
- This Next.js version (16) differs from older docs: read AGENTS.md and the guides in `node_modules/next/dist/docs/` before writing code.

## Product decisions
Why the site is the way it is. Several of these look like bugs or gaps but are deliberate: don't "fix" them, and ask before changing one.

**Goals**
- Small, fast and simple, with high Lighthouse scores (performance, accessibility, SEO). Most visitors are on phones, so design for the phone first.
- Homely and family-run, not a big-chain look. Keep the existing logo; it's big and centred on phones on purpose (strong branding) and compact on desktop.

**Content rules**
- Menu prices come from the restaurant's own menu, never from the delivery apps (their prices are marked up). Spice levels follow the delivery apps.
- Never invent a price, dish, review, rating or quote. A dish without a confirmed price shows "Call for price" with a `check` note in `data/menu.ts`. Reviews are the real Google rating and count plus a summary in our own words; no placeholder or made-up reviews.
- Dinner only, Tuesday to Sunday: no lunch deals or daily specials.
- Menu changes are confirmed by the restaurant; changes to the look go to the repo owner.

**Must keep**
- Order buttons for DoorDash, Uber Eats and SkipTheDishes, and the 10% off in-store pickup offer.
- Tap-to-call phone number, opening hours, and the open-now badge.
- The drawn map (`components/LocationMap.tsx`): exactly where the restaurant is (Kingsway at Royal Oak) and that parking is at the back. It stays a light drawing in the night theme.
- Menu filters in two rows: Diet (vegetarian, gluten-free) and Spice (no spice, mild, medium, hot); dish photos one tap away; and the section bar showing where you are.
- The *order list* (`lib/list.ts`, `components/OrderList.tsx`, `components/AddToList.tsx`): diners tap + on dishes, then read the list to the server or call it in. It is **not online ordering**: nothing is sent anywhere, and the list screen says so at the top ("This isn't sent to the restaurant"); keep that line. Named "Order list" by the repo owner. The list stays in the browser (localStorage), holding only codes, sizes and quantities, so names and prices always come from `data/menu.ts`.
- The files for search engines and AI assistants (structured data, `llms.txt`, `llms-full.txt`, sitemap, robots).

**Deliberate choices that can look odd**
- F8 Dry Chili Fish shows "Call for price": it isn't on the restaurant's current menu, and it stays listed for now.
- Plain Rice (J1) is one dish with Small / Medium / Large prices. Like the soups, its sizes stack one per line in the price column on the right.
- The section bar's highlight ("Pop") is CSS only: the current chip fills red with a small bounce. An earlier JavaScript and SVG-filter "gooey" pill was removed because it was janky; don't bring back script-driven or filter-based animation.
- The night theme's page is a deep forest green from the logo, not black. The logo sits on a cream plate at night because its green letters vanish on a dark page.
- The compact header applies from 768 px wide up; phones keep the big logo (`tests/devices.spec.ts` checks both).
- The spice filter is one joined bar that reads as a heat scale, yet several levels can be on at once: a dish shows if it matches any level that's on (Mild + Medium shows both). Diet buttons narrow instead: a dish must match all of them. Pressed spice levels fill chili red; pressed diet buttons fill dark.
- On phones the footer leaves out the "Hungry?" band's Call / Order buttons (the sticky bar has them) and the Visit column (Find us, just above, has the address and Directions). Laptops and tablets from 768 px wide show both.
- The order list's + is a small 28 px ring and, once tapped, a 28 px red − 1 + pill in the same spot, sized to the menu's tags and prices. Each button still has a 40 px tap area (the visible shape sits inside a 40 px button); don't enlarge the shapes, and don't shrink the tap areas. On the Most ordered cards and in the photo popup, "Add to order list" is a full-width button that turns into a full-width − 1 + bar in the same place; card names take the spare height so the buttons line up.
- Instagram, Facebook and Yelp in the footer are round logo buttons in one colour (glyphs from Simple Icons, CC0, in `components/icons.tsx`), so all three fit on one line in the narrowest footer column.
- On phones the round dish photo in the red band runs 24 px past the right edge on purpose, so the plate looks bigger than the phone. From 768 px wide up it sits fully inside the band.

## Common tasks
- **Change a price, name, size or spice level:** edit the dish in `data/menu.ts`. Every part of the page (full menu, *Most ordered*, Google's data, llms.txt) reads from it. Then `npm test -- --project=data`, and `npm start` to look at it on http://localhost:4000.
- **Add or remove a dish:** same file; every code (A1, C4…) must be unique. Dishes with no price need a `check` note (shown as "Call for price").
- **Vegetarian marks or the gluten-free section changed:** update the count and dish names in `data/faq.ts`; the data tests say exactly what's out of step.
- **Most ordered:** the `popularCodes` list near the end of `data/menu.ts`; each dish there needs a photo.
- **A dish photo:** `public/images/dishes/<photo>-320.webp` and `<photo>-640.webp`, named by the dish's `photo` field.
- **Hours, phone, links, reviews:** `data/site.ts` (hours are in both `hours` and `openingHours`).
- **Anything visual:** check phones and desktop in both the light and night themes, then `npm test` (it includes a text-contrast check for both themes).
- **Finish:** run `npm test`, commit on the task's branch, then push and open a pull request when asked (see the rules above).

## Commands
See README.md (`npm start` serves the built site at http://localhost:4000; `npm run dev` previews at http://localhost:3000; `npm test` builds and runs every test).
