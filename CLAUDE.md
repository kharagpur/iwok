# Indian Wok website

Static site for Indian Wok (an Indian-Chinese restaurant, Burnaby). Built with Next.js as a static export, published to GitHub Pages at indianwok.ca.

## Project notes live in the project notes, not here
- Project: /Users/home/Documents/project notes/10 Projects/Indian Wok Website Redesign/Indian Wok Website Redesign.md
- Requirements: …/Specs/Indian Wok – Requirements.md
- Decisions: …/Decisions/
- Every new requirement or decision goes into those notes, following the CLAUDE.md. Keep "Setup & developer info" in the project note current.

## Rules
- `output: 'export'` only: no server features (no API routes that read requests, no default next/image optimizer, no rewrites or redirects).
- Mobile-first; keep client JavaScript to a minimum; target high Lighthouse scores.
- Photos: resized ahead of time (WebP, the sizes shown); never ship the original 2021 files as-is.
- `public/CNAME` = indianwok.ca; the published folder must contain an empty `.nojekyll`.
- The menu is one data file; every section reads prices from it.
- Styling: Tailwind CSS v4 (utility classes; brand colours and fonts in `@theme` in `app/globals.css`). the owner's choice, 2026-11-07.
- Design: option A "chili signboard": white page, big logo, red hero band, Bricolage Grotesque headings, text-first menu, sticky Call/Order/Directions bar on phones.
- Restaurant facts live in `data/site.ts`, questions in `data/faq.ts`; `lib/seo.ts` builds the structured data and llms.txt from them. Never hand-write a fact in a component.
- Photos come from the full-size 2021 originals in kharagpur/iwok's history: `npm run photos -- <clone>` (scripts/photo-sources.json).
- Source code is in local Git only for now (no GitHub remote); the restaurant previews on the owner's laptop. Built files go to github.com/kharagpur/iwok only at launch, after her approval ([[2026-11-07 Local Git and Laptop Preview]] in the project notes).
- Commit code here with `app: <summary>`. Code changes don't get project notes notes; requirements, decisions and milestones do.
- This Next.js version (16) differs from older docs: read AGENTS.md and the guides in `node_modules/next/dist/docs/` before writing code.

## Commands
- `npm run dev` — local preview
- `npm run build` — writes the static site to `out/`
