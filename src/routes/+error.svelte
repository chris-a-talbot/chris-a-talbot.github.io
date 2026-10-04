<script lang="ts">
  /**
   * GitHub Pages matches paths case-sensitively and serves 404.html (this app) for anything else,
   * so a 404 whose path matches a page ignoring case and a trailing slash (/Aga26, /AGA26/,
   * /AGA26_supplement) is sent on to that page. Otherwise this is SvelteKit's default error page.
   */
  import { onMount } from 'svelte';
  import { page } from '$app/state';

  // Every static page's path, from the route files themselves; [param] routes cannot be matched.
  const PATHS = Object.keys(import.meta.glob('./**/+page.svelte'))
    .map((file) => file.slice(1).replace(/\/?\+page\.svelte$/, '') || '/')
    .filter((path) => !path.includes('['));

  const fold = (path: string) => path.toLowerCase().replace(/\/+$/, '') || '/';

  onMount(() => {
    if (page.status !== 404) return;
    const target = PATHS.find((path) => fold(path) === fold(location.pathname));
    if (target && target !== location.pathname) {
      location.replace(target + location.search + location.hash);
    }
  });
</script>

<h1>{page.status}</h1>
<p>{page.error?.message}</p>
