<script lang="ts">
  /**
   * "We assessed 8 different offsets", as on the poster. Each entry opens its citation and
   * equation card (MethodDialog).
   */
  import { C } from './theme';
  import { METHODS, METHOD } from './methods';
  import { ui } from './state.svelte';

  const env = METHODS.filter((m) => m.group === 'environmental');
  const obs = METHODS.filter((m) => m.group === 'observed');
  const bench = METHOD.climate;
</script>

{#snippet item(m: (typeof METHODS)[number])}
  <li>
    <button onclick={() => (ui.method = m.key)} aria-haspopup="dialog">
      <span class="name">{m.number}) {m.name}</span>
      <span class="cite">({m.cite})</span>
      <svg class="i" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"
        ><circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.3" /><path
          d="M8 7v4.2M8 4.6v.1"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
        /></svg
      >
    </button>
  </li>
{/snippet}

<div class="offsets">
  <div class="cols">
    <div>
      <h3 style:color={C.lake}>Environmental-change</h3>
      <ul>{#each env as m}{@render item(m)}{/each}</ul>
    </div>
    <div>
      <h3 style:color={C.spruce}>Observed-reference</h3>
      <ul>{#each obs as m}{@render item(m)}{/each}</ul>
    </div>
  </div>
  <button class="bench" onclick={() => (ui.method = bench.key)} aria-haspopup="dialog">
    <span class="name">C) Mahalanobis climate distance</span> <span class="cite">({bench.cite})</span>
    <svg class="i" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"
      ><circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.3" /><path
        d="M8 7v4.2M8 4.6v.1"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
      /></svg
    >
  </button>
  <p class="foot">(and a climate-only benchmark)</p>
</div>

<style>
  .offsets {
    container-type: inline-size;
    font-family: var(--aga-font);
    color: var(--aga-ink);
  }
  .cols {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.4rem 1rem;
  }
  @container (min-width: 25rem) {
    .cols {
      grid-template-columns: 1fr 1fr;
    }
  }
  h3 {
    margin: 0 0 0.25rem;
    font-family: var(--aga-font);
    font-size: 1.05rem;
    font-weight: 600;
    text-align: center;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  button {
    position: relative;
    display: block;
    width: 100%;
    padding: 0.45rem 1.9rem 0.45rem 0.45rem;
    border: 0;
    border-radius: 0.45rem;
    background: none;
    font: inherit;
    text-align: left;
    color: inherit;
    cursor: pointer;
  }
  button:hover {
    background: var(--aga-panel);
  }
  button:focus-visible {
    outline: 2px solid var(--aga-lake);
  }
  .name {
    display: block;
    font-size: 1.08rem;
    line-height: 1.25;
  }
  .cite {
    display: block;
    padding-left: 1.4em;
    font-size: 0.86rem;
  }
  .i {
    position: absolute;
    right: 0.5rem;
    top: 0.65rem;
    color: var(--aga-soft-ink);
  }
  .bench {
    margin-top: 0.3rem;
  }
  .bench .name,
  .bench .cite {
    display: inline;
    padding: 0;
  }
  .foot {
    margin: 0.5rem -0.25rem -0.25rem;
    padding: 0.4rem 0.5rem;
    background: var(--aga-mint);
    border-radius: 0 0 0.6rem 0.6rem;
    text-align: center;
    font-weight: 700;
    font-size: 1.05rem;
  }
</style>
