<script lang="ts">
  export let title: string;
  export let expanded: boolean = true;

  function toggle() { expanded = !expanded; }
</script>

<div class="cv-section" class:expanded>
  <button class="cv-section-header" on:click={toggle} aria-expanded={expanded}>
    <h4>{title}</h4>
    <span class="cv-section-toggle" aria-hidden="true">{expanded ? '−' : '+'}</span>
  </button>
  {#if expanded}
    <div class="cv-section-content">
      <slot />
    </div>
  {/if}
</div>

<style>
  .cv-section { border-bottom: 1px solid var(--stone); }
  .cv-section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: var(--space-md) 0;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
  }
  .cv-section-header h4 {
    font-size: var(--text-lg);
    font-weight: 500;
    color: var(--slate-deep);
    margin: 0;
  }
  .cv-section-header:hover h4 { color: var(--highlight); }
  .cv-section-toggle {
    font-size: var(--text-xl);
    color: var(--sage);
    font-weight: 300;
  }
  .cv-section-content { padding-bottom: var(--space-lg); }
</style>
