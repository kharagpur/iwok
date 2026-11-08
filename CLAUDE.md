# Indian Wok website

Static site for Indian Wok (Sophia and Ian Chung's Indian-Chinese restaurant, Burnaby). Built with Next.js as a static export, published to GitHub Pages at indianwok.ca.

## Project notes live in the vault, not here
- In Kenneth's Second Brain vault: `20 Areas/Home & Life Admin/Indian Wok.md` — the restaurant, the website, open items and **Setup & developer info** (keep it current). The finished redesign project (requirements, decisions) is archived in `80 Archive/Projects/Indian Wok Website Redesign/`.
- New decisions or requirements about the site go into the Indian Wok note, following the vault's CLAUDE.md.

## Rules
- `output: 'export'` only: no server features (no API routes that read requests, no default next/image optimizer, no rewrites or redirects).
- Mobile-first; keep client JavaScript to a minimum; target high Lighthouse scores.
- Photos: resized ahead of time (WebP, the sizes shown); never ship the original 2021 files as-is.
- `public/CNAME` = indianwok.ca; the published folder must contain an empty `.nojekyll`.
- The menu is one data file; every section reads prices from it.
- Styling: Tailwind CSS v4 (utility classes; brand colours and fonts in `@theme` in `app/globals.css`). Kenneth's choice, 2026-11-07.
- Design: option A "chili signboard" (vault: 2026-11-08 Modern Design – Option A): white page, big logo, red hero band, Bricolage Grotesque headings, text-first menu, sticky Call/Order/Directions bar on phones.
- Restaurant facts live in `data/site.ts`, questions in `data/faq.ts`; `lib/seo.ts` builds the structured data and llms.txt from them. Never hand-write a fact in a component.
- Photos come from the full-size 2021 originals in this repo's own history: `npm run photos` (scripts/photo-sources.json).
- This folder (`~/dev/iwok`) is Kenneth's clone of github.com/kharagpur/iwok (public). **Live since 2026-11-08:** every push to `master` builds and publishes indianwok.ca through GitHub Actions (`.github/workflows/deploy-pages.yml`). `Old_Website_CheckPoint` is the 2021 site, kept for rollback.
- **Never commit to `master` (Kenneth, 2026-11-08).** For every task, start a branch from an up-to-date `master`: `feature/<short-name>` for something new, `fix/<short-name>` for a bug fix. Commit only there (one branch per task; keep working on it until Kenneth says it's done). Check `npm start`, lint and build before each commit. Kenneth pushes the branch, opens a pull request and merges it on GitHub; merging is what publishes the site. Never merge, push or delete a branch yourself unless Kenneth says so in those words ("merge it", "delete the branch").
- Commit messages: a short plain summary of the change (on the task's branch). Code changes don't get vault notes; requirements, decisions and milestones do.
- `npm install` must stay clean (Kenneth, 2026-11-08): ESLint 10; patched `minimatch`/`compression` pinned under `overrides` in package.json; `.npmrc` has `legacy-peer-deps=true` because the Next.js lint plugins haven't declared ESLint 10 support. Run `npm audit` after adding packages.
- This Next.js version (16) differs from older docs: read AGENTS.md and the guides in `node_modules/next/dist/docs/` before writing code.

## Commands
- `npm start` — builds, then serves `out/` at http://localhost:4000 (Kenneth's choice: always port 4000)
- `npm run dev` — local preview with live reload (port 3000)
- `npm run build` — writes the static site to `out/`
