<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { createNoise3D } from 'simplex-noise';

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null = null;
  /** The contours are drawn here and blitted; see BASEMAP_INTERVAL. */
  let basemap: HTMLCanvasElement | null = null;
  let basemapCtx: CanvasRenderingContext2D | null = null;
  let width = 0;
  let height = 0;
  let animationId: number;
  let time = 0;
  let frame = 0;
  let maxScroll = 0;
  let scrollProgress = 0; // 0 at top, 1 at bottom

  let seedX = 0;
  let seedY = 0;

  const noise3D = createNoise3D();

  // ---- Terrain ----------------------------------------------------------

  const LEVELS = 10;
  const LOW = -0.65;
  const HIGH = 0.65;
  /** Every fifth contour is an index contour: heavier, and labelled with its elevation. */
  const INDEX_EVERY = 5;
  /** Offset so index contours land mid-range, where lines are most likely on screen. */
  const INDEX_PHASE = 2;
  /** Metres per band. Arbitrary but consistent, so the labels read as a real survey. */
  const BAND_HEIGHT = 50;
  /** Labels are anchored to fixed screen columns so they drift with the field
      rather than jumping between segments each frame. */
  const LABEL_COLUMNS = [0.14, 0.34, 0.54, 0.74, 0.9];

  // ---- Palette ----------------------------------------------------------

  type Rgb = [number, number, number];

  /** Overwritten from the site's CSS custom properties on mount; these are the fallbacks. */
  let cloud: Rgb = [250, 248, 245];
  let stone: Rgb = [168, 159, 150];
  let sage: Rgb = [107, 99, 92];
  let slate: Rgb = [61, 56, 54];
  let teal: Rgb = [122, 154, 138];
  let highlight: Rgb = [205, 106, 78];
  let elevWater: Rgb = [79, 122, 150];
  let elevLow: Rgb = [107, 143, 87];
  let elevMid: Rgb = [196, 154, 74];
  let elevHigh: Rgb = [156, 90, 52];

  function hexToRgb(hex: string, fallback: Rgb): Rgb {
    const m = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex.trim());
    if (!m) return fallback;
    return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
  }

  function readPalette() {
    const styles = getComputedStyle(document.documentElement);
    const token = (name: string, fallback: Rgb) =>
      hexToRgb(styles.getPropertyValue(name), fallback);

    cloud = token('--cloud', cloud);
    stone = token('--stone', stone);
    sage = token('--sage', sage);
    slate = token('--slate-deep', slate);
    teal = token('--teal-accent', teal);
    highlight = token('--highlight', highlight);
    elevWater = token('--elev-water', elevWater);
    elevLow = token('--elev-low', elevLow);
    elevMid = token('--elev-mid', elevMid);
    elevHigh = token('--elev-high', elevHigh);
  }

  function mix(from: Rgb, to: Rgb, t: number): Rgb {
    return [
      Math.round(from[0] + (to[0] - from[0]) * t),
      Math.round(from[1] + (to[1] - from[1]) * t),
      Math.round(from[2] + (to[2] - from[2]) * t)
    ];
  }

  function rgba([r, g, b]: Rgb, alpha: number): string {
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // ---- Noise field ------------------------------------------------------

  function sampleNoise(x: number, y: number, t: number): number {
    const nx = (x + seedX) * 0.0018;
    const ny = (y + seedY) * 0.0018;
    const nt = t * 0.000006;

    let value = 0;
    value += noise3D(nx, ny, nt) * 1.0;
    value += noise3D(nx * 2.5, ny * 2.5, nt * 1.5) * 0.4;
    value += noise3D(nx * 6, ny * 6, nt * 2) * 0.12;

    return value / 1.52;
  }

  function getGradient(x: number, y: number, t: number): { dx: number; dy: number; value: number } {
    const eps = 8;
    const value = sampleNoise(x, y, t);
    const dx = (sampleNoise(x + eps, y, t) - sampleNoise(x - eps, y, t)) / (2 * eps);
    const dy = (sampleNoise(x, y + eps, t) - sampleNoise(x, y - eps, t)) / (2 * eps);
    return { dx, dy, value };
  }

  /** Field value as a 0-1 position between the lowest and highest contour. */
  function elevationT(value: number): number {
    return Math.max(0, Math.min(1, (value - LOW) / (HIGH - LOW)));
  }

  function thresholdFor(level: number): number {
    return LOW + ((HIGH - LOW) * level) / (LEVELS - 1);
  }

  function isIndexContour(level: number): boolean {
    return level % INDEX_EVERY === INDEX_PHASE;
  }

  // ---- Populations ------------------------------------------------------

  /**
   * Each mark is a population, drawn as the cross a survey puts on a spot
   * elevation. `pref` is one heritable trait - the elevation band the population
   * is adapted to, 0 at the valley floor and 1 on the ridge line - and it decides
   * both where the population tries to be and what colour it is, on the same
   * hypsometric ramp a physical map uses for the same range.
   *
   * Neighbours exchange migrants and converge on a shared preference; isolated
   * ones drift apart. Because a preference also sorts a population to a
   * particular altitude, divergence and separation reinforce each other.
   */
  interface Deme {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    alpha: number;
    life: number;
    maxLife: number;
    heading: number;
    wanderPhase: number;
    baseSpeed: number;
    /** A standing directional habit, so two demes in the same band don't move alike. */
    bias: number;
    /** Preferred elevation, 0 (valley) to 1 (ridge). */
    pref: number;
    /** Distance covered since the last stagnation check. */
    travelled: number;
  }

  let demes: Deme[] = [];
  const DEME_COUNT = 45;
  /** Populations within this radius exchange migrants. */
  const MIGRATION_RADIUS = 250;
  /* Migration pulls a population toward its neighbours' preference; drift is a
     random walk away from it. Kept well apart so real structure forms instead of
     everything settling on one preference - and because preference also sorts
     demes by altitude, separation then feeds back into further divergence. */
  const MIGRATION_RATE = 0.004;
  const DRIFT = 0.03;
  const MAX_SPEED = 0.6;
  /** How far off its preferred band a population has to be before it commits to moving. */
  const TOLERANCE = 0.22;
  /** A deme covering less than this in a window has settled too hard; move it on. */
  const STAGNATION_WINDOW = 420;
  const STAGNATION_DISTANCE = 45;

  /** Small biases are common, strong traversers rare. */
  function dispersalBias(): number {
    const r = Math.random() * 2 - 1;
    return r * Math.abs(r) * 1.4;
  }

  function createDeme(randomLife: boolean = false): Deme {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: 0,
      vy: 0,
      size: 2.6 + Math.random() * 1.1,
      alpha: 0.85 + Math.random() * 0.15,
      life: randomLife ? Math.random() * 600 : 0,
      maxLife: 900 + Math.random() * 700,
      heading: Math.random() * Math.PI * 2,
      wanderPhase: Math.random() * Math.PI * 2,
      baseSpeed: 0.12 + Math.random() * 0.16,
      bias: dispersalBias(),
      pref: Math.random(),
      travelled: 0
    };
  }

  function initDemes() {
    demes = [];
    for (let i = 0; i < DEME_COUNT; i++) {
      demes.push(createDeme(true));
    }
  }

  /** Migrant-weighted mean preference of the neighbourhood, or null in isolation. */
  function localPreference(d: Deme): number | null {
    let sum = 0;
    let totalWeight = 0;

    for (const other of demes) {
      if (other === d) continue;

      const dx = other.x - d.x;
      const dy = other.y - d.y;
      const distSq = dx * dx + dy * dy;
      if (distSq === 0 || distSq >= MIGRATION_RADIUS * MIGRATION_RADIUS) continue;

      const weight = Math.pow(1 - Math.sqrt(distSq) / MIGRATION_RADIUS, 1.5);
      sum += other.pref * weight;
      totalWeight += weight;
    }

    return totalWeight < 0.05 ? null : sum / totalWeight;
  }

  function respawn(d: Deme) {
    if (Math.random() < 0.2) {
      // Immigration from off the map: an unrelated lineage with its own habit.
      const edge = Math.floor(Math.random() * 4);
      switch (edge) {
        case 0: d.x = -10; d.y = Math.random() * height; d.heading = 0; break;
        case 1: d.x = width + 10; d.y = Math.random() * height; d.heading = Math.PI; break;
        case 2: d.x = Math.random() * width; d.y = -10; d.heading = Math.PI / 2; break;
        case 3: d.x = Math.random() * width; d.y = height + 10; d.heading = -Math.PI / 2; break;
      }
      d.pref = Math.random();
    } else {
      // Founded from whatever is already nearby, inheriting its preference.
      d.x = Math.random() * width;
      d.y = Math.random() * height;
      d.heading = Math.random() * Math.PI * 2;
      const local = localPreference(d);
      d.pref =
        local === null
          ? Math.random()
          : Math.max(0, Math.min(1, local + (Math.random() - 0.5) * 0.2));
    }

    d.vx = 0;
    d.vy = 0;
    d.life = 0;
    d.maxLife = 900 + Math.random() * 700;
    d.wanderPhase = Math.random() * Math.PI * 2;
    d.baseSpeed = 0.12 + Math.random() * 0.16;
    d.bias = dispersalBias();
    d.travelled = 0;
  }

  // Opacity based on scroll - full at the top, fading as you read down
  function getScrollOpacityMultiplier(): number {
    if (scrollProgress < 0.15) return 1.0;
    if (scrollProgress > 0.6) return 0.1;
    return 1.0 - (scrollProgress - 0.15) * (0.9 / 0.45);
  }

  function updateDemes() {
    // Gene flow is resolved against the previous state, so no deme reacts to a
    // neighbour that has already been updated this tick.
    const incoming = demes.map(localPreference);

    for (let i = 0; i < demes.length; i++) {
      const d = demes[i];

      const neighbours = incoming[i];
      if (neighbours !== null) d.pref += (neighbours - d.pref) * MIGRATION_RATE;
      d.pref = Math.max(0, Math.min(1, d.pref + (Math.random() - 0.5) * DRIFT));

      const grad = getGradient(d.x, d.y, time);
      const mismatch = d.pref - elevationT(grad.value);
      const urgency = Math.min(1, Math.abs(mismatch) / TOLERANCE);

      // Climb toward higher ground when it wants higher ground, descend when lower.
      const slope =
        mismatch > 0 ? Math.atan2(grad.dy, grad.dx) : Math.atan2(-grad.dy, -grad.dx);

      // A population already in its band is free to explore along it; one in the
      // wrong band commits to the climb or the descent. Without this everything
      // settles into the same few basins and summits and stops moving.
      d.wanderPhase += 0.006 + Math.random() * 0.004;
      const curiosity = 0.3 + (1 - urgency) * 1.5;
      const preferred = slope + Math.sin(d.wanderPhase) * curiosity + d.bias * (1 - urgency);

      let angleDiff = preferred - d.heading;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      d.heading += angleDiff * 0.025;

      const target = d.baseSpeed * (0.5 + urgency * 0.8);
      d.vx += (Math.cos(d.heading) * target - d.vx) * 0.06;
      d.vy += (Math.sin(d.heading) * target - d.vy) * 0.06;

      const speed = Math.sqrt(d.vx * d.vx + d.vy * d.vy);
      if (speed > MAX_SPEED) {
        d.vx = (d.vx / speed) * MAX_SPEED;
        d.vy = (d.vy / speed) * MAX_SPEED;
      }

      d.x += d.vx;
      d.y += d.vy;
      d.life++;
      d.travelled += speed;

      if (d.life % STAGNATION_WINDOW === 0) {
        if (d.travelled < STAGNATION_DISTANCE) {
          respawn(d);
          continue;
        }
        d.travelled = 0;
      }

      if (d.life > d.maxLife || d.x < -30 || d.x > width + 30 || d.y < -30 || d.y > height + 30) {
        respawn(d);
      }
    }
  }

  /** Hypsometric tints: water blue, lowland green, upland ochre, ridge brown. */
  function hypsometric(t: number): Rgb {
    const stops = [elevWater, elevLow, elevMid, elevHigh];
    const scaled = Math.max(0, Math.min(1, t)) * (stops.length - 1);
    const i = Math.min(stops.length - 2, Math.floor(scaled));
    return mix(stops[i], stops[i + 1], scaled - i);
  }

  function drawDemes() {
    if (!ctx) return;

    const scrollOpacity = getScrollOpacityMultiplier();

    ctx.lineWidth = 1.5;
    ctx.lineCap = 'butt';

    for (const d of demes) {
      let alpha = d.alpha * scrollOpacity;
      const fadeTime = 120;
      if (d.life < fadeTime) {
        alpha *= d.life / fadeTime;
      } else if (d.life > d.maxLife - fadeTime) {
        alpha *= (d.maxLife - d.life) / fadeTime;
      }

      if (alpha < 0.02) continue;

      // The saltire a survey puts on a checked spot elevation.
      const r = d.size;
      ctx.strokeStyle = rgba(hypsometric(d.pref), alpha);
      ctx.beginPath();
      ctx.moveTo(d.x - r, d.y - r);
      ctx.lineTo(d.x + r, d.y + r);
      ctx.moveTo(d.x + r, d.y - r);
      ctx.lineTo(d.x - r, d.y + r);
      ctx.stroke();
    }
  }

  // ---- Contours ---------------------------------------------------------

  interface Label {
    x: number;
    y: number;
    text: string;
  }

  const RESOLUTION = 10;
  /** Reused across regenerations rather than reallocated; sized in handleResize. */
  let grid = new Float32Array(0);
  let gridCols = 0;
  let gridRows = 0;

  function measureGrid() {
    gridCols = Math.ceil(width / RESOLUTION) + 1;
    gridRows = Math.ceil(height / RESOLUTION) + 1;
    grid = new Float32Array(gridCols * gridRows);
  }

  function drawTerrain() {
    const c = basemapCtx;
    if (!c || width === 0 || height === 0) return;

    c.fillStyle = rgba(cloud, 1);
    c.fillRect(0, 0, width, height);

    for (let j = 0; j < gridRows; j++) {
      for (let i = 0; i < gridCols; i++) {
        grid[j * gridCols + i] = sampleNoise(i * RESOLUTION, j * RESOLUTION, time);
      }
    }

    const thresholds: number[] = [];
    const paths: Path2D[] = [];
    for (let level = 0; level < LEVELS; level++) {
      thresholds.push(thresholdFor(level));
      paths.push(new Path2D());
    }

    // One traversal for all ten levels. Most cells are crossed by no contour at
    // all, and comparing against the cell's own min and max rejects those in two
    // tests instead of deriving a marching-squares case per level.
    for (let j = 0; j < gridRows - 1; j++) {
      for (let i = 0; i < gridCols - 1; i++) {
        const a = j * gridCols + i;
        const b = a + gridCols;
        const tl = grid[a];
        const tr = grid[a + 1];
        const br = grid[b + 1];
        const bl = grid[b];

        let lo = tl;
        let hi = tl;
        if (tr < lo) lo = tr;
        else if (tr > hi) hi = tr;
        if (br < lo) lo = br;
        else if (br > hi) hi = br;
        if (bl < lo) lo = bl;
        else if (bl > hi) hi = bl;

        for (let level = 0; level < LEVELS; level++) {
          const threshold = thresholds[level];
          if (threshold < lo || threshold > hi) continue;
          addCell(paths[level], i, j, threshold, tl, tr, br, bl);
        }
      }
    }

    const labels: Label[] = [];

    for (let level = 0; level < LEVELS; level++) {
      const t = elevationT(thresholds[level]);
      const index = isIndexContour(level);

      c.strokeStyle = rgba(mix(stone, sage, t), index ? 0.5 + t * 0.25 : 0.22 + t * 0.2);
      c.lineWidth = index ? 1.4 : 0.7 + t * 0.4;
      c.lineCap = 'round';
      c.lineJoin = 'round';
      c.stroke(paths[level]);

      if (index) collectLabels(thresholds[level], level, labels);
    }

    // Drawn last so no later contour crosses a label.
    drawLabels(labels);
  }

  function addCell(
    path: Path2D,
    i: number,
    j: number,
    threshold: number,
    tl: number,
    tr: number,
    br: number,
    bl: number
  ) {
    let k = 0;
    if (tl >= threshold) k |= 1;
    if (tr >= threshold) k |= 2;
    if (br >= threshold) k |= 4;
    if (bl >= threshold) k |= 8;
    if (k === 0 || k === 15) return;

    const x = i * RESOLUTION;
    const y = j * RESOLUTION;

    const top = lerp(x, x + RESOLUTION, (threshold - tl) / (tr - tl || 0.001));
    const right = lerp(y, y + RESOLUTION, (threshold - tr) / (br - tr || 0.001));
    const bottom = lerp(x + RESOLUTION, x, (threshold - br) / (bl - br || 0.001));
    const left = lerp(y + RESOLUTION, y, (threshold - bl) / (tl - bl || 0.001));

    switch (k) {
      case 1: case 14: seg(path, x, left, top, y); break;
      case 2: case 13: seg(path, top, y, x + RESOLUTION, right); break;
      case 3: case 12: seg(path, x, left, x + RESOLUTION, right); break;
      case 4: case 11: seg(path, x + RESOLUTION, right, bottom, y + RESOLUTION); break;
      case 5:
        seg(path, x, left, top, y);
        seg(path, x + RESOLUTION, right, bottom, y + RESOLUTION);
        break;
      case 6: case 9: seg(path, top, y, bottom, y + RESOLUTION); break;
      case 7: case 8: seg(path, x, left, bottom, y + RESOLUTION); break;
      case 10:
        seg(path, x, left, bottom, y + RESOLUTION);
        seg(path, top, y, x + RESOLUTION, right);
        break;
    }
  }

  /** Find where an index contour crosses a few fixed screen columns. */
  function collectLabels(threshold: number, level: number, out: Label[]) {
    const text = String(level * BAND_HEIGHT);
    const topLimit = 80; // clear of the fixed nav
    const bottomLimit = height - 60;

    for (const fraction of LABEL_COLUMNS) {
      const i = Math.min(gridCols - 1, Math.max(0, Math.round((width * fraction) / RESOLUTION)));

      let best: number | null = null;
      for (let j = 1; j < gridRows; j++) {
        const above = grid[(j - 1) * gridCols + i] - threshold;
        const below = grid[j * gridCols + i] - threshold;
        if (above === below || above * below > 0) continue;

        const y = (j - 1 + above / (above - below)) * RESOLUTION;
        if (y < topLimit || y > bottomLimit) continue;

        // Prefer the crossing nearest mid-screen, so the label sits where the eye is.
        if (best === null || Math.abs(y - height / 2) < Math.abs(best - height / 2)) {
          best = y;
        }
      }

      if (best !== null) out.push({ x: width * fraction, y: best, text });
    }
  }

  /** Break the line and set the elevation in the gap, the way a paper map does. */
  function drawLabels(labels: Label[]) {
    const c = basemapCtx;
    if (!c) return;

    c.font = '9px "JetBrains Mono", ui-monospace, monospace';
    c.textAlign = 'center';
    c.textBaseline = 'middle';

    for (const label of labels) {
      const halfWidth = c.measureText(label.text).width / 2 + 5;
      c.fillStyle = rgba(cloud, 1);
      c.fillRect(label.x - halfWidth, label.y - 6, halfWidth * 2, 12);

      c.fillStyle = rgba(sage, 0.8);
      c.fillText(label.text, label.x, label.y);
    }
  }

  function lerp(a: number, b: number, t: number): number {
    const clamped = Math.max(0, Math.min(1, t));
    return a + (b - a) * clamped;
  }

  function seg(path: Path2D, x1: number, y1: number, x2: number, y2: number) {
    path.moveTo(x1, y1);
    path.lineTo(x2, y2);
  }

  // ---- Loop -------------------------------------------------------------

  /* The contours drift about 3px a second, so redrawing them every frame costs
     ~40,000 noise samples to move a line by five hundredths of a pixel. Rebuilding
     the base map every sixth frame steps it by less than half a pixel - invisible -
     and leaves the main thread free for the demes, which do move frame to frame. */
  const BASEMAP_INTERVAL = 6;

  function render() {
    if (!ctx || !basemap) return;

    if (frame % BASEMAP_INTERVAL === 0) drawTerrain();
    ctx.drawImage(basemap, 0, 0, width, height);

    updateDemes();
    drawDemes();
  }

  function animate() {
    time += 16;
    frame++;
    render();
    animationId = requestAnimationFrame(animate);
  }

  function handleResize() {
    if (!browser || !canvas) return;

    const dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx = canvas.getContext('2d');
    ctx?.scale(dpr, dpr);

    if (!basemap) basemap = document.createElement('canvas');
    basemap.width = width * dpr;
    basemap.height = height * dpr;
    basemapCtx = basemap.getContext('2d');
    basemapCtx?.scale(dpr, dpr);

    measureGrid();
    measureScroll();
    initDemes();
    frame = 0;
    render();
  }

  /** scrollHeight forces a layout, so it is read on resize rather than on scroll. */
  function measureScroll() {
    if (!browser) return;
    maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    handleScroll();
  }

  function handleScroll() {
    if (!browser) return;
    scrollProgress = maxScroll > 0 ? Math.min(1, window.scrollY / maxScroll) : 0;
  }

  onMount(() => {
    seedX = Math.random() * 10000;
    seedY = Math.random() * 10000;
    time = Math.random() * 100000;

    readPalette();
    handleResize();

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Expanding a CV section changes the page height, so remeasure rather than
    // reading scrollHeight on every scroll event.
    const pageObserver = new ResizeObserver(measureScroll);
    pageObserver.observe(document.body);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      animate();
    }

    return () => pageObserver.disconnect();
  });

  onDestroy(() => {
    if (browser) {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      if (animationId) cancelAnimationFrame(animationId);
    }
  });
</script>

<div class="terrain-container">
  <canvas bind:this={canvas} class="terrain"></canvas>
  <div class="content-overlay"></div>
</div>

<style>
  .terrain-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
    pointer-events: none;
  }

  .terrain {
    display: block;
  }

  .content-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      ellipse 80% 60% at 50% 40%,
      color-mix(in srgb, var(--cloud) 65%, transparent) 0%,
      color-mix(in srgb, var(--cloud) 30%, transparent) 45%,
      transparent 75%
    );
    pointer-events: none;
  }
</style>
