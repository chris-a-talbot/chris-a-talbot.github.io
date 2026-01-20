import type { TerrainNoiseFn } from './noise';

export interface ContourLine {
  id: string;
  elevation: number;
  paths: string[];  // Multiple disconnected paths per elevation
  opacity: number;
  color: string;
  strokeWidth: number;
}

export interface ContourConfig {
  width: number;
  height: number;
  resolution: number;
  levels: number;
  yOffset: number;  // For sampling different parts of noise field
}

/**
 * Sample noise field on a grid
 */
function sampleGrid(
  noise: TerrainNoiseFn,
  config: ContourConfig
): Float32Array {
  const cols = Math.ceil(config.width / config.resolution) + 1;
  const rows = Math.ceil(config.height / config.resolution) + 1;
  const grid = new Float32Array(cols * rows);

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const x = i * config.resolution;
      const y = j * config.resolution + config.yOffset;
      // Use y as z-dimension too for more variation
      grid[j * cols + i] = noise(x, y, y * 0.0001);
    }
  }

  return grid;
}

/**
 * Marching squares lookup table
 */
const EDGE_TABLE: Record<number, Array<[number, number]>> = {
  0: [], 15: [],
  1: [[3, 0]], 14: [[0, 3]],
  2: [[0, 1]], 13: [[1, 0]],
  3: [[3, 1]], 12: [[1, 3]],
  4: [[1, 2]], 11: [[2, 1]],
  5: [[3, 0], [1, 2]], 10: [[0, 1], [2, 3]],
  6: [[0, 2]], 9: [[2, 0]],
  7: [[3, 2]], 8: [[2, 3]],
};

function interpolate(v1: number, v2: number, threshold: number): number {
  if (Math.abs(v2 - v1) < 0.0001) return 0.5;
  return (threshold - v1) / (v2 - v1);
}

function getEdgePoint(
  edge: number,
  cellX: number,
  cellY: number,
  resolution: number,
  t: number
): [number, number] {
  switch (edge) {
    case 0: return [cellX + t * resolution, cellY];
    case 1: return [cellX + resolution, cellY + t * resolution];
    case 2: return [cellX + (1 - t) * resolution, cellY + resolution];
    case 3: return [cellX, cellY + (1 - t) * resolution];
    default: return [cellX, cellY];
  }
}

/**
 * Extract line segments at a threshold, then connect them into paths
 */
function extractContourPaths(
  grid: Float32Array,
  cols: number,
  rows: number,
  resolution: number,
  threshold: number
): string[] {
  // Collect all segments as point pairs
  const segments: Array<[[number, number], [number, number]]> = [];

  for (let j = 0; j < rows - 1; j++) {
    for (let i = 0; i < cols - 1; i++) {
      const tl = grid[j * cols + i];
      const tr = grid[j * cols + i + 1];
      const br = grid[(j + 1) * cols + i + 1];
      const bl = grid[(j + 1) * cols + i];

      let cellIndex = 0;
      if (tl >= threshold) cellIndex |= 1;
      if (tr >= threshold) cellIndex |= 2;
      if (br >= threshold) cellIndex |= 4;
      if (bl >= threshold) cellIndex |= 8;

      const edges = EDGE_TABLE[cellIndex];
      if (!edges || edges.length === 0) continue;

      const edgeT = [
        interpolate(tl, tr, threshold),
        interpolate(tr, br, threshold),
        interpolate(br, bl, threshold),
        interpolate(bl, tl, threshold),
      ];

      const cellX = i * resolution;
      const cellY = j * resolution;

      for (const [e1, e2] of edges) {
        const p1 = getEdgePoint(e1, cellX, cellY, resolution, edgeT[e1]);
        const p2 = getEdgePoint(e2, cellX, cellY, resolution, edgeT[e2]);
        segments.push([p1, p2]);
      }
    }
  }

  // Connect segments into continuous paths
  return connectSegments(segments);
}

/**
 * Connect line segments into continuous paths with smooth curves
 */
