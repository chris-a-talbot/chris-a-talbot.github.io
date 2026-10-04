/**
 * The citation-and-equation card for each metric in "We assessed 8 different offsets".
 *
 * Sources, so these can be checked: the calculations are the project's declared forms as
 * written up in cardinalis/poster_offset/OFFSETS_11.md (pipeline/OFFSETS.tsv,
 * scripts/t06_offsets.py, t06_offsets.R); the references are offset/review/references.bib,
 * with the DOIs verified in cardinalis/poster_accuracy_audit.md.
 * Citations and mathematics only, by request: no interpretation.
 *
 * Strings are HTML. Maths uses the poster's equation face (Source Sans 3) through the
 * `.m` class; bold = vector or matrix, as on the poster.
 */

export interface Reference {
  /** Authors, year, title and venue, as HTML. */
  html: string;
  doi?: string;
  /** Shown before the reference, e.g. "Software". */
  role?: string;
}

export interface Method {
  key: string;
  /** The poster's list number: "1".."8", or "C". */
  number: string;
  /** The poster's list name. */
  name: string;
  /** The poster's short citation, without parentheses. */
  cite: string;
  group: 'environmental' | 'observed' | 'benchmark';
  refs: Reference[];
  /** Calculation steps, where an equation alone does not define the statistic. */
  steps?: string[];
  equations: string[];
  notation: [symbol: string, meaning: string][];
}

// ---------------------------------------------------------------- shared symbols
const zi = '<b>z</b><sub><i>i</i></sub>';
const zs = '<b>z</b><sup>*</sup><sub><i>i</i></sub>';
const dz = 'Δ<b>z</b><sub><i>i</i></sub>';
const T = '<sup>⊤</sup>';
const sumL = 'Σ<sub><i>l</i></sub>';
const invL = '(1/<i>L</i>)';
/** A circumflex inside the letter's own element, so the mark stays on its glyph. */
const hat = (s: string) => (/<\/[ib]>$/.test(s) ? s.replace(/(<\/[ib]>)$/, '\u0302$1') : `${s}\u0302`);
const sq = '<sup>2</sup><sub>2</sub>';

const N = {
  i: ['<i>i</i>', 'population'],
  l: ['<i>l</i>, <i>L</i>', 'candidate locus; number of candidate loci'],
  z: [
    `${zi}, ${zs}`,
    'population <i>i</i>’s baseline climate and its drought-scenario climate, both standardised with the baseline populations’ means and SDs'
  ],
  dz: [dz, `${zs} − ${zi}`],
  d: ['<i>d</i>', 'number of climate variables'],
  Z: ['<b>Z</b>', 'the <i>n</i> × <i>d</i> matrix of the populations’ climates <b>z</b><sub><i>i</i></sub>'],
  y: ['<i>y</i><sub><i>il</i></sub>', 'population <i>i</i>’s observed allele frequency at locus <i>l</i>']
} satisfies Record<string, [string, string]>;

