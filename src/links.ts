/**
 * Where the page sends people. Fill a link in and its door opens; leave it null and it says
 * "soon…". The words on each door are in src/render.ts.
 */
export interface Links {
  /** the map */
  map: string;
  /** the Discord: a permanent invite (Discord → Invite People → Edit invite link → Expire after: Never) */
  discord: string | null;
  /**
   * The newsletter. `form`: an email box on this page that posts straight to the newsletter
   * service (Buttondown's embed form: https://buttondown.com/api/emails/embed-subscribe/<name>),
   * so addresses never pass through this site. `page`: a link to the service's own signup page
   * (e.g. Substack's https://<name>.substack.com).
   */
  newsletter: { form: string } | { page: string } | null;
}

export const links: Links = {
  map: 'https://gardeninsound.website',
  discord: 'https://discord.gg/35JBFPzWeT',
  newsletter: null,
};
