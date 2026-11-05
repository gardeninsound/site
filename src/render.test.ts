import { describe, expect, it } from 'vitest';
import { links } from './links.ts';
import { renderDoors, safeUrl } from './render.ts';

describe('the doors', () => {
  it('render the real links', () => {
    const html = renderDoors(links);
    expect(html).toContain(`href="${safeUrl(links.map)}"`);
    expect(html.match(/class="door"/g)).toHaveLength(3);
  });

  it('say "soon…" until a link is filled in', () => {
    const html = renderDoors({ map: 'https://gardeninsound.website', discord: null, newsletter: null });
    expect(html.match(/class="soon"/g)).toHaveLength(2);
  });

  it('link to Discord and show an email form once they exist', () => {
    const html = renderDoors({
      map: 'https://gardeninsound.website',
      discord: 'https://discord.gg/abc123',
      newsletter: { form: 'https://buttondown.com/api/emails/embed-subscribe/garden' },
    });
    expect(html).not.toContain('class="soon"');
    expect(html).toContain('href="https://discord.gg/abc123"');
    expect(html).toContain('action="https://buttondown.com/api/emails/embed-subscribe/garden"');
    expect(html).toContain('type="email"');
  });

  it('refuse anything but https links', () => {
    expect(() => renderDoors({ ...links, discord: 'javascript:alert(1)' })).toThrow(/https/);
    expect(() => renderDoors({ ...links, newsletter: { page: 'http://example.com' } })).toThrow(/https/);
  });
});
