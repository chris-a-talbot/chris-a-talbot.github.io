<script lang="ts">
  /**
   * /aga26_supplement — supplementary material for the AGA 2026 poster, in the poster page's style.
   * Every number is read from data/supplement.json, which cardinalis/poster_offset/web_supplement.py
   * writes from the declared screen and checks against the poster's own figure tables.
   */
  import { onMount } from 'svelte';
  import { C } from '$lib/aga26/theme';
  import { signed } from '$lib/aga26/format';
  import Panel from '$lib/aga26/Panel.svelte';
  import Footer from '$lib/aga26/Footer.svelte';
  import Populations from '$lib/aga26/supp/Populations.svelte';
  import Windows from '$lib/aga26/supp/Windows.svelte';
  import RowChart from '$lib/aga26/supp/RowChart.svelte';
  import Matrix from '$lib/aga26/supp/Matrix.svelte';
  import Fold from '$lib/aga26/supp/Fold.svelte';
  import { LATITUDE, CODING, LEAVE_ONE_OUT } from '$lib/aga26/supp/specs';
  import S from '$lib/aga26/data/supplement.json';
  import { METHODS, type Reference } from '$lib/aga26/methods';

  const TITLE = 'Genomic offset predicts population vulnerability in an extreme climate event... backwards';

  /** The sections, in reading order, under their two group headings: [id, chip label, the question
      each answers, which is both its panel title and its line in the contents]. */
  type Section = [string, string, string];
  const GROUPS: { id: string; title: string; sections: Section[] }[] = [
    {
      id: 'design',
      title: 'Data and design',
      sections: [
        ['populations', 'Populations', 'How many populations were sampled? What quality?'],
        ['windows', 'Windows', 'How bad was the drought? How was it calculated?'],
        ['climate', 'Climate', 'What climate variables did the genomic offsets use?'],
        ['loci', 'Loci', 'Which loci did the offsets use? What were they compared against?']
      ]
    },
    {
      id: 'robustness',
      title: 'Robustness of the poster’s results',
      sections: [
        ['rankings', 'Rankings', 'How alike do the offsets rank the populations?'],
        ['covariates', 'Covariates', 'Do latitude or other covariates explain the associations?'],
        ['extirpations', 'Extirpations', 'How are extirpated populations handled? Does it matter?'],
        ['leave-one-out', 'Leave-one-out', 'Does any single population drive the associations?']
      ]
    }
  ];
  const SECTIONS_ALL: Section[] = [...GROUPS.flatMap((g) => g.sections), ['references', 'References', 'References']];
  const SECTIONS = SECTIONS_ALL;
  const Q = Object.fromEntries(SECTIONS.map(([id, , q]) => [id, q]));

  let current = $state<string>(SECTIONS[0][0]);
  let bar: HTMLElement;

  onMount(() => {
    const seen = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) seen.set(e.target.id, e.isIntersecting);
        const first = SECTIONS.find(([id]) => seen.get(id));
        if (first) current = first[0];
      },
      { rootMargin: '-25% 0px -55% 0px' }
    );
    for (const [id] of SECTIONS) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  });
  $effect(() => {
    const chip = bar?.querySelector<HTMLElement>(`a[href="#${current}"]`);
    if (chip && bar) {
      const r = chip.offsetLeft - bar.clientWidth / 2 + chip.offsetWidth / 2;
      bar.scrollTo({ left: r, behavior: 'smooth' });
    }
  });

  /** The data's references, checked against Crossref on 2026-10-04. The offsets' come from the
      method cards (METHODS), whose references were checked the same way. */
  const REFERENCES: Reference[] = [
    {
      html: 'Anstett DN, Anstett J, Sheth SN, Moxley DR, Branch HA, Jahani M, Huang K, Todesco M, Jordan R, Lazaro-Guevara JM, Rieseberg LH, Angert AL (2026). Rapid evolution predicts demographic recovery after extreme drought. <i>Science</i> 391(6790): 1172–1176.',
      doi: '10.1126/science.adu0995'
    },
    {
      html: 'Sheth SN, Angert AL (2018). Demographic compensation does not rescue populations at a trailing range edge. <i>Proceedings of the National Academy of Sciences</i> 115(10): 2413–2418.',
      doi: '10.1073/pnas.1715899115'
    }
  ];

  // ---- numbers quoted in the text, all read from the data
  const R = S.roster;
  const thousands = (v: number) => v.toLocaleString('en-US');
  const ordinal = (k: number) => k + (k % 10 === 1 && k !== 11 ? 'st' : k % 10 === 2 && k !== 12 ? 'nd' : k % 10 === 3 && k !== 13 ? 'rd' : 'th');
  const list = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs.at(-1)}`);

  const byYear = S.windows.years.map((y, k) => ({ y, v: S.windows.index[k] }));
  const top = (xs: typeof byYear) => xs.reduce((a, b) => (b.v > a.v ? b : a));
  const peak = top(byYear);
  const [d0, d1] = [S.windows.scenario[0], S.windows.scenario[S.windows.scenario.length - 1]];
  const peakIn = top(byYear.filter((d) => d.y >= d0 && d.y <= d1));
  const depth = S.populations.filter((p) => p.genomic).map((p) => p.depth as number);
</script>

<svelte:head>
  <title>Supplement | AGA 2026 | Chris Talbot</title>
  <meta name="description" content="Supplementary material for the AGA 2026 poster “{TITLE}”." />
  <meta name="theme-color" content={C.carnelian} />
  <link
    href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:ital,wght@0,200..800;1,200..800&family=Source+Sans+3:ital,wght@0,400;0,600;0,700;1,400;1,700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="aga">
  <header class="band">
    <div class="band-in">
      <a class="home" href="/">← chris-a-talbot.com</a>
      <div class="titles">
        <p class="kicker">AGA 2026 poster</p>
        <h1><span class="hi">Supplement</span></h1>
        <p class="poster">{TITLE}</p>
      </div>
      <a class="back" href="/AGA26"><span aria-hidden="true">←</span> Back to the poster</a>
    </div>
  </header>

  <div class="meta">
    <p class="authors"><b>Christopher A. Talbot</b><sup>1</sup>, Daniel N. Anstett<sup>2</sup>, Philipp W. Messer<sup>1</sup></p>
    <p class="affil">
      <span><sup>1</sup>Department of Computational Biology, Cornell University</span>
      <span><sup>2</sup>School of Integrative Plant Science, Plant Biology Section, Cornell University</span>
    </p>
  </div>

  <nav class="bar" aria-label="Supplement sections">
    <div class="chips" bind:this={bar}>
      {#each SECTIONS as [id, label]}
        <a href="#{id}" class:on={current === id} aria-current={current === id ? 'true' : undefined}>{label}</a>
      {/each}
    </div>
  </nav>

  <main class="page">
    <nav class="contents" aria-label="Contents">
      {#each GROUPS as g}
        <div>
          <h2>{g.title}</h2>
          <ol>
            {#each g.sections as [id, , question]}
              <li><a href="#{id}">{question}</a></li>
            {/each}
          </ol>
        </div>
      {/each}
    </nav>

    <!-- ================================================================ data and design -->
    <h2 class="group" id="design">Data and design</h2>

    <Panel id="populations" title={Q.populations}>
      <div class="prose">
        <p>
          Seed for the baseline genomes was collected in 2007–2011 from {R.baseline_pops} populations: {R.baseline_sequenced}
          plants were sequenced, and {R.baseline_individuals} remain after {R.baseline_mislabel} mislabelled samples were removed.
          The demographic census followed {R.monitored} populations, {R.monitored_sequenced} of them among the {R.baseline_pops}.
          Mean sequencing depth in the {R.genomic} analysed populations is {Math.min(...depth).toFixed(1)}–{Math.max(
            ...depth
          ).toFixed(1)}×.
        </p>
      </div>
      <Populations />
    </Panel>

    <Panel id="windows" title={Q.windows}>
      <div class="prose">
        <p>
          A population’s growth over one census interval is <i>r</i> = log(λ + 0.01), where λ is its projected growth rate
          for that interval (Sheth &amp; Angert 2018; Anstett et al. 2026). Each outcome averages <i>r</i> over a window of
          intervals, named here by the year each interval starts.
        </p>
      </div>
      <div class="fig"><Windows /></div>
      <div class="prose">
        <ul>
          <li><b>Change into the drought:</b> drought <i>r</i> − pre-drought <i>r</i></li>
          <li><b>Change out of the drought:</b> recovery <i>r</i> − drought <i>r</i></li>
          <li><b>Persistence:</b> 1 = present through recovery, 0 = extirpated during the drought</li>
        </ul>
      </div>
      <Fold label="How the drought climate and the drought index are calculated">
      <div class="prose">
        <p>
          The offsets’ drought climate is each population’s baseline climate plus its mean {d0}–{d1} ClimateNA anomaly from
          the 1981–2010 normal.
        </p>
        <p>
          The drought index (the bars) combines eight ClimateNA annual anomalies, every variable of the association scan except
          the extreme maximum temperature: each is standardised across the monitored sites and years and signed so that warmer
          or drier is positive, the eight are summarised by their median at each site, and each bar is the median across sites.
          It peaks in {peak.y} ({signed(peak.v)}), after the recovery window; within {d0}–{d1} its highest value is
          {signed(peakIn.v)}, in {peakIn.y}.
        </p>
      </div>
      </Fold>
    </Panel>

    <div class="pair">
      <Panel id="climate" title={Q.climate}>
        <div class="prose">
          <p>Every offset, and the climate benchmark, uses three ClimateNA variables.</p>
        </div>
        <dl class="vars">
          <div>
            <dt>CMD</dt>
            <dd><b>Climatic moisture deficit</b> (Hargreaves, mm): the evaporative demand that precipitation does not meet</dd>
          </div>
          <div>
            <dt>Tave<sub>sm</sub></dt>
            <dd><b>Mean summer temperature</b> (June–August, °C): drives evaporative demand</dd>
          </div>
          <div>
            <dt>PPT<sub>wt</sub></dt>
            <dd><b>Winter precipitation</b> (December–February, mm): the water supply</dd>
          </div>
        </dl>
        <Fold label="Why these three variables, and how they are scaled">
        <div class="prose">
          <p>
            The scan’s other six variables are less specific or nearly constant here: annual precipitation (almost all of it
            falls in winter), summer precipitation (summers are dry), precipitation as snow, and three temperature measures other
            than the summer mean (annual mean, winter mean and the 30-year extreme maximum).
          </p>
          <p>
            Climate is standardised once, with the means and standard deviations across the {R.baseline_pops} baseline
            populations: the scale the association scan was fitted on.
          </p>
          <p>
            Anstett et al. (2026, Table S2) found the same three variables most strongly associated with population decline (OLS
            <i>p</i> = 0.007 for summer temperature, 0.015 for winter precipitation and 0.051 for CMD; next, annual precipitation,
            0.238).
          </p>
        </div>
        </Fold>
      </Panel>

      <Panel id="loci" title={Q.loci}>
        <div class="prose">
          <p>
            The candidate loci come from the published genome–environment association scan of the {R.baseline_pops} baseline
            populations (BayPass and window-based tests against nine ClimateNA variables; Anstett et al. 2026).
          </p>
        </div>
        <ol class="flow">
          <li><b>{thousands(S.loci.n_source)}</b> candidate SNPs, across all nine variables</li>
          <li><b>{S.loci.n_family}</b> associated with CMD, summer temperature or winter precipitation</li>
          <li>
            <b>{S.loci.n_sites}</b> after LD clumping (plink2: {S.loci.clump_kb} kb, <i>r</i><sup>2</sup> {S.loci.clump_r2}, keeping
            the SNP with the highest Bayes factor)
          </li>
        </ol>
        <div class="prose">
          <p>
            Metrics 1–3 and 5–8 use these {S.loci.n_sites} loci; RDAforest (4) uses genome-wide LD-pruned markers, and climate
            distance uses none.
          </p>
        </div>
        <Fold label="Random-locus sets" heading>
        <div class="prose">
          <p>
            A random-locus version of a metric replaces each candidate locus with a marker from the same minor-allele-frequency
            bin (width {S.loci.maf_bin}), drawn without replacement from {thousands(S.loci.pool)} LD-pruned markers (MAF ≥ 0.05,
            plink2 <code>--indep-pairwise 50 10 0.1</code>). Each drawn marker keeps the climate variable its candidate was
            assigned.
          </p>
          <p>
            Each metric is recomputed on {S.loci.draws} random sets ({S.loci.draws_forest} for gradient forest, which fits a forest
            per set). RDAforest has no candidate set, so no random-locus version.
          </p>
        </div>
        </Fold>
      </Panel>
    </div>

    <!-- ================================================================ robustness -->
    <h2 class="group" id="robustness">Robustness of the poster’s results</h2>

    <Panel id="rankings" tone="pink" title={Q.rankings}>
      <div class="prose">
        <p>
          Spearman ρ between every pair of metrics across the {S.matrix.n} populations. Boxes join metrics that hierarchical
          clustering of the rankings joins at |ρ| ≥ 0.90 (<code>Hmisc::varclus</code>, complete linkage).
        </p>
      </div>
      <Matrix />
    </Panel>

    <Panel id="covariates" tone="pink" title={Q.covariates}>
      <div class="prose">
        <p>
          The three extirpated populations are the {list(R.ext_rank_south.map(ordinal))} southernmost of the {R.genomic}.
          Each association is shown as observed, adjusted for latitude, and adjusted for all four covariates at once: latitude,
          baseline sample size, mean sequencing depth and pre-drought growth. Change into the drought is not adjusted for
          pre-drought growth, which it contains. Pick a row for each covariate on its own.
        </p>
      </div>
      <RowChart {...LATITUDE} />
    </Panel>

    <Panel id="extirpations" tone="pink" title={Q.extirpations}>
      <div class="prose">
        <p>
          On the poster, change into the drought ranks the three extirpated populations together at the worst value
          ({S.arms['8'].n} populations), and change out of the drought uses the {S.arms['5'].n} survivors with recovery growth.
          Hollow markers show the other coding of each: change into the drought among the {S.arms['4'].n} survivors only, and
          change out of the drought with the extirpated populations ranked together at the worst value ({S.arms['9'].n}).
        </p>
      </div>
      <div class="fig"><RowChart {...CODING} /></div>
    </Panel>

    <Panel id="leave-one-out" tone="pink" title={Q['leave-one-out']}>
      <div class="prose">
        <p>
          Each association recomputed with one population left out, once for each population. The bar spans those results;
          the dot is the result with every population.
        </p>
      </div>
      <RowChart {...LEAVE_ONE_OUT} />
    </Panel>

    <section class="refs" id="references" aria-labelledby="references-title">
      <h2 id="references-title">References</h2>
      <Fold label="Methods and software" always>
      <ol class="by-metric">
        {#each METHODS as m}
          <li>
            <span class="metric">{m.number}) {m.name}</span>
            <ul>
              {#each m.refs as r}
                <li>
                  {#if r.role}<span class="role">{r.role}:</span>{/if}
                  {@html r.html}
                  {#if r.doi}<a href="https://doi.org/{r.doi}" target="_blank" rel="noopener">doi:{r.doi}</a>{/if}
                </li>
              {/each}
            </ul>
          </li>
        {/each}
      </ol>
      </Fold>
      <Fold label="Data" always>
      <ol>
        {#each REFERENCES as r}
          <li>
            {@html r.html}
            {#if r.doi}<a href="https://doi.org/{r.doi}" target="_blank" rel="noopener">doi:{r.doi}</a>{/if}
          </li>
        {/each}
      </ol>
      </Fold>
    </section>
  </main>

  <Footer />
</div>

<style>
  :global(html:has(.aga)),
  :global(body:has(.aga)) {
    background: #fff;
  }
  :global(html:has(.aga)) {
    scroll-padding-top: 3.6rem;
  }

  .aga {
    --aga-font: 'Atkinson Hyperlegible Next', 'Source Sans 3', system-ui, sans-serif;
    --aga-math: 'Source Sans 3', 'Atkinson Hyperlegible Next', sans-serif;
    --aga-carnelian: #b31b1b;
    --aga-lake: #1f4396;
    --aga-spruce: #0a7f5c;
    --aga-ink: #222222;
    --aga-soft-ink: #55565a;
    --aga-paper: #ffffff;
    --aga-panel: #f3f2ef;
    --aga-rule: #bdbbbb;
    --aga-mint: #e6f2ee;
    --aga-mint-dark: #b5d8ce;
    --aga-pink: #f0d1d1;
    --aga-pink-band: #e8baba;
    --aga-blue: #e8ecf4;
    --aga-h2: clamp(1.18rem, 1.05rem + 0.55vw, 1.5rem);
    --aga-sticky: 3.6rem;

    min-height: 100dvh;
    background: var(--aga-paper);
    color: var(--aga-ink);
    font-family: var(--aga-font);
    font-size: 1rem;
    line-height: 1.45;
    -webkit-text-size-adjust: 100%;
  }
  .aga :global(p) {
    margin: 0;
  }
  .aga :global(b) {
    font-weight: 700;
  }

  /* --- title band ---------------------------------------------------------------- */
  .band {
    background: var(--aga-carnelian);
    padding: clamp(1.4rem, 3vw, 2.6rem) clamp(1rem, 3vw, 3rem) clamp(1.5rem, 3vw, 2.8rem);
  }
  .band-in {
    max-width: 84rem;
    margin: 0 auto;
    display: grid;
    gap: 0.8rem;
    justify-items: start;
  }
  .home {
    font-size: 0.85rem;
    color: #fff;
    opacity: 0.88;
    text-decoration: none;
  }
  .home:hover {
    color: #fff;
    opacity: 1;
    text-decoration: underline;
  }
  .kicker {
    font-size: 0.95rem;
    font-weight: 600;
    color: #f3f2ef;
  }
  h1 {
    margin: 0.1rem 0 0;
    font-family: var(--aga-font);
    font-size: clamp(2.3rem, 1.5rem + 3.4vw, 4.4rem);
    font-weight: 600;
    line-height: 1.08;
    color: #f3f2ef;
  }
  .hi {
    font-weight: 800;
    color: #fff;
  }
  .poster {
    margin-top: 0.45rem !important;
    max-width: 52rem;
    font-size: clamp(1rem, 0.9rem + 0.6vw, 1.35rem);
    font-weight: 600;
    line-height: 1.3;
    color: #f3f2ef;
  }
  .back {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.55rem 1.1rem;
    border-radius: 999px;
    background: #fff;
    color: var(--aga-carnelian);
    font-weight: 700;
    font-size: 1rem;
    text-decoration: none;
    box-shadow: 0 1px 3px rgb(0 0 0 / 0.18);
  }
  .back:hover {
    color: var(--aga-carnelian);
    text-decoration: none;
    background: #f3f2ef;
  }
  .home:focus-visible,
  .back:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 3px;
  }

  .meta {
    max-width: 84rem;
    margin: 0 auto;
    padding: 0.9rem 1rem 0.8rem;
  }
  .authors {
    font-size: clamp(1rem, 0.95rem + 0.3vw, 1.2rem);
  }
  .authors sup,
  .affil sup {
    font-size: 0.65em;
  }
  .affil {
    margin-top: 0.25rem !important;
    display: flex;
    flex-wrap: wrap;
    gap: 0.1rem 2.5rem;
    font-size: clamp(0.82rem, 0.78rem + 0.2vw, 0.95rem);
    color: var(--aga-soft-ink);
  }

  /* --- section bar ----------------------------------------------------------------- */
  .bar {
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.45rem 0.6rem 0.45rem 0;
    background: rgb(255 255 255 / 0.96);
    border-bottom: 1px solid var(--aga-panel);
    box-shadow: 0 2px 6px rgb(0 0 0 / 0.04);
  }
  .chips {
    flex: 1;
    display: flex;
    gap: 0.25rem;
    overflow-x: auto;
    scrollbar-width: none;
    padding: 0 0.6rem;
    mask-image: linear-gradient(90deg, transparent 0, #000 0.6rem, #000 calc(100% - 1rem), transparent);
  }
  .chips::-webkit-scrollbar {
    display: none;
  }
  .chips a {
    flex: none;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    min-height: 2.4rem;
    padding: 0.3rem 0.75rem;
    border-radius: 999px;
    font-family: var(--aga-font);
    font-size: 0.88rem;
    line-height: 1;
    color: var(--aga-soft-ink);
    text-decoration: none;
    white-space: nowrap;
  }
  .chips a:hover {
    background: var(--aga-panel);
    color: var(--aga-ink);
    text-decoration: none;
  }
  .chips a.on {
    background: var(--aga-carnelian);
    color: #fff;
    font-weight: 700;
  }
  .chips a:focus-visible {
    outline: 2px solid var(--aga-lake);
    outline-offset: 1px;
  }

  /* --- the page: one column on a phone, wide panels and pairs on a laptop ------------ */
  .page {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 2rem;
    max-width: 52rem;
    margin: 0 auto;
    padding: 1.4rem 1rem 3rem;
  }
  .pair {
    display: grid;
    gap: 2rem;
    min-width: 0;
  }
  @media (min-width: 76rem) {
    .page {
      max-width: 84rem;
      gap: 2.4rem;
      padding: 1.4rem 2rem 3.4rem;
    }
    .pair {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1.8rem;
      align-items: start;
    }
    .band {
      padding: clamp(1rem, 2.4vh, 2rem) 2rem;
    }
    .band-in {
      grid-template-columns: 1fr auto;
      grid-template-rows: auto 1fr;
      align-items: start;
      gap: 0 2rem;
    }
    .titles {
      grid-column: 1;
      grid-row: 1 / 3;
    }
    .home {
      grid-column: 2;
      grid-row: 1;
      justify-self: end;
      margin-top: 0.3rem;
    }
    .back {
      grid-column: 2;
      grid-row: 2;
      align-self: end;
      justify-self: end;
      font-size: 1.1rem;
      padding: 0.7rem 1.4rem;
    }
    .meta {
      padding: 0.6rem 2rem 0.55rem;
    }
  }

  .contents {
    display: grid;
    gap: 1rem 2rem;
    padding: 1rem 1.1rem 1.1rem;
    border-radius: 0.6rem;
    background: var(--aga-panel);
  }
  @media (min-width: 48rem) {
    .contents {
      grid-template-columns: 1fr 1fr;
    }
  }
  .contents h2 {
    margin: 0 0 0.4rem;
    font-family: var(--aga-font);
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--aga-carnelian);
  }
  .contents ol {
    margin: 0;
    padding-left: 1.3rem;
    font-size: 0.95rem;
    line-height: 1.35;
  }
  .contents li + li {
    margin-top: 0.3rem;
  }
  .contents a {
    color: var(--aga-ink);
    text-decoration: underline;
    text-decoration-color: var(--aga-rule);
    text-underline-offset: 0.18em;
  }
  .contents a:hover {
    color: var(--aga-carnelian);
    text-decoration-color: currentColor;
  }

  .group {
    scroll-margin-top: var(--aga-sticky);
    margin: 0.8rem 0 -0.6rem;
    font-family: var(--aga-font);
    font-size: clamp(1.25rem, 1.05rem + 0.9vw, 1.75rem);
    font-weight: 700;
    line-height: 1.2;
    text-align: center;
    color: var(--aga-carnelian);
    text-wrap: balance;
  }

  .prose {
    font-size: 1rem;
    line-height: 1.5;
  }
  .prose :global(* + p),
  .prose :global(* + ul),
  .prose :global(* + ol),
  .prose :global(* + h3) {
    margin-top: 0.7rem;
  }
  .prose ul {
    margin-bottom: 0;
    padding-left: 1.2rem;
  }
  .prose li + li {
    margin-top: 0.2rem;
  }
  .prose code {
    font-size: 0.86em;
  }
  .fig {
    width: 100%;
    max-width: 58rem;
    margin-left: auto;
    margin-right: auto;
  }
  .aga :global(.body > * + *) {
    margin-top: 0.9rem;
  }

  .vars {
    display: grid;
    gap: 0.5rem;
    margin: 0;
  }
  .vars div {
    display: grid;
    grid-template-columns: 5.2rem 1fr;
    gap: 0.75rem;
    align-items: baseline;
    padding: 0.55rem 0.7rem;
    border-radius: 0.5rem;
    background: var(--aga-mint);
  }
  .vars dt {
    font-weight: 800;
    font-size: 1.1rem;
    color: var(--aga-spruce);
  }
  .vars dd {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.35;
  }

  .flow {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0;
  }
  .flow li {
    position: relative;
    padding: 0.45rem 0.7rem 0.45rem 0.7rem;
    border-left: 3px solid var(--aga-spruce);
    background: var(--aga-mint);
    font-size: 0.95rem;
    line-height: 1.35;
  }
  .flow li + li {
    margin-top: 0.35rem;
  }
  .flow b {
    font-size: 1.15rem;
    color: var(--aga-spruce);
  }

  @media (min-width: 60rem) {
  }

  .refs {
    scroll-margin-top: var(--aga-sticky);
    padding-top: 0.6rem;
    border-top: 1px solid var(--aga-rule);
    font-size: 0.9rem;
    line-height: 1.45;
  }
  .refs h2 {
    margin: 0 0 0.5rem;
    font-family: var(--aga-font);
    font-size: 1.1rem;
    font-weight: 700;
  }
  .refs ol {
    margin: 0 0 0.8rem;
    padding-left: 1.3rem;
  }
  .by-metric {
    list-style: none;
    padding-left: 0 !important;
  }
  .by-metric > li + li {
    margin-top: 0.55rem;
  }
  .metric {
    font-weight: 700;
  }
  .by-metric ul {
    margin: 0.15rem 0 0;
    padding-left: 1.3rem;
  }
  .role {
    font-weight: 600;
    color: var(--aga-soft-ink);
  }
  .refs li + li {
    margin-top: 0.35rem;
  }
  .refs a {
    margin-left: 0.25rem;
    color: var(--aga-lake);
    overflow-wrap: anywhere;
  }

</style>
