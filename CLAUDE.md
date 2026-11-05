# Garden in Sound · site — Development Guide

The project's home page: one static page, a "public notice" with three notices (the map, the
Garden Club Discord, the Garden Notice newsletter). Sibling of the map
(`../bearisland-map`, repo `gardeninsound/map`) and follows its rules.

## Commands

- `npm run dev` → http://localhost:5173/ · `npm test` · `npm run build` (tsc + vite) — both green before committing.

## How it's built

- `index.html` is the page. At build time the `notices` plugin in `vite.config.ts` replaces
  `<!-- notices -->` with `renderNotices(links)` from `src/render.ts`, so the output is plain
  HTML that works without JavaScript. `src/main.ts` only loads the fonts and `src/style.css`.
- `src/links.ts`: where each notice points. `null` → "Coming soon". Only https links render
  (`safeUrl`); tests in `src/render.test.ts`.
- `base: './'`: the build works at `gardeninsound.github.io/site/`, on previews, and at a domain root.
- **Words are Mike's** (`exit320-stack`): the notices in `src/render.ts`, header and footer in `index.html`.
- **Privacy:** the page collects nothing. The newsletter form posts straight to the newsletter
  service. Don't add analytics, trackers or third-party scripts; fonts are self-hosted (fontsource).

## Git workflow

As in the map's CLAUDE.md: a short branch from fresh `main`, a PR, the **Check**
(`.github/workflows/ci.yml`: size guard, tests, build), then auto-merge
(`gh pr merge --auto --squash --delete-branch`), adding the other person as reviewer when it
touches their area. Never push to `main` directly. `main` deploys to GitHub Pages
(`deploy.yml`). PR previews: `preview.yml` → `preview/` (Worker `site-preview`), cleaned up by
`preview-cleanup.yml`; both skip without the `CLOUDFLARE_API_TOKEN` secret.
