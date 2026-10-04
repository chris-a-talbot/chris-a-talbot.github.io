/**
 * The citation-and-equation card for each metric in "We assessed 8 different offsets".
 *
 * Sources, so these can be checked: the calculations are the project's declared forms as
 * written up in cardinalis/poster_offset/OFFSETS_11.md (pipeline/OFFSETS.tsv,
 * scripts/t06_offsets.py, t06_offsets.R); the references are offset/review/references.bib,
 * each checked against its Crossref record (authors, year, title, venue, volume, pages, DOI).
 * Citations and mathematics only, by request: no interpretation.
 *
 * Equations and notation symbols are TeX, typeset by KaTeX (tex.ts). Steps and meanings are
 * HTML in which $…$ marks inline TeX.
 */

/**
 * The cards are hidden for now: nothing opens them. Set true to make the offset list's entries
 * and the charts' "Citation & equation" links open them again.
 */
export const SHOW_METHOD_CARDS = false;

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
  /** Calculation steps, where an equation alone does not define the statistic (HTML, $…$ TeX). */
  steps?: string[];
  /** Display equations (TeX). */
  equations: string[];
  /** [symbol (TeX), meaning (HTML, $…$ TeX)] */
  notation: [string, string][];
}

// ---------------------------------------------------------------- shared notation
const N = {
  i: ['i', 'population'],
  l: ['l,\\ L', 'candidate locus; number of candidate loci'],
  z: [
    '\\mathbf{z}_i,\\ \\mathbf{z}^*_i',
    'population $i$’s baseline climate and its drought-scenario climate, both standardised with the baseline populations’ means and SDs'
  ],
  dz: ['\\Delta\\mathbf{z}_i', '$\\mathbf{z}^*_i - \\mathbf{z}_i$'],
  d: ['d', 'number of climate variables'],
  Z: ['\\mathbf{Z}', 'the $n \\times d$ matrix of the populations’ climates $\\mathbf{z}_i$'],
  y: ['y_{il}', 'population $i$’s observed allele frequency at locus $l$']
} satisfies Record<string, [string, string]>;

