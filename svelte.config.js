import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: 'docs',
      assets: 'docs',
      fallback: 'index.html',
      precompress: false,
      strict: true
    }),
    paths: {
      base: ''
    },
    prerender: {
      handleHttpError: ({ path, message }) => {
        // Ignore missing assets during prerender
        const ignoredPaths = [
          '/favicon.png',
          '/apple-touch-icon.png',
          '/evolution2024poster.html',
          '/botany2024poster.html'
        ];
        if (ignoredPaths.includes(path)) {
          console.warn(`Warning: ${path} not found, ignoring during prerender`);
          return;
        }
        throw new Error(message);
      }
    }
  }
};

export default config;
