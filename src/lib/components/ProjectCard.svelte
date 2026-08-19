<script lang="ts">
  import type { Project } from '$lib/data/types';
  export let project: Project;
</script>

<a
  href={project.href}
  class="project-card"
  class:full={project.full}
  class:with-logo={project.logo}
  target="_blank"
  rel="noopener noreferrer"
>
  {#if project.image}
    <div class="project-image">
      <img src={project.image} alt="{project.title} screenshot" loading="lazy" />
    </div>
  {/if}
  {#if project.logo}
    <!-- Decorative: the card's own title already names the project. -->
    <img class="project-logo" src={project.logo} alt="" loading="lazy" />
  {/if}
  <div class="project-content">
    <h4 class="project-title">{project.title}</h4>
    <p class="project-tagline">{project.tagline}</p>
    <p class="project-description">{project.description}</p>
  </div>
</a>

<style>
  .project-card {
    display: block;
    text-decoration: none;
    color: inherit;
    background: var(--cloud);
    border: 1px solid var(--stone);
    transition: border-color 0.15s ease, background-color 0.15s ease;
  }
  .project-card:hover {
    border-color: var(--highlight);
    background: color-mix(in srgb, var(--cloud) 95%, var(--highlight));
    text-decoration: none;
  }
  .project-image {
    overflow: hidden;
    border-bottom: 1px solid var(--stone);
  }
  .project-image img {
    width: 100%;
    height: auto;
    display: block;
    transition: transform 0.3s ease;
  }
  .project-card:hover .project-image img {
    transform: scale(1.02);
  }
  .project-content {
    padding: var(--space-md);
  }
  .project-title {
    font-size: var(--text-lg);
    margin-bottom: var(--space-xs);
  }
  .project-tagline {
    font-size: var(--text-sm);
    color: var(--teal-accent);
    margin-bottom: var(--space-sm);
  }
  .project-description {
    font-size: var(--text-sm);
    color: var(--sage);
    line-height: 1.5;
    margin-bottom: 0;
  }

  /* Spans the grid. Set per project rather than by position, so which card is
     wide is a property of the project and not of where it happens to sit. */
  .project-card.full {
    grid-column: span 2;
  }
  .project-card.full .project-content {
    padding: var(--space-lg);
  }
  .project-card.full .project-title {
    font-size: var(--text-xl);
  }

  /* A mark beside the text, rather than a screenshot above it. Fills out a
     full-width card for projects that have no interface to show. */
  .project-card.with-logo {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: var(--space-lg);
    padding: var(--space-lg);
  }
  .project-card.with-logo .project-content {
    padding: 0;
  }
  /* The mark carries its own black rule to the edge, so it needs no border. */
  .project-logo {
    display: block;
    width: 8rem;
    height: 8rem;
  }

  @media (max-width: 800px) {
    .project-card.full {
      grid-column: span 1;
    }
    .project-card.with-logo {
      gap: var(--space-md);
    }
    .project-logo {
      width: 5rem;
      height: 5rem;
    }
  }
</style>