// ---------------------------------------------------------------- references
const R = {
  gain2023: {
    html: 'Gain C, Rhoné B, Cubry P, Salazar I, Forbes F, Vigouroux Y, Jay F, François O (2023). A quantitative theory for genomic offset statistics. <i>Molecular Biology and Evolution</i> 40(6): msad140.',
    doi: '10.1093/molbev/msad140'
  },
  lea3: {
    role: 'Software',
    html: 'Gain C, François O (2021). LEA 3: factor models in population genetics and ecological genomics with R. <i>Molecular Ecology Resources</i> 21(8): 2738–2748.'
  },
  lfmm2: {
    role: 'Software',
    html: 'Caye K, Jumentier B, Lepeule J, François O (2019). LFMM 2: fast and accurate inference of gene–environment associations in genome-wide studies. <i>Molecular Biology and Evolution</i> 36(4): 852–860.'
  },
  fitzpatrick2015: {
    html: 'Fitzpatrick MC, Keller SR (2015). Ecological genomics meets community-level modelling of biodiversity: mapping the genomic landscape of current and future environmental adaptation. <i>Ecology Letters</i> 18(1): 1–16.',
    doi: '10.1111/ele.12376'
  },
  ellis2012: {
    role: 'Gradient forests',
    html: 'Ellis N, Smith SJ, Pitcher CR (2012). Gradient forests: calculating importance gradients on physical predictors. <i>Ecology</i> 93(1): 156–168.'
  },
  capblancq2021: {
    html: 'Capblancq T, Forester BR (2021). Redundancy analysis: a Swiss Army Knife for landscape genomics. <i>Methods in Ecology and Evolution</i> 12(12): 2298–2309.',
    doi: '10.1111/2041-210X.13722'
  },
  matz2025: {
    html: 'Matz MV, Black KL (2025). RDAforest: identifying environmental drivers of polygenic adaptation. <i>Molecular Ecology Resources</i> 25(8): e70002.',
    doi: '10.1111/1755-0998.70002'
  },
  rellstab2016: {
    html: 'Rellstab C, Zoller S, Walthert L, Lesur I, Pluess AR, Graf R, Bodénès C, Sperisen C, Kremer A, Gugerli F (2016). Signatures of local adaptation in candidate genes of oaks (<i>Quercus</i> spp.) with respect to present and future climatic conditions. <i>Molecular Ecology</i> 25(23): 5907–5924.',
    doi: '10.1111/mec.13889'
  },
  reis2026: {
    html: 'Reis GA, Forister ML, Lucas LK, Shapiro AM, Fordyce JA, Nice CC, Gompert Z (2026). Genomic offset is not predictive of recent demographic trends in <i>Lycaeides</i> butterflies. bioRxiv preprint.',
    doi: '10.64898/2026.06.21.733565'
  },
  borrell2020: {
    html: 'Borrell JS, Zohren J, Nichols RA, Buggs RJA (2020). Genomic assessment of local adaptation in dwarf birch to inform assisted gene flow. <i>Evolutionary Applications</i> 13(1): 161–175.',
    doi: '10.1111/eva.12883'
  },
  mahony2017: {
    html: 'Mahony CR, Cannon AJ, Wang T, Aitken SN (2017). A closer look at novel climates: new methods and insights at continental to landscape scales. <i>Global Change Biology</i> 23(9): 3934–3955.',
    doi: '10.1111/gcb.13645'
  }
} satisfies Record<string, Reference>;

