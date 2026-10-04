<script lang="ts">
  /**
   * The supplement's version of the poster's results chart (AssocChart): one row per metric, one
   * panel per outcome, every value a directional association on −1..+1. Each cell draws the marks
   * it is given. On a phone the panels become tabs; picking a row shows its exact values below.
   * An optional side panel shows one ordinary correlation per row (e.g. with latitude).
   */
  import { onMount } from 'svelte';
  import { C, tint } from '../theme';
  import type { RowSpec, ColSpec, Detail, ChartSpec } from './types';

  let {
    id,
    rows,
    headers = {},
    cols,
    marks,
    colour,
    ceiling = () => null,
    side,
    legend,
    detail,
    minWide = 700
  }: ChartSpec = $props();

  const label = (r: RowSpec) => `${r.number}  ${r.name}`;
  const oneLine = (s: string) => s.replace('\n', ' ');
  const FAINT = tint(C.rule, 0.5);
  const TICKS: [number, string][] = [
    [-1, '−1'],
    [-0.5, '−0.5'],
    [0, '0'],
    [0.5, '+0.5'],
    [1, '+1']
  ];

  // rows top to bottom, in row units: a header above a headed group, a gap between groups
  const layout = $derived.by(() => {
    let y = 0;
    let prev: string | null = null;
    const ypos: Record<string, number> = {};
    const heads: { y: number; text: string; cls: string }[] = [];
    const rules: number[] = [];
    for (const r of rows) {
      if (r.group !== prev) {
        if (prev !== null) {
          y -= 0.35;
          rules.push(y + 0.5 + 0.35 / 2);
        }
        if (headers[r.group]) {
          heads.push({ y, text: headers[r.group], cls: r.cls });
          y -= 0.75;
        }
      }
      ypos[r.key] = y;
      y -= 1;
      prev = r.group;
    }
    const all = [...Object.values(ypos), ...heads.map((h) => h.y)];
    return { ypos, heads, rules, top: Math.max(...all) + 0.55, bottom: Math.min(...all) - 0.7 };
  });

  let width = $state(328);
  let tab = $state(0);
  const wide = $derived(width >= minWide);
  const shown = $derived(wide ? cols : [cols[Math.min(tab, cols.length - 1)]]);
  /** The side panel needs the room of a wide chart; on a phone its values are in the read-out. */
  const sided = $derived(!!side && wide);

  const fs = $derived(wide ? 13.5 : 12.5);
  const rowPx = $derived(wide ? 27 : 26);
  const top = $derived(wide ? 44 : 10);
  const AXIS = 34;
  const plotH = $derived((layout.top - layout.bottom) * rowPx);
  const height = $derived(top + plotH + AXIS);
  const GAP = $derived(wide ? 22 : 16);
  const PAD_L = 12;
  const PAD_R = 14;
  const sideW = $derived(sided ? 104 : 0);

  let labelW = $state(120);
  function measure() {
    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) return;
    let w = 0;
    ctx.font = `400 ${fs}px "Atkinson Hyperlegible Next", "Source Sans 3", sans-serif`;
    for (const r of rows) w = Math.max(w, ctx.measureText(label(r)).width);
    ctx.font = `600 ${fs * 0.9}px "Atkinson Hyperlegible Next", sans-serif`;
    for (const h of layout.heads) w = Math.max(w, ctx.measureText(h.text).width);
    labelW = Math.ceil(w) + 6;
  }
  onMount(() => {
    document.fonts?.ready.then(measure);
  });
  $effect(() => {
    void fs;
    void rows;
    if (typeof document !== 'undefined') measure();
  });

  const sideX0 = $derived(labelW + PAD_L);
  const plotX0 = $derived(sideX0 + (sided ? sideW + GAP : 0));
  const panelW = $derived((width - plotX0 - PAD_R - GAP * (shown.length - 1)) / shown.length);
  const x0 = (k: number) => plotX0 + k * (panelW + GAP);
  const xs = (k: number, v: number) => x0(k) + ((v + 1) / 2) * panelW;
  const sx = (v: number) => sideX0 + ((v + 1) / 2) * sideW;
  const ys = (y: number) => top + (layout.top - y) * rowPx;
  const base = $derived(top + plotH);
  const ok = (v: number | null | undefined): v is number => v != null && Number.isFinite(v);

  let picked: string | null = $state(null);
  let hover: string | null = $state(null);
  const selected = $derived(rows.find((r) => r.key === picked) ?? null);
  function pick(key: string) {
    picked = picked === key ? null : key;
  }
  function keypick(e: KeyboardEvent, key: string) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      pick(key);
    }
  }
</script>

