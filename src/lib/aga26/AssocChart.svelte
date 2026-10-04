<script lang="ts">
  /**
   * Figures 9 and 10 of the poster, drawn from the poster's own numbers (data/fig09.json,
   * data/fig10.json, written by poster_offset/web_export.py and checked there against the
   * figures' TSVs). Marks follow fig09_association.py / fig10_benchmark.py:
   *   assoc   −ρ dot with its 95% bootstrap interval (omitted where the poster omits it),
   *           × adjusted for latitude, + adjusted for pre-drought growth
   *   bench   one tick per matched random-locus set (alpha 0.10, so agreeing sets darken),
   *           the candidate-locus dot, a ring where the poster rings it, a dash where the
   *           benchmark was not evaluated, an ink bar where every set gives one value
   * Wide screens show the three outcomes side by side, as on the poster; narrow screens show
   * one at a time behind tabs. Picking a row shows its exact values below the chart.
   */
  import { onMount } from 'svelte';
  import { C, CLASS_COLOUR, tint } from './theme';
  import { signed, pval, interval } from './format';
  import { mainLayout, rowLabel, type Row } from './rows';
  import { ui } from './state.svelte';

  interface Arm {
    arm: number;
    title: string;
  }
  // The JSON's shape is fixed by web_export.py; cells are read loosely.
  let { data, kind, id }: { data: any; kind: 'assoc' | 'bench'; id: string } = $props();

  const arms: Arm[] = $derived(data.arms);
  const rows: Row[] = $derived(data.rows);
  const L = $derived(mainLayout(rows, data.groups));
  const RMAX: number = $derived(data.rho_max_persistence);
  const FAINT = tint(C.rule, 0.5);
  const TICKS: [number, string][] = [
    [-1, '−1'],
    [-0.5, '−0.5'],
    [0, '0'],
    [0.5, '+0.5'],
    [1, '+1']
  ];
  const oneLine = (s: string) => s.replace('\n', ' ');

  let width = $state(328);
  const wide = $derived(width >= 700);
  const shown = $derived(wide ? arms : arms.filter((a) => a.arm === ui.arm));

  const fs = $derived(wide ? 13.5 : 12.5);
  const rowPx = $derived(wide ? 27 : 26);
  const top = $derived(wide ? 44 : 10);
  const AXIS = 34;
  const plotH = $derived((L.top - L.bottom) * rowPx);
  const height = $derived(top + plotH + AXIS);
  const GAP = 22;
  const PAD_L = 12;
  const PAD_R = 14;

  // The label column is as wide as its longest label, measured once the poster's face loads.
  let labelW = $state(estimate(12.5));
  function estimate(size: number) {
    return Math.max(...rows.map((r) => rowLabel(r).length)) * size * 0.56 + 6;
  }
  function measure() {
    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) return;
    let w = 0;
    for (const r of rows) {
      ctx.font = `400 ${fs}px "Atkinson Hyperlegible Next", "Source Sans 3", sans-serif`;
      w = Math.max(w, ctx.measureText(rowLabel(r)).width);
    }
    for (const h of L.headers) {
      ctx.font = `600 ${fs * 0.9}px "Atkinson Hyperlegible Next", sans-serif`;
      w = Math.max(w, ctx.measureText(h.text).width);
    }
    labelW = Math.ceil(w) + 6;
  }
  onMount(() => {
    document.fonts?.ready.then(measure);
  });
  $effect(() => {
    void fs;
    if (typeof document !== 'undefined') measure();
  });

  const panelW = $derived((width - labelW - PAD_L - PAD_R - GAP * (shown.length - 1)) / shown.length);
  const x0 = (k: number) => labelW + PAD_L + k * (panelW + GAP);
  const xs = (k: number, v: number) => x0(k) + ((v + 1) / 2) * panelW;
  const ys = (y: number) => top + (L.top - y) * rowPx;
  const base = $derived(top + plotH);

  /** Identical random-set results stack: n ticks at alpha 0.10 composite to 1 − 0.9ⁿ. */
  function stacks(draws: number[]) {
    const m = new Map<number, number>();
    for (const v of draws) {
      const k = Math.round(v * 1e12) / 1e12;
      m.set(k, (m.get(k) ?? 0) + 1);
    }
    return [...m].map(([v, n]) => ({ v, a: 1 - Math.pow(1 - data.rug_alpha, n) }));
  }

  const selected = $derived(rows.find((r) => r.key === ui.metric) ?? null);
  let hover: string | null = $state(null);

  function pick(key: string) {
    ui.metric = ui.metric === key ? null : key;
  }
  function keypick(e: KeyboardEvent, key: string) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      pick(key);
    }
  }
