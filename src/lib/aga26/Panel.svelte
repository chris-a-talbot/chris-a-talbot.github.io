<script lang="ts">
  import type { Snippet } from 'svelte';

  /**
   * One poster panel: a rounded header bar over its body, in the poster's tints.
   *   mint       pale mint header, white body   (Data and Background, Methods, ...)
   *   mintDark   darker mint header, mint body  (Study Overview, Takeaways)
   *   pink       pale red header, white body    (the two results panels)
   *   blue       pale blue header, white body   (When do genomes add information?)
   */
  let {
    id,
    title,
    tone = 'mint',
    children
  }: {
    id: string;
    title: string;
    tone?: 'mint' | 'mintDark' | 'pink' | 'blue';
    children: Snippet;
  } = $props();
</script>

<section {id} class="panel {tone}" aria-labelledby="{id}-title">
  <h2 id="{id}-title" class="hdr">{title}</h2>
  <div class="body">
    {@render children()}
  </div>
</section>

<style>
  .panel {
    scroll-margin-top: var(--aga-sticky, 3.5rem);
    min-width: 0;
  }

  .hdr {
    margin: 0;
    padding: 0.32em 0.75em 0.28em;
    border-radius: 0.6rem 0.6rem 0 0;
    font-family: var(--aga-font);
    font-weight: 700;
    font-size: var(--aga-h2);
    line-height: 1.2;
    text-align: center;
    color: var(--aga-ink);
    background: var(--aga-mint);
    text-wrap: balance;
  }

  .body {
    padding: 0.9rem 0.25rem 0.25rem;
  }

  .mintDark .hdr {
    background: var(--aga-mint-dark);
  }
  .mintDark .body {
    background: var(--aga-mint);
    border-radius: 0 0 0.6rem 0.6rem;
    padding: 1rem 1rem 1.1rem;
  }
  .pink .hdr {
    background: var(--aga-pink);
  }
  .blue .hdr {
    background: var(--aga-blue);
  }
</style>
