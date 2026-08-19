<script lang="ts">
  export let id: string;
  export let title: string | null = null;
</script>

<section {id} class="section">
  {#if title}
    <h2 class="section-title">{title}</h2>
  {/if}
  <div class="section-content paper">
    <slot />
  </div>
</section>

<style>
  .section {
    min-height: 100vh;
    padding: var(--space-xl) var(--space-lg);
    padding-top: calc(var(--nav-height) + var(--space-xl));
    position: relative;
  }

  .section-content {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: var(--space-xl);
  }

  .section-title {
    margin-bottom: var(--space-lg);
  }

  @media (max-width: 800px) {
    .section {
      padding: var(--space-lg) var(--space-md);
      padding-top: calc(var(--nav-height) + var(--space-lg));
    }

    .section-content {
      padding: var(--space-lg);
    }
  }
</style>