</script>

<div class="chart" bind:clientWidth={width}>
  {#if !wide}
    <div class="tabs" role="tablist" aria-label="Outcome">
      {#each arms as a}
        <button
          role="tab"
          aria-selected={ui.arm === a.arm}
          class:on={ui.arm === a.arm}
          onclick={() => (ui.arm = a.arm)}>{oneLine(a.title)}</button
        >
      {/each}
    </div>
  {/if}

  <div class="stage">
  <svg {width} {height} viewBox="0 0 {width} {height}" aria-hidden="true" class="plot">
    <!-- the picked row, under everything -->
    {#each rows as o}
      {#if o.key === ui.metric || o.key === hover}
        <rect
          x="0"
          y={ys(L.ypos[o.key]) - rowPx / 2}
          {width}
          height={rowPx}
          fill={o.key === ui.metric ? C.panel : tint(C.panel, 0.5)}
        />
      {/if}
    {/each}

    <!-- row labels and group headers: the shared y axis -->
    {#each L.headers as h}
      <text
        x={labelW}
        y={ys(h.y)}
        text-anchor="end"
        dominant-baseline="central"
        font-size={fs * 0.9}
        font-weight="600"
        fill={CLASS_COLOUR[h.cls]}>{h.text}</text
      >
    {/each}
    {#each rows as o}
      <text
        x={labelW}
        y={ys(L.ypos[o.key])}
        text-anchor="end"
        dominant-baseline="central"
        font-size={fs}
        font-weight={o.key === ui.metric ? 700 : 400}
        fill={C.ink}
        class="pre">{rowLabel(o)}</text
      >
    {/each}

    {#each shown as a, k (a.arm)}
      {#if wide}
        <text x={xs(k, 0)} y={top - 26} text-anchor="middle" font-size={fs + 0.5} fill={C.ink}>
          {#each a.title.split('\n') as line, j}
            <tspan x={xs(k, 0)} dy={j === 0 ? 0 : fs + 2}>{line}</tspan>
          {/each}
        </text>
      {/if}

      <!-- faint group rules, then the zero line and the persistence limit -->
      {#each L.rules as r}
        <line x1={x0(k)} x2={x0(k) + panelW} y1={ys(r)} y2={ys(r)} stroke={FAINT} stroke-width="1" />
      {/each}
      {#if a.arm === 10}
        {#each [-RMAX, RMAX] as v}
          <line
            x1={xs(k, v)}
            x2={xs(k, v)}
            y1={top}
            y2={base}
            stroke={C.softInk}
            stroke-width="1.3"
            stroke-dasharray="2 3.25"
          />
        {/each}
      {/if}
      <line x1={xs(k, 0)} x2={xs(k, 0)} y1={top} y2={base} stroke={C.softInk} stroke-width="1.3" />

      {#each rows as o}
        {@const c = data.cells[o.key][String(a.arm)]}
        {@const y = ys(L.ypos[o.key])}
        {@const col = CLASS_COLOUR[o.cls]}
        {#if kind === 'assoc'}
          {#if c.ci_reliable}
            <line x1={xs(k, c.lo)} x2={xs(k, c.hi)} y1={y} y2={y} stroke={col} stroke-width="2.2" />
          {/if}
          <circle cx={xs(k, c.eff)} cy={y} r="5.5" fill={col} stroke={C.paper} stroke-width="1.2" />
          {#if c.lat != null}
            {@const x = xs(k, c.lat)}
            <path
              d="M{x - 4} {y - 4}L{x + 4} {y + 4}M{x - 4} {y + 4}L{x + 4} {y - 4}"
              stroke={C.ink}
              stroke-width="1.7"
            />
          {/if}
          {#if c.pre != null}
            {@const x = xs(k, c.pre)}
            <path d="M{x - 4.6} {y}H{x + 4.6}M{x} {y - 4.6}V{y + 4.6}" stroke={C.ink} stroke-width="1.7" />
          {/if}
        {:else if !c.evaluated}
          <rect
            x={xs(k, -data.dash_half_width * 1.4)}
            y={y - rowPx / 2}
            width={xs(k, data.dash_half_width * 1.4) - xs(k, -data.dash_half_width * 1.4)}
            height={rowPx}
            fill={o.key === ui.metric ? C.panel : C.paper}
          />
          <line
            x1={xs(k, -data.dash_half_width)}
            x2={xs(k, data.dash_half_width)}
            y1={y}
            y2={y}
            stroke={C.softInk}
            stroke-width="2.6"
          />
        {:else}
          {#if !c.one_value}
            {#each stacks(c.draws) as s}
              <line
                x1={xs(k, s.v)}
                x2={xs(k, s.v)}
                y1={y - 0.4 * rowPx}
                y2={y + 0.4 * rowPx}
                stroke={C.softInk}
                stroke-opacity={s.a}
                stroke-width="1.1"
              />
            {/each}
          {/if}
          <circle cx={xs(k, c.eff)} cy={y} r="5.5" fill={col} stroke={C.paper} stroke-width="1.2" />
          {#if c.ring}
            <circle cx={xs(k, c.eff)} cy={y} r="9.2" fill="none" stroke={C.ink} stroke-width="1.4" />
          {/if}
          {#if c.one_value}
            <line
              x1={xs(k, c.draws[0])}
              x2={xs(k, c.draws[0])}
              y1={y - 0.46 * rowPx}
              y2={y + 0.46 * rowPx}
              stroke={C.ink}
              stroke-width="3.2"
            />
          {/if}
        {/if}
      {/each}

      <!-- x axis -->
      <line x1={xs(k, -1)} x2={xs(k, 1)} y1={base} y2={base} stroke={C.rule} stroke-width="1.3" />
      {#each TICKS as [v, lab]}
        <line x1={xs(k, v)} x2={xs(k, v)} y1={base} y2={base + 5} stroke={C.rule} stroke-width="1.3" />
        <text x={xs(k, v)} y={base + 19} text-anchor="middle" font-size={fs - 0.5} fill={C.ink}>{lab}</text>
      {/each}
    {/each}
  </svg>

  <!-- the rows as buttons, laid over the drawing -->
  <div class="hits">
    {#each rows as o}
      <div
        class="hit"
        role="button"
        tabindex="0"
        aria-pressed={o.key === ui.metric}
        aria-label="{rowLabel(o)}: show values"
        style:top="{ys(L.ypos[o.key]) - rowPx / 2}px"
        style:height="{rowPx}px"
        onclick={() => pick(o.key)}
        onkeydown={(e) => keypick(e, o.key)}
        onpointerenter={() => (hover = o.key)}
        onpointerleave={() => (hover = null)}
      ></div>
    {/each}
  </div>
  </div>

  <p class="xlabel" style:margin-left={wide ? `${labelW + PAD_L}px` : null} style:margin-right={wide ? `${PAD_R}px` : null}>
    Directional association (−Spearman ρ)<br />← opposite direction · expected direction →
  </p>

  <ul class="legend" class:row={wide}>
    {#if kind === 'assoc'}
      <li>
        <svg width="34" height="14" aria-hidden="true"
          ><line x1="2" x2="32" y1="7" y2="7" stroke={C.softInk} stroke-width="2.2" /><circle
            cx="22"
            cy="7"
            r="4.6"
            fill={C.softInk}
            stroke={C.paper}
          /></svg
        >−ρ with 95% bootstrap interval
      </li>
      <li>
        <svg width="34" height="14" aria-hidden="true"
          ><path d="M13 3L21 11M13 11L21 3" stroke={C.ink} stroke-width="1.7" /></svg
        >adjusted for latitude
      </li>
      <li>
        <svg width="34" height="14" aria-hidden="true"
          ><path d="M12 7H22M17 2V12" stroke={C.ink} stroke-width="1.7" /></svg
        >adjusted for pre-drought growth
      </li>
    {:else}
      <li>
        <svg width="34" height="14" aria-hidden="true"
          ><line x1="17" x2="17" y1="1" y2="13" stroke={C.softInk} stroke-width="1.5" /></svg
        >one matched random-locus set (darker = more sets agree)
      </li>
      <li>
        <svg width="34" height="14" aria-hidden="true"><circle cx="17" cy="7" r="4.6" fill={C.softInk} /></svg
        >candidate loci
      </li>
      <li>
        <svg width="34" height="20" aria-hidden="true"
          ><circle cx="17" cy="10" r="8.5" fill="none" stroke={C.ink} stroke-width="1.4" /></svg
        >differs from random-locus sets (two-sided 5%, unadjusted)
      </li>
    {/if}
    <li>
      <svg width="34" height="14" aria-hidden="true"
        ><line x1="2" x2="32" y1="7" y2="7" stroke={C.softInk} stroke-width="1.3" stroke-dasharray="2 3.25" /></svg
      >rank correlation limit
    </li>
  </ul>

  {#if selected}
    {@const o = selected}
    <div class="detail" aria-live="polite">
      <div class="dhead">
        <span class="dname" style:color={CLASS_COLOUR[o.cls]}>{rowLabel(o)}</span>
        <span class="dact">
          <button class="link" onclick={() => (ui.method = o.key)}>Citation &amp; equation</button>
          <button class="x" aria-label="Clear the picked row" onclick={() => (ui.metric = null)}>×</button>
        </span>
      </div>
      <div class="scroll">
        <table>
          <thead>
            <tr>
              <th></th>
              {#each arms as a}<th scope="col">{oneLine(a.title)}</th>{/each}
            </tr>
          </thead>
          <tbody>
            {#if kind === 'assoc'}
              <tr>
                <th scope="row">−ρ</th>
                {#each arms as a}<td>{signed(data.cells[o.key][a.arm].eff)}</td>{/each}
              </tr>
              <tr>
                <th scope="row">95% bootstrap interval</th>
                {#each arms as a}
                  {@const c = data.cells[o.key][a.arm]}
                  <td>{c.ci_reliable ? interval(c.lo, c.hi) : '—'}</td>
                {/each}
              </tr>
              <tr>
                <th scope="row">adjusted for latitude</th>
                {#each arms as a}<td>{signed(data.cells[o.key][a.arm].lat)}</td>{/each}
              </tr>
              <tr>
                <th scope="row">adjusted for pre-drought growth</th>
                {#each arms as a}<td>{signed(data.cells[o.key][a.arm].pre)}</td>{/each}
              </tr>
              <tr>
                <th scope="row">populations (n)</th>
                {#each arms as a}<td>{data.cells[o.key][a.arm].n}</td>{/each}
              </tr>
              <tr>
                <th scope="row">permutation p</th>
                {#each arms as a}<td>{pval(data.cells[o.key][a.arm].p_perm)}</td>{/each}
              </tr>
            {:else}
              <tr>
                <th scope="row">candidate loci, −ρ</th>
                {#each arms as a}<td>{signed(data.cells[o.key][a.arm].eff)}</td>{/each}
              </tr>
              <tr>
                <th scope="row">matched random-locus sets</th>
                {#each arms as a}
                  {@const c = data.cells[o.key][a.arm]}
                  <td>{c.evaluated ? c.n_draws : '—'}</td>
                {/each}
              </tr>
              <tr>
                <th scope="row">random sets, median −ρ</th>
                {#each arms as a}
                  {@const c = data.cells[o.key][a.arm]}
                  <td>{c.evaluated ? signed(c.median) : '—'}</td>
                {/each}
              </tr>
              <tr>
                <th scope="row">random sets, middle 95%</th>
                {#each arms as a}
                  {@const c = data.cells[o.key][a.arm]}
                  <td>{c.evaluated ? interval(c.q025, c.q975) : '—'}</td>
                {/each}
              </tr>
            {/if}
          </tbody>
        </table>
      </div>
    </div>
  {/if}

  <div class="visually-hidden">
  <table aria-labelledby="{id}-title">
    <thead>
      <tr>
        <th scope="col">metric</th>
        {#each arms as a}<th scope="col">{oneLine(a.title)}</th>{/each}
      </tr>
    </thead>
    <tbody>
      {#each rows as o}
        <tr>
          <th scope="row">{rowLabel(o)}</th>
          {#each arms as a}
            {@const c = data.cells[o.key][String(a.arm)]}
            <td>
              {#if kind === 'assoc'}
                −ρ {signed(c.eff)}{c.ci_reliable ? `, 95% bootstrap interval ${interval(c.lo, c.hi)}` : ''}
              {:else if c.evaluated}
                candidate loci −ρ {signed(c.eff)}; {c.n_draws} random-locus sets, median {signed(c.median)}{c.ring
                  ? '; differs from random-locus sets'
                  : ''}
              {:else}
                —
              {/if}
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
  </div>
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
  .dact {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
  .link {
    border: 1px solid var(--aga-rule);
    background: var(--aga-paper);
    border-radius: 999px;
    padding: 0.3rem 0.7rem;
    font: inherit;
    font-size: 0.8rem;
    color: var(--aga-ink);
    cursor: pointer;
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
</style>
