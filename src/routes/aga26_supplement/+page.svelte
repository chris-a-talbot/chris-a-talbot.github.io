<script lang="ts">
  /**
   * /aga26_supplement — a placeholder for the AGA 2026 poster's supplementary material, linked
   * from the poster page's title band. Kept out of search results until it has content.
   */
  const TITLE = 'Genomic offset predicts population vulnerability in an extreme climate event... backwards';
</script>

<svelte:head>
  <title>Supplement | AGA 2026 | Chris Talbot</title>
  <meta name="robots" content="noindex" />
  <meta name="theme-color" content="#b31b1b" />
  <link
    href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:wght@400;600;700;800&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="supp-page">
  <header class="band">
    <div class="in">
      <a class="home" href="/">← chris-a-talbot.com</a>
      <p class="kicker">AGA 2026 poster</p>
      <h1>Supplement</h1>
      <p class="poster">{TITLE}</p>
    </div>
  </header>

  <main>
    <p>Supplementary material for this poster will be posted here.</p>
    <div class="links">
      <a class="btn primary" href="/AGA26">← Back to the poster</a>
      <a class="btn" href="/">chris-a-talbot.com</a>
    </div>
  </main>
</div>

<style>
  :global(html:has(.supp-page)),
  :global(body:has(.supp-page)) {
    background: #fff;
  }
  .supp-page {
    --red: #b31b1b;
    --ink: #222222;
    min-height: 100dvh;
    font-family: 'Atkinson Hyperlegible Next', system-ui, sans-serif;
    color: var(--ink);
    background: #fff;
  }
  .band {
    background: var(--red);
    color: #fff;
    padding: clamp(1.2rem, 4vw, 2.6rem) clamp(1rem, 4vw, 2.6rem);
  }
  .in {
    max-width: 60rem;
    margin: 0 auto;
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
    margin: 1.2rem 0 0;
    font-size: 0.95rem;
    font-weight: 600;
    color: #f3f2ef;
  }
  h1 {
    margin: 0.1rem 0 0;
    font-family: inherit;
    font-size: clamp(2.2rem, 1.6rem + 3vw, 3.6rem);
    font-weight: 800;
    line-height: 1.1;
    color: #fff;
  }
  .poster {
    margin: 0.6rem 0 0;
    font-size: clamp(1rem, 0.9rem + 0.6vw, 1.3rem);
    font-weight: 600;
    color: #f3f2ef;
    line-height: 1.3;
  }
  main {
    max-width: 60rem;
    margin: 0 auto;
    padding: 2rem clamp(1rem, 4vw, 2.6rem) 3rem;
    font-size: 1.05rem;
  }
  main p {
    margin: 0;
  }
  .links {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin-top: 1.4rem;
  }
  .btn {
    display: inline-flex;
    align-items: center;
    min-height: 2.6rem;
    padding: 0.5rem 1.1rem;
    border-radius: 999px;
    border: 1px solid #bdbbbb;
    color: var(--ink);
    text-decoration: none;
    font-weight: 600;
  }
  .btn:hover {
    border-color: var(--red);
    color: var(--red);
    text-decoration: none;
  }
  .btn.primary {
    background: var(--red);
    border-color: var(--red);
    color: #fff;
  }
  .btn.primary:hover {
    background: #9a1717;
    color: #fff;
  }
  a:focus-visible {
    outline: 2px solid #1f4396;
    outline-offset: 2px;
  }
  .home:focus-visible {
    outline-color: #fff;
  }
</style>
