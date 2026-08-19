<script lang="ts">
  import Section from '$lib/components/Section.svelte';
  import Nav from '$lib/components/Nav.svelte';
  import Terrain from '$lib/components/Terrain.svelte';
  import TerrainLFV from '$lib/components/TerrainLFV.svelte';
  import { slfvMode } from '$lib/background';
  import Intro from '$lib/components/Intro.svelte';
  import Background from '$lib/components/Background.svelte';
  import PublicationList from '$lib/components/PublicationList.svelte';
  import Portfolio from '$lib/components/Portfolio.svelte';
  import CV from '$lib/components/CV.svelte';
  import { name, heroTagline, profileImage } from '$lib/data/bio';
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

<Nav variant="home" />
{#if $slfvMode}
  <TerrainLFV />
{:else}
  <Terrain />
{/if}

<main>
  <section id="hero" class="hero">
    <div class="hero-grid">
      <div class="identity">
        <div class="portrait">
          <img src={profileImage} alt="Chris Talbot" />
          <h1>{name}</h1>
        </div>
        <p class="tagline">
          {#each heroTagline as line}<span>{line}</span>{/each}
        </p>
      </div>
      <Intro />
    </div>
  </section>

  <Section id="background" title="Background">
    <Background />
  </Section>

  <Section id="publications" title="Publications">
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
  /* Deliberately short of a full screen, so the Background heading below crests
     the fold. That says there is more to read without an arrow having to say it. */
  .hero {
    min-height: calc(100vh - 11rem);
    display: flex;
    align-items: center;
    padding: calc(var(--nav-height) + var(--space-lg)) var(--space-lg) var(--space-lg);
  }

  /* Same width as the section panels below, so the intro card's right edge lines
     up with theirs rather than jogging out by an inch. */
  .hero-grid {
    width: 100%;
    max-width: var(--max-width);
    margin: 0 auto;
    display: grid;
    grid-template-columns: 20rem minmax(0, 1fr);
    gap: var(--space-xl);
    align-items: center;
  }

  /* The name sits inside the portrait, on a scrim. The bottom of this crop is his
     jacket, which measures about 70/255 luminance, so cloud-coloured type over a
     partial scrim clears contrast comfortably. */
  .portrait {
    position: relative;
    width: 100%;
    aspect-ratio: 1;
    border: 1px solid var(--stone);
    overflow: hidden;
    margin-bottom: var(--space-lg);
  }

  .portrait img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* A square keeps the source's full width, so none of him is cut off; 22%
       down puts his face on the upper third. */
    object-position: center 22%;
  }

  .portrait h1 {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0;
    padding: var(--space-xl) var(--space-md) var(--space-md);
    font-size: var(--text-3xl);
    font-weight: 700;
    line-height: 1.1;
    color: var(--cloud);
    /* Held near-opaque across the whole band the type occupies: bright sand shows
       through the lower right of this crop, and a softer ramp measured 2.5:1. */
    background: linear-gradient(
      to top,
      color-mix(in srgb, var(--slate-deep) 93%, transparent) 0%,
      color-mix(in srgb, var(--slate-deep) 88%, transparent) 55%,
      color-mix(in srgb, var(--slate-deep) 30%, transparent) 85%,
      transparent 100%
    );
  }

  .tagline span {
    display: block;
  }

  .tagline {
    font-size: var(--text-xl);
    color: var(--slate-deep);
    margin-bottom: var(--space-lg);
    font-weight: 600;
    text-shadow:
      0 0 15px var(--cloud),
      0 0 30px var(--cloud),
      0 1px 2px var(--cloud);
  }

  @media (max-width: 1000px) {
    .hero {
      min-height: auto;
      padding-top: calc(var(--nav-height) + var(--space-xl));
      padding-bottom: var(--space-xl);
    }

    .hero-grid {
      grid-template-columns: 1fr;
      gap: var(--space-lg);
    }

    /* Only the identity centres; the paragraph beside it stays ranged left. */
    .identity {
      text-align: center;
    }

    .portrait {
      max-width: 22rem;
      margin-left: auto;
      margin-right: auto;
      text-align: left;
    }

  }
</style>