// ---------------------------------------------------------------- the nine cards
export const METHODS: Method[] = [
  {
    key: 'g2',
    number: '1',
    name: 'Geometric offset (G²)',
    cite: 'Gain et al., 2023',
    group: 'environmental',
    refs: [R.gain2023, R.lea3, R.lfmm2],
    steps: ['Fit LFMM2 to individual genotypes at the candidate loci; compute G² with <code>LEA::genetic.gap</code>.'],
    equations: [
      `<b>Y</b> = <b>Z B</b>${T} + <b>U V</b>${T} + <b>E</b>`,
      `G<sup>2</sup><sub><i>i</i></sub> = ${dz}${T} <b>C</b><sub><i>b</i></sub> ${dz} = ${invL} ${sumL} (<b>b</b><sub><i>l</i></sub>${T}${dz})<sup>2</sup>`,
      `<b>C</b><sub><i>b</i></sub> = <b>B</b>${T}<b>B</b> / <i>L</i>`
    ],
    notation: [
      ['<b>Y</b>', 'individuals’ genotypes at the candidate loci'],
      ['<b>Z</b>', 'the individuals’ climates'],
      ['<b>B</b>', 'the <i>L</i> × <i>d</i> matrix of climate effect sizes; row <b>b</b><sub><i>l</i></sub> is locus <i>l</i>’s'],
      ['<b>U</b>, <b>V</b>', '<i>K</i> latent factors and their loadings'],
      ['<b>E</b>', 'residuals'],
      N.dz,
      N.z,
      N.l,
      N.i
    ]
  },
  {
    key: 'gf',
    number: '2',
    name: 'Gradient Forest',
    cite: 'Fitzpatrick & Keller, 2015',
    group: 'environmental',
    refs: [R.fitzpatrick2015, R.ellis2012],
    steps: [
      'Fit <code>gradientForest</code> of candidate-locus allele frequencies on climate.',
      'Each climate variable <i>v</i> gets a cumulative-importance (turnover) function <i>f</i><sub><i>v</i></sub>.',
      'Average the offset over several random seeds.'
    ],
    equations: [`GF<sub><i>i</i></sub> = ‖ <b>f</b>(${zs}) − <b>f</b>(${zi}) ‖<sub>2</sub>`],
    notation: [
      ['<b>f</b>', 'the vector of turnover functions (<i>f</i><sub>1</sub>, …, <i>f</i><sub><i>d</i></sub>)'],
      N.z,
      N.d,
      N.i
    ]
  },
  {
    key: 'rda',
    number: '3',
    name: 'RDA',
    cite: 'Capblancq & Forester, 2021',
    group: 'environmental',
    refs: [R.capblancq2021],
    steps: [
      'Fit a plain RDA of candidate-locus allele frequencies on climate (<code>vegan::rda</code>).',
      'Project <b>z</b> and <b>z</b><sup>*</sup> onto the constrained axes (the adaptive index).',
      'Retain axes with <i>w</i><sub><i>k</i></sub> &gt; 0.01: all three constrained axes (<i>w</i> = 0.17536, 0.03133, 0.02030).'
    ],
    equations: [
      `RDA<sub><i>i</i></sub> = √[ Σ<sub><i>k</i></sub> <i>w</i><sub><i>k</i></sub> (AI<sub><i>k</i></sub>(${zs}) − AI<sub><i>k</i></sub>(${zi}))<sup>2</sup> ]`,
      '<i>w</i><sub><i>k</i></sub> = λ<sub><i>k</i></sub> / total inertia'
    ],
    notation: [
      ['AI<sub><i>k</i></sub>', 'adaptive index: the projection of a climate onto constrained axis <i>k</i>'],
      ['λ<sub><i>k</i></sub>', 'the eigenvalue of constrained axis <i>k</i>'],
      ['<i>w</i><sub><i>k</i></sub>', 'axis <i>k</i>’s weight'],
      N.z,
      N.i
    ]
  },
  {
    key: 'rdaforest',
    number: '4',
    name: 'RDAforest',
    cite: 'Matz & Black, 2025',
    group: 'environmental',
    refs: [R.matz2025],
    steps: [
      'Compute genetic distances (IBS) among individuals, then their principal coordinates.',
      'Fit jackknifed random forests (<code>ordinationJackknife</code>) that predict those coordinates from climate, conditioned on spatial position.',
      'The offset is the Euclidean distance between a population’s predicted genetic position at <b>z</b><sup>*</sup> and at <b>z</b>, scaled as <code>gen_offset_oj</code> does (by the 90th percentile).',
      'Genome-wide markers (an LD-pruned draw), not the candidate loci.'
    ],
    equations: [`RDAforest<sub><i>i</i></sub> ∝ ‖ <b>ĝ</b>(${zs}) − <b>ĝ</b>(${zi}) ‖<sub>2</sub>`],
    notation: [
      ['<b>ĝ</b>(<b>z</b>)', 'the predicted position in genetic principal-coordinate space under climate <b>z</b>'],
      N.z,
      N.i
    ]
  },
  {
    key: 'rona',
    number: '5',
    name: 'RONA',
    cite: 'Rellstab et al., 2016',
    group: 'observed',
    refs: [R.rellstab2016],
    equations: [
      `<i>y</i><sub><i>il</i></sub> = ${hat('<i>a</i>')}<sub><i>l</i></sub> + ${hat('<i>s</i>')}<sub><i>l</i></sub> <i>z</i><sub><i>i</i>,<i>k</i>(<i>l</i>)</sub> + ${hat('<i>e</i>')}<sup>(<i>k</i>)</sup><sub><i>il</i></sub>`,
      `RONA<sub><i>i</i></sub> = ${invL} ${sumL} | ${hat('<i>a</i>')}<sub><i>l</i></sub> + ${hat('<i>s</i>')}<sub><i>l</i></sub> <i>z</i><sup>*</sup><sub><i>i</i>,<i>k</i>(<i>l</i>)</sub> − <i>y</i><sub><i>il</i></sub> |`,
      `= ${invL} ${sumL} | ${hat('<i>s</i>')}<sub><i>l</i></sub> Δ<i>z</i><sub><i>i</i>,<i>k</i>(<i>l</i>)</sub> − ${hat('<i>e</i>')}<sup>(<i>k</i>)</sup><sub><i>il</i></sub> |`
    ],
    notation: [
      ['<i>k</i>(<i>l</i>)', 'the one climate variable assigned to locus <i>l</i>'],
      [
        `${hat('<i>a</i>')}<sub><i>l</i></sub>, ${hat('<i>s</i>')}<sub><i>l</i></sub>`,
        'intercept and slope of the regression of locus <i>l</i>’s frequency on that variable, across populations'
      ],
      [`${hat('<i>e</i>')}<sup>(<i>k</i>)</sup><sub><i>il</i></sub>`, 'its residual'],
      N.y,
      N.z,
      N.l,
      N.i
    ]
  },
  {
    key: 'crona',
    number: '6',
    name: 'Residual c-RONA',
    cite: 'Reis et al., 2026',
    group: 'observed',
    refs: [R.reis2026, { ...R.borrell2020, role: 'c-RONA' }],
    steps: [
      `Fit the OLS of each candidate locus’s allele frequency on [1, <b>Z</b>], giving residuals ${hat('<i>e</i>')}<sub><i>il</i></sub>.`
    ],
    equations: [`C<sub><i>i</i></sub> = ${invL} ${sumL} | ${hat('<i>e</i>')}<sub><i>il</i></sub> |`],
    notation: [
      [`${hat('<i>e</i>')}<sub><i>il</i></sub>`, 'population <i>i</i>’s OLS residual at locus <i>l</i>'],
      N.Z,
      N.l,
      N.i
    ]
  },
  {
    key: 'frona',
    number: '7',
    name: 'f-RONA',
    cite: 'Borrell et al., 2020',
    group: 'observed',
    refs: [R.borrell2020],
    steps: [
      'For each climate variable <i>k</i>, fit a ridge regression of <i>z</i><sub><i>k</i></sub> on the allele frequencies at its assigned loci (variance ratio by REML, as <code>rrBLUP::mixed.solve</code>; Endelman 2011).',
      `Fit it leave-one-out, so each population’s predicted value ${hat('<i>z</i>')}<sub><i>ik</i></sub> comes from a model it was not part of.`
    ],
    equations: [
      `f-RONA<sub><i>i</i></sub> = (1/<i>d</i>) Σ<sub><i>k</i></sub> | <i>z</i><sup>*</sup><sub><i>ik</i></sub> − ${hat('<i>z</i>')}<sub><i>ik</i></sub> |&ensp;(in SD units)`
    ],
    notation: [
      [`${hat('<i>z</i>')}<sub><i>ik</i></sub>`, 'population <i>i</i>’s predicted value of climate variable <i>k</i> from its allele frequencies'],
      ['<i>z</i><sup>*</sup><sub><i>ik</i></sub>', 'its drought-scenario value of variable <i>k</i>'],
      N.d,
      N.i
    ]
  },
  {
    key: 'g2_obs',
    number: '8',
    name: 'Observed-frequency G²',
    cite: 'new',
    group: 'observed',
    refs: [{ html: 'This study.' }, R.lea3, R.lfmm2],
    steps: [`Fit LFMM2 (<code>LEA::lfmm2</code>) to the <i>n</i> × <i>L</i> matrix of candidate-locus population allele frequencies, with <i>K</i> latent factors and ridge λ = 10<sup>−5</sup>.`],
    equations: [
      `<i>y</i><sub><i>il</i></sub> = μ<sub><i>l</i></sub> + <b>b</b><sub><i>l</i></sub>${T}${zi} + <b>u</b><sub><i>i</i></sub>${T}<b>v</b><sub><i>l</i></sub> + <i>e</i><sub><i>il</i></sub>`,
      `${hat('<i>e</i>')}<sub><i>il</i></sub> = <i>y</i><sub><i>il</i></sub> − ${hat('μ')}<sub><i>l</i></sub> − ${hat('<b>b</b>')}<sub><i>l</i></sub>${T}${zi} − ${hat('<b>u</b>')}<sub><i>i</i></sub>${T}${hat('<b>v</b>')}<sub><i>l</i></sub>`,
      `<i>y</i><sup>*</sup><sub><i>il</i></sub> = ${hat('μ')}<sub><i>l</i></sub> + ${hat('<b>b</b>')}<sub><i>l</i></sub>${T}${zs} + ${hat('<b>u</b>')}<sub><i>i</i></sub>${T}${hat('<b>v</b>')}<sub><i>l</i></sub>`,
      `δ<sub><i>il</i></sub> = <i>y</i><sup>*</sup><sub><i>il</i></sub> − <i>y</i><sub><i>il</i></sub> = ${hat('<b>b</b>')}<sub><i>l</i></sub>${T}${dz} − ${hat('<i>e</i>')}<sub><i>il</i></sub>`,
      `G<sup>2</sup><sub>obs,<i>i</i></sub> = ${invL} ${sumL} δ<sub><i>il</i></sub><sup>2</sup> = ‖<b>B</b><sub>pop</sub>${dz} − ${hat('<b>e</b>')}<sub><i>i</i></sub>‖${sq}/<i>L</i>`,
      `= G<sup>2</sup><sub>pop,<i>i</i></sub> − (2/<i>L</i>) ${sumL} (${hat('<b>b</b>')}<sub><i>l</i></sub>${T}${dz}) ${hat('<i>e</i>')}<sub><i>il</i></sub> + ${invL} ${sumL} ${hat('<i>e</i>')}<sub><i>il</i></sub><sup>2</sup>`,
      `G<sup>2</sup><sub>pop,<i>i</i></sub> = ${dz}${T} ${hat('<b>C</b>')}<sub><i>b</i>,pop</sub> ${dz}`
    ],
    notation: [
      N.y,
      ['μ<sub><i>l</i></sub>', 'locus <i>l</i>’s mean'],
      ['<b>b</b><sub><i>l</i></sub>', 'locus <i>l</i>’s climate effect sizes (rows of <b>B</b><sub>pop</sub>)'],
      ['<b>u</b><sub><i>i</i></sub>, <b>v</b><sub><i>l</i></sub>', 'population <i>i</i>’s fitted latent score and locus <i>l</i>’s loading'],
      [`<i>e</i><sub><i>il</i></sub>, ${hat('<b>e</b>')}<sub><i>i</i></sub>`, 'residual; the vector of population <i>i</i>’s residuals over loci'],
      ['<i>x̂</i>', 'the estimate of <i>x</i>'],
      ['<i>y</i><sup>*</sup><sub><i>il</i></sub>', 'the fitted drought-target frequency, with population <i>i</i>’s fitted latent scores held fixed'],
      ['δ<sub><i>il</i></sub>', 'the required change'],
      [`${hat('<b>C</b>')}<sub><i>b</i>,pop</sub>`, `${hat('<b>B</b>')}${T}<sub>pop</sub>${hat('<b>B</b>')}<sub>pop</sub> / <i>L</i>`],
      N.dz,
      N.z,
      N.l,
      N.i
    ]
  },
  {
    key: 'climate',
    number: 'C',
    name: 'Mahalanobis climate distance',
    cite: 'Mahony et al., 2017',
    group: 'benchmark',
    refs: [R.mahony2017],
    equations: [`D<sub><i>i</i></sub> = √( ${dz}${T} <b>R</b><sub><i>z</i></sub><sup>−1</sup> ${dz} )`],
    notation: [['<b>R</b><sub><i>z</i></sub>', 'the correlation matrix of the baseline climates'], N.dz, N.z, N.i]
  }
];

/**
 * A superscript and a subscript on the same symbol (z*ᵢ, G²_obs,i, b_lᵀ) are set one above the
 * other, as in typeset maths, rather than one after the other.
 */
function stack(html: string): string {
  return html
    .replace(/<sub>((?:(?!<\/?su[bp]>).)*)<\/sub><sup>((?:(?!<\/?su[bp]>).)*)<\/sup>/g, '<span class="ss"><sup>$2</sup><sub>$1</sub></span>')
    .replace(/<sup>((?:(?!<\/?su[bp]>).)*)<\/sup><sub>((?:(?!<\/?su[bp]>).)*)<\/sub>/g, '<span class="ss"><sup>$1</sup><sub>$2</sub></span>');
}
for (const m of METHODS) {
  m.equations = m.equations.map(stack);
  m.steps = m.steps?.map(stack);
  m.notation = m.notation.map(([a, b]) => [stack(a), stack(b)]);
}

export const METHOD = Object.fromEntries(METHODS.map((m) => [m.key, m])) as Record<string, Method>;
