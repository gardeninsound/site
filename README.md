# Garden in Sound · site

The home page for Garden in Sound, in the map's colors, with three ways in:
[the map](https://gardeninsound.website), the Gardeners Club (Discord), and the letters (newsletter).

Live at **https://gardeninsound.org**.

## Change it

- **Links:** `src/links.ts`. A link left `null` shows "soon…". Each filled-in link also gets a
  short address for posters and QR codes: `gardeninsound.org/map`, `/discord`, `/letters`
  (redirect pages made at build time), so the real link can change without reprinting.
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

## The domain

`gardeninsound.org` is in the project's Cloudflare account (Exit320's Account), next to
`gardeninsound.website` (the map). DNS points at GitHub Pages through Cloudflare's proxy:

| Type | Name | Content | Proxy |
|---|---|---|---|
| A | `@` | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (four records) | proxied |
| CNAME | `www` | `gardeninsound.github.io` | proxied |

SSL/TLS mode is **Full**, not Full (strict): behind the proxy GitHub serves its generic
certificate, which strict mode rejects (error 526). The custom domain is set in GitHub → this
repo → Settings → Pages (`public/CNAME` records it too).
