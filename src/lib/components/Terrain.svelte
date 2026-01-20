<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { createNoise3D } from 'simplex-noise';

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null = null;
  let width = 0;
  let height = 0;
  let animationId: number;
  let time = 0;
  let scrollProgress = 0; // 0 at top, 1 at bottom

  let seedX = 0;
  let seedY = 0;

  const noise3D = createNoise3D();

  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    alpha: number;
    life: number;
    maxLife: number;
    hue: number;
    saturation: number;
    targetAngle: number;
    wanderPhase: number;
    baseSpeed: number;
  }

  let particles: Particle[] = [];
  const PARTICLE_COUNT = 45;      // Fewer particles
  const INFLUENCE_RADIUS = 250;   // Larger radius for fewer, bigger clusters
  const COLOR_ADAPT_RATE = 0.03;  // Faster adaptation

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

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle(true));
    }
  }

  function createParticle(randomLife: boolean = false): Particle {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: 0,
      vy: 0,
      size: 3 + Math.random() * 2.5,
      alpha: 0.35 + Math.random() * 0.2,
      life: randomLife ? Math.random() * 600 : 0,
      maxLife: 900 + Math.random() * 700,
      hue: Math.random() * 360,
      saturation: 35 + Math.random() * 20,
      targetAngle: Math.random() * Math.PI * 2,
      wanderPhase: Math.random() * Math.PI * 2,
      baseSpeed: 0.12 + Math.random() * 0.2
    };
  }

  function getLocalAverageHue(p: Particle): number | null {
    let sinSum = 0;
    let cosSum = 0;
    let totalWeight = 0;

    for (const other of particles) {
      if (other === p) continue;

      const dx = other.x - p.x;
      const dy = other.y - p.y;
      const distSq = dx * dx + dy * dy;

      if (distSq < INFLUENCE_RADIUS * INFLUENCE_RADIUS && distSq > 0) {
        const dist = Math.sqrt(distSq);
        const weight = Math.pow(1 - (dist / INFLUENCE_RADIUS), 1.5);
        const radians = (other.hue * Math.PI) / 180;

        sinSum += Math.sin(radians) * weight;
        cosSum += Math.cos(radians) * weight;
        totalWeight += weight;
      }
    }

    if (totalWeight < 0.05) return null;

    let avgHue = (Math.atan2(sinSum, cosSum) * 180) / Math.PI;
    if (avgHue < 0) avgHue += 360;

    return avgHue;
  }

  function lerpHue(from: number, to: number, t: number): number {
    let diff = to - from;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    let result = from + diff * t;
    if (result < 0) result += 360;
    if (result >= 360) result -= 360;

    return result;
  }

  // Particle opacity based on scroll - full opacity at top, fades as you scroll
  function getScrollOpacityMultiplier(): number {
    // Full opacity for first 15% of scroll, then fade to 0.1 by 60%
    if (scrollProgress < 0.15) return 1.0;
    if (scrollProgress > 0.6) return 0.1;
    return 1.0 - (scrollProgress - 0.15) * (0.9 / 0.45);
  }

  function updateParticles() {
    const newHues: number[] = [];
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const localAvg = getLocalAverageHue(p);

      if (localAvg !== null) {
        newHues[i] = lerpHue(p.hue, localAvg, COLOR_ADAPT_RATE);
      } else {
        newHues[i] = p.hue;
      }
    }

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.hue = newHues[i];

      const grad = getGradient(p.x, p.y, time);

      p.wanderPhase += 0.006 + Math.random() * 0.003;

      const downhillAngle = Math.atan2(-grad.dy, -grad.dx);
      const wanderOffset = Math.sin(p.wanderPhase) * 1.0;
      const preferredAngle = downhillAngle + wanderOffset;

      let angleDiff = preferredAngle - p.targetAngle;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      p.targetAngle += angleDiff * 0.025;

      const gradientMag = Math.sqrt(grad.dx * grad.dx + grad.dy * grad.dy);
      const speedMultiplier = 0.5 + gradientMag * 12;
      const currentSpeed = p.baseSpeed * speedMultiplier;

      const targetVx = Math.cos(p.targetAngle) * currentSpeed;
      const targetVy = Math.sin(p.targetAngle) * currentSpeed;

      p.vx += (targetVx - p.vx) * 0.06;
      p.vy += (targetVy - p.vy) * 0.06;

      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      const maxSpeed = 0.6;
      if (speed > maxSpeed) {
        p.vx = (p.vx / speed) * maxSpeed;
        p.vy = (p.vy / speed) * maxSpeed;
      }

      p.x += p.vx;
      p.y += p.vy;
      p.life++;

      if (p.life > p.maxLife || p.x < -30 || p.x > width + 30 || p.y < -30 || p.y > height + 30) {
        if (Math.random() < 0.2) {
          const edge = Math.floor(Math.random() * 4);
          switch (edge) {
            case 0: p.x = -10; p.y = Math.random() * height; p.targetAngle = 0; break;
            case 1: p.x = width + 10; p.y = Math.random() * height; p.targetAngle = Math.PI; break;
            case 2: p.x = Math.random() * width; p.y = -10; p.targetAngle = Math.PI / 2; break;
            case 3: p.x = Math.random() * width; p.y = height + 10; p.targetAngle = -Math.PI / 2; break;
          }
          p.hue = Math.random() * 360;
        } else {
          p.x = Math.random() * width;
          p.y = Math.random() * height;
          const localAvg = getLocalAverageHue(p);
          p.hue = localAvg !== null ? localAvg + (Math.random() - 0.5) * 30 : Math.random() * 360;
          p.targetAngle = Math.random() * Math.PI * 2;
        }
        p.vx = 0;
        p.vy = 0;
        p.life = 0;
        p.maxLife = 900 + Math.random() * 700;
        p.wanderPhase = Math.random() * Math.PI * 2;
        p.baseSpeed = 0.12 + Math.random() * 0.2;
      }
    }
  }

  function drawParticles() {
    if (!ctx) return;

    const scrollOpacity = getScrollOpacityMultiplier();

    for (const p of particles) {
      let alpha = p.alpha * scrollOpacity;
      const fadeTime = 120;
      if (p.life < fadeTime) {
        alpha *= p.life / fadeTime;
      } else if (p.life > p.maxLife - fadeTime) {
        alpha *= (p.maxLife - p.life) / fadeTime;
      }

      if (alpha < 0.02) continue; // Skip nearly invisible particles

      // Main particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, ${p.saturation}%, 45%, ${alpha})`;
      ctx.fill();

      // Glow
      if (alpha > 0.1) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, ${p.saturation}%, 50%, ${alpha * 0.1})`;
        ctx.fill();
      }
    }
  }

  function drawContours() {
    if (!ctx || width === 0 || height === 0) return;

    ctx.fillStyle = '#f5f7fa';
    ctx.fillRect(0, 0, width, height);

    const resolution = 10;
    const cols = Math.ceil(width / resolution) + 1;
    const rows = Math.ceil(height / resolution) + 1;

    const grid: number[][] = [];
    for (let j = 0; j < rows; j++) {
      grid[j] = [];
      for (let i = 0; i < cols; i++) {
        grid[j][i] = sampleNoise(i * resolution, j * resolution, time);
      }
    }

    const levels = 10;
    for (let level = 0; level < levels; level++) {
      const threshold = -0.65 + (1.3 * level) / (levels - 1);
      const t = (threshold + 0.65) / 1.3;

      const r = Math.round(100 + t * 50);
      const g = Math.round(130 + t * 40);
      const b = Math.round(145 + t * 30);
      const alpha = 0.25 + t * 0.2;

      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      ctx.lineWidth = 0.7 + t * 0.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      drawContourLevel(grid, cols, rows, resolution, threshold);
    }

    updateParticles();
    drawParticles();
  }

  function drawContourLevel(
    grid: number[][],
    cols: number,
    rows: number,
    resolution: number,
    threshold: number
  ) {
    if (!ctx) return;

    ctx.beginPath();

    for (let j = 0; j < rows - 1; j++) {
      for (let i = 0; i < cols - 1; i++) {
        const tl = grid[j][i];
        const tr = grid[j][i + 1];
        const br = grid[j + 1][i + 1];
        const bl = grid[j + 1][i];

        let index = 0;
        if (tl >= threshold) index |= 1;
        if (tr >= threshold) index |= 2;
        if (br >= threshold) index |= 4;
        if (bl >= threshold) index |= 8;

        if (index === 0 || index === 15) continue;

        const x = i * resolution;
        const y = j * resolution;

        const top = lerp(x, x + resolution, (threshold - tl) / (tr - tl || 0.001));
        const right = lerp(y, y + resolution, (threshold - tr) / (br - tr || 0.001));
        const bottom = lerp(x + resolution, x, (threshold - br) / (bl - br || 0.001));
        const left = lerp(y + resolution, y, (threshold - bl) / (tl - bl || 0.001));

        switch (index) {
          case 1: case 14: line(x, left, top, y); break;
          case 2: case 13: line(top, y, x + resolution, right); break;
          case 3: case 12: line(x, left, x + resolution, right); break;
          case 4: case 11: line(x + resolution, right, bottom, y + resolution); break;
          case 5:
            line(x, left, top, y);
            line(x + resolution, right, bottom, y + resolution);
            break;
          case 6: case 9: line(top, y, bottom, y + resolution); break;
          case 7: case 8: line(x, left, bottom, y + resolution); break;
          case 10:
            line(x, left, bottom, y + resolution);
            line(top, y, x + resolution, right);
            break;
        }
      }
    }

    ctx.stroke();
  }

  function lerp(a: number, b: number, t: number): number {
    const clamped = Math.max(0, Math.min(1, t));
    return a + (b - a) * clamped;
  }

  function line(x1: number, y1: number, x2: number, y2: number) {
    if (!ctx) return;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
  }

  function animate() {
    time += 16;
    drawContours();
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
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    initParticles();
    drawContours();
  }

  function handleScroll() {
    if (!browser) return;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress = maxScroll > 0 ? Math.min(1, window.scrollY / maxScroll) : 0;
  }

  onMount(() => {
    seedX = Math.random() * 10000;
    seedY = Math.random() * 10000;
    time = Math.random() * 100000;

    handleResize();
    handleScroll();

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      animate();
    }
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
      rgba(245, 247, 250, 0.65) 0%,
      rgba(245, 247, 250, 0.3) 45%,
      transparent 75%
    );
    pointer-events: none;
  }
</style>
