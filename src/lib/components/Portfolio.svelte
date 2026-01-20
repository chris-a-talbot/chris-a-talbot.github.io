<script lang="ts">
  import ProjectCard from './ProjectCard.svelte';
  import { projects } from '$lib/data/projects';

  const leadProjects = projects.filter(p => p.role === 'lead');
  const contributorProjects = projects.filter(p => p.role === 'contributor');
</script>

<div class="portfolio">
  <div class="portfolio-section">
    <h3>As Lead Developer</h3>
    <div class="project-grid">
      {#each leadProjects as project, i}
        <ProjectCard {project} size={i === 0 ? 'large' : 'medium'} />
      {/each}
    </div>
  </div>

  {#if contributorProjects.length > 0}
    <div class="portfolio-section">
      <h3>As Contributor</h3>
      <div class="project-grid contributors">
        {#each contributorProjects as project}
          <ProjectCard {project} size="medium" />
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .portfolio-section { margin-bottom: var(--space-2xl); }
  .portfolio-section:last-child { margin-bottom: 0; }
  .portfolio-section h3 {
    font-size: var(--text-xl);
    margin-bottom: var(--space-lg);
    padding-bottom: var(--space-sm);
    border-bottom: 1px solid var(--stone);
  }
  .project-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-lg);
  }
  .project-grid.contributors {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 1000px) {
    .project-grid.contributors { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 800px) {
    .project-grid, .project-grid.contributors { grid-template-columns: 1fr; }
  }
</style>
