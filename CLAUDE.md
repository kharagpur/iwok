# Indian Wok website

Static site for Indian Wok, an Indian-Chinese restaurant in Burnaby, British Columbia. Built with Next.js as a static export, published to GitHub Pages at indianwok.ca.

## Rules
- Public repository: never write personal names, family details, personal email addresses or notes from outside this repo into files, comments or commit messages. Describe changes plainly ("logo at half size on desktop").
- `output: 'export'` only: no server features (no API routes that read requests, no default next/image optimizer, no rewrites or redirects).
- Mobile-first; keep client JavaScript to a minimum; target high Lighthouse scores.
- Photos: resized ahead of time (WebP, the sizes shown); never ship the original 2021 files as-is.
- `public/CNAME` = indianwok.ca; the published folder must contain an empty `.nojekyll`.
- The menu is one data file; every section reads prices from it.
- Styling: Tailwind CSS v4 (utility classes; brand colours and fonts in `@theme` in `app/globals.css`).
- Design: white page, big logo on phones, red hero band, Bricolage Grotesque headings, text-first menu, sticky Call/Order/Directions bar on phones.
- Restaurant facts live in `data/site.ts`, questions in `data/faq.ts`; `lib/seo.ts` builds the structured data and llms.txt from them. Never hand-write a fact in a component.
- Photos come from the full-size 2021 originals in this repo's own history: `npm run photos` (scripts/photo-sources.json).
- **Live:** every merge into `master` builds and publishes indianwok.ca through GitHub Actions (`.github/workflows/deploy-pages.yml`). `Old_Website_CheckPoint` is the 2021 site, kept for rollback.
- **Never commit to `master`.** For every task, start a branch from an up-to-date `master`: `feature/<short-name>` for something new, `fix/<short-name>` for a bug fix. Commit only there (one branch per task). Check lint, build and tests before each commit. The repo owner pushes the branch, opens a pull request and merges it on GitHub; merging is what publishes the site. Never merge, push or delete a branch unless the owner says so in those words ("merge it", "delete the branch").
- Commit messages: a short plain summary of the change.
- `npm install` must stay clean: ESLint 10; patched `minimatch`/`compression` pinned under `overrides` in package.json; `.npmrc` has `legacy-peer-deps=true` because the Next.js lint plugins haven't declared ESLint 10 support. Run `npm audit` after adding packages.
- Tests: `tests/` with Playwright — `data.spec.ts` (menu, hours, FAQ, search text), `devices.spec.ts` (every test on 4 iPhone/iPad and 5 Android/Fold screens plus a laptop), `site.spec.ts` (links, images, Google data, 404). Run `npm test` before every commit and add or update a test with each change; when a test fails because the site rightly changed, update the test in the same commit. GitHub runs them on every pull request (`.github/workflows/test.yml`).
- This Next.js version (16) differs from older docs: read AGENTS.md and the guides in `node_modules/next/dist/docs/` before writing code.

## Commands
See README.md (`npm start` serves the built site at http://localhost:4000; `npm run dev` previews at http://localhost:3000; `npm test` builds and runs every test).
