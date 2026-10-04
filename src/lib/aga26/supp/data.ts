/**
 * The supplement's data (data/supplement.json, from poster_offset/web_supplement.py), typed and
 * shaped for its charts: the poster's rows and outcomes, one colour per metric class, and the
 * cells every chart reads.
 */
import S from '../data/supplement.json';
import { C } from '../theme';
import { signed, pval, interval } from '../format';
import type { RowSpec, ColSpec } from './types';

export { S };

export interface Cell {
  n: number;
  eff: number;
  lo: number | null;
  hi: number | null;
  ci_reliable: boolean;
  p_perm: number;
  lat: number | null;
  nb: number | null;
  dp: number | null;
  pre: number | null;
  joint: number | null;
  joint_controls: string[];
  rho_lat: number | null;
  rho_nb: number | null;
  rho_dp: number | null;
  rho_pre: number | null;
}

const CELLS = S.cells as unknown as Record<string, Record<string, Cell>>;
export const cell = (key: string, arm: number | string): Cell => CELLS[key][String(arm)];

const ROW = Object.fromEntries(S.rows.map((r) => [r.key, r]));
export const row = (key: string, group?: string): RowSpec => ({ ...ROW[key], group: group ?? ROW[key].cls });

/** The poster's nine rows (figures 9 and 10), under the poster's two group headers. */
export const MAIN: RowSpec[] = S.main.map((k) => row(k));
export const HEADERS: Record<string, string> = S.groups;

/** The poster's colours: environmental-change lake, observed-reference spruce, benchmark ink. */
const COLOUR: Record<string, string> = { blind: C.lake, aware: C.spruce, bench: C.ink };
export const colour = (r: RowSpec) => COLOUR[r.cls] ?? C.ink;

/** The poster's three outcomes, in its order. */
export const OUTCOMES: ColSpec[] = [
  { id: '8', title: 'change into\nthe drought' },
  { id: '10', title: 'persistence' },
  { id: '5', title: 'change out of\nthe drought' }
];
export const RMAX = S.limits.rho_max;
export const persistence = (c: ColSpec) => (c.id === '10' ? RMAX : null);

/** The poster's read-out rows for one cell: −ρ, interval, partials, n, p. */
export function readout(c: Cell) {
  return {
    eff: signed(c.eff),
    ci: c.ci_reliable && c.lo != null && c.hi != null ? interval(c.lo, c.hi) : '—',
    lat: signed(c.lat),
    pre: signed(c.pre),
    n: String(c.n),
    p: pval(c.p_perm)
  };
}
