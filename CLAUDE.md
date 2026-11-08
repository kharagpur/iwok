# Indian Wok website

Static site for Indian Wok (Sophia and Ian Chung's Indian-Chinese restaurant, Burnaby). Built with Next.js as a static export, published to GitHub Pages at indianwok.ca.

## Project notes live in the vault, not here
- In Kenneth's Second Brain vault, folder `10 Projects/Indian Wok Website Redesign/`: the project note, `Specs/Indian Wok – Requirements.md` and `Decisions/`.
- Every new requirement or decision goes into those notes, following the vault's CLAUDE.md. Keep "Setup & developer info" in the project note current.

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
- This folder (`~/dev/iwok`) is Kenneth's clone of github.com/kharagpur/iwok. The new site lives on the branch `New-website-refresh-2026-`, which grows from `master` (Kenneth, 2026-11-08; vault: 2026-11-08 New Site on a Branch of the Live Repo). `master` stays the live 2021 site until launch; it's merged into `master` only after Sophia approves, and only once GitHub Pages builds the site (the source can't be served as is). Kenneth runs `git push` himself.
- Commit code here with `app: <summary>`. Code changes don't get vault notes; requirements, decisions and milestones do.
- `npm install` must stay clean (Kenneth, 2026-11-08): ESLint 10; patched `minimatch`/`compression` pinned under `overrides` in package.json; `.npmrc` has `legacy-peer-deps=true` because the Next.js lint plugins haven't declared ESLint 10 support. Run `npm audit` after adding packages.
- This Next.js version (16) differs from older docs: read AGENTS.md and the guides in `node_modules/next/dist/docs/` before writing code.

## Commands
- `npm start` — builds, then serves `out/` at http://localhost:4000 (Kenneth's choice: always port 4000)
- `npm run dev` — local preview with live reload (port 3000)
- `npm run build` — writes the static site to `out/`
