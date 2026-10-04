/**
 * The row layout of figures 9 and 10, ported from poster_offset/common.py: main_layout (in the
 * poster's wide mode, gap 0.35 and header step 0.75), main_rules and the y limits of
 * main_rows_axis. Units are rows; y runs downward from the first header at 0.
 */
export interface Row {
  number: string;
  key: string;
  name: string;
  cls: string;
}

export interface Header {
  y: number;
  text: string;
  cls: string;
}

export interface Layout {
  ypos: Record<string, number>;
  headers: Header[];
  rules: number[];
  top: number;
  bottom: number;
}

export function mainLayout(
  rows: Row[],
  groups: Record<string, string>,
  gap = 0.35,
  step = 0.75
): Layout {
  let y = 0;
  let prev: string | null = null;
  const ypos: Record<string, number> = {};
  const headers: Header[] = [];
  for (const o of rows) {
    if (o.cls !== prev) {
      if (o.cls in groups) {
        if (prev !== null) y -= gap;
        headers.push({ y, text: groups[o.cls], cls: o.cls });
        y -= step;
      } else if (prev !== null) {
        y -= gap;
      }
    }
    ypos[o.key] = y;
    y -= 1;
    prev = o.cls;
  }
  // main_rules: above the second group's header, and above climate distance when present
  const obs = headers.find((h) => h.cls === 'aware')!.y;
  const lastEnv = Math.min(...rows.filter((o) => o.cls === 'blind').map((o) => ypos[o.key]));
  const lastObs = Math.min(...rows.filter((o) => o.cls === 'aware').map((o) => ypos[o.key]));
  const rules = [(obs + lastEnv) / 2 + 0.05];
  if ('climate' in ypos) rules.push((lastObs + ypos.climate) / 2);
  return {
    ypos,
    headers,
    rules,
    top: Math.max(...headers.map((h) => h.y)) + 0.55,
    bottom: Math.min(...Object.values(ypos)) - 0.7
  };
}

/** The row label every figure uses: "1  G²"; the benchmark "C  climate distance". */
export const rowLabel = (o: Row) => `${o.number}  ${o.name}`;
