<script lang="ts">
  /**
   * The citation-and-equation card for the metric in ui.method. Citations and maths only.
   * The maths is TeX typeset by KaTeX (tex.ts), fetched while the page is idle so a card opens
   * already typeset; until it arrives the TeX source is shown.
   */
  import { onMount } from 'svelte';
  import { C } from './theme';
  import { METHODS, METHOD } from './methods';
  import { ui } from './state.svelte';

  type Tex = typeof import('./tex');
  let tex: Tex | null = $state(null);
  const load = () => import('./tex').then((t) => (tex = t));
  onMount(() => {
    const idle = window.requestIdleCallback ?? ((f: () => void) => setTimeout(f, 1200));
    idle(() => load());
  });
  $effect(() => {
    if (ui.method && !tex) load();
  });
  const show = (t: string) => (tex ? tex.display(t) : `<code>${t}</code>`);
  const sym = (t: string) => (tex ? tex.inline(t) : `<code>${t}</code>`);
  const prose = (h: string) => (tex ? tex.prose(h) : h);

  let dialog: HTMLDialogElement;
  const m = $derived(ui.method ? METHOD[ui.method] : null);
  const at = $derived(m ? METHODS.indexOf(m) : -1);
  const GROUP = {
    environmental: ['Environmental-change', C.lake],
    observed: ['Observed-reference', C.spruce],
    benchmark: ['Climate-only benchmark', C.ink]
  } as const;

  $effect(() => {
    if (!dialog) return;
    if (m && !dialog.open) dialog.showModal();
    if (!m && dialog.open) dialog.close();
  });

  function step(d: number) {
    ui.method = METHODS[(at + d + METHODS.length) % METHODS.length].key;
  }
  function backdrop(e: MouseEvent) {
    if (e.target === dialog) ui.method = null;
  }
</script>

<dialog bind:this={dialog} onclose={() => (ui.method = null)} onclick={backdrop} aria-labelledby="method-title">
  {#if m}
    <article>
      <header>
        <p class="group" style:color={GROUP[m.group][1]}>{GROUP[m.group][0]}</p>
        <h2 id="method-title">{m.number}) {m.name}</h2>
        <button class="close" aria-label="Close" onclick={() => (ui.method = null)}>×</button>
      </header>

      <section>
        <h3>Citation</h3>
        <ul class="refs">
          {#each m.refs as r}
            <li>
              {#if r.role}<span class="role">{r.role}:</span>{/if}
              {@html r.html}
              {#if r.doi}<a href="https://doi.org/{r.doi}" target="_blank" rel="noopener">doi:{r.doi}</a>{/if}
            </li>
          {/each}
        </ul>
      </section>

      <section>
        <h3>Calculation</h3>
        {#if m.steps}
          <ol class="steps">
            {#each m.steps as s}<li>{@html prose(s)}</li>{/each}
          </ol>
        {/if}
        <div class="eqs">
          {#each m.equations as e}<div class="eq">{@html show(e)}</div>{/each}
        </div>
      </section>

      <section>
        <h3>Notation</h3>
        <dl>
          {#each m.notation as [symbol, meaning]}
            <dt>{@html sym(symbol)}</dt>
            <dd>{@html prose(meaning)}</dd>
          {/each}
        </dl>
      </section>

      <nav>
        <button onclick={() => step(-1)}>← {METHODS[(at - 1 + METHODS.length) % METHODS.length].number}</button>
        <button onclick={() => step(1)}>{METHODS[(at + 1) % METHODS.length].number} →</button>
      </nav>
    </article>
  {/if}
</dialog>

<style>
  dialog {
    width: min(42rem, 100vw - 1.5rem);
    max-height: min(90dvh, 52rem);
    padding: 0;
    border: 0;
    border-radius: 0.8rem;
    color: var(--aga-ink);
    background: var(--aga-paper);
    font-family: var(--aga-font);
    box-shadow: 0 10px 40px rgb(0 0 0 / 0.25);
  }
  dialog::backdrop {
    background: rgb(34 34 34 / 0.45);
  }
  @media (max-width: 40rem) {
    dialog {
      width: 100vw;
      max-width: 100vw;
      margin: auto 0 0;
      border-radius: 0.9rem 0.9rem 0 0;
      max-height: 88dvh;
    }
  }
  article {
    padding: 0 1.1rem 1rem;
  }
  header {
    position: sticky;
    top: 0;
    background: var(--aga-paper);
    padding: 0.9rem 2.2rem 0.5rem 0;
    border-bottom: 1px solid var(--aga-panel);
    z-index: 1;
  }
  .group {
    margin: 0;
    font-size: 0.82rem;
    font-weight: 600;
  }
  h2 {
    margin: 0.1rem 0 0;
    font-family: var(--aga-font);
    font-size: 1.3rem;
    font-weight: 700;
    line-height: 1.2;
    color: var(--aga-ink);
  }
  .close {
    position: absolute;
    top: 0.6rem;
    right: -0.4rem;
    width: 2.4rem;
    height: 2.4rem;
    border: 0;
    background: none;
    font-size: 1.6rem;
    color: var(--aga-soft-ink);
    cursor: pointer;
  }
  h3 {
    margin: 1rem 0 0.4rem;
    font-family: var(--aga-font);
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--aga-soft-ink);
  }
  .refs,
  .steps {
    margin: 0;
    padding-left: 1.1rem;
    font-size: 0.92rem;
    line-height: 1.4;
  }
  .refs li + li,
  .steps li + li {
    margin-top: 0.35rem;
  }
  .role {
    font-weight: 600;
  }
  .refs a {
    color: var(--aga-lake);
    word-break: break-all;
  }
  .eqs {
    margin-top: 0.6rem;
    padding: 0.2rem 0.75rem;
    background: var(--aga-panel);
    border-radius: 0.5rem;
    overflow-x: auto;
    overflow-y: hidden;
  }
  .eq :global(.katex-display) {
    margin: 0.55rem 0;
    text-align: left;
  }
  .eq :global(.katex-display > .katex) {
    text-align: left;
  }
  .eqs :global(.katex),
  dl :global(.katex),
  .steps :global(.katex) {
    font-size: 1.08em;
  }
  @media (max-width: 30rem) {
    .eqs :global(.katex) {
      font-size: 0.98em;
    }
  }
  dl {
    margin: 0;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.35rem 0.9rem;
    font-size: 0.92rem;
    line-height: 1.4;
  }
  dt {
    white-space: nowrap;
  }
  dd {
    margin: 0;
  }
  .steps :global(code),
  .eqs :global(code),
  dt :global(code) {
    font-family: var(--aga-math);
    font-size: 0.95em;
    background: var(--aga-panel);
    padding: 0 0.2em;
    border-radius: 0.2em;
  }
  nav {
    display: flex;
    justify-content: space-between;
    margin-top: 1.1rem;
  }
  nav button {
    border: 1px solid var(--aga-rule);
    border-radius: 999px;
    background: var(--aga-paper);
    padding: 0.35rem 0.9rem;
    font: inherit;
    font-size: 0.85rem;
    color: var(--aga-ink);
    cursor: pointer;
  }
  button:focus-visible {
    outline: 2px solid var(--aga-lake);
  }
</style>
