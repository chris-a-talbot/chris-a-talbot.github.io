<script lang="ts">
  import type { Education, Experience } from '$lib/data/types';

  export let items: Array<Education | Experience>;
  export let type: 'education' | 'experience' = 'education';
</script>

<div class="timeline">
  {#each items as item, i}
    <div class="timeline-item">
      <div class="timeline-marker"></div>
      <div class="timeline-content">
        {#if type === 'education'}
          {@const edu = item as Education}
          <div class="timeline-header">
            <span class="timeline-degree">{edu.degree}</span>
            <span class="timeline-year">{edu.year}</span>
          </div>
          <div class="timeline-field">{edu.field}</div>
          <div class="timeline-institution">{edu.institution}</div>
          {#if edu.honors}
            <div class="timeline-note">{edu.honors}</div>
          {/if}
          {#if edu.advisor}
            <div class="timeline-note">Advisor: {edu.advisor}</div>
          {/if}
        {:else}
          {@const exp = item as Experience}
          <div class="timeline-header">
            <span class="timeline-role">{exp.role}</span>
            <span class="timeline-year">{exp.period}</span>
          </div>
          <div class="timeline-lab">{exp.lab}</div>
          <div class="timeline-institution">{exp.institution}</div>
          {#if exp.project}
            <div class="timeline-project">{exp.project}</div>
          {/if}
        {/if}
      </div>
    </div>
  {/each}
</div>

<style>
  .timeline {
    position: relative;
    padding-left: var(--space-lg);
  }
  .timeline::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.5rem;
    bottom: 0.5rem;
    width: 1px;
    background-color: var(--stone);
  }
  .timeline-item {
    position: relative;
    padding-bottom: var(--space-lg);
  }
  .timeline-item:last-child {
    padding-bottom: 0;
  }
  .timeline-marker {
    position: absolute;
    left: calc(-1 * var(--space-lg) - 4px);
    top: 0.5rem;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background-color: var(--cloud);
    border: 2px solid var(--highlight);
  }
  .timeline-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: var(--space-md);
    flex-wrap: wrap;
  }
  .timeline-degree, .timeline-role {
    font-family: var(--font-heading);
    font-size: var(--text-lg);
    font-weight: 500;
    color: var(--slate-deep);
  }
  .timeline-year {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--sage);
  }
  .timeline-field, .timeline-lab {
    font-size: var(--text-base);
    color: var(--slate-deep);
    margin-top: var(--space-xs);
  }
  .timeline-institution {
    font-size: var(--text-sm);
    color: var(--sage);
  }
  .timeline-note, .timeline-project {
    font-size: var(--text-sm);
    color: var(--sage);
    font-style: italic;
    margin-top: var(--space-xs);
  }
</style>
