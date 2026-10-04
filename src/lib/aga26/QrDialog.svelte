<script lang="ts">
  /** A full-screen QR for this page, to show from a laptop so people can open it on their phones. */
  import { FILES } from './theme';
  import { ui } from './state.svelte';

  let dialog: HTMLDialogElement;
  $effect(() => {
    if (!dialog) return;
    if (ui.qr && !dialog.open) dialog.showModal();
    if (!ui.qr && dialog.open) dialog.close();
  });
</script>

<dialog bind:this={dialog} onclose={() => (ui.qr = false)} onclick={() => (ui.qr = false)} aria-label="QR code for chris-a-talbot.com/AGA26">
  <div class="qr">
    <img src="{FILES}/qr_present.svg" alt="QR code linking to chris-a-talbot.com/AGA26" />
    <p>chris-a-talbot.com/AGA26</p>
  </div>
  <button class="close" aria-label="Close">×</button>
</dialog>

<style>
  dialog {
    width: 100vw;
    height: 100dvh;
    max-width: none;
    max-height: none;
    margin: 0;
    padding: 0;
    border: 0;
    background: var(--aga-paper);
    color: var(--aga-ink);
    font-family: var(--aga-font);
    cursor: zoom-out;
  }
  dialog[open] {
    display: grid;
    place-items: center;
  }
  .qr {
    display: grid;
    justify-items: center;
    gap: 1rem;
  }
  img {
    width: min(78vmin, 34rem);
    height: auto;
    image-rendering: pixelated;
  }
  p {
    margin: 0;
    font-size: clamp(1.2rem, 3.5vmin, 2.2rem);
    font-weight: 700;
    color: var(--aga-carnelian);
  }
  .close {
    position: absolute;
    top: 0.8rem;
    right: 1rem;
    width: 3rem;
    height: 3rem;
    border: 0;
    background: none;
    font-size: 2rem;
    color: var(--aga-soft-ink);
    cursor: pointer;
  }
</style>