function connectSegments(segments: Array<[[number, number], [number, number]]>): string[] {
  if (segments.length === 0) return [];

  const paths: string[] = [];
  const used = new Set<number>();
  const tolerance = 0.5;

  function pointsClose(p1: [number, number], p2: [number, number]): boolean {
    return Math.abs(p1[0] - p2[0]) < tolerance && Math.abs(p1[1] - p2[1]) < tolerance;
  }

  function findConnected(point: [number, number], exclude: number): number {
    for (let i = 0; i < segments.length; i++) {
      if (used.has(i) || i === exclude) continue;
      if (pointsClose(segments[i][0], point) || pointsClose(segments[i][1], point)) {
        return i;
      }
    }
    return -1;
  }

  for (let start = 0; start < segments.length; start++) {
    if (used.has(start)) continue;

    const chain: [number, number][] = [segments[start][0], segments[start][1]];
    used.add(start);

    // Extend forward
    let current = chain[chain.length - 1];
    let next = findConnected(current, start);
    while (next !== -1) {
      used.add(next);
      const seg = segments[next];
      if (pointsClose(seg[0], current)) {
        chain.push(seg[1]);
        current = seg[1];
      } else {
        chain.push(seg[0]);
        current = seg[0];
      }
      next = findConnected(current, next);
    }

    // Extend backward
    current = chain[0];
    next = findConnected(current, start);
    while (next !== -1) {
      used.add(next);
      const seg = segments[next];
      if (pointsClose(seg[0], current)) {
        chain.unshift(seg[1]);
        current = seg[1];
      } else {
        chain.unshift(seg[0]);
        current = seg[0];
      }
      next = findConnected(current, next);
    }

    if (chain.length >= 2) {
      paths.push(smoothPath(chain));
    }
  }

  return paths;
}

/**
 * Convert points to smooth SVG path using Catmull-Rom splines
 */
function smoothPath(points: [number, number][]): string {
  if (points.length < 2) return '';
  if (points.length === 2) {
    return `M${points[0][0].toFixed(1)},${points[0][1].toFixed(1)}L${points[1][0].toFixed(1)},${points[1][1].toFixed(1)}`;
  }

  const d: string[] = [`M${points[0][0].toFixed(1)},${points[0][1].toFixed(1)}`];

  // Use quadratic curves through midpoints for smoothing
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];

    if (i === 0) {
      // First segment - line to midpoint
      const mid = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
      d.push(`L${mid[0].toFixed(1)},${mid[1].toFixed(1)}`);
    } else if (i === points.length - 2) {
      // Last segment
      d.push(`Q${p0[0].toFixed(1)},${p0[1].toFixed(1)},${p1[0].toFixed(1)},${p1[1].toFixed(1)}`);
    } else {
      // Middle segments - quadratic curve through point to next midpoint
      const mid = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
      d.push(`Q${p0[0].toFixed(1)},${p0[1].toFixed(1)},${mid[0].toFixed(1)},${mid[1].toFixed(1)}`);
    }
  }

  return d.join('');
}

/**
 * Color palette - cool earth tones transitioning by elevation
 */
function getContourStyle(elevation: number, normalizedY: number): { color: string; opacity: number; strokeWidth: number } {
  const t = (elevation + 1) / 2; // 0 to 1

  // Colors shift from teal at top to deeper blue-gray at bottom
  const depthInfluence = normalizedY * 0.3;

  const r = Math.round(50 + t * 50 - depthInfluence * 30);
  const g = Math.round(90 + t * 50 - depthInfluence * 20);
  const b = Math.round(100 + t * 40 + depthInfluence * 20);

  // Higher elevations are more prominent
  const opacity = 0.2 + t * 0.4 + (1 - normalizedY) * 0.1;

  // Stroke width varies by elevation - ridges thicker than valleys
  const strokeWidth = 0.8 + t * 0.8;

  return {
    color: `rgb(${r}, ${g}, ${b})`,
    opacity: Math.min(0.7, opacity),
    strokeWidth
  };
}

/**
 * Generate contours for a section of the terrain
 */
export function generateContours(
  noise: TerrainNoiseFn,
  config: ContourConfig,
  normalizedY: number = 0
): ContourLine[] {
  const cols = Math.ceil(config.width / config.resolution) + 1;
  const rows = Math.ceil(config.height / config.resolution) + 1;
  const grid = sampleGrid(noise, config);

  const contours: ContourLine[] = [];

  for (let i = 0; i < config.levels; i++) {
    const elevation = -0.8 + (1.6 * i) / (config.levels - 1);
    const paths = extractContourPaths(grid, cols, rows, config.resolution, elevation);

    if (paths.length > 0) {
      const style = getContourStyle(elevation, normalizedY);

      contours.push({
        id: `contour-${config.yOffset}-${i}`,
        elevation,
        paths,
        ...style
      });
    }
  }

  return contours;
}
