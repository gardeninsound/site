# Previews

Each pull request's build is uploaded as a preview version of the `site-preview` Worker (files
only, no code) in the project's Cloudflare account, at
`https://pr-<number>-site-preview.gardeninsound.workers.dev`. Uploaded by
`.github/workflows/preview.yml`; replaced with `closed/` when the PR closes
(`preview-cleanup.yml`). The Worker's own address, `site-preview.gardeninsound.workers.dev`,
shows the closed page.

Needs the GitHub secret `CLOUDFLARE_API_TOKEN`: a Cloudflare API token with **Workers Scripts:
Edit** on the project's account (the same kind the map uses). Without it, previews are skipped.