// ---------------------------------------------------------------- references (Crossref-checked)
const R = {
  gain2023: {
    html: 'Gain C, Rhoné B, Cubry P, Salazar I, Forbes F, Vigouroux Y, Jay F, François O (2023). A quantitative theory for genomic offset statistics. <i>Molecular Biology and Evolution</i> 40(6): msad140.',
    doi: '10.1093/molbev/msad140'
  },
  lea3: {
    role: 'Software',
    html: 'Gain C, François O (2021). LEA 3: factor models in population genetics and ecological genomics with R. <i>Molecular Ecology Resources</i> 21(8): 2738–2748.',
    doi: '10.1111/1755-0998.13366'
  },
  lfmm2: {
    role: 'Software',
    html: 'Caye K, Jumentier B, Lepeule J, François O (2019). LFMM 2: fast and accurate inference of gene–environment associations in genome-wide studies. <i>Molecular Biology and Evolution</i> 36(4): 852–860.',
    doi: '10.1093/molbev/msz008'
  },
  fitzpatrick2015: {
    html: 'Fitzpatrick MC, Keller SR (2015). Ecological genomics meets community-level modelling of biodiversity: mapping the genomic landscape of current and future environmental adaptation. <i>Ecology Letters</i> 18(1): 1–16.',
    doi: '10.1111/ele.12376'
  },
  ellis2012: {
    role: 'Gradient forests',
    html: 'Ellis N, Smith SJ, Pitcher CR (2012). Gradient forests: calculating importance gradients on physical predictors. <i>Ecology</i> 93(1): 156–168.',
    doi: '10.1890/11-0252.1'
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
  endelman2011: {
    role: 'Software',
    html: 'Endelman JB (2011). Ridge regression and other kernels for genomic selection with R package rrBLUP. <i>The Plant Genome</i> 4(3): 250–255.',
    doi: '10.3835/plantgenome2011.08.0024'
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
    steps: ['Fit LFMM2 to individual genotypes at the candidate loci; compute $G^2$ with <code>LEA::genetic.gap</code>.'],
    equations: [
      '\\mathbf{Y} = \\mathbf{Z}\\mathbf{B}^{\\top} + \\mathbf{U}\\mathbf{V}^{\\top} + \\mathbf{E}',
      'G^2_i = \\Delta\\mathbf{z}_i^{\\top}\\,\\mathbf{C}_b\\,\\Delta\\mathbf{z}_i = \\frac{1}{L}\\sum_{l=1}^{L}\\left(\\mathbf{b}_l^{\\top}\\Delta\\mathbf{z}_i\\right)^{2}',
      '\\mathbf{C}_b = \\frac{\\mathbf{B}^{\\top}\\mathbf{B}}{L}'
    ],
    notation: [
      ['\\mathbf{Y}', 'individuals’ genotypes at the candidate loci'],
      ['\\mathbf{Z}', 'the individuals’ climates'],
      ['\\mathbf{B}', 'the $L \\times d$ matrix of climate effect sizes; row $\\mathbf{b}_l$ is locus $l$’s'],
      ['\\mathbf{U},\\ \\mathbf{V}', '$K$ latent factors and their loadings'],
      ['\\mathbf{E}', 'residuals'],
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
      'Each climate variable $v$ gets a cumulative-importance (turnover) function $f_v$.',
      'Average the offset over several random seeds.'
    ],
    equations: ['\\mathrm{GF}_i = \\left\\lVert \\mathbf{f}(\\mathbf{z}^*_i) - \\mathbf{f}(\\mathbf{z}_i) \\right\\rVert_2'],
    notation: [['\\mathbf{f}', 'the vector of turnover functions $(f_1, \\dots, f_d)$'], N.z, N.d, N.i]
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
      'Project $\\mathbf{z}$ and $\\mathbf{z}^*$ onto the constrained axes (the adaptive index).',
      'Retain axes with $w_k > 0.01$: all three constrained axes ($w = 0.17536,\\ 0.03133,\\ 0.02030$).'
    ],
    equations: [
      '\\mathrm{RDA}_i = \\sqrt{\\sum_{k} w_k \\left(\\mathrm{AI}_k(\\mathbf{z}^*_i) - \\mathrm{AI}_k(\\mathbf{z}_i)\\right)^{2}}',
      'w_k = \\frac{\\lambda_k}{\\text{total inertia}}'
    ],
    notation: [
      ['\\mathrm{AI}_k', 'adaptive index: the projection of a climate onto constrained axis $k$'],
      ['\\lambda_k', 'the eigenvalue of constrained axis $k$'],
      ['w_k', 'axis $k$’s weight'],
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
      'The offset is the Euclidean distance between a population’s predicted genetic position at $\\mathbf{z}^*$ and at $\\mathbf{z}$, scaled as <code>gen_offset_oj</code> does (by the 90th percentile).',
      'Genome-wide markers (an LD-pruned draw), not the candidate loci.'
    ],
    equations: ['\\mathrm{RDAforest}_i \\propto \\left\\lVert \\hat{\\mathbf{g}}(\\mathbf{z}^*_i) - \\hat{\\mathbf{g}}(\\mathbf{z}_i) \\right\\rVert_2'],
    notation: [
      ['\\hat{\\mathbf{g}}(\\mathbf{z})', 'the predicted position in genetic principal-coordinate space under climate $\\mathbf{z}$'],
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
      'y_{il} = \\hat{a}_l + \\hat{s}_l\\, z_{i,k(l)} + \\hat{e}^{(k)}_{il}',
      '\\begin{aligned} \\mathrm{RONA}_i &= \\frac{1}{L}\\sum_{l} \\left| \\hat{a}_l + \\hat{s}_l\\, z^*_{i,k(l)} - y_{il} \\right| \\\\ &= \\frac{1}{L}\\sum_{l} \\left| \\hat{s}_l\\, \\Delta z_{i,k(l)} - \\hat{e}^{(k)}_{il} \\right| \\end{aligned}'
    ],
    notation: [
      ['k(l)', 'the one climate variable assigned to locus $l$'],
      ['\\hat{a}_l,\\ \\hat{s}_l', 'intercept and slope of the regression of locus $l$’s frequency on that variable, across populations'],
      ['\\hat{e}^{(k)}_{il}', 'its residual'],
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
    steps: ['Fit the OLS of each candidate locus’s allele frequency on $[\\mathbf{1}, \\mathbf{Z}]$, giving residuals $\\hat{e}_{il}$.'],
    equations: ['C_i = \\frac{1}{L}\\sum_{l} \\left| \\hat{e}_{il} \\right|'],
    notation: [['\\hat{e}_{il}', 'population $i$’s OLS residual at locus $l$'], N.Z, N.l, N.i]
  },
  {
    key: 'frona',
    number: '7',
    name: 'f-RONA',
    cite: 'Borrell et al., 2020',
    group: 'observed',
    refs: [R.borrell2020, R.endelman2011],
    steps: [
      'For each climate variable $k$, fit a ridge regression of $z_k$ on the allele frequencies at its assigned loci (variance ratio by REML, as <code>rrBLUP::mixed.solve</code>).',
      'Fit it leave-one-out, so each population’s predicted value $\\hat{z}_{ik}$ comes from a model it was not part of.'
    ],
    equations: ['\\text{f-RONA}_i = \\frac{1}{d}\\sum_{k=1}^{d} \\left| z^*_{ik} - \\hat{z}_{ik} \\right| \\quad \\text{(in SD units)}'],
    notation: [
      ['\\hat{z}_{ik}', 'population $i$’s predicted value of climate variable $k$ from its allele frequencies'],
      ['z^*_{ik}', 'its drought-scenario value of variable $k$'],
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
    steps: [
      'Fit LFMM2 (<code>LEA::lfmm2</code>) to the $n \\times L$ matrix of candidate-locus population allele frequencies, with $K$ latent factors and ridge $\\lambda = 10^{-5}$.'
    ],
    equations: [
      '\\begin{aligned} y_{il} &= \\mu_l + \\mathbf{b}_l^{\\top}\\mathbf{z}_i + \\mathbf{u}_i^{\\top}\\mathbf{v}_l + e_{il} \\\\ \\hat{e}_{il} &= y_{il} - \\hat{\\mu}_l - \\hat{\\mathbf{b}}_l^{\\top}\\mathbf{z}_i - \\hat{\\mathbf{u}}_i^{\\top}\\hat{\\mathbf{v}}_l \\\\ y^*_{il} &= \\hat{\\mu}_l + \\hat{\\mathbf{b}}_l^{\\top}\\mathbf{z}^*_i + \\hat{\\mathbf{u}}_i^{\\top}\\hat{\\mathbf{v}}_l \\\\ \\delta_{il} &= y^*_{il} - y_{il} = \\hat{\\mathbf{b}}_l^{\\top}\\Delta\\mathbf{z}_i - \\hat{e}_{il} \\end{aligned}',
      '\\begin{aligned} G^2_{\\mathrm{obs},i} &= \\frac{1}{L}\\sum_{l}\\delta_{il}^{2} = \\frac{\\left\\lVert \\mathbf{B}_{\\mathrm{pop}}\\Delta\\mathbf{z}_i - \\hat{\\mathbf{e}}_i \\right\\rVert_2^{2}}{L} \\\\ &= G^2_{\\mathrm{pop},i} - \\frac{2}{L}\\sum_{l}\\left(\\hat{\\mathbf{b}}_l^{\\top}\\Delta\\mathbf{z}_i\\right)\\hat{e}_{il} + \\frac{1}{L}\\sum_{l}\\hat{e}_{il}^{2} \\end{aligned}',
      'G^2_{\\mathrm{pop},i} = \\Delta\\mathbf{z}_i^{\\top}\\,\\hat{\\mathbf{C}}_{b,\\mathrm{pop}}\\,\\Delta\\mathbf{z}_i, \\qquad \\hat{\\mathbf{C}}_{b,\\mathrm{pop}} = \\frac{\\hat{\\mathbf{B}}_{\\mathrm{pop}}^{\\top}\\hat{\\mathbf{B}}_{\\mathrm{pop}}}{L}'
    ],
    notation: [
      N.y,
      ['\\mu_l', 'locus $l$’s mean'],
      ['\\mathbf{b}_l,\\ \\mathbf{B}_{\\mathrm{pop}}', 'locus $l$’s climate effect sizes; the $L \\times d$ matrix of them from this population-level fit'],
      ['\\mathbf{u}_i,\\ \\mathbf{v}_l', 'population $i$’s fitted latent score and locus $l$’s loading'],
      ['e_{il},\\ \\hat{\\mathbf{e}}_i', 'residual; the vector of population $i$’s residuals over loci'],
      ['\\hat{x}', 'the estimate of $x$'],
      ['y^*_{il}', 'the fitted drought-target frequency, with population $i$’s fitted latent scores held fixed'],
      ['\\delta_{il}', 'the required change'],
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
    equations: ['D_i = \\sqrt{\\Delta\\mathbf{z}_i^{\\top}\\,\\mathbf{R}_z^{-1}\\,\\Delta\\mathbf{z}_i}'],
    notation: [['\\mathbf{R}_z', 'the correlation matrix of the baseline climates'], N.dz, N.z, N.i]
  }
];

export const METHOD = Object.fromEntries(METHODS.map((m) => [m.key, m])) as Record<string, Method>;
