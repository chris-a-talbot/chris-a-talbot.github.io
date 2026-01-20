<script lang="ts">
  import type { Project } from '$lib/data/types';
  export let project: Project;
  export let size: 'large' | 'medium' | 'small' = 'medium';
</script>

<a href={project.href} class="project-card {size}" target="_blank" rel="noopener noreferrer">
  <div class="project-image">
    <img src={project.image} alt="{project.title} screenshot" loading="lazy" />
  </div>
  <div class="project-content">
    <h4 class="project-title">{project.title}</h4>
    <p class="project-tagline">{project.tagline}</p>
    <p class="project-description">{project.description}</p>
    {#if project.technologies}
      <div class="project-tech">
        {#each project.technologies as tech}
          <span class="tech-tag">{tech}</span>
        {/each}
      </div>
    {/if}
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
  .project-card:hover .project-image img { transform: scale(1.02); }
  .project-content { padding: var(--space-md); }
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
    margin-bottom: var(--space-md);
  }
  .project-tech {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
  }
  .tech-tag {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--sage);
  }
  .tech-tag:not(:last-child)::after { content: ' ·'; }
  .project-card.large { grid-column: span 2; }
  .project-card.large .project-content { padding: var(--space-lg); }
  .project-card.large .project-title { font-size: var(--text-xl); }
  .project-card.small .project-description { display: none; }
  @media (max-width: 800px) {
    .project-card.large { grid-column: span 1; }
  }
</style>
