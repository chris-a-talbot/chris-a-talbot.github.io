<script lang="ts">
  import Nav from '$lib/components/Nav.svelte';
  import ContourRule from '$lib/components/ContourRule.svelte';
  import { formatDate } from '$lib/blog';
  import type { PageData } from './$types';

  export let data: PageData;

  $: post = data.post;
  $: dateline = [formatDate(post.date), ...(post.tags ?? [])].join(' · ');
</script>

<svelte:head>
  <title>{post.title} | Chris Talbot</title>
  <meta name="description" content={post.description} />
  <meta property="og:title" content={post.title} />
  <meta property="og:description" content={post.description} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://chris-a-talbot.com/blog/{post.slug}/" />
  <meta property="article:published_time" content={post.date} />
  <meta name="twitter:card" content="summary" />
</svelte:head>

<Nav variant="blog" />

<main class="page">
  <article class="article">
    <header class="header">
      <div class="header-text">
        <h1>{post.title}</h1>
        <p class="lede">{post.description}</p>
      </div>
      <ContourRule>{dateline}</ContourRule>
    </header>

    <div class="prose">
      <svelte:component this={post.content} />
    </div>
  </article>

  <footer class="footer">
    <ContourRule>End</ContourRule>
    <nav class="post-nav">
      <div class="post-nav-side">
        {#if data.older}
          <span class="post-nav-label">Previous</span>
          <a href="/blog/{data.older.slug}/">{data.older.title}</a>
        {/if}
      </div>
      <div class="post-nav-side next">
        {#if data.newer}
          <span class="post-nav-label">Next</span>
          <a href="/blog/{data.newer.slug}/">{data.newer.title}</a>
        {/if}
      </div>
    </nav>
    <a class="back" href="/blog/">All writing</a>
  </footer>
</main>

<style>
  .page {
    max-width: 44rem;
    margin: 0 auto;
    padding: calc(var(--nav-height) + var(--space-xl)) var(--space-lg) var(--space-2xl);
  }

  /* ---- Header ---- */
  .header {
    margin-bottom: var(--space-xl);
  }
  .header-text {
    max-width: 36rem;
    margin: 0 auto var(--space-lg);
  }
  .header h1 {
    font-size: var(--text-3xl);
    line-height: 1.15;
    max-width: 20ch;
    text-wrap: balance;
  }
  .lede {
    font-family: var(--font-heading);
    font-size: var(--text-lg);
    line-height: 1.6;
    color: var(--sage);
    margin-top: var(--space-md);
  }

  /* ---- Article body ----
     A 36rem reading measure with a wider 44rem track that figures and tables
     can escape into. */
  .prose {
    display: grid;
    grid-template-columns:
      [wide-start] minmax(0, 1fr)
      [text-start] min(100%, 36rem) [text-end]
      minmax(0, 1fr) [wide-end];
  }
  .prose > :global(*) {
    grid-column: text;
  }
  .prose :global(figure),
  .prose :global(.wide) {
    grid-column: wide;
    margin: var(--space-lg) 0;
  }
  .prose :global(pre) {
    grid-column: wide;
  }

  .prose :global(p) {
    font-family: var(--font-heading);
    font-size: 1.0625rem;
    line-height: 1.75;
    color: var(--slate-deep);
    margin-bottom: var(--space-md);
  }

  /* Structure is set in the sans face so it reads against the serif prose. */
  .prose :global(h2),
  .prose :global(h3) {
    font-family: var(--font-body);
    font-weight: 600;
    color: var(--slate-deep);
    line-height: 1.3;
  }
  .prose :global(h2) {
    font-size: var(--text-lg);
    margin: var(--space-xl) 0 var(--space-sm);
  }
  .prose :global(h3) {
    font-size: var(--text-base);
    margin: var(--space-lg) 0 var(--space-sm);
  }

  .prose :global(ul),
  .prose :global(ol) {
    font-family: var(--font-heading);
    font-size: 1.0625rem;
    line-height: 1.75;
    margin: 0 0 var(--space-md) var(--space-lg);
  }
  .prose :global(li) {
    margin-bottom: var(--space-xs);
  }
  .prose :global(li)::marker {
    color: var(--stone);
  }

  .prose :global(blockquote) {
    border-left: 2px solid var(--teal-accent);
    padding-left: var(--space-md);
    margin: var(--space-lg) 0;
  }
  .prose :global(blockquote p) {
    color: var(--sage);
    font-style: italic;
    margin-bottom: 0;
  }

  .prose :global(hr) {
    border: none;
    border-top: 1px solid var(--stone);
    margin: var(--space-xl) 0;
  }

  .prose :global(figure) {
    display: block;
  }
  .prose :global(figure img) {
    display: block;
    width: 100%;
    height: auto;
    border: 1px solid var(--stone);
  }
  .prose :global(figcaption) {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    line-height: 1.6;
    color: var(--sage);
    margin-top: var(--space-sm);
  }
  .prose :global(p img) {
    max-width: 100%;
    height: auto;
  }

  /* ---- Code ---- */
  .prose :global(pre) {
    background-color: color-mix(in srgb, var(--cloud) 88%, var(--stone));
    border: 1px solid color-mix(in srgb, var(--stone) 50%, transparent);
    padding: var(--space-md);
    overflow-x: auto;
    margin-bottom: var(--space-md);
    line-height: 1.6;
  }
  .prose :global(code) {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
  }
  /* Code blocks hold a fixed size so ~80-column samples fit without scrolling. */
  .prose :global(pre code) {
    font-size: 0.875rem;
  }
  .prose :global(:not(pre) > code) {
    background-color: color-mix(in srgb, var(--cloud) 88%, var(--stone));
    padding: 0.1em 0.3em;
  }
  .prose :global(.token.comment),
  .prose :global(.token.prolog) {
    color: var(--stone);
  }
  .prose :global(.token.keyword),
  .prose :global(.token.boolean),
  .prose :global(.token.number) {
    color: var(--highlight);
  }
  .prose :global(.token.string),
  .prose :global(.token.char) {
    color: var(--teal-accent);
  }
  .prose :global(.token.function),
  .prose :global(.token.class-name) {
    color: var(--slate-deep);
    font-weight: 500;
  }
  .prose :global(.token.operator),
  .prose :global(.token.punctuation) {
    color: var(--sage);
  }

  /* ---- Tables ---- */
  .prose :global(table) {
    border-collapse: collapse;
    width: 100%;
    font-size: var(--text-sm);
    margin: var(--space-lg) 0;
  }
  .prose :global(th) {
    font-family: var(--font-body);
    font-weight: 600;
    text-align: left;
    border-bottom: 1px solid var(--stone);
  }
  .prose :global(td) {
    border-bottom: 1px solid color-mix(in srgb, var(--stone) 35%, transparent);
  }
  .prose :global(th),
  .prose :global(td) {
    padding: var(--space-sm) var(--space-md) var(--space-sm) 0;
  }

  /* ---- Footer ---- */
  .footer {
    margin-top: var(--space-2xl);
  }
  .post-nav {
    display: flex;
    justify-content: space-between;
    gap: var(--space-lg);
    margin: var(--space-lg) 0;
  }
  .post-nav-side {
    max-width: 18rem;
  }
  .post-nav-side.next {
    text-align: right;
  }
  .post-nav-label {
    display: block;
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--stone);
    margin-bottom: var(--space-xs);
  }
  .post-nav-side a {
    font-family: var(--font-heading);
    font-size: var(--text-base);
  }
  .back {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
  }

  @media (max-width: 600px) {
    .post-nav {
      flex-direction: column;
    }
    .post-nav-side.next {
      text-align: left;
    }
  }
</style>
