<script lang="ts">
  /**
   * "What do we want to predict?" — the poster's outcomes cartoon (poster_offset/
   * fig12_outcomes_cartoon.py), redrawn from the script's own geometry so it can be read on a
   * phone: the trajectory, arrows and badges in the drawing, the three definitions listed
   * under it. Picking a definition brings its marks forward.
   */
  import { C, tint } from './theme';

  let width = $state(328);
  let active: 1 | 2 | 3 | null = $state(null);

  // the script's axes coordinates; x is widened to 0.95 so the last phase label fits
  const X0 = 0.042;
  const X1 = 0.95;
  const Y0 = 0.154;
  const Y1 = 0.76;
  const HEAD = 86;
  const chartH = $derived(Math.max(190, Math.min(300, width * 0.6)));
  const height = $derived(HEAD + chartH);
  const x = (v: number) => ((v - X0) / (X1 - X0)) * width;
  const y = (v: number) => HEAD + ((Y1 - v) / (Y1 - Y0)) * chartH;

  const PHASE_X = [0.21, 0.51, 0.82];
  const PHASES = [
    ['before', '2010–11 starts'],
    ['drought', '2012–14 starts'],
    ['recovery', '2016–17 starts']
  ];
  const [xp, xd, xr] = PHASE_X;
  const yp = 0.665;
  const yd = 0.37;
  const yr = 0.46;
  const zero = 0.515;
  const xe = 0.545;
  const GUIDE = tint(C.rule, 0.45);

  // fig12's droplet, in its own points (axes size 0.037 at 912.7 x 534.65 pt per unit)
  const DX = 0.037 * 912.7 * 0.7;
  const DY = 0.037 * 534.65 * 0.7;
  const drop = (cx: number, cy: number) =>
    `M${cx} ${cy - DY}C${cx - 0.62 * DX} ${cy - 0.22 * DY} ${cx - 0.48 * DX} ${cy + 0.62 * DY} ${cx} ${cy + 0.78 * DY}` +
    `C${cx + 0.48 * DX} ${cy + 0.62 * DY} ${cx + 0.62 * DX} ${cy - 0.22 * DY} ${cx} ${cy - DY}Z`;

  const curve = $derived(
    `M${x(xp)} ${y(yp)}C${x(0.31)} ${y(yp)} ${x(0.42)} ${y(yd)} ${x(xd)} ${y(yd)}` +
      `C${x(0.61)} ${y(yd)} ${x(0.72)} ${y(yr)} ${x(xr)} ${y(yr)}`
  );
  const lost = $derived(
    `M${x(0.424)} ${y(0.434)}C${x(0.465)} ${y(0.385)} ${x(0.495)} ${y(0.235)} ${x(xe)} ${y(0.205)}`
  );

  const dim = (g: 1 | 2 | 3) => (active === null || active === g ? 1 : 0.15);
  const pick = (g: 1 | 2 | 3) => (active = active === g ? null : g);
</script>

