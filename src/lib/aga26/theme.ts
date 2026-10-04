/**
 * The AGA 2026 poster's palette, copied from the poster scripts' theme.py so the web
 * version draws in exactly the poster's colours. Panel tints were sampled from the
 * exported poster PDF (AGA26_cat267.pdf).
 */
export const C = {
  carnelian: '#b31b1b',
  lake: '#1f4396',
  amber: '#a56a00',
  spruce: '#0a7f5c',
  sky: '#267ac4',
  heather: '#90608f',
  stone: '#929295',
  paper: '#ffffff',
  panel: '#f3f2ef',
  rule: '#bdbbbb',
  ink: '#222222',
  softInk: '#55565a',
  viridisDark: '#440154'
} as const;

/** theme.tint: `frac` of `hex` mixed over `over`, as an opaque hex. */
export function tint(hex: string, frac: number, over: string = C.paper): string {
  const a = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const b = [1, 3, 5].map((i) => parseInt(over.slice(i, i + 2), 16));
  return (
    '#' +
    a
      .map((x, k) => Math.round(frac * x + (1 - frac) * b[k]).toString(16).padStart(2, '0'))
      .join('')
  );
}

/** One colour per metric class, as common.STYLE (figures 9 and 10 use circles only). */
export const CLASS_COLOUR: Record<string, string> = {
  blind: C.lake,
  aware: C.spruce,
  bench: C.ink
};

/** Where the poster's files live once the site is built. */
export const FILES = '/files/aga26';
export const PDF = '/files/posters/AGA_2026_Poster.pdf';
export const URL = 'https://chris-a-talbot.com/AGA26';
