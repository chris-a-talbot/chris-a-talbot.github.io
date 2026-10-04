<script lang="ts">
  /**
   * "Geometric offset ranks the three extirpated populations as the safest": the poster's two
   * maps (poster/fig11_forecast_map.py at its poster size, as SVG) and their teardrop keys.
   * Each population's position and marker size on both maps come from the drawn figure
   * (data/maps.json), so a population picked on one map is marked on both.
   * Wide: the poster's arrangement, both maps between their key bands. Narrow: one map at a
   * time, switched by the two key titles, with the keys lying horizontally above.
   */
  import { C, FILES } from './theme';
  import { signed } from './format';
  import { ui } from './state.svelte';
  import M from './data/maps.json';

  type Which = 'forecast' | 'fate_delta';
  let width = $state(340);
  let which: Which = $state('forecast');
  const wide = $derived(width >= 640);

  const W = M.maps.forecast.width;
  const H = M.maps.forecast.height;
  const pops = M.pops;
  const pop = $derived(pops.find((p) => p.id === ui.pop) ?? null);

  /** Hit circles: at least ~16 px on screen; small marks drawn last so they stay reachable. */
  function hits(w: Which, mapPx: number) {
    const scale = mapPx / W;
    const out: { id: number; x: number; y: number; r: number }[] = [];
    for (const p of pops) {
      const m = (M.maps[w].marks as Record<string, any>)[String(p.id)];
      for (const where of ['main', 'inset']) {
        if (!m[where]) continue;
        out.push({ id: p.id, x: m[where].xy[0], y: m[where].xy[1], r: Math.max(m[where].r + 2, 16 / scale) });
      }
    }
    return out.sort((a, b) => b.r - a.r);
  }
  function rings(w: Which) {
    if (ui.pop == null) return [];
    const m = (M.maps[w].marks as Record<string, any>)[String(ui.pop)];
    return ['main', 'inset'].filter((k) => m[k]).map((k) => ({ x: m[k].xy[0], y: m[k].xy[1], r: m[k].r + 5 }));
  }
  function describe(id: number) {
    const p = pops.find((q) => q.id === id)!;
    return `geometric offset risk rank ${p.risk} of 15; ${
      p.extirpated ? 'population extirpated' : `Δ growth rate, into drought ${signed(p.d_into)}`
    }`;
  }
  function pick(id: number) {
    ui.pop = ui.pop === id ? null : id;
  }
  function key(e: KeyboardEvent, id: number) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      pick(id);
    }
  }

  let mapPx = $state(300);
  const ALT: Record<Which, string> = {
    forecast:
      'Map of the 15 populations coloured and sized by geometric offset risk ranking, darker and larger meaning higher risk. The three southern populations that were extirpated are drawn smallest and lightest: the lowest risk.',
    fate_delta:
      'Map of the same populations coloured and sized by the change in growth rate into the drought, redder and larger meaning a larger decline; the three extirpated populations are red triangles in the south.'
  };
</script>

