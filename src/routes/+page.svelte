<script lang="ts">
  import Section from '$lib/components/Section.svelte';
  import Nav from '$lib/components/Nav.svelte';
  import Terrain from '$lib/components/Terrain.svelte';
  import About from '$lib/components/About.svelte';
  import PublicationList from '$lib/components/PublicationList.svelte';
  import Portfolio from '$lib/components/Portfolio.svelte';
  import CV from '$lib/components/CV.svelte';
</script>

<svelte:head>
  <title>Chris Talbot | Computational Biology</title>
  <meta name="description" content="PhD student in Computational Biology at Cornell University. Research in population genetics, evolutionary ecology, and biodiversity conservation." />
  <meta property="og:title" content="Chris Talbot | Computational Biology" />
  <meta property="og:description" content="PhD student in Computational Biology at Cornell University. Research in population genetics and evolutionary ecology." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://chris-a-talbot.com" />
  <meta name="twitter:card" content="summary" />
</svelte:head>

<Nav />
<Terrain />

<main>
  <section id="hero" class="hero">
    <div class="hero-content">
      <h1>Chris Talbot</h1>
      <p class="tagline">Computational Biologist · Population Geneticist</p>
      <a href="https://www.cornell.edu" class="affiliation" target="_blank" rel="noopener noreferrer">
        <img src="/images/cornell_logo_simple_b31b1b.svg" alt="Cornell University" class="cornell-logo" />
      </a>
      <div class="scroll-indicator" aria-hidden="true">↓</div>
    </div>
  </section>

  <Section id="about" title="About">
    <About />
  </Section>

  <Section id="research" title="Research">
    <PublicationList />
  </Section>

  <Section id="portfolio" title="Portfolio">
    <Portfolio />
  </Section>

  <Section id="cv" title="CV">
    <CV />
  </Section>
</main>

<style>
  .hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: var(--space-lg);
  }

  .hero-content {
    max-width: 48rem;
  }

  .hero h1 {
    font-size: var(--text-4xl);
    font-weight: 700;
    margin-bottom: var(--space-md);
    color: var(--slate-deep);
    /* Strong text shadow for legibility against terrain */
    text-shadow:
      0 0 20px rgba(247, 250, 252, 0.95),
      0 0 40px rgba(247, 250, 252, 0.8),
      0 0 60px rgba(247, 250, 252, 0.6),
      0 2px 4px rgba(247, 250, 252, 1);
  }

  .tagline {
    font-size: var(--text-xl);
    color: var(--slate-deep);
    margin-bottom: var(--space-lg);
    font-weight: 600;
    text-shadow:
      0 0 15px rgba(247, 250, 252, 0.95),
      0 0 30px rgba(247, 250, 252, 0.8),
      0 1px 2px rgba(247, 250, 252, 1);
  }

  .affiliation {
    display: inline-block;
    margin-bottom: var(--space-2xl);
    transition: opacity 0.2s ease;
  }

  .affiliation:hover {
    opacity: 0.8;
  }

  .cornell-logo {
    height: 2.5rem;
    width: auto;
    filter: drop-shadow(0 0 8px rgba(247, 250, 252, 0.9)) drop-shadow(0 0 16px rgba(247, 250, 252, 0.7));
  }

  .scroll-indicator {
    font-size: var(--text-2xl);
    color: var(--slate-deep);
    animation: bounce 2s infinite;
    text-shadow:
      0 0 10px rgba(247, 250, 252, 0.9),
      0 0 20px rgba(247, 250, 252, 0.7);
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
  }

  @media (prefers-reduced-motion: reduce) {
    .scroll-indicator {
      animation: none;
    }
  }
</style>
