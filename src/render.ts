import type { Links } from './links.ts';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Only real web links make it onto the page. */
export function safeUrl(url: string): string {
  const u = new URL(url);
  if (u.protocol !== 'https:') throw new Error(`not an https link: ${url}`);
  return u.href;
}

/**
 * A door is a row: a name, a hint, and on the right either a pill, "soon…", or (for the
 * newsletter's email form) the form under it. With a link, the whole row is the link.
 */
type Door = { name: string; hint: string; detail: string } & ({ href: string; label: string } | { soon: true } | { form: string });

const soon = '<span class="soon">soon…</span>';

function newsletterDoor(n: Links['newsletter']): Door {
  const words = {
    name: 'The letters',
    hint: 'Now and then, by email.',
    detail: 'Our newsletter! Sporadic and full of magic and mystery. Read along with us.',
  };
  if (!n) return { ...words, soon: true };
  if ('page' in n) return { ...words, href: n.page, label: 'Write me' };
  return { ...words, form: n.form };
}

const text = (d: Door) => `<span class="name">${esc(d.name)}</span>
      <span class="hint">${esc(d.hint)}</span>
      <span class="detail">${esc(d.detail)}</span>`;

function renderDoor(d: Door): string {
  if ('href' in d)
    return `<li><a class="door" href="${esc(safeUrl(d.href))}">
      ${text(d)}
      <span class="go">${esc(d.label)}</span>
    </a></li>`;
  if ('form' in d)
    return `<li class="door">
      ${text(d)}
      <form class="signup" action="${esc(safeUrl(d.form))}" method="post" target="_blank">
        <label for="email" class="sr">Email address</label>
        <input id="email" name="email" type="email" required autocomplete="email" placeholder="your email">
        <button type="submit" class="go">Write me</button>
      </form>
    </li>`;
  return `<li class="door">
      ${text(d)}
      ${soon}
    </li>`;
}

/** The three ways in, as HTML. Words: Mike's drafts, his to rewrite. */
export function renderDoors(links: Links): string {
  const club = {
    name: 'The Gardeners Club',
    hint: 'Find the others.',
    detail: 'Join our Discord! Come say hello, organize events, make art!',
  };
  const doors: Door[] = [
    {
      name: 'The map',
      hint: 'Follow the lemons.',
      detail: 'A rabbit, a few streets, some lemons. See where they lead.',
      href: links.map,
      label: 'Walk',
    },
    links.discord ? { ...club, href: links.discord, label: 'Come in' } : { ...club, soon: true },
    newsletterDoor(links.newsletter),
  ];
  return doors.map(renderDoor).join('\n    ');
}

/**
 * A page that sends you straight on to `url`: for short addresses like gardeninsound.org/discord
 * that posters and QR codes can use, so the real link can change without reprinting.
 */
export function renderRedirect(url: string, name: string): string {
  const href = esc(safeUrl(url));
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <meta http-equiv="refresh" content="0; url=${href}" />
    <title>${esc(name)} · Garden in Sound</title>
  </head>
  <body style="background:#2b2350;color:#fff7e6;font:18px/1.5 system-ui,sans-serif;padding:40px 24px">
    <p>On your way to ${esc(name)}… <a style="color:#ffe066" href="${href}">Go now</a></p>
  </body>
</html>
`;
}

/** Short addresses on gardeninsound.org (path → where it goes), from the links that exist. */
export function shortLinks(links: Links): Record<string, { url: string; name: string }> {
  const out: Record<string, { url: string; name: string }> = { map: { url: links.map, name: 'the map' } };
  if (links.discord) out.discord = { url: links.discord, name: 'the Gardeners Club' };
  if (links.newsletter && 'page' in links.newsletter) out.letters = { url: links.newsletter.page, name: 'the letters' };
  return out;
}
