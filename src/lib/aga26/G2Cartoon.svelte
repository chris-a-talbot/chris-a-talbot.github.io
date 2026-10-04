<script lang="ts">
  /**
   * "We test a new form of geometric offset": the poster's two cartoon panels
   * (poster_offset/fig13_g2_cartoon.py, drawn by its own functions, one SVG per panel at its
   * poster width). Side by side where there is room, as on the poster; otherwise one at a
   * time behind the two panel titles.
   */
  import { C, FILES, tint } from './theme';

  let width = $state(340);
  let which: 'conventional' | 'observed' = $state('conventional');
  const wide = $derived(width >= 560);

  const PANELS = {
    conventional: {
      title: 'conventional G²',
      colour: C.lake,
      alt: 'Conventional G²: a single arrow, climate-implied displacement, runs from the fitted present allele frequencies to the fitted drought-target allele frequencies. G² sub i equals the squared norm of B ind times delta z sub i, divided by L.'
    },
    observed: {
      title: 'observed-reference G²',
      colour: C.spruce,
      alt: 'Observed-reference G²: from the fitted present allele frequencies, a current residual arrow leads to the observed allele frequencies, and a dashed climate-implied displacement leads to the fitted drought-target allele frequencies; the observed-to-target mismatch arrow joins the observed to the target frequencies. G² sub obs, i equals the squared norm of B pop times delta z sub i minus e hat sub i, divided by L.'
    }
  } as const;
</script>

<div class="g2" bind:clientWidth={width}>
  {#if wide}
    <div class="pair" style:--divider={tint(C.rule, 0.55)}>
      <img src="{FILES}/g2_conventional.svg" alt={PANELS.conventional.alt} />
      <img src="{FILES}/g2_observed.svg" alt={PANELS.observed.alt} />
    </div>
  {:else}
    <div class="switch" role="tablist" aria-label="Panel">
      {#each Object.entries(PANELS) as [k, p]}
        <button
          role="tab"
          aria-selected={which === k}
          class:on={which === k}
          style:color={p.colour}
          onclick={() => (which = k as typeof which)}>{p.title}</button
        >
      {/each}
    </div>
    <div class="one">
      {#each Object.entries(PANELS) as [k, p]}
        <img src="{FILES}/g2_{k}.svg" alt={p.alt} class:hidden={which !== k} aria-hidden={which !== k} />
      {/each}
    </div>
  {/if}
</div>

<style>
  .g2 {
    font-family: var(--aga-font);
  }
  img {
    display: block;
    width: 100%;
    height: auto;
  }
  .pair {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .pair img + img {
    border-left: 1.2px solid var(--divider);
  }
  .one {
    display: grid;
    max-width: 20rem;
    margin: 0.5rem auto 0;
  }
  .one img {
    grid-area: 1 / 1;
  }
  .hidden {
    visibility: hidden;
  }
  .switch {
    display: flex;
    gap: 0.25rem;
    padding: 0.2rem;
    background: var(--aga-panel);
    border-radius: 0.5rem;
  }
  .switch button {
    flex: 1 1 0;
    min-height: 2.6rem;
    border: 0;
    border-radius: 0.35rem;
    background: transparent;
    font: inherit;
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    opacity: 0.6;
  }
  .switch button.on {
    background: var(--aga-paper);
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.12);
    opacity: 1;
  }
  .switch button:focus-visible {
    outline: 2px solid var(--aga-lake);
  }
</style>
