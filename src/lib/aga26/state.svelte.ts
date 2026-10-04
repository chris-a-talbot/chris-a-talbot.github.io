/**
 * What the reader has picked, shared across the page: a metric picked in one chart is
 * highlighted in the other, and a population picked on one map is marked on both.
 */
export const ui = $state({
  /** The metric whose row is highlighted in the results charts (a row key: 'g2', 'rona', ...). */
  metric: null as string | null,
  /** The outcome shown on narrow screens, shared by both results charts (an arm id). */
  arm: 8,
  /** The metric whose citation-and-equation card is open. */
  method: null as string | null,
  /** The population picked on the forecast and fate maps. */
  pop: null as number | null,
  /** The presenter QR overlay. */
  qr: false
});
