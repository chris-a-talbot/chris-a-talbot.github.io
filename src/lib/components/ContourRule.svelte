<script lang="ts">
  /**
   * A hairline that breaks to let a short label sit inline, the way a contour
   * line on a topographic map breaks around its elevation reading.
   */
</script>

<div class="contour-rule">
  <span class="line" aria-hidden="true"></span>
  <span class="label"><slot /></span>
  <span class="line" aria-hidden="true"></span>
</div>

<style>
  .contour-rule {
    display: flex;
    align-items: center;
    gap: var(--space-md);
  }
  .line {
    flex: 1 1 var(--space-lg);
    min-width: var(--space-md);
    height: 1px;
    background-color: var(--stone);
  }
  .label {
    flex: 0 1 auto;
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-align: center;
    color: var(--sage);
    white-space: nowrap;
  }

  /* A long label (a dateline with tags) would otherwise push the page wider
     than a phone screen. */
  @media (max-width: 700px) {
    .contour-rule {
      gap: var(--space-sm);
    }
    .label {
      white-space: normal;
    }
  }
</style>
