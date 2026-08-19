import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Blog posts in src/posts are authored as Markdown and compiled by mdsvex.
  extensions: ['.svelte', '.md'],
  preprocess: [mdsvex({ extensions: ['.md'] }), vitePreprocess()],
  kit: {
    adapter: adapter({
      pages: 'docs',
      assets: 'docs',
      // Served from /docs on GitHub Pages, which uses 404.html for unknown paths.
      fallback: '404.html',
      precompress: false,
      strict: true
    }),
    prerender: {
      // /blog/[slug] has no entries while every post is hidden or drafted, which
      // is a valid state for this site rather than a missing link.
      handleUnseenRoutes: 'ignore'
    }
  }
};

export default config;
