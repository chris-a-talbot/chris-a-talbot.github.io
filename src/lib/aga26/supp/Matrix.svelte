<script lang="ts">
  /**
   * Backup figure 6, poster rows only: Spearman ρ between every pair of metrics' rankings of the 15
   * populations, in the figure's clustered order. Boxes join metrics that the pipeline's
   * redundancy clustering (Hmisc::varclus, complete linkage, cut at ρ = 0.90) puts in one cluster.
   */
  import { C, tint } from '../theme';
  import { signed } from '../format';
  import { S, row, colour } from './data';

  const M = S.matrix;
  const rows = M.keys.map((k) => row(k));
  const n = rows.length;
  /** Runs of consecutive metrics in one cluster, as [first, last] indices. */
  const boxes: [number, number][] = [];
  for (let i = 0; i < n; ) {
    let j = i;
    while (j + 1 < n && M.cluster[j + 1] === M.cluster[i]) j++;
    if (j > i) boxes.push([i, j]);
    i = j + 1;
  }
  const fill = (v: number) => (v >= 0 ? tint(C.amber, 0.12 + 0.88 * v) : tint(C.heather, 0.12 + 0.6 * -v));

  let width = $state(328);
  let hover: [number, number] | null = $state(null);
  const labelW = $derived(width < 520 ? 168 : 196);
  const cellPx = $derived(Math.max(20, Math.min(54, (width - labelW - 8) / n)));
  const fs = $derived(cellPx >= 44 ? 13 : cellPx >= 34 ? 11 : 0);
  const top = 30;
  const height = $derived(top + n * cellPx + 4);
  const cx = (j: number) => labelW + j * cellPx;
  const cy = (i: number) => top + i * cellPx;
  const svgW = $derived(labelW + n * cellPx + 4);
</script>

<div class="matrix" bind:clientWidth={width}>
  <svg width={svgW} {height} viewBox="0 0 {svgW} {height}" role="group" aria-label="Rank correlations between the metrics">
    {#each rows as r, j}
      <text x={cx(j) + cellPx / 2} y={top - 9} text-anchor="middle" font-size="12.5" font-weight="700" fill={colour(r)}>{r.number}</text>
    {/each}
    {#each rows as r, i}
      <text x={labelW - 8} y={cy(i) + cellPx / 2} text-anchor="end" dominant-baseline="central" font-size={width < 520 ? 12 : 13} fill={C.ink} class="pre"
        >{r.number}  {r.name}</text
      >
      {#each rows as c, j}
        {#if j <= i}
          {@const v = M.rho[i][j] as number}
          <rect
            x={cx(j) + 1}
            y={cy(i) + 1}
            width={cellPx - 2}
            height={cellPx - 2}
            fill={i === j ? C.paper : fill(v)}
            stroke={hover && hover[0] === i && hover[1] === j ? C.ink : 'none'}
            stroke-width="1.5"
            role="img"
            aria-label="{r.name} and {c.name}: ρ {signed(v)}"
            onpointerenter={() => (hover = [i, j])}
            onpointerleave={() => (hover = null)}
          />
          {#if i === j}
            <circle cx={cx(j) + cellPx / 2} cy={cy(i) + cellPx / 2} r={Math.min(9, cellPx / 3)} fill={colour(r)} />
          {:else if fs}
            <text
              x={cx(j) + cellPx / 2}
              y={cy(i) + cellPx / 2 + 0.5}
              text-anchor="middle"
              dominant-baseline="central"
              font-size={fs}
              font-weight={Math.abs(v) >= 0.5 ? 700 : 400}
              fill={v >= 0.6 ? C.paper : C.ink}
              class="v">{v.toFixed(2).replace('-', '−')}</text
            >
          {/if}
        {/if}
      {/each}
    {/each}
    {#each boxes as [a, b]}
      <rect x={cx(a)} y={cy(a)} width={(b - a + 1) * cellPx} height={(b - a + 1) * cellPx} fill="none" stroke={C.ink} stroke-width="2.4" />
    {/each}
  </svg>
  <p class="readout" aria-live="polite">
    {#if hover && hover[0] !== hover[1]}
      <b>{rows[hover[0]].name}</b> and <b>{rows[hover[1]].name}</b>: ρ = {signed(M.rho[hover[0]][hover[1]] as number)}
    {:else}&nbsp;{/if}
  </p>
</div>

<style>
  .matrix {
    width: 100%;
    overflow-x: auto;
    font-family: var(--aga-font);
  }
  svg {
    display: block;
    margin: 0 auto;
    overflow: visible;
  }
  .pre {
    white-space: pre;
  }
  .v {
    pointer-events: none;
    font-variant-numeric: tabular-nums;
  }
  .readout {
    margin: 0.2rem 0 0;
    min-height: 1.3em;
    font-size: 0.85rem;
    text-align: center;
  }
</style>
