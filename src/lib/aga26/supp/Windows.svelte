<script lang="ts">
  /**
   * The census windows behind the outcomes, under the poster's drought index (the bars of its
   * timeline, pipeline/outcomes/drought_index.csv): each census interval from its start year to the
   * next census, coloured by the window it belongs to; the years the offsets' drought climate
   * averages; and the three extirpations.
   */
  import { C } from '../theme';
  import { signed } from '../format';
  import S from '../data/supplement.json';

  const W = S.windows;
  const WINDOW: Record<string, { label: string; colour: string }> = {
    pre: { label: 'pre-drought', colour: C.sky },
    drought: { label: 'drought', colour: C.amber },
    recovery: { label: 'recovery', colour: C.spruce }
  };
  const intervals = W.years.slice(0, -1).map((y) => {
    const w = Object.keys(W.windows).find((k) => (W.windows as Record<string, number[]>)[k].includes(y));
    return { y, w: w ?? null };
  });
  const runs = Object.keys(WINDOW).map((k) => {
    const ys = intervals.filter((i) => i.w === k).map((i) => i.y);
    return { k, from: Math.min(...ys), to: Math.max(...ys) + 1 };
  });

  let width = $state(328);
  let picked: number | null = $state(null);
  const LEFT = 44;
  const RIGHT = 10;
  const TOP = 12;
  const XLIM = [W.years[0] - 0.6, W.years[W.years.length - 1] + 0.6];
  const YLIM = [-1.15, 1.15];
  const dH = $derived(Math.max(130, Math.min(190, width * 0.3)));
  const iY = $derived(TOP + dH + 40);
  const sY = $derived(iY + 44);
  const eY = $derived(sY + 34);
  const base = $derived(eY + 16);
  const height = $derived(base + 26);
  const x = (v: number) => LEFT + ((v - XLIM[0]) / (XLIM[1] - XLIM[0])) * (width - LEFT - RIGHT);
  const y = (v: number) => TOP + ((YLIM[1] - v) / (YLIM[1] - YLIM[0])) * dH;
  const narrow = $derived(width < 480);
  const bar = $derived(picked == null ? null : { y: picked, v: W.index[W.years.indexOf(picked)] });
  function key(e: KeyboardEvent, year: number) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      picked = picked === year ? null : year;
    }
  }
</script>

<figure class="windows" bind:clientWidth={width}>
  <svg {width} {height} viewBox="0 0 {width} {height}" fill={C.ink} role="group" aria-label="Drought index by year, the census windows, and the offsets’ drought climate">
    <!-- drought index -->
    <line x1={LEFT} x2={LEFT} y1={y(YLIM[0])} y2={y(YLIM[1])} stroke={C.rule} stroke-width="1.3" />
    {#each [[-1, '−1'], [0, '0'], [1, '1']] as [v, lab]}
      <line x1={LEFT - 5} x2={LEFT} y1={y(+v)} y2={y(+v)} stroke={C.rule} stroke-width="1.3" />
      <text x={LEFT - 8} y={y(+v)} text-anchor="end" dominant-baseline="central" class="t12">{lab}</text>
    {/each}
    <text transform="translate(12 {TOP + dH / 2}) rotate(-90)" text-anchor="middle" dominant-baseline="central" class="t12">drought index</text>
    <line x1={LEFT} x2={width - RIGHT} y1={y(0)} y2={y(0)} stroke={C.rule} stroke-width="1" />
    {#each W.years as yr, k}
      {@const v = W.index[k]}
      <rect
        x={x(yr - 0.31)}
        y={Math.min(y(0), y(v))}
        width={x(yr + 0.31) - x(yr - 0.31)}
        height={Math.abs(y(v) - y(0))}
        fill={v > 0 ? C.carnelian : C.lake}
        stroke={picked === yr ? C.ink : 'none'}
        stroke-width="1.5"
      />
      <rect
        x={x(yr - 0.5)}
        y={TOP}
        width={x(yr + 0.5) - x(yr - 0.5)}
        height={dH}
        fill="transparent"
        role="button"
        tabindex="0"
        aria-label="{yr}: drought index {signed(v)}"
        aria-pressed={picked === yr}
        class="hit"
        onclick={() => (picked = picked === yr ? null : yr)}
        onkeydown={(e) => key(e, yr)}
      />
    {/each}

    <!-- census intervals, start year to the next census -->
    <text x={LEFT} y={iY - 24} class="t12 lab">census intervals (outcome windows)</text>
    {#each runs as r}
      <text x={(x(r.from) + x(r.to)) / 2} y={iY - 9} text-anchor="middle" fill={WINDOW[r.k].colour} class="t12 b"
        >{WINDOW[r.k].label}</text
      >
    {/each}
    {#each intervals as i}
      {@const col = i.w ? WINDOW[i.w].colour : C.rule}
      <line x1={x(i.y) + 2.5} x2={x(i.y + 1) - 2.5} y1={iY} y2={iY} stroke={col} stroke-width="6" stroke-linecap="round" />
      {#if !narrow}
        <circle cx={x(i.y) + 2.5} cy={iY} r="1.8" fill={C.paper} />
      {/if}
    {/each}

    <!-- the offsets' drought climate -->
    <text x={LEFT} y={sY - 12} class="t12 lab">offsets’ drought climate (mean annual anomaly)</text>
    <path
      d="M{x(W.scenario[0] - 0.4)} {sY + 5}V{sY}H{x(W.scenario[W.scenario.length - 1] + 0.4)}V{sY + 5}"
      fill="none"
      stroke={C.ink}
      stroke-width="1.6"
    />

    <!-- extirpations -->
    {#each W.extirpation_years as yr}
      <path d="M{x(yr) - 6.5} {eY - 5.5}H{x(yr) + 6.5}L{x(yr)} {eY + 6.5}Z" fill={C.carnelian} />
    {/each}
    <text x={x(W.extirpation_years[W.extirpation_years.length - 1]) + 12} y={eY} dominant-baseline="central" fill={C.carnelian} class="t12">extirpations</text>

    <!-- years -->
    <line x1={LEFT} x2={width - RIGHT} y1={base} y2={base} stroke={C.rule} stroke-width="1.3" />
    {#each W.years as yr}
      {#if !narrow || yr % 2 === 0}
        <line x1={x(yr)} x2={x(yr)} y1={base} y2={base + 5} stroke={C.rule} stroke-width="1.3" />
        <text x={x(yr)} y={base + 19} text-anchor="middle" class="t12">{yr}</text>
      {/if}
    {/each}
  </svg>
  <p class="readout" aria-live="polite">
    {#if bar}{bar.y}: drought index <b>{signed(bar.v)}</b>{:else}&nbsp;{/if}
  </p>
</figure>

<style>
  .windows {
    margin: 0;
    width: 100%;
    font-family: var(--aga-font);
  }
  svg {
    display: block;
    max-width: 100%;
    height: auto;
    overflow: visible;
  }
  .t12 {
    font-size: 12px;
  }
  .lab {
    fill: var(--aga-soft-ink);
  }
  .b {
    font-weight: 700;
  }
  .hit {
    cursor: pointer;
    outline: none;
  }
  .hit:focus-visible {
    stroke: var(--aga-lake);
    stroke-width: 2;
  }
  .readout {
    margin: 0.1rem 0 0;
    min-height: 1.3em;
    font-size: 0.85rem;
    text-align: center;
  }
</style>
