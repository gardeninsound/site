# hello@gardeninsound.org

Email Routing on `gardeninsound.org` (project Cloudflare account) sends mail for
`hello@gardeninsound.org` to the `garden-hello` Worker, which forwards each message to every
address in the Worker's `TO` secret (comma-separated; currently the project inbox and
Jim). It's a secret rather than a var so the addresses stay out of this public repo. A plain forwarding rule can only have one destination.

Receive only: replies come from your own address, not hello@.

## Change who gets it

1. Add the new address as a destination (it gets a confirmation link to click):
   `npx wrangler email routing addresses create someone@example.com`
2. Replace the whole list: `npx wrangler secret put TO` here, and type every address,
   comma-separated. (`wrangler secret list` shows that it exists, never its value.)

## Add another address (e.g. letters@)

`npx wrangler email routing rules create gardeninsound.org --match-type literal --match-field to
--match-value letters@gardeninsound.org --action-type worker --action-value garden-hello`
