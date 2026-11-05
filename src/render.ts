import type { Links } from './links.ts';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Only real web links make it onto the page. */
export function safeUrl(url: string): string {
  const u = new URL(url);
  if (u.protocol !== 'https:') throw new Error(`not an https link: ${url}`);
  return u.href;
}

interface Notice {
  no: string;
  title: string;
  body: string;
  action: string;
}

const soon = '<p class="soon">Coming soon</p>';

const button = (href: string, label: string) =>
  `<a class="act" href="${esc(safeUrl(href))}">${esc(label)} →</a>`;

function newsletterAction(n: Links['newsletter']): string {
  if (!n) return soon;
  if ('page' in n) return button(n.page, 'Sign up');
  return `<form class="signup" action="${esc(safeUrl(n.form))}" method="post" target="_blank">
      <label for="email">Email address</label>
      <div class="row"><input id="email" name="email" type="email" required autocomplete="email" placeholder="you@example.com">
      <button type="submit">Sign up</button></div>
    </form>`;
}

/** The three notices on the page, as HTML. Words: Mike's drafts, his to rewrite. */
export function renderNotices(links: Links): string {
  const notices: Notice[] = [
    {
      no: '01',
      title: 'Explore the map',
      body: 'Walk a rabbit along West Seattle’s main streets and find where the art went up.',
      action: button(links.map, 'Open the map'),
    },
    {
      no: '02',
      title: 'Join the Garden Club',
      body: 'Our Discord. Plan painting days, share what you find, help pick what gets made next. 13 and up.',
      action: links.discord ? button(links.discord, 'Join on Discord') : soon,
    },
    {
      no: '03',
      title: 'Get the Garden Notice',
      body: 'Once a month by email: what’s coming up, and what got made. Unsubscribe any time.',
      action: newsletterAction(links.newsletter),
    },
  ];
  return notices
    .map(
      (n) => `<article class="notice">
    <p class="no">Notice No. ${n.no}</p>
    <h2>${esc(n.title)}</h2>
    <p>${esc(n.body)}</p>
    ${n.action}
  </article>`,
    )
    .join('\n  ');
}
