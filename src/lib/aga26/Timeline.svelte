<script lang="ts">
  /**
   * The poster's timeline (fig01b, poster_offset/fig01_setting.timeline_figure): the drought
   * index as bars, drier carnelian and wetter lake, the 2012–2015 drought shaded amber; below,
   * what was measured when, and the three extirpations. Values: data/timeline.json, read from
   * pipeline/outcomes/drought_index.csv. Labels sit above their spans so they fit a phone.
   */
  import { C } from './theme';
  import { signed } from './format';
  import T from './data/timeline.json';

  let width = $state(328);
  let picked: number | null = $state(null);

  const LEFT = 44;
  const RIGHT = 8;
  const TOP = 24;
  const dH = $derived(Math.max(140, Math.min(200, width * 0.36)));
  const sTop = $derived(TOP + dH + 14);
  const ROW = 27;
  const rowY = (r: number) => sTop + 20 + (3 - r) * ROW;
  const base = $derived(rowY(0) + 14);
  const height = $derived(base + 42);

  const x = (v: number) => LEFT + ((v - T.xlim[0]) / (T.xlim[1] - T.xlim[0])) * (width - LEFT - RIGHT);
  const y = (v: number) => TOP + ((T.ylim[1] - v) / (T.ylim[1] - T.ylim[0])) * dH;

  const LABELS = [
    { text: 'baseline genomes', n: '(n=55)', colour: C.lake },
    { text: 'temporal genomes', n: '(n=12)', colour: C.sky },
    { text: 'temporal demography', n: '(n=19)', colour: C.softInk }
  ];
  const YEARS = [2007, 2009, 2011, 2013, 2015, 2017, 2019];
  const bar = $derived(T.bars.find((b) => b.year === picked) ?? null);

  function key(e: KeyboardEvent, year: number) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      picked = picked === year ? null : year;
    }
  }
</script>

<figure class="timeline" bind:clientWidth={width}>
  <svg {width} {height} viewBox="0 0 {width} {height}" fill={C.ink} role="group" aria-label="Drought index by year, 2010 to 2019, and what was measured when">
    <!-- the drought, shaded across both panels -->
    {#each [[TOP, TOP + dH], [sTop, base]] as [a, b]}
      <rect x={x(T.drought[0])} y={a} width={x(T.drought[1]) - x(T.drought[0])} height={b - a} fill={C.amber} fill-opacity="0.1" />
    {/each}
    <text x={(x(T.drought[0]) + x(T.drought[1])) / 2} y={TOP + 13} text-anchor="middle" class="t12">‘mega-drought’</text>

    <!-- drought index -->
    <line x1={LEFT} x2={LEFT} y1={y(T.ylim[0])} y2={y(T.ylim[1])} stroke={C.rule} stroke-width="1.3" />
    {#each [[-1, '−1'], [0, '0'], [1, '1']] as [v, lab]}
      <line x1={LEFT - 5} x2={LEFT} y1={y(+v)} y2={y(+v)} stroke={C.rule} stroke-width="1.3" />
      <text x={LEFT - 8} y={y(+v)} text-anchor="end" dominant-baseline="central" class="t12">{lab}</text>
    {/each}
    <text transform="translate(12 {TOP + dH / 2}) rotate(-90)" text-anchor="middle" dominant-baseline="central" class="t12">drought index</text>
    <line x1={LEFT} x2={width - RIGHT} y1={y(0)} y2={y(0)} stroke={C.rule} stroke-width="1" />
    {#each T.bars as b}
      {@const x0 = x(b.year - 0.31)}
      {@const w = x(b.year + 0.31) - x0}
      <rect
        x={x0}
        y={Math.min(y(0), y(b.index))}
        width={w}
        height={Math.abs(y(b.index) - y(0))}
        fill={b.index > 0 ? C.carnelian : C.lake}
        stroke={picked === b.year ? C.ink : 'none'}
        stroke-width="1.5"
      />
      <rect
        x={x(b.year - 0.5)}
        y={TOP}
        width={x(b.year + 0.5) - x(b.year - 0.5)}
        height={dH}
        fill="transparent"
        role="button"
        tabindex="0"
        aria-label="{b.year}: drought index {signed(b.index)}"
        aria-pressed={picked === b.year}
        class="hit"
        onclick={() => (picked = picked === b.year ? null : b.year)}
        onkeydown={(e) => key(e, b.year)}
      />
    {/each}

    <!-- what was measured when -->
    {#each T.spans as s, i}
      {@const ry = rowY(3 - i)}
      <line x1={x(s.start)} x2={x(s.end)} y1={ry} y2={ry} stroke={s.colour} stroke-width="5" />
      <text x={x(s.start)} y={ry - 8} fill={LABELS[i].colour} class="t12"
        >{LABELS[i].text} <tspan class="t11">{LABELS[i].n}</tspan></text
      >
    {/each}
    {#each T.extirpations as yr}
      <path d="M{x(yr) - 6.5} {rowY(0) - 5.5}H{x(yr) + 6.5}L{x(yr)} {rowY(0) + 6.5}Z" fill={C.carnelian} />
    {/each}
    <text x={x(T.extirpations[0]) - 12} y={rowY(0)} text-anchor="end" dominant-baseline="central" fill={C.carnelian} class="t12">extirpations</text>

    <line x1={LEFT} x2={width - RIGHT} y1={base} y2={base} stroke={C.rule} stroke-width="1.3" />
    {#each YEARS as yr}
      <line x1={x(yr)} x2={x(yr)} y1={base} y2={base + 5} stroke={C.rule} stroke-width="1.3" />
      <text x={x(yr)} y={base + 19} text-anchor="middle" class="t12">{yr}</text>
    {/each}
    <text x={(LEFT + width - RIGHT) / 2} y={base + 36} text-anchor="middle" class="t12">year</text>
  </svg>
  <p class="readout" aria-live="polite">
    {#if bar}{bar.year}: drought index <b>{signed(bar.index)}</b>{:else}&nbsp;{/if}
  </p>
</figure>

<style>
  .timeline {
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
  .t11 {
    font-size: 11px;
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
    color: var(--aga-ink);
  }
</style>
