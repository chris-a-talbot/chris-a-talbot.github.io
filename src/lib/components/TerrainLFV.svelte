<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null = null;
  /** The graticule never changes, so it is drawn once here and blitted. */
  let basemap: HTMLCanvasElement | null = null;
  let basemapCtx: CanvasRenderingContext2D | null = null;
  let width = 0;
  let height = 0;
  let animationId: number;
  let maxScroll = 0;
  let scrollProgress = 0; // 0 at top, 1 at bottom

  // ---- Palette ----------------------------------------------------------

  type Rgb = [number, number, number];

  /** Overwritten from the site's CSS custom properties on mount; these are the fallbacks. */
  let cloud: Rgb = [250, 248, 245];
  let stone: Rgb = [168, 159, 150];
  let slate: Rgb = [61, 56, 54];
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
    slate = token('--slate-deep', slate);
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

  /**
   * There are four allelic types and no hybrids: reproduction copies a parent's
   * type exactly, so a type is either present at a site or it isn't. Takes a
   * value in type-index space [0, TYPES - 1]; only the eased transition between
   * two types and the per-site tint jitter ever land between whole numbers.
   */
  const TYPES = 4;

  function typeColour(t: number): Rgb {
    const stops = [elevWater, elevLow, elevMid, elevHigh];
    const clamped = Math.max(0, Math.min(stops.length - 1, t));
    const i = Math.min(stops.length - 2, Math.floor(clamped));
    return mix(stops[i], stops[i + 1], clamped - i);
  }

  function randomType(): number {
    return Math.floor(Math.random() * TYPES);
  }

  // ---- Population -------------------------------------------------------

  /**
   * The spatial Lambda-Fleming-Viot picture: space is saturated with
   * individuals, so unlike the demes on the front page nothing here ever
   * moves or dies out - a site is a site forever, and evolution is purely a
   * matter of which type currently holds it. `type` is the heritable trait and
   * is always one of the four whole types; `shade` trails it so a recolonised
   * patch blooms into the parent's colour rather than snapping, and `jitter` is
   * a fixed per-site tint that is never inherited, so a patch of one type reads
   * as a patch rather than a flat wash.
   */
  interface Site {
    x: number;
    y: number;
    type: number;
    shade: number;
    jitter: number;
    size: number;
  }

  let sites: Site[] = [];
  /** Grid pitch of the sampled population. The continuum, at survey resolution. */
  const SPACING = 36;

  function initSites() {
    sites = [];

    /*
     * A handful of founder lineages, so the opening frame already shows the
     * patchwork the process produces at stationarity instead of salt-and-pepper
     * noise that takes a minute to sort itself out. Each site inherits from its
     * nearest founder, plus a little jitter so patches aren't perfectly flat.
     */
    const founders: { x: number; y: number; type: number }[] = [];
    const founderCount = 6 + Math.floor(Math.random() * 3);
    for (let i = 0; i < founderCount; i++) {
      founders.push({
        x: Math.random() * width,
        y: Math.random() * height,
        type: randomType()
      });
    }

    const cols = Math.ceil(width / SPACING) + 1;
    const rows = Math.ceil(height / SPACING) + 1;

    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        // Jittered rather than square, so the field reads as a survey's spot
        // checks and not as graph paper.
        const x = i * SPACING + (Math.random() - 0.5) * SPACING * 0.6;
        const y = j * SPACING + (Math.random() - 0.5) * SPACING * 0.6;

        let nearest = founders[0];
        let best = Infinity;
        for (const f of founders) {
          const d = (f.x - x) * (f.x - x) + (f.y - y) * (f.y - y);
          if (d < best) {
            best = d;
            nearest = f;
          }
        }

        const type = nearest.type;
        sites.push({
          x,
          y,
          type,
          shade: type,
          jitter: (Math.random() - 0.5) * 0.24,
          size: 2.4 + Math.random() * 1.0
        });
      }
    }
  }

  // ---- Reproduction events ----------------------------------------------

  /**
   * The whole model is driven by these. A Poisson rain of balls falls on the
   * plane; each ball picks one parent from the individuals inside it, and a
   * fraction u of everyone inside dies and is replaced by the parent's
   * offspring. That is the entire mechanism - there is no per-individual
   * behaviour at all, which is what separates this from the front page.
   *
   * Drawn the way a plane-table surveyor would record one: a compass sweep
   * from north, cardinal ticks, the parent flagged at its station, and the
   * event's parameters noted beside the circle.
   */
  interface Event {
    x: number;
    y: number;
    r: number;
    /** Impact: the fraction of the ball's population replaced. */
    u: number;
    parent: Site | null;
    parentType: number;
    age: number;
    large: boolean;
  }

  let events: Event[] = [];
  /* Expected events per frame: a little under one a second at 60fps. The ceiling
     is set well above the steady state (rate x lifetime, under two on screen) so
     the rate governs how busy the sheet is rather than the cap clamping it. */
  const EVENT_RATE = 1 / 70;
  const MAX_CONCURRENT = 5;
  /** Frames spent drawing the circle before the replacement lands. */
  const SWEEP = 10;
  const EVENT_LIFE = 110;
  const FADE = 45;
  /* Far fewer events, so each has to carry more. Roughly one in five is a
     large-scale extinction/recolonisation, and close to one in five introduces
     a type that was not there before. */
  const MUTATION = 0.18;
  const LARGE_EVENT = 0.22;

  /** Small balls common, large ones rare; the tail is the interesting part. */
  function sampleRadius(): { r: number; large: boolean } {
    if (Math.random() < LARGE_EVENT) {
      return { r: 175 + Math.random() * 150, large: true };
    }
    return { r: 48 + Math.pow(Math.random(), 2.0) * 120, large: false };
  }

  function spawnEvent() {
    const { r, large } = sampleRadius();
    const x = Math.random() * width;
    const y = Math.random() * height;

    // The parent is drawn uniformly from the individuals inside the ball.
    const inside: Site[] = [];
    for (const s of sites) {
      const dx = s.x - x;
      const dy = s.y - y;
      if (dx * dx + dy * dy <= r * r) inside.push(s);
    }
    if (inside.length === 0) return;

    const parent = inside[Math.floor(Math.random() * inside.length)];
    // Copied exactly. Drifting the type by a little each generation is a random
    // walk on a bounded interval, which piles every lineage up in the middle of
    // the ramp - that is what turned the whole sheet tan.
    let parentType = parent.type;
    if (Math.random() < MUTATION) {
      parentType = (parent.type + 1 + Math.floor(Math.random() * (TYPES - 1))) % TYPES;
    }

    events.push({
      x,
      y,
      r,
      // Large events replace more of what they cover; that is what makes
      // them extinction/recolonisation events rather than big ripples.
      u: large ? 0.85 + Math.random() * 0.15 : 0.6 + Math.random() * 0.35,
      parent,
      parentType,
      age: 0,
      large
    });
  }

  /** The moment the compass sweep closes, the replacement lands. */
  function applyEvent(e: Event) {
    for (const s of sites) {
      const dx = s.x - e.x;
      const dy = s.y - e.y;
      if (dx * dx + dy * dy > e.r * e.r) continue;
      if (Math.random() < e.u) s.type = e.parentType;
    }
  }

  function updateEvents() {
    if (events.length < MAX_CONCURRENT && Math.random() < EVENT_RATE) spawnEvent();

    for (let i = events.length - 1; i >= 0; i--) {
      const e = events[i];
      e.age++;
      if (e.age === SWEEP) applyEvent(e);
      if (e.age > EVENT_LIFE) events.splice(i, 1);
    }
  }

  function updateSites() {
    for (const s of sites) {
      s.shade += (s.type - s.shade) * 0.08;
    }
  }

  // ---- Drawing ----------------------------------------------------------

  // Opacity based on scroll - full at the top, fading as you read down
  function getScrollOpacityMultiplier(): number {
    if (scrollProgress < 0.15) return 1.0;
    if (scrollProgress > 0.6) return 0.1;
    return 1.0 - (scrollProgress - 0.15) * (0.9 / 0.45);
  }

  function drawBasemap() {
    const c = basemapCtx;
    if (!c) return;

    c.fillStyle = rgba(cloud, 1);
    c.fillRect(0, 0, width, height);

    // Graticule ticks, so the sheet reads as a map even between events.
    const pitch = 90;
    const arm = 4;
    c.strokeStyle = rgba(stone, 0.3);
    c.lineWidth = 0.8;
    c.beginPath();
    for (let y = pitch; y < height; y += pitch) {
      for (let x = pitch; x < width; x += pitch) {
        c.moveTo(x - arm, y);
        c.lineTo(x + arm, y);
        c.moveTo(x, y - arm);
        c.lineTo(x, y + arm);
      }
    }
    c.stroke();
  }

  /* At this spacing the sheet carries ~2,000 sites. One stroke call each is
     what made the previous background fight with scrolling, so the crosses are
     batched into one path per colour step instead - 40 stroke calls a frame.
     The steps span all four types, so ~13 of them cover one type-to-type gap,
     which is fine resolution for both the bloom and the per-site tint jitter. */
  const SHADE_STEPS = 40;

  function drawSites(scrollOpacity: number) {
    if (!ctx) return;

    const paths: Path2D[] = [];
    for (let i = 0; i < SHADE_STEPS; i++) paths.push(new Path2D());

    for (const s of sites) {
      const tinted = (s.shade + s.jitter) / (TYPES - 1);
      const step = Math.min(
        SHADE_STEPS - 1,
        Math.max(0, Math.round(tinted * (SHADE_STEPS - 1)))
      );
      const path = paths[step];
      const r = s.size;
      // The saltire a survey puts on a checked station.
      path.moveTo(s.x - r, s.y - r);
      path.lineTo(s.x + r, s.y + r);
      path.moveTo(s.x + r, s.y - r);
      path.lineTo(s.x - r, s.y + r);
    }

    ctx.lineWidth = 1.5;
    ctx.lineCap = 'butt';
    for (let i = 0; i < SHADE_STEPS; i++) {
      const t = (i / (SHADE_STEPS - 1)) * (TYPES - 1);
      ctx.strokeStyle = rgba(typeColour(t), 0.85 * scrollOpacity);
      ctx.stroke(paths[i]);
    }
  }

  function drawEvents(scrollOpacity: number) {
    const c = ctx;
    if (!c) return;

    for (const e of events) {
      const fade = e.age > EVENT_LIFE - FADE ? (EVENT_LIFE - e.age) / FADE : 1;
      const alpha = fade * scrollOpacity;
      if (alpha < 0.02) continue;

      const sweeping = e.age < SWEEP;
      const sweep = sweeping ? e.age / SWEEP : 1;
      const start = -Math.PI / 2;

      // The compass line: heavier while being drawn, settling once closed.
      c.strokeStyle = rgba(slate, (sweeping ? 0.6 : 0.35) * alpha);
      c.lineWidth = e.large ? 1.4 : 1.0;
      c.beginPath();
      c.arc(e.x, e.y, e.r, start, start + sweep * Math.PI * 2);
      c.stroke();

      if (!sweeping) {
        // The recolonised footprint, washed in the parent's colour.
        c.fillStyle = rgba(typeColour(e.parentType), 0.05 * alpha);
        c.beginPath();
        c.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        c.fill();

        // Cardinal ticks.
        c.strokeStyle = rgba(slate, 0.35 * alpha);
        c.lineWidth = 1;
        c.beginPath();
        for (let k = 0; k < 4; k++) {
          const a = start + (k * Math.PI) / 2;
          c.moveTo(e.x + Math.cos(a) * (e.r - 3), e.y + Math.sin(a) * (e.r - 3));
          c.lineTo(e.x + Math.cos(a) * (e.r + 3), e.y + Math.sin(a) * (e.r + 3));
        }
        c.stroke();

        // The parent, flagged at its station.
        if (e.parent) {
          c.strokeStyle = rgba(highlight, 0.85 * alpha);
          c.lineWidth = 1.2;
          c.beginPath();
          c.arc(e.parent.x, e.parent.y, 5, 0, Math.PI * 2);
          c.stroke();
        }
      }
    }
  }

  function render() {
    if (!ctx || !basemap) return;

    ctx.drawImage(basemap, 0, 0, width, height);

    const scrollOpacity = getScrollOpacityMultiplier();
    drawSites(scrollOpacity);
    drawEvents(scrollOpacity);
  }

  function animate() {
    updateEvents();
    updateSites();
    render();
    animationId = requestAnimationFrame(animate);
  }

  // ---- Housekeeping -----------------------------------------------------

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

    drawBasemap();
    measureScroll();
    initSites();
    events = [];
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
    readPalette();
    handleResize();

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    const pageObserver = new ResizeObserver(measureScroll);
    pageObserver.observe(document.body);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Run the process to a believable patchwork without animating it: land
      // a few hundred events instantly and show the still.
      for (let i = 0; i < 300; i++) {
        spawnEvent();
        for (const e of events) applyEvent(e);
        events = [];
      }
      for (const s of sites) s.shade = s.type;
      render();
    } else {
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
