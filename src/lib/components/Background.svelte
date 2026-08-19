<script lang="ts">
  import Timeline from './Timeline.svelte';
  import { education, experience } from '$lib/data/bio';
</script>

<div class="background-columns">
  <div class="background-column">
    <h3>Education</h3>
    <Timeline items={education} type="education" />
  </div>
  <div class="background-column">
    <h3>Research Experience</h3>
    <Timeline items={experience} type="experience" />
  </div>
</div>

<style>
  .background-columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-2xl);
  }
  .background-column h3 {
    font-size: var(--text-xl);
    margin-bottom: var(--space-lg);
    padding-bottom: var(--space-sm);
    border-bottom: 1px solid var(--stone);
  }
  @media (max-width: 1000px) {
    .background-columns {
      grid-template-columns: 1fr;
      gap: var(--space-xl);
    }
  }
</style>
