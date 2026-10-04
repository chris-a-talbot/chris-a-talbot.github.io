<script lang="ts">
  /**
   * The AGA 2026 poster, "Genomic offset predicts population vulnerability in an extreme
   * climate event... backwards", as a phone-first page. Text and numbers are the poster's
   * (AGA26_cat267.pdf); figures are redrawn or re-exported from the poster's own scripts and
   * data by cardinalis/poster_offset/web_export.py. On a wide screen the panels fall into the
   * poster's grid; on a phone they stack in the poster's reading order.
   */
  import { onMount } from 'svelte';
  import { C, FILES, PDF, URL } from '$lib/aga26/theme';
  import { ui } from '$lib/aga26/state.svelte';
  import Panel from '$lib/aga26/Panel.svelte';
  import SettingMap from '$lib/aga26/SettingMap.svelte';
  import Timeline from '$lib/aga26/Timeline.svelte';
  import OutcomesCartoon from '$lib/aga26/OutcomesCartoon.svelte';
  import OffsetList from '$lib/aga26/OffsetList.svelte';
  import ForecastFate from '$lib/aga26/ForecastFate.svelte';
  import G2Cartoon from '$lib/aga26/G2Cartoon.svelte';
  import AssocChart from '$lib/aga26/AssocChart.svelte';
  import MethodDialog from '$lib/aga26/MethodDialog.svelte';
  import QrDialog from '$lib/aga26/QrDialog.svelte';
  import Footer from '$lib/aga26/Footer.svelte';
  import fig09 from '$lib/aga26/data/fig09.json';
  import fig10 from '$lib/aga26/data/fig10.json';

  const TITLE = 'Genomic offset predicts population vulnerability in an extreme climate event... backwards';
  const QUESTION =
    'Does genomic offset predict population resilience to an observed extreme climate event in scarlet monkeyflower?';

  /** The section bar: short names for the poster's panels, in reading order. */
  const SECTIONS = [
    ['background', 'Background'],
    ['overview', 'Overview'],
    ['predict', 'Outcomes'],
    ['offsets', 'Offsets'],
    ['headline', 'Maps'],
    ['new', 'New offset'],
    ['results', 'Results'],
    ['benchmark', 'Random SNPs'],
    ['methods', 'Methods'],
    ['takeaways', 'Takeaways'],
    ['next', 'Next']
  ] as const;
  let current = $state('background');
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
</script>

