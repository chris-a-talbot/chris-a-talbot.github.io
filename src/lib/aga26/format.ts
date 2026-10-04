/** Number formats for the read-outs. Display only: the data are never rounded. */
export const MINUS = '−';

/** A signed value with a true minus sign: +0.19, −0.60, 0.00. */
export function signed(v: number | null | undefined, digits = 2): string {
  if (v == null || !Number.isFinite(v)) return '—';
  const s = Math.abs(v).toFixed(digits);
  if (Number(s) === 0) return s;
  return (v < 0 ? MINUS : '+') + s;
}

/** A p-value to two significant figures: 0.021, 0.0044, 0.80. */
export function pval(p: number | null | undefined): string {
  if (p == null || !Number.isFinite(p)) return '—';
  return p.toPrecision(2);
}

/** "[−0.90, +0.01]" */
export function interval(lo: number | null, hi: number | null): string {
  return `[${signed(lo)}, ${signed(hi)}]`;
}
