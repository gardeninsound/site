import { defineConfig } from 'vite';
import { links } from './src/links.ts';
import { renderDoors } from './src/render.ts';

// The page is plain HTML: the doors are written into index.html at build time from
// src/links.ts, so the page works without JavaScript and search engines see the links.
export default defineConfig({
  // Relative asset paths: the same build works at gardeninsound.github.io/site/, on a PR
  // preview, and at the root of a custom domain.
  base: './',
  plugins: [
    {
      name: 'doors',
      transformIndexHtml: (html) => html.replace('<!-- doors -->', renderDoors(links)),
    },
  ],
});
