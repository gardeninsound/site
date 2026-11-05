# Garden in Sound · site

The home page for Garden in Sound, in the map's colors, with three ways in:
[the map](https://gardeninsound.website), the club (Discord), and the letters (newsletter).

Live at **https://gardeninsound.github.io/site/** until it gets its own domain.

## Change it

- **Links:** `src/links.ts`. A link left `null` shows "soon…".
- **Words:** `src/render.ts` (the three doors), `index.html`, and `about.html` (the about page).
- **Look:** `src/style.css`.

```sh
npm install
npm run dev     # http://localhost:5173/
npm test
npm run build   # → dist/
```

## How it goes live

Same as the map: a branch, a pull request, the **Check** (tests + build), then merge. `main`
deploys to GitHub Pages. Every PR also gets a preview at
`https://pr-<number>-site-preview.gardeninsound.workers.dev` (see `preview/`), once the repo
has the `CLOUDFLARE_API_TOKEN` secret.

## Newsletter signups

The email box posts straight to the newsletter service, so addresses never pass through this
site. Set `newsletter` in `src/links.ts` to `{ form: '<the service's embed form address>' }`,
or `{ page: '<its signup page>' }` to link out instead.

## Giving it a domain

1. Buy the domain in the project's Cloudflare account (Exit320's Account).
2. Add `public/CNAME` containing the domain, and merge.
3. In Cloudflare DNS, point it at GitHub Pages (proxied), with SSL/TLS on **Full**, as for
   `gardeninsound.website` (see the map's `docs/hosting.md`).
4. GitHub → this repo → Settings → Pages → Custom domain.