<figure class="cartoon" bind:clientWidth={width}>
  <svg {width} {height} viewBox="0 0 {width} {height}" aria-hidden="true" fill={C.ink}>
    <defs>
      {#each [['amber', C.amber], ['spruce', C.spruce]] as [id, col]}
        <marker id="head-{id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse" markerUnits="userSpaceOnUse">
          <path d="M0 0L10 5L0 10Z" fill={col} />
        </marker>
      {/each}
    </defs>

    <!-- phases -->
    {#each PHASE_X as px, i}
      <path d={drop(x(px), 18)} fill={C.sky} />
      <text x={x(px)} y={50} text-anchor="middle" font-size="13" font-weight="600">{PHASES[i][0]}</text>
      <text x={x(px)} y={64} text-anchor="middle" font-size="12" fill={C.softInk}>mean r</text>
      <text x={x(px)} y={78} text-anchor="middle" font-size="12" fill={C.softInk}>{PHASES[i][1]}</text>
      <line x1={x(px)} x2={x(px)} y1={y(0.335)} y2={y(0.745)} stroke={GUIDE} stroke-width="1" stroke-dasharray="2 3" />
    {/each}
    {#each [[-1, -1, 1, 1], [-1, 1, 1, -1]] as [a, b, c, d]}
      <line
        x1={x(xd) + a * 0.72 * DX}
        y1={18 + b * 0.72 * DY}
        x2={x(xd) + c * 0.72 * DX}
        y2={18 + d * 0.72 * DY}
        stroke={C.carnelian}
        stroke-width="2.6"
      />
    {/each}

    <!-- axes -->
    <line x1={x(0.105)} x2={x(0.105)} y1={y(0.155)} y2={y(0.735)} stroke={C.ink} stroke-width="2" />
    <line x1={x(0.105)} x2={x(0.9)} y1={y(zero)} y2={y(zero)} stroke={C.rule} stroke-width="1.2" stroke-dasharray="3 3" />
    <text x={x(0.118)} y={y(zero) - 5} font-size="12" fill={C.softInk}>r = 0</text>
    <text transform="translate({x(0.105) - 12} {y(0.455)}) rotate(-90)" text-anchor="middle" font-size="12" font-weight="600">annual growth rate, r</text>

    <!-- the trajectory -->
    <path d={curve} fill="none" stroke={C.ink} stroke-width="3.4" stroke-linecap="round" />

    <!-- 1: change into the drought -->
    <g opacity={dim(1)} class="fade">
      <line x1={x(xp) + 7} x2={x(0.302)} y1={y(yp)} y2={y(yp)} stroke={C.rule} stroke-width="1.1" stroke-dasharray="2 2" />
      <line x1={x(0.338)} x2={x(xd) - 7} y1={y(yd)} y2={y(yd)} stroke={C.rule} stroke-width="1.1" stroke-dasharray="2 2" />
      <line x1={x(0.32)} x2={x(0.32)} y1={y(yp) + 3} y2={y(yd) - 3} stroke={C.amber} stroke-width="2.4" marker-start="url(#head-amber)" marker-end="url(#head-amber)" />
      <circle cx={x(0.32) - 15} cy={y((yp + yd) / 2)} r="10" fill={C.amber} stroke={C.paper} stroke-width="1.5" />
      <text x={x(0.32) - 15} y={y((yp + yd) / 2)} text-anchor="middle" dominant-baseline="central" font-size="12.5" font-weight="700" fill={C.paper}>1</text>
    </g>

    <!-- 3: change out of the drought -->
    <g opacity={dim(3)} class="fade">
      <line x1={x(xd) + 7} x2={x(0.652)} y1={y(yd)} y2={y(yd)} stroke={C.rule} stroke-width="1.1" stroke-dasharray="2 2" />
      <line x1={x(0.688)} x2={x(xr) - 7} y1={y(yr)} y2={y(yr)} stroke={C.rule} stroke-width="1.1" stroke-dasharray="2 2" />
      <line x1={x(0.67)} x2={x(0.67)} y1={y(yd) - 3} y2={y(yr) + 3} stroke={C.spruce} stroke-width="2.4" marker-start="url(#head-spruce)" marker-end="url(#head-spruce)" />
      <circle cx={x(0.67) + 16} cy={y((yd + yr) / 2) + 2} r="10" fill={C.spruce} stroke={C.paper} stroke-width="1.5" />
      <text x={x(0.67) + 16} y={y((yd + yr) / 2) + 2} text-anchor="middle" dominant-baseline="central" font-size="12.5" font-weight="700" fill={C.paper}>3</text>
    </g>

    <!-- 2: persistence; the extirpated leave the trajectory during the drought -->
    <g opacity={dim(2)} class="fade">
      <path d={lost} fill="none" stroke={C.carnelian} stroke-width="3.1" stroke-linecap="round" />
      <path d="M{x(xe) - 5.5} {y(0.205) - 5.5}L{x(xe) + 5.5} {y(0.205) + 5.5}M{x(xe) - 5.5} {y(0.205) + 5.5}L{x(xe) + 5.5} {y(0.205) - 5.5}" stroke={C.carnelian} stroke-width="2.6" />
      <circle cx={x(xe) + 20} cy={y(0.205)} r="10" fill={C.ink} stroke={C.paper} stroke-width="1.5" />
      <text x={x(xe) + 20} y={y(0.205)} text-anchor="middle" dominant-baseline="central" font-size="12.5" font-weight="700" fill={C.paper}>2</text>
    </g>

    {#each [[xp, yp], [xd, yd], [xr, yr]] as [a, b]}
      <circle cx={x(a)} cy={y(b)} r="4.6" fill={C.ink} stroke={C.paper} stroke-width="1.3" />
    {/each}
  </svg>

  <ol class="defs">
    <li>
      <button aria-pressed={active === 1} onclick={() => pick(1)} style:--c={C.amber}>
        <span class="badge">1</span>
        <span><b>change into drought</b><br /><span class="f">Δr = r drought − r before</span></span>
      </button>
    </li>
    <li>
      <button aria-pressed={active === 2} onclick={() => pick(2)} style:--c={C.ink}>
        <span class="badge">2</span>
        <span
          ><b>persistence</b><br /><span class="f">1 = present through recovery</span><br /><span class="f" style:color={C.carnelian}
            >0 = extirpated during drought</span
          ></span
        >
      </button>
    </li>
    <li>
      <button aria-pressed={active === 3} onclick={() => pick(3)} style:--c={C.spruce}>
        <span class="badge">3</span>
        <span><b>change out of drought</b><br /><span class="f">Δr = r recovery − r drought</span></span>
      </button>
    </li>
  </ol>
</figure>

<style>
  .cartoon {
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
  .fade {
    transition: opacity 0.2s ease;
  }
  .defs {
    list-style: none;
    margin: 0.4rem 0 0;
    padding: 0;
    display: grid;
    gap: 0.3rem;
  }
  .defs button {
    display: flex;
    gap: 0.6rem;
    align-items: flex-start;
    width: 100%;
    padding: 0.4rem 0.5rem;
    border: 1px solid transparent;
    border-radius: 0.5rem;
    background: none;
    font: inherit;
    font-size: 0.95rem;
    line-height: 1.25;
    text-align: left;
    color: var(--c);
    cursor: pointer;
  }
  .defs button:hover {
    background: var(--aga-panel);
  }
  .defs button[aria-pressed='true'] {
    border-color: var(--c);
    background: var(--aga-panel);
  }
  .defs button:focus-visible {
    outline: 2px solid var(--aga-lake);
  }
  .defs b {
    font-weight: 700;
  }
  .f {
    font-weight: 600;
    font-size: 0.9em;
  }
  .badge {
    flex: none;
    display: grid;
    place-items: center;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    background: var(--c);
    color: var(--aga-paper);
    font-weight: 700;
    font-size: 0.85rem;
    margin-top: 0.05rem;
  }
</style>
