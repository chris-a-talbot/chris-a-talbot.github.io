<script lang="ts">
  export let id: string;
  export let title: string | null = null;
</script>

<section {id} class="section">
  {#if title}
    <h2 class="section-title">{title}</h2>
  {/if}
  <div class="section-content">
    <slot />
  </div>
</section>

<style>
  .section {
    min-height: 100vh;
    padding: var(--space-2xl) var(--space-lg);
    padding-top: calc(var(--nav-height) + var(--space-2xl));
    position: relative;
  }

  .section-content {
    max-width: var(--max-width);
    margin: 0 auto;
    /* Subtle backdrop for readability */
    background: linear-gradient(
      135deg,
      rgba(247, 250, 252, 0.75) 0%,
      rgba(247, 250, 252, 0.6) 100%
    );
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    border-radius: 2px;
    padding: var(--space-xl);
    /* Subtle border for definition */
    box-shadow:
      0 1px 0 rgba(255, 255, 255, 0.5),
      0 0 0 1px rgba(45, 55, 72, 0.05);
  }

  .section-title {
    margin-bottom: var(--space-xl);
  }

  @media (max-width: 800px) {
    .section {
      padding: var(--space-xl) var(--space-md);
      padding-top: calc(var(--nav-height) + var(--space-xl));
    }

    .section-content {
      padding: var(--space-lg);
    }
  }
</style>