{#snippet map(w: Which, visible: boolean)}
  <div class="map" class:hidden={!visible} aria-hidden={!visible} bind:clientWidth={mapPx}>
    <img src="{FILES}/map_{w}.svg" alt={ALT[w]} width={W} height={H} />
    <svg viewBox="0 0 {W} {H}" class="over">
      {#each rings(w) as r}
        <circle cx={r.x} cy={r.y} r={r.r} fill="none" stroke={C.paper} stroke-width="5" vector-effect="non-scaling-stroke" />
        <circle cx={r.x} cy={r.y} r={r.r} fill="none" stroke={C.ink} stroke-width="2.2" vector-effect="non-scaling-stroke" />
      {/each}
      {#if visible}
        {#each hits(w, mapPx) as h}
          <circle
            cx={h.x}
            cy={h.y}
            r={h.r}
            class="hit"
            role="button"
            tabindex="0"
            aria-pressed={ui.pop === h.id}
            aria-label={describe(h.id)}
            onclick={() => pick(h.id)}
            onkeydown={(e) => key(e, h.id)}
          />
        {/each}
      {/if}
    </svg>
  </div>
{/snippet}

<div class="ff" class:wide bind:clientWidth={width}>
  {#if wide}
    <div class="band left">
      <span class="end" style:color={C.viridisDark}>highest risk</span>
      <div class="vkey">
        <span class="vlabel up">geometric offset risk ranking</span>
        <span class="keyimg"><img src="{FILES}/key_forecast_vertical.png" alt="" /></span>
      </div>
      <span class="end" style:color={C.spruce}>lowest risk</span>
    </div>
    {@render map('forecast', true)}
    {@render map('fate_delta', true)}
    <div class="band right">
      <span class="end" style:color={C.lake}>growth rate<br />increased</span>
      <div class="vkey">
        <span class="keyimg"><img src="{FILES}/key_fate_vertical_flipped.png" alt="" /></span>
        <span class="vlabel down">Δ growth rate, into drought</span>
      </div>
      <span class="end" style:color={C.carnelian}>population<br />extirpated</span>
    </div>
  {:else}
    <div class="switch" role="tablist" aria-label="Map">
      <button role="tab" aria-selected={which === 'forecast'} class:on={which === 'forecast'} onclick={() => (which = 'forecast')}
        >geometric offset risk ranking</button
      >
      <button role="tab" aria-selected={which === 'fate_delta'} class:on={which === 'fate_delta'} onclick={() => (which = 'fate_delta')}
        >Δ growth rate, into drought</button
      >
    </div>
    <div class="hband">
      {#if which === 'forecast'}
        <span style:color={C.spruce}>lowest risk</span>
        <img src="{FILES}/key_forecast.png" alt="" />
        <span style:color={C.viridisDark}>highest risk</span>
      {:else}
        <span style:color={C.lake}>growth rate increased</span>
        <img src="{FILES}/key_fate_horizontal.png" alt="" />
        <span style:color={C.carnelian}>population extirpated</span>
      {/if}
    </div>
    <div class="stack">
      {@render map('forecast', which === 'forecast')}
      {@render map('fate_delta', which === 'fate_delta')}
    </div>
  {/if}
</div>
<p class="readout" aria-live="polite">
  {#if pop}
    <span class="chip">geometric offset risk rank <b>{pop.risk}</b> of 15</span>
    <span class="chip">
      {#if pop.extirpated}<b style:color={C.carnelian}>population extirpated</b>{:else}Δ growth rate, into drought <b>{signed(pop.d_into)}</b>{/if}
    </span>
  {:else}&nbsp;{/if}
</p>

<style>
  .ff {
    font-family: var(--aga-font);
  }
  .ff.wide {
    display: grid;
    grid-template-columns: minmax(4.5rem, 0.5fr) 1fr 1fr minmax(4.5rem, 0.5fr);
    gap: 0.4rem;
    align-items: stretch;
  }
  .map {
    position: relative;
    min-width: 0;
  }
  .map img {
    display: block;
    width: 100%;
    height: auto;
  }
  .over {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
  .hit {
    fill: transparent;
    cursor: pointer;
    outline: none;
    -webkit-tap-highlight-color: transparent;
  }
  .hit:focus-visible {
    stroke: var(--aga-lake);
    stroke-width: 2px;
    vector-effect: non-scaling-stroke;
  }

  .band {
    background: var(--aga-pink-band);
    border-radius: 0.6rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 1.2rem 0.3rem;
    text-align: center;
    font-size: 0.78rem;
    font-weight: 600;
    line-height: 1.15;
  }
  .vkey {
    flex: 1;
    display: flex;
    align-items: stretch;
    justify-content: center;
    gap: 0.35rem;
    margin: 0.6rem 0;
    min-height: 8rem;
    width: 100%;
  }
  .keyimg {
    position: relative;
    width: 1.6rem;
  }
  .keyimg img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .vlabel {
    align-self: center;
    writing-mode: vertical-rl;
    font-weight: 600;
    font-size: 0.95rem;
    color: #000;
    white-space: nowrap;
  }
  .vlabel.up {
    transform: rotate(180deg);
  }

  .switch {
    display: flex;
    gap: 0.25rem;
    padding: 0.2rem;
    background: var(--aga-pink-band);
    border-radius: 0.5rem;
  }
  .switch button {
    flex: 1 1 0;
    min-height: 2.6rem;
    border: 0;
    border-radius: 0.35rem;
    background: transparent;
    font: inherit;
    font-size: 0.85rem;
    font-weight: 600;
    line-height: 1.15;
    color: var(--aga-ink);
    cursor: pointer;
  }
  .switch button.on {
    background: var(--aga-paper);
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.15);
  }
  .switch button:focus-visible {
    outline: 2px solid var(--aga-lake);
  }
  .hband {
    display: grid;
    grid-template-columns: 1fr minmax(0, 11rem) 1fr;
    align-items: center;
    gap: 0.4rem;
    margin: 0.55rem 0 0.25rem;
    font-size: 0.8rem;
    font-weight: 600;
    line-height: 1.15;
  }
  .hband span:first-child {
    text-align: right;
  }
  .hband img {
    width: 100%;
    height: auto;
  }
  .stack {
    display: grid;
  }
  .stack > :global(*) {
    grid-area: 1 / 1;
  }
  .hidden {
    visibility: hidden;
  }

  .readout {
    margin: 0.4rem 0 0;
    min-height: 1.6em;
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    justify-content: center;
    font-family: var(--aga-font);
    font-size: 0.85rem;
  }
  .chip {
    padding: 0.15rem 0.6rem;
    border-radius: 999px;
    background: var(--aga-panel);
  }
</style>
