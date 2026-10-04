/**
 * What each of the supplement's row charts draws: its rows, panels, marks, legend and read-out.
 * Every value is a cell of data/supplement.json; nothing is computed here but labels.
 */
import { signed, interval } from '../format';
import type { RowSpec, ColSpec, Mark, Detail, ChartSpec } from './types';
import { S, cell, MAIN, HEADERS, colour, OUTCOMES, persistence, readout } from './data';

const title1 = (c: ColSpec) => c.title.replace('\n', ' ');
const HEAD = OUTCOMES.map(title1);
const each = (f: (arm: string) => string) => OUTCOMES.map((c) => f(c.id));

// ---------------------------------------------------------------- latitude and the covariates
const LAT_ARM = '10'; // the 15 populations of change into the drought and persistence
const CONTROL_NAMES: Record<string, string> = {
  latitude: 'latitude',
  n_baseline: 'sample size',
  mean_dp_genomic: 'depth',
  r_mean_pre: 'pre-drought growth'
};
export const LATITUDE: ChartSpec = {
  id: 'latitude',
  rows: MAIN,
  headers: HEADERS,
  cols: OUTCOMES,
  colour,
  ceiling: persistence,
  side: {
    title: 'Spearman ρ\nwith latitude',
    values: Object.fromEntries(MAIN.map((r) => [r.key, cell(r.key, LAT_ARM).rho_lat]))
  },
  marks: (r: RowSpec, c: ColSpec): Mark[] => {
    const x = cell(r.key, c.id);
    return [
      { kind: 'dot', v: x.eff },
      { kind: 'cross', v: x.lat },
      { kind: 'diamond', v: x.joint }
    ];
  },
  legend: [
    { kind: 'side', label: 'Spearman ρ with latitude (15 populations; not sign-flipped)' },
    { kind: 'dot', label: '−ρ as observed' },
    { kind: 'cross', label: 'adjusted for latitude' },
    { kind: 'diamond', label: 'adjusted for all covariates together' },
    { kind: 'ceiling', label: 'rank correlation limit' }
  ],
  detail: (r: RowSpec): Detail => ({
    head: HEAD,
    rows: [
      ['−ρ as observed', each((a) => signed(cell(r.key, a).eff))],
      ['adjusted for latitude', each((a) => signed(cell(r.key, a).lat))],
      ['adjusted for baseline sample size', each((a) => signed(cell(r.key, a).nb))],
      ['adjusted for mean sequencing depth', each((a) => signed(cell(r.key, a).dp))],
      ['adjusted for pre-drought growth', each((a) => signed(cell(r.key, a).pre))],
      ['adjusted for all together', each((a) => signed(cell(r.key, a).joint))],
      ['ρ with latitude', each((a) => signed(cell(r.key, a).rho_lat))],
      ['ρ with sample size', each((a) => signed(cell(r.key, a).rho_nb))],
      ['ρ with depth', each((a) => signed(cell(r.key, a).rho_dp))],
      ['ρ with pre-drought growth', each((a) => signed(cell(r.key, a).rho_pre))],
      ['populations (n)', each((a) => String(cell(r.key, a).n))]
    ],
    note:
      'Adjusted values are partial Spearman correlations, sign-flipped like −ρ. “All together” controls for ' +
      OUTCOMES.map((c) => `${title1(c)}: ${cell(r.key, c.id).joint_controls.map((k) => CONTROL_NAMES[k]).join(', ')}`).join('; ') +
      '.'
  })
};

// ---------------------------------------------------------------- how extirpations are coded
const CODINGS: { col: ColSpec; poster: string; other: string; head: [string, string] }[] = [
  {
    col: { id: 'into', title: 'change into\nthe drought' },
    poster: '8',
    other: '4',
    head: ['into the drought: extirpated ranked worst (poster)', 'into the drought: survivors only']
  },
  {
    col: { id: 'out', title: 'change out of\nthe drought' },
    poster: '5',
    other: '9',
    head: ['out of the drought: survivors only (poster)', 'out of the drought: extirpated ranked worst']
  }
];
export const CODING: ChartSpec = {
  id: 'extirpation-coding',
  rows: MAIN,
  headers: HEADERS,
  cols: CODINGS.map((k) => k.col),
  colour,
  minWide: 520,
  marks: (r: RowSpec, c: ColSpec): Mark[] => {
    const k = CODINGS.find((k) => k.col.id === c.id)!;
    return [
      { kind: 'hollow', v: cell(r.key, k.other).eff },
      { kind: 'dot', v: cell(r.key, k.poster).eff }
    ];
  },
  legend: [
    { kind: 'dot', label: 'as on the poster' },
    { kind: 'hollow', label: 'the other coding' }
  ],
  detail: (r: RowSpec): Detail => {
    const arms = CODINGS.flatMap((k) => [k.poster, k.other]);
    return {
      head: CODINGS.flatMap((k) => k.head),
      rows: [
        ['−ρ', arms.map((a) => readout(cell(r.key, a)).eff)],
        ['95% bootstrap interval', arms.map((a) => readout(cell(r.key, a)).ci)],
        ['populations (n)', arms.map((a) => readout(cell(r.key, a)).n)],
        ['permutation p', arms.map((a) => readout(cell(r.key, a)).p)]
      ]
    };
  }
};

// ---------------------------------------------------------------- leave one out
interface Loo {
  lo: number;
  hi: number;
  sig: number;
  n: number;
}
const LOO = S.loo as unknown as Record<string, Record<string, Loo>>;
export const LEAVE_ONE_OUT: ChartSpec = {
  id: 'leave-one-out',
  rows: MAIN,
  headers: HEADERS,
  cols: OUTCOMES,
  colour,
  ceiling: persistence,
  marks: (r: RowSpec, c: ColSpec): Mark[] => [
    { kind: 'band', lo: LOO[r.key][c.id].lo, hi: LOO[r.key][c.id].hi },
    { kind: 'dot', v: cell(r.key, c.id).eff }
  ],
  legend: [
    { kind: 'band', label: 'range with one population left out' },
    { kind: 'dot', label: '−ρ with every population' },
    { kind: 'ceiling', label: 'rank correlation limit (all 15)' }
  ],
  detail: (r: RowSpec): Detail => ({
    head: HEAD,
    rows: [
      ['−ρ with every population', each((a) => signed(cell(r.key, a).eff))],
      ['range, one left out', each((a) => interval(LOO[r.key][a].lo, LOO[r.key][a].hi))],
      ['subsamples with p < 0.05', each((a) => `${LOO[r.key][a].sig} of ${LOO[r.key][a].n}`)]
    ]
  })
};
