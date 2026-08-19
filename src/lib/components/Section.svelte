<script lang="ts">
  export let id: string;
  export let title: string | null = null;
</script>

<section {id} class="section">
  <div class="section-inner">
    {#if title}
      <h2 class="section-title">{title}</h2>
    {/if}
    <div class="section-content paper">
      <slot />
    </div>
  </div>
</section>

<style>
  .section {
    min-height: 100vh;
    padding: var(--space-xl) var(--space-lg);
    padding-top: calc(var(--nav-height) + var(--space-xl));
    position: relative;
  }

  /* Title and panel share a track, so the heading is positioned against the
     panel's edge rather than against the viewport. */
  .section-inner {
    max-width: var(--max-width);
    margin: 0 auto;
  }

  .section-content {
    border-radius: 2px;
    padding: var(--space-xl);
  }

  /*
   * Centred on the panel's left border, so the heading reads as a label for the
   * box rather than drifting off toward the window edge on a wide screen. The
   * shift is capped at whatever gutter actually exists — half the title where
   * there is room, less where there isn't, nothing at all once the panel fills
   * the width — so it can never be pushed off the edge of the screen.
   */
  .section-title {
    width: fit-content;
    margin-bottom: var(--space-lg);
    transform: translateX(calc(-1 * min(50%, max(0px, (100vw - 76rem) / 2))));
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
