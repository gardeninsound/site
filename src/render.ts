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
type Door = { name: string; hint: string } & ({ href: string; label: string } | { soon: true } | { form: string });

const soon = '<span class="soon">soon…</span>';

function newsletterDoor(n: Links['newsletter']): Door {
  const words = { name: 'The letters', hint: 'Now and then, by email.' };
  if (!n) return { ...words, soon: true };
  if ('page' in n) return { ...words, href: n.page, label: 'Write me' };
  return { ...words, form: n.form };
}

const text = (d: Door) => `<span class="name">${esc(d.name)}</span>
      <span class="hint">${esc(d.hint)}</span>`;

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
  const doors: Door[] = [
    { name: 'The map', hint: 'Follow the lemons.', href: links.map, label: 'Walk' },
    links.discord
      ? { name: 'The club', hint: 'Find the others.', href: links.discord, label: 'Come in' }
      : { name: 'The club', hint: 'Find the others.', soon: true },
    newsletterDoor(links.newsletter),
  ];
  return doors.map(renderDoor).join('\n    ');
}
