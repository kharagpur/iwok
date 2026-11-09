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
- Design: white page, big logo on phones, red hero band, Bricolage Grotesque headings, text-first menu, sticky Call/Order/Directions bar on phones.
- Restaurant facts live in `data/site.ts`, questions in `data/faq.ts`; `lib/seo.ts` builds the structured data and llms.txt from them. Never hand-write a fact in a component.
- Photos come from the full-size 2021 originals in this repo's own history: `npm run photos` (scripts/photo-sources.json).
- **Live:** every merge into `master` builds and publishes indianwok.ca through GitHub Actions (`.github/workflows/deploy-pages.yml`). `Old_Website_CheckPoint` is the 2021 site, kept for rollback.
- **Never commit to `master`.** For every task, start a branch from an up-to-date `master` (`git switch master && git pull`): `feature/<short-name>` for something new, `fix/<short-name>` for a bug fix. Commit only there (one branch per task). Check lint, build and tests before each commit.
- **Pushing and merging:** push the branch and open a pull request only when the person you're working with asks. Never push to `master`, never force-push, never merge: the repo owner reviews each pull request and merges it on GitHub once the **Test** check is green, and merging is what publishes the site. Never delete a branch unless asked in those words ("delete the branch"). `.claude/settings.json` asks before any push and blocks force-pushes, pushes to `master` and merges.
- Personal preferences for Claude belong in your own `~/.claude/CLAUDE.md`, `CLAUDE.local.md` or `.claude/settings.local.json` (the last two are ignored by Git), never in this file.
- Commit messages: a short plain summary of the change.
- `npm install` must stay clean: ESLint 10; patched `minimatch`/`compression` pinned under `overrides` in package.json; `.npmrc` has `legacy-peer-deps=true` because the Next.js lint plugins haven't declared ESLint 10 support. Run `npm audit` after adding packages.
- Tests: `tests/` with Playwright — `data.spec.ts` (menu, hours, FAQ, search text), `devices.spec.ts` (every test on 4 iPhone/iPad and 5 Android/Fold screens plus a laptop), `site.spec.ts` (links, images, Google data, 404), `theme.spec.ts` (light/night themes and text contrast in both, on every device). Run `npm test` before every commit and add or update a test with each change; when a test fails because the site rightly changed, update the test in the same commit. GitHub runs them on every pull request (`.github/workflows/test.yml`).
- This Next.js version (16) differs from older docs: read AGENTS.md and the guides in `node_modules/next/dist/docs/` before writing code.

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
