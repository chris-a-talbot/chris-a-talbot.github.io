<script lang="ts">
  import Nav from '$lib/components/Nav.svelte';
  import Terrain from '$lib/components/Terrain.svelte';
  import TerrainLFV from '$lib/components/TerrainLFV.svelte';
  import { slfvMode } from '$lib/background';
  import Section from '$lib/components/Section.svelte';
  import ContourRule from '$lib/components/ContourRule.svelte';
  import { postsByYear, posts, formatShortDate } from '$lib/blog';
</script>

<svelte:head>
  <title>Writing | Chris Talbot</title>
  <meta name="description" content="Notes on population genetics, simulation, and the tools that go with them, by Chris Talbot." />
  <meta property="og:title" content="Writing | Chris Talbot" />
  <meta property="og:description" content="Notes on population genetics, simulation, and the tools that go with them." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://chris-a-talbot.com/blog/" />
  <meta name="twitter:card" content="summary" />
</svelte:head>

<Nav variant="blog" />
{#if $slfvMode}
  <TerrainLFV />
{:else}
  <Terrain />
{/if}

<main>
  <Section id="writing" title="Writing">
    <div class="writing">
      {#if posts.length === 0}
        <p class="empty">I haven't posted yet, but I'm planning to!</p>
      {:else}
        {#each postsByYear as group}
          <div class="year">
            <ContourRule>{group.year}</ContourRule>
            <ul class="post-list">
              {#each group.items as post}
                <li class="post">
                  <a class="post-link" href="/blog/{post.slug}/">
                    <span class="post-date">{formatShortDate(post.date)}</span>
                    <span class="post-body">
                      <span class="post-title">{post.title}</span>
                      <span class="post-description">{post.description}</span>
                      {#if post.tags?.length}
                        <span class="post-tags">
                          {#each post.tags as tag}<span class="tag">{tag}</span>{/each}
                        </span>
                      {/if}
                    </span>
                  </a>
                </li>
              {/each}
            </ul>
          </div>
        {/each}
      {/if}
    </div>
  </Section>
</main>

<style>
  .writing {
    max-width: 52rem;
  }
  .empty {
    color: var(--sage);
    font-style: italic;
  }
  .year {
    margin-bottom: var(--space-xl);
  }
  .year:last-child {
    margin-bottom: 0;
  }
  .post-list {
    list-style: none;
    margin-top: var(--space-md);
  }
  .post-link {
    display: grid;
    grid-template-columns: 5rem 1fr;
    gap: var(--space-lg);
    padding: var(--space-md) 0;
    color: inherit;
    text-decoration: none;
    border-bottom: 1px solid color-mix(in srgb, var(--stone) 35%, transparent);
  }
  .post:last-child .post-link {
    border-bottom: none;
  }
  .post-link:hover {
    text-decoration: none;
  }
  .post-date {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--sage);
    padding-top: 0.2em;
  }
  .post-body {
    display: block;
    max-width: 42rem;
  }
  .post-title {
    display: block;
    font-family: var(--font-heading);
    font-size: var(--text-lg);
    font-weight: 500;
    color: var(--slate-deep);
    transition: color 0.15s ease;
  }
  .post-link:hover .post-title {
    color: var(--highlight);
  }
  .post-description {
    display: block;
    font-size: var(--text-sm);
    color: var(--sage);
    line-height: 1.6;
    margin-top: var(--space-xs);
  }
  .post-tags {
    display: block;
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--stone);
    margin-top: var(--space-sm);
  }
  .tag:not(:last-child)::after {
    content: ' · ';
  }

  @media (max-width: 600px) {
    .post-link {
      grid-template-columns: 1fr;
      gap: var(--space-xs);
    }
  }
</style>