<div class="chart" bind:clientWidth={width}>
  {#if !wide && cols.length > 1}
    <div class="tabs" role="tablist" aria-label="Outcome">
      {#each cols as c, k}
        <button role="tab" aria-selected={tab === k} class:on={tab === k} onclick={() => (tab = k)}>{oneLine(c.title)}</button>
      {/each}
    </div>
  {/if}

  <div class="stage">
    <svg {width} {height} viewBox="0 0 {width} {height}" aria-hidden="true" class="plot">
      {#each rows as r}
        {#if r.key === picked || r.key === hover}
          <rect x="0" y={ys(layout.ypos[r.key]) - rowPx / 2} {width} height={rowPx} fill={r.key === picked ? C.panel : tint(C.panel, 0.5)} />
        {/if}
      {/each}

      {#each layout.heads as h}
        <text x={labelW} y={ys(h.y)} text-anchor="end" dominant-baseline="central" font-size={fs * 0.9} font-weight="600" fill={colour(rows.find((r) => r.cls === h.cls)!)}>{h.text}</text>
      {/each}
      {#each rows as r}
        <text
          x={labelW}
          y={ys(layout.ypos[r.key])}
          text-anchor="end"
          dominant-baseline="central"
          font-size={fs}
          font-weight={r.key === picked ? 700 : 400}
          fill={C.ink}
          class="pre">{label(r)}</text
        >
      {/each}

      {#if side && sided}
        <text x={sx(0)} y={top - 26} text-anchor="middle" font-size={fs - 1} fill={C.ink}>
          {#each side.title.split('\n') as line, j}
            <tspan x={sx(0)} dy={j === 0 ? 0 : fs}>{line}</tspan>
          {/each}
        </text>
        {#each layout.rules as y}
          <line x1={sideX0} x2={sideX0 + sideW} y1={ys(y)} y2={ys(y)} stroke={FAINT} />
        {/each}
        <line x1={sx(0)} x2={sx(0)} y1={top} y2={base} stroke={C.softInk} stroke-width="1.3" />
        {#each rows as r}
          {@const v = side.values[r.key]}
          {#if ok(v)}
            <rect
              x={Math.min(sx(0), sx(v))}
              y={ys(layout.ypos[r.key]) - rowPx * 0.28}
              width={Math.abs(sx(v) - sx(0))}
              height={rowPx * 0.56}
              fill={colour(r)}
              fill-opacity="0.55"
            />
          {/if}
        {/each}
        <line x1={sideX0} x2={sideX0 + sideW} y1={base} y2={base} stroke={C.rule} stroke-width="1.3" />
        {#each [[-1, '−1'], [0, '0'], [1, '+1']] as [v, lab]}
          <line x1={sx(+v)} x2={sx(+v)} y1={base} y2={base + 5} stroke={C.rule} stroke-width="1.3" />
          <text x={sx(+v)} y={base + 19} text-anchor="middle" font-size={fs - 0.5} fill={C.ink}>{lab}</text>
        {/each}
      {/if}

      {#each shown as c, k (c.id)}
        {#if wide}
          <text x={xs(k, 0)} y={top - 26} text-anchor="middle" font-size={fs + 0.5} fill={C.ink}>
            {#each c.title.split('\n') as line, j}
              <tspan x={xs(k, 0)} dy={j === 0 ? 0 : fs + 2}>{line}</tspan>
            {/each}
          </text>
        {/if}
        {#each layout.rules as y}
          <line x1={x0(k)} x2={x0(k) + panelW} y1={ys(y)} y2={ys(y)} stroke={FAINT} />
        {/each}
        {@const lim = ceiling(c)}
        {#if lim != null}
          {#each [-lim, lim] as v}
            <line x1={xs(k, v)} x2={xs(k, v)} y1={top} y2={base} stroke={C.softInk} stroke-width="1.3" stroke-dasharray="2 3.25" />
          {/each}
        {/if}
        <line x1={xs(k, 0)} x2={xs(k, 0)} y1={top} y2={base} stroke={C.softInk} stroke-width="1.3" />

        {#each rows as r}
          {@const y = ys(layout.ypos[r.key])}
          {@const col = colour(r)}
          {#each marks(r, c) as m}
            {#if m.kind === 'band' && ok(m.lo) && ok(m.hi)}
              <rect x={xs(k, m.lo)} y={y - 4.5} width={Math.max(xs(k, m.hi) - xs(k, m.lo), 2)} height="9" rx="4.5" fill={col} fill-opacity="0.22" />
            {:else if m.kind === 'ci' && ok(m.lo) && ok(m.hi)}
              <line x1={xs(k, m.lo)} x2={xs(k, m.hi)} y1={y} y2={y} stroke={col} stroke-width="2.2" />
            {:else if m.kind === 'dot' && ok(m.v)}
              <circle cx={xs(k, m.v)} cy={y} r="5.5" fill={col} stroke={C.paper} stroke-width="1.2" />
            {:else if m.kind === 'hollow' && ok(m.v)}
              <circle cx={xs(k, m.v)} cy={y} r="4.9" fill={C.paper} stroke={col} stroke-width="1.9" />
            {:else if m.kind === 'cross' && ok(m.v)}
              {@const x = xs(k, m.v)}
              <path d="M{x - 4} {y - 4}L{x + 4} {y + 4}M{x - 4} {y + 4}L{x + 4} {y - 4}" stroke={C.ink} stroke-width="1.7" />
            {:else if m.kind === 'plus' && ok(m.v)}
              {@const x = xs(k, m.v)}
              <path d="M{x - 4.6} {y}H{x + 4.6}M{x} {y - 4.6}V{y + 4.6}" stroke={C.ink} stroke-width="1.7" />
            {:else if m.kind === 'diamond' && ok(m.v)}
              {@const x = xs(k, m.v)}
              <path d="M{x} {y - 5.4}L{x + 5.4} {y}L{x} {y + 5.4}L{x - 5.4} {y}Z" fill="none" stroke={C.ink} stroke-width="1.6" />
            {/if}
          {/each}
        {/each}

        <line x1={xs(k, -1)} x2={xs(k, 1)} y1={base} y2={base} stroke={C.rule} stroke-width="1.3" />
        {#each TICKS as [v, lab]}
          <line x1={xs(k, v)} x2={xs(k, v)} y1={base} y2={base + 5} stroke={C.rule} stroke-width="1.3" />
          <text x={xs(k, v)} y={base + 19} text-anchor="middle" font-size={fs - 0.5} fill={C.ink}>{lab}</text>
        {/each}
      {/each}
    </svg>

    {#if detail}
      <div class="hits">
        {#each rows as r}
          <div
            class="hit"
            role="button"
            tabindex="0"
            aria-pressed={r.key === picked}
            aria-label="{label(r)}: show values"
            style:top="{ys(layout.ypos[r.key]) - rowPx / 2}px"
            style:height="{rowPx}px"
            onclick={() => pick(r.key)}
            onkeydown={(e) => keypick(e, r.key)}
            onpointerenter={() => (hover = r.key)}
            onpointerleave={() => (hover = null)}
          ></div>
        {/each}
      </div>
    {/if}
  </div>

  <p class="xlabel" style:margin-left={wide ? `${plotX0}px` : null} style:margin-right={wide ? `${PAD_R}px` : null}>
    Directional association (−Spearman ρ)<br />← opposite direction · expected direction →
  </p>

  <ul class="legend" class:row={wide}>
    {#each legend.filter((l) => l.kind !== 'side' || sided) as l}
      <li>
        <svg width="34" height="14" aria-hidden="true">
          {#if l.kind === 'dot'}
            <circle cx="17" cy="7" r="4.8" fill={C.softInk} />
          {:else if l.kind === 'hollow'}
            <circle cx="17" cy="7" r="4.3" fill={C.paper} stroke={C.softInk} stroke-width="1.8" />
          {:else if l.kind === 'ci'}
            <line x1="2" x2="32" y1="7" y2="7" stroke={C.softInk} stroke-width="2.2" /><circle cx="22" cy="7" r="4.6" fill={C.softInk} stroke={C.paper} />
          {:else if l.kind === 'band'}
            <rect x="2" y="2.5" width="30" height="9" rx="4.5" fill={C.softInk} fill-opacity="0.22" /><circle cx="20" cy="7" r="4.6" fill={C.softInk} stroke={C.paper} />
          {:else if l.kind === 'cross'}
            <path d="M13 3L21 11M13 11L21 3" stroke={C.ink} stroke-width="1.7" />
          {:else if l.kind === 'plus'}
            <path d="M12 7H22M17 2V12" stroke={C.ink} stroke-width="1.7" />
          {:else if l.kind === 'diamond'}
            <path d="M17 1.8L22.2 7L17 12.2L11.8 7Z" fill="none" stroke={C.ink} stroke-width="1.6" />
          {:else if l.kind === 'ceiling'}
            <line x1="2" x2="32" y1="7" y2="7" stroke={C.softInk} stroke-width="1.3" stroke-dasharray="2 3.25" />
          {:else if l.kind === 'side'}
            <rect x="9" y="3" width="16" height="8" fill={C.softInk} fill-opacity="0.55" />
          {/if}
        </svg>{l.label}
      </li>
    {/each}
  </ul>

  {#if detail && selected}
    {@const d = detail(selected)}
    <div class="detail" aria-live="polite">
      <div class="dhead">
        <span class="dname" style:color={colour(selected)}>{label(selected)}</span>
        <button class="x" aria-label="Clear the picked row" onclick={() => (picked = null)}>×</button>
      </div>
      <div class="scroll">
        <table>
          <thead>
            <tr>
              <th></th>
              {#each d.head as h}<th scope="col">{h}</th>{/each}
            </tr>
          </thead>
          <tbody>
            {#each d.rows as [name, values]}
              <tr>
                <th scope="row">{name}</th>
                {#each values as v}<td>{v}</td>{/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      {#if d.note}<p class="dnote">{d.note}</p>{/if}
    </div>
  {/if}

  {#if detail}
    <div class="visually-hidden">
      <table aria-label="{id}: values">
        <tbody>
          {#each rows as r}
            {@const d = detail(r)}
            {#each d.rows as [name, values]}
              <tr>
                <th scope="row">{label(r)}, {name}</th>
                {#each values as v, j}<td>{d.head[j]}: {v}</td>{/each}
              </tr>
            {/each}
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<style>
  .chart {
    position: relative;
    width: 100%;
    font-family: var(--aga-font);
    color: var(--aga-ink);
  }
  .plot {
    display: block;
    max-width: 100%;
    height: auto;
    font-family: var(--aga-font);
    overflow: visible;
  }
  .pre {
    white-space: pre;
  }
  .stage {
    position: relative;
  }
  .hits {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .hit {
    position: absolute;
    left: 0;
    right: 0;
    cursor: pointer;
    pointer-events: auto;
    -webkit-tap-highlight-color: transparent;
    border-radius: 3px;
  }
  .hit:focus-visible {
    outline: 2px solid var(--aga-lake);
    outline-offset: -2px;
  }

  .tabs {
    display: flex;
    gap: 0.25rem;
    margin: 0 0 0.5rem;
    padding: 0.2rem;
    background: var(--aga-panel);
    border-radius: 0.5rem;
  }
  .tabs button {
    flex: 1 1 0;
    min-height: 2.6rem;
    padding: 0.3rem 0.35rem;
    border: 0;
    border-radius: 0.35rem;
    background: transparent;
    font: inherit;
    font-size: 0.8rem;
    line-height: 1.15;
    color: var(--aga-soft-ink);
    cursor: pointer;
  }
  .tabs button.on {
    background: var(--aga-paper);
    color: var(--aga-ink);
    font-weight: 700;
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.12);
  }
  .tabs button:focus-visible {
    outline: 2px solid var(--aga-lake);
  }

  .xlabel {
    margin-top: 0.15rem;
    margin-bottom: 0.6rem;
    text-align: center;
    font-size: 0.86rem;
    line-height: 1.3;
  }
  .legend {
    list-style: none;
    width: fit-content;
    max-width: 100%;
    margin: 0 auto 0.25rem;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    font-size: 0.8rem;
    line-height: 1.25;
  }
  .legend.row {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.25rem 1.2rem;
  }
  .legend li {
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }
  .legend svg {
    flex: none;
  }

  .detail {
    margin-top: 0.75rem;
    border: 1px solid var(--aga-rule);
    border-radius: 0.5rem;
    padding: 0.6rem 0.7rem 0.5rem;
    background: var(--aga-paper);
  }
  .dhead {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 0.35rem;
  }
  .dname {
    font-weight: 700;
    white-space: pre;
  }
  .x {
    border: 0;
    background: none;
    font-size: 1.4rem;
    line-height: 1;
    width: 2rem;
    height: 2rem;
    color: var(--aga-soft-ink);
    cursor: pointer;
  }
  .scroll {
    overflow-x: auto;
  }
  .detail table {
    border-collapse: collapse;
    font-size: 0.8rem;
    width: 100%;
  }
  .detail th,
  .detail td {
    padding: 0.25rem 0.4rem;
    text-align: right;
    vertical-align: bottom;
    font-variant-numeric: tabular-nums;
  }
  .detail thead th {
    font-weight: 600;
    color: var(--aga-soft-ink);
    line-height: 1.15;
  }
  .detail tbody th {
    text-align: left;
    font-weight: 400;
    color: var(--aga-soft-ink);
  }
  .detail tbody tr + tr {
    border-top: 1px solid var(--aga-panel);
  }
  .dnote {
    margin-top: 0.4rem !important;
    font-size: 0.8rem;
    color: var(--aga-soft-ink);
  }
</style>
