<script lang="ts">
  /**
   * A block that a phone or tablet (up to 64rem, an iPad in portrait) shows collapsed behind a
   * toggle, and a wider screen shows open. The collapse is CSS on the server-rendered markup, so
   * it never flashes open first. With `heading`, wider screens show the label as the block's
   * heading; otherwise the label appears only as the toggle. With `always`, every screen shows it
   * collapsed behind the toggle.
   */
  import type { Snippet } from 'svelte';

  let {
    label,
    heading = false,
    always = false,
    children
  }: { label: string; heading?: boolean; always?: boolean; children: Snippet } = $props();
  let open = $state(false);
  const uid = $props.id();
</script>

<div class="fold" class:open class:always>
  {#if heading}<h3 class="heading">{label}</h3>{/if}
  <button type="button" class="toggle" aria-expanded={open} aria-controls="{uid}-body" onclick={() => (open = !open)}>
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"
      ><path d="M5 3l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg
    >
    {label}
  </button>
  <div class="body" id="{uid}-body">
    {@render children()}
  </div>
</div>

<style>
  .heading {
    margin: 0 0 0.45rem;
    font-family: var(--aga-font);
    font-size: 1.05rem;
    font-weight: 700;
  }
  .toggle {
    display: none;
    align-items: center;
    gap: 0.4rem;
    width: 100%;
    min-height: 2.6rem;
    padding: 0.45rem 0.1rem;
    border: 0;
    border-top: 1px solid var(--aga-rule);
    background: none;
    font: inherit;
    font-size: 0.95rem;
    font-weight: 700;
    line-height: 1.25;
    text-align: left;
    color: var(--aga-ink);
    cursor: pointer;
  }
  .toggle svg {
    flex: none;
    transition: transform 0.15s;
  }
  .open .toggle svg {
    transform: rotate(90deg);
  }
  .toggle:focus-visible {
    outline: 2px solid var(--aga-lake);
    outline-offset: 2px;
  }
  .open .body {
    padding: 0.2rem 0 0.4rem;
  }
  .always .heading {
    display: none;
  }
  .always .toggle {
    display: flex;
  }
  .always:not(.open) .body {
    display: none;
  }
  @media (max-width: 64rem) {
    .heading {
      display: none;
    }
    .toggle {
      display: flex;
    }
    .fold:not(.open) .body {
      display: none;
    }
  }
</style>
