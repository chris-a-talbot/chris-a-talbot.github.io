/** The shapes RowChart draws from (see specs.ts). */
export interface RowSpec {
  key: string;
  number: string;
  name: string;
  cls: string;
  /** Rows of one group sit together; a group with a header gets it above its first row. */
  group: string;
}
export interface ColSpec {
  id: string;
  /** May break onto two lines with "\n". */
  title: string;
}
export type Mark =
  | { kind: 'dot' | 'hollow' | 'cross' | 'plus' | 'diamond'; v: number | null | undefined }
  | { kind: 'ci' | 'band'; lo: number | null | undefined; hi: number | null | undefined };
export interface Detail {
  head: string[];
  rows: [string, string[]][];
  note?: string;
}
export interface LegendItem {
  kind: Mark['kind'] | 'ceiling' | 'side';
  label: string;
}
/** Everything a RowChart takes. */
export interface ChartSpec {
  id: string;
  rows: RowSpec[];
  headers?: Record<string, string>;
  cols: ColSpec[];
  marks: (r: RowSpec, c: ColSpec) => Mark[];
  colour: (r: RowSpec) => string;
  ceiling?: (c: ColSpec) => number | null;
  side?: { title: string; values: Record<string, number | null> };
  legend: LegendItem[];
  detail?: (r: RowSpec) => Detail;
  minWide?: number;
}