<svelte:head>
  <title>{TITLE} | AGA 2026 | Chris Talbot</title>
  <meta name="description" content={QUESTION} />
  <meta name="theme-color" content={C.carnelian} />
  <link rel="canonical" href={URL} />
  <meta property="og:title" content={TITLE} />
  <meta property="og:description" content={QUESTION} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content={URL} />
  <meta name="twitter:card" content="summary" />
  <link
    href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:ital,wght@0,200..800;1,200..800&family=Source+Sans+3:ital,wght@0,400;0,600;0,700;1,400;1,700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="aga">
  <header class="band">
    <h1>
      <span class="hi">Genomic offset</span> predicts population<br class="br-wide" /> vulnerability in an extreme climate event...<br /><span
        class="hi">backwards</span
      >
    </h1>
  </header>

  <div class="meta">
    <p class="question">{QUESTION}</p>
    <p class="authors"><b>Christopher A. Talbot</b><sup>1</sup>, Daniel N. Anstett<sup>2</sup>, Philipp W. Messer<sup>1</sup></p>
    <p class="affil">
      <span><sup>1</sup>Department of Computational Biology, Cornell University</span>
      <span><sup>2</sup>School of Integrative Plant Science, Plant Biology Section, Cornell University</span>
    </p>
  </div>

  <nav class="bar" aria-label="Poster sections">
    <div class="chips" bind:this={bar}>
      {#each SECTIONS as [id, label]}
        <a href="#{id}" class:on={current === id} aria-current={current === id ? 'true' : undefined}>{label}</a>
      {/each}
    </div>
    <div class="actions">
      <button onclick={() => (ui.qr = true)} aria-label="Show a QR code for this page" title="Show QR code">
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" fill="currentColor"
          ><path
            d="M2 2h7v7H2zm2 2v3h3V4zm7-2h7v7h-7zm2 2v3h3V4zM2 11h7v7H2zm2 2v3h3v-3zm7-2h2v2h-2zm2 2h2v2h-2zm2-2h3v2h-3zm-4 4h2v3h-2zm4 0h3v3h-3z"
          /></svg
        >
        <span>QR</span>
      </button>
      <a href={PDF} download aria-label="Download the poster as a PDF" title="Download the poster (PDF)">
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7"
          ><path d="M10 3v10m-4-4 4 4 4-4M4 16h12" stroke-linecap="round" stroke-linejoin="round" /></svg
        >
        <span>PDF</span>
      </a>
    </div>
  </nav>

  <main class="grid">
    <div class="a-background">
      <Panel id="background" title="Data and Background">
        <div class="setting-box">
          <div class="setting">
            <div class="smap"><SettingMap /></div>
            <div class="stime"><Timeline /></div>
          </div>
        </div>
      </Panel>
    </div>

    <div class="a-overview">
      <Panel id="overview" title="Study Overview" tone="mintDark">
        <div class="prose">
          <p>
            As climate change progresses, extreme climate events will become increasingly common. To predict population
            outcomes under climate change, predicting resilience to such events is critical. Here, we investigate exactly
            such an event in a range-wide study of <i>Mimulus cardinalis</i>, the scarlet monkeyflower.
          </p>
          <p>
            Genomic offset has become a common tool for exploring population vulnerability to climate change. Offset
            statistics aim to calculate how far future climate will push populations toward maladaptation. Some measure a
            climate distance, using genomics to weight the importance of climate variables. Others use observed allele
            frequencies to measure maladaptation distance in an allele-frequency space. Here, we present a test of these
            methods against long-term field data spanning an extreme climate event, and introduce one new method.
          </p>
        </div>
      </Panel>
    </div>

    <div class="a-predict">
      <Panel id="predict" title="What do we want to predict?">
        <OutcomesCartoon />
      </Panel>
    </div>

    <div class="a-offsets">
      <Panel id="offsets" title="We assessed 8 different offsets">
        <OffsetList />
      </Panel>
    </div>

    <section id="headline" class="a-headline headline" aria-labelledby="headline-title">
      <h2 id="headline-title">Geometric offset ranks the three extirpated populations as the safest</h2>
      <ForecastFate />
    </section>

    <div class="a-new">
      <Panel id="new" title="We test a new form of geometric offset">
        <G2Cartoon />
      </Panel>
    </div>

    <div class="a-main">
    <div class="a-results">
      <Panel id="results" tone="pink" title="Most offsets track climate distance, with the wrong sign; some offsets predict well on recovery">
        <AssocChart data={fig09} kind="assoc" id="results" />
      </Panel>
    </div>

    <div class="a-benchmark">
      <Panel id="benchmark" tone="pink" title="Few offsets on climate-associated loci outperform neutral, frequency-matched SNPs">
        <AssocChart data={fig10} kind="bench" id="benchmark" />
      </Panel>
    </div>
    </div>

    <div class="a-side">
      <Panel id="methods" title="Methods">
        <ul class="bullets">
          <li>
            <b>Correlations:</b> We use <b>Spearman rank correlations</b> because we are interested in identifying the
            at-risk populations, not the specific fitted relationships.
          </li>
          <li>
            <b>Effect sizes</b>: We <b>report −<span class="rho">ρ</span></b>, such that positive values mean that
            populations ranked as riskier experienced worse outcomes.
          </li>
          <li>
            <b>Covariates:</b> We use <b>partial Spearman rank correlations</b> to assess the impact of confounders like
            latitude, sample number, and sampling depth on effect size.
          </li>
          <li>
            <b>Extirpation treatment:</b> We <b>rank extirpated populations together</b> at the worst rank on the ‘change
            into drought’ outcome.
          </li>
          <li>
            <b>Random SNP benchmark:</b> We use <b>frequency-matched random draws of LD-pruned loci</b> for random-SNP
            versions of each predictor where applicable.
          </li>
        </ul>
      </Panel>

      <Panel id="takeaways" title="Takeaways" tone="mintDark">
        <ul class="bullets">
          <li><b>Low offset doesn’t mean low vulnerability</b> to climate events or change</li>
          <li><b>Benchmarking offset statistics</b> against climate distance and random SNPs can inform their interpretation</li>
          <li>
            <b>Observed-frequency based offsets</b> should better account for existing maladaptation, but the overall
            contribution of genomics for these predictions remains unclear
          </li>
          <li>The <b>choice of outcome</b> to predict changes predictions significantly</li>
          <li><b>Developing even larger, longer-term datasets</b> will be essential for validating predictors of resilience in the field</li>
        </ul>
      </Panel>

      <Panel id="next" title="When do genomes add information?" tone="blue">
        <p class="lead">Moving forward (to see progress so far, scan the QR code):</p>
        <ul class="bullets">
          <li>
            <b>Compare genomic offset</b> alongside other genomic, demographic, and environmental predictors on a wide range
            of demographic outcomes
          </li>
          <li>Ask <b>when genomic data adds value</b> to predictions of conservation relevance</li>
          <li><b>Explain the performance</b> of various predictors and interpret the underlying biology</li>
          <li>Build a <b>generalizable pipeline</b> to evaluate climate resilience in other systems</li>
          <li>
            Build <b>SLiM simulations</b> (individual-based, forward-in-time) to evaluate the conditions under which our results
            do or do not hold
          </li>
        </ul>
      </Panel>
    </div>
  </main>

  <Footer />
  <MethodDialog />
  <QrDialog />
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
    padding: clamp(1.4rem, 3vw, 3rem) clamp(1rem, 3vw, 3rem) clamp(1.5rem, 3.2vw, 3.2rem);
  }
  h1 {
    margin: 0 auto;
    max-width: 96rem;
    font-family: var(--aga-font);
    font-size: clamp(1.95rem, 1.1rem + 3.4vw, 4.9rem);
    font-weight: 600;
    line-height: 1.12;
    letter-spacing: 0.005em;
    color: #f3f2ef;
  }
  .hi {
    font-weight: 800;
    color: #fff;
  }

  .meta {
    max-width: 100rem;
    margin: 0 auto;
    padding: 1.1rem 1rem 0.9rem;
  }
  .question {
    font-size: clamp(1.12rem, 1rem + 0.8vw, 1.7rem);
    font-weight: 700;
    line-height: 1.25;
  }
  .authors {
    margin-top: 0.35rem !important;
    font-size: clamp(1rem, 0.95rem + 0.4vw, 1.4rem);
  }
  .authors sup,
  .affil sup {
    font-size: 0.65em;
  }
  .affil {
    margin-top: 0.3rem !important;
    display: flex;
    flex-wrap: wrap;
    gap: 0.1rem 2.5rem;
    font-size: clamp(0.82rem, 0.78rem + 0.25vw, 1.02rem);
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
  .chips a,
  .actions button,
  .actions a {
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
  .actions {
    display: flex;
    gap: 0.3rem;
  }
  .actions button,
  .actions a {
    border: 1px solid var(--aga-rule);
    background: var(--aga-paper);
    color: var(--aga-ink);
    cursor: pointer;
    padding: 0.3rem 0.6rem;
  }
  .actions a:hover,
  .actions button:hover {
    border-color: var(--aga-carnelian);
    color: var(--aga-carnelian);
    text-decoration: none;
  }
  @media (max-width: 30rem) {
    .actions span {
      display: none;
    }
  }
  .chips a:focus-visible,
  .actions :focus-visible {
    outline: 2px solid var(--aga-lake);
    outline-offset: 1px;
  }

  /* --- panels: stacked on a phone, the poster's grid on a wide screen ------------------ */
  .grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 2rem;
    max-width: 46rem;
    margin: 0 auto;
    padding: 1.4rem 1rem 2.6rem;
  }
  .a-main,
  .a-side {
    display: grid;
    gap: 2rem;
    align-content: start;
    min-width: 0;
  }
  .grid > div,
  .a-main > div {
    min-width: 0;
  }
  /* Laptop: the title and the first row (Data and Background, Study Overview) fit one screen,
     so the page can sit open on a table. The title scales with the screen's height. */
  @media (min-width: 76rem) {
    .band {
      padding: clamp(0.8rem, 2.2vh, 2rem) 2rem;
    }
    h1 {
      font-size: clamp(2.2rem, 4.4vh + 0.5rem, 4.6rem);
      line-height: 1.1;
    }
    .meta {
      padding: 0.6rem 2rem 0.55rem;
    }
    .question {
      font-size: 1.3rem;
    }
    .authors {
      margin-top: 0.15rem !important;
      font-size: 1.1rem;
    }
    .affil {
      margin-top: 0.1rem !important;
      font-size: 0.88rem;
    }
    .grid {
      max-width: 100rem;
      grid-template-columns: repeat(12, minmax(0, 1fr));
      gap: 2.4rem 1.8rem;
      padding: 1rem 2rem 3rem;
    }
    .a-background {
      grid-area: 1 / 1 / 2 / 7;
    }
    .a-overview {
      grid-area: 1 / 7 / 2 / 13;
    }
    .a-predict {
      grid-area: 2 / 1 / 3 / 5;
    }
    .a-offsets {
      grid-area: 2 / 5 / 3 / 9;
    }
    .a-new {
      grid-area: 2 / 9 / 3 / 13;
    }
    .a-headline {
      grid-area: 3 / 2 / 4 / 12;
    }
    .a-main {
      grid-area: 4 / 1 / 5 / 9;
      gap: 2.4rem;
    }
    .a-side {
      grid-area: 4 / 9 / 5 / 13;
    }
  }
  @media (max-width: 75.99rem) {
    .br-wide {
      display: none;
    }
  }

  .setting-box {
    container-type: inline-size;
  }
  .setting {
    display: grid;
    gap: 0.6rem;
  }
  .smap {
    width: min(100%, 15rem);
    margin: 0 auto;
  }
  @container (min-width: 34rem) {
    .setting {
      grid-template-columns: 28% 1fr;
      align-items: start;
    }
    .smap {
      width: 100%;
    }
  }

  .prose {
    font-size: 1.04rem;
    line-height: 1.5;
  }
  .prose p + p {
    margin-top: 0.9rem;
  }

  .headline {
    scroll-margin-top: var(--aga-sticky);
    min-width: 0;
  }
  .headline h2 {
    margin: 0 0 0.8rem;
    font-family: var(--aga-font);
    font-size: clamp(1.25rem, 1.05rem + 0.9vw, 1.75rem);
    font-weight: 700;
    line-height: 1.2;
    text-align: center;
    color: var(--aga-carnelian);
    text-wrap: balance;
  }

  .bullets {
    margin: 0;
    padding-left: 1.15rem;
    font-size: 0.98rem;
    line-height: 1.42;
  }
  .bullets li + li {
    margin-top: 0.3rem;
  }
  .lead {
    margin-bottom: 0.6rem !important;
    font-size: 0.98rem;
  }
  .rho {
    font-family: var(--aga-math);
  }
</style>
