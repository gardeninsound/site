import type { Links } from './links.ts';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Only real web links make it onto the page. */
export function safeUrl(url: string): string {
  const u = new URL(url);
  if (u.protocol !== 'https:') throw new Error(`not an https link: ${url}`);
  return u.href;
}

interface Door {
  name: string;
  hint: string;
  action: string;
}

const soon = '<span class="soon">soon…</span>';

const button = (href: string, label: string) =>
  `<a class="go" href="${esc(safeUrl(href))}">${esc(label)}</a>`;

function newsletterAction(n: Links['newsletter']): string {
  if (!n) return soon;
  if ('page' in n) return button(n.page, 'Write me');
  return `<form class="signup" action="${esc(safeUrl(n.form))}" method="post" target="_blank">
      <label for="email" class="sr">Email address</label>
      <input id="email" name="email" type="email" required autocomplete="email" placeholder="your email">
      <button type="submit" class="go">Write me</button>
    </form>`;
}

/** The three ways in, as HTML. Words: Mike's drafts, his to rewrite. */
export function renderDoors(links: Links): string {
  const doors: Door[] = [
    { name: 'The map', hint: 'Follow the lemons.', action: button(links.map, '▶ Walk') },
    { name: 'The club', hint: 'Find the others.', action: links.discord ? button(links.discord, 'Come in') : soon },
    { name: 'The letters', hint: 'Now and then, by email.', action: newsletterAction(links.newsletter) },
  ];
  return doors
    .map(
      (d) => `<li class="door">
      <span class="name">${esc(d.name)}</span>
      <span class="hint">${esc(d.hint)}</span>
      ${d.action}
    </li>`,
    )
    .join('\n    ');
}
