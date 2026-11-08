# Indian Wok website

Static site for Indian Wok (an Indian-Chinese restaurant, Burnaby). Built with Next.js as a static export, published to GitHub Pages at indianwok.ca.

## Project notes live in the project notes, not here
- In the project notes: the project notes — the restaurant, the website, open items and **Setup & developer info** (keep it current). The finished redesign project (requirements, decisions) is archived in the project archive.
- New decisions or requirements about the site go into the Indian Wok note, following the CLAUDE.md.

## Rules
- `output: 'export'` only: no server features (no API routes that read requests, no default next/image optimizer, no rewrites or redirects).
- Mobile-first; keep client JavaScript to a minimum; target high Lighthouse scores.
- Photos: resized ahead of time (WebP, the sizes shown); never ship the original 2021 files as-is.
- `public/CNAME` = indianwok.ca; the published folder must contain an empty `.nojekyll`.
- The menu is one data file; every section reads prices from it.
- Styling: Tailwind CSS v4 (utility classes; brand colours and fonts in `@theme` in `app/globals.css`). the owner's choice, 2026-11-07.
- Design: option A "chili signboard": white page, big logo, red hero band, Bricolage Grotesque headings, text-first menu, sticky Call/Order/Directions bar on phones.
- Restaurant facts live in `data/site.ts`, questions in `data/faq.ts`; `lib/seo.ts` builds the structured data and llms.txt from them. Never hand-write a fact in a component.
- Photos come from the full-size 2021 originals in this repo's own history: `npm run photos` (scripts/photo-sources.json).
- This folder (`~/dev/iwok`) is the owner's clone of github.com/kharagpur/iwok (public). **Live since 2026-11-08:** work on `master`; every push to `master` builds and publishes indianwok.ca through GitHub Actions (`.github/workflows/deploy-pages.yml`). Check `npm start` before committing. the owner runs `git push` himself. `Old_Website_CheckPoint` is the 2021 site, kept for rollback.
- Commit code here with `app: <summary>`. Code changes don't get project notes notes; requirements, decisions and milestones do.
- `npm install` must stay clean (the owner, 2026-11-08): ESLint 10; patched `minimatch`/`compression` pinned under `overrides` in package.json; `.npmrc` has `legacy-peer-deps=true` because the Next.js lint plugins haven't declared ESLint 10 support. Run `npm audit` after adding packages.
- Tests (the owner, 2026-11-08: "add a few tests related to mobile devices and any other tests that you need"): `tests/` with Playwright — `data.spec.ts` (menu, hours, FAQ, search text), `devices.spec.ts` (every test on 4 iPhone/iPad and 5 Android/Fold screens plus a laptop), `site.spec.ts` (links, images, Google data, 404). Run `npm test` before every commit and add or update a test with each change; when a test fails because the site rightly changed, update the test in the same commit. GitHub runs them on every pull request (`.github/workflows/test.yml`).
- This Next.js version (16) differs from older docs: read AGENTS.md and the guides in `node_modules/next/dist/docs/` before writing code.

## Commands
- `npm start` — builds, then serves `out/` at http://localhost:4000 (the owner's choice: always port 4000)
- `npm run dev` — local preview with live reload (port 3000)
- `npm run build` — writes the static site to `out/`
- `npm test` — builds, then runs every test (first time: `npm run test:setup` downloads the test browsers); `npm run test:report` shows the last results
