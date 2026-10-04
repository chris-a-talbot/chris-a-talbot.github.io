/**
 * TeX typesetting for the method cards, by KaTeX. Loaded on demand (MethodDialog imports this
 * module dynamically), so the poster page itself carries none of KaTeX's script or fonts.
 * KaTeX writes MathML alongside its HTML, so screen readers read the equations as maths.
 */
import katex from 'katex';
import 'katex/dist/katex.min.css';

const OPTS = { throwOnError: false, strict: 'ignore' as const, output: 'htmlAndMathml' as const };

/** A display equation. */
export function display(tex: string): string {
  return katex.renderToString(tex, { ...OPTS, displayMode: true });
}

/** An inline symbol. */
export function inline(tex: string): string {
  return katex.renderToString(tex, OPTS);
}

/** HTML in which $…$ marks inline TeX. A symbol keeps its trailing punctuation ("l’s", "x,")
    on the same line. */
export function prose(html: string): string {
  return html.replace(
    /\$([^$]+)\$([^\s<$]*)/g,
    (_, tex: string, tail: string) => `<span style="white-space:nowrap">${inline(tex)}${tail}</span>`
  );
}
