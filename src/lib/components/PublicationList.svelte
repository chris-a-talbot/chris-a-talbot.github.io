<script lang="ts">
  import { publicationsByStatus } from '$lib/data/publications';

  function highlightAuthor(authors: string): string {
    return authors.replace(/(Talbot, C\. A\.)/g, '<span class="highlight">$1</span>');
  }
</script>

<div class="publications">
  {#if publicationsByStatus.published.length > 0}
    <div class="pub-group">
      <h3>Published</h3>
      <ul class="pub-list">
        {#each publicationsByStatus.published as pub}
          <li class="pub-item">
            <span class="pub-year">{pub.year}</span>
            <div class="pub-content">
              <span class="pub-authors">{@html highlightAuthor(pub.authors)}</span>
              <span class="pub-title">{pub.title}.</span>
              <span class="pub-venue">{pub.venue}.</span>
            </div>
          </li>
        {/each}
      </ul>
    </div>
  {/if}

  {#if publicationsByStatus.inReview.length > 0}
    <div class="pub-group">
      <h3>In Review</h3>
      <ul class="pub-list">
        {#each publicationsByStatus.inReview as pub}
          <li class="pub-item">
            <span class="pub-year">{pub.year}</span>
            <div class="pub-content">
              <span class="pub-authors">{@html highlightAuthor(pub.authors)}</span>
              <span class="pub-title">{pub.title}.</span>
              <span class="pub-venue">{pub.venue}.</span>
              {#if pub.arxiv}
                <span class="pub-arxiv">{pub.arxiv}</span>
              {/if}
            </div>
          </li>
        {/each}
      </ul>
    </div>
  {/if}

  {#if publicationsByStatus.inPrep.length > 0}
    <div class="pub-group">
      <h3>In Preparation</h3>
      <ul class="pub-list">
        {#each publicationsByStatus.inPrep as pub}
          <li class="pub-item">
            <span class="pub-year">{pub.year}</span>
            <div class="pub-content">
              <span class="pub-authors">{@html highlightAuthor(pub.authors)}</span>
              <span class="pub-title">{pub.title}.</span>
              <span class="pub-venue">{pub.venue}.</span>
            </div>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>

<style>
  .publications { max-width: 48rem; }
  .pub-group { margin-bottom: var(--space-xl); }
  .pub-group:last-child { margin-bottom: 0; }
  .pub-group h3 {
    font-size: var(--text-lg);
    font-weight: 500;
    margin-bottom: var(--space-md);
    padding-bottom: var(--space-sm);
    border-bottom: 1px solid var(--stone);
  }
  .pub-list { list-style: none; }
  .pub-item {
    display: grid;
    grid-template-columns: 4rem 1fr;
    gap: var(--space-md);
    padding: var(--space-md) 0;
    border-bottom: 1px solid color-mix(in srgb, var(--stone) 30%, transparent);
  }
  .pub-item:last-child { border-bottom: none; }
  .pub-year {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--sage);
  }
  .pub-content { line-height: 1.6; }
  .pub-authors { color: var(--sage); }
  .pub-authors :global(.highlight) {
    color: var(--highlight);
    font-weight: 500;
  }
  .pub-title {
    color: var(--slate-deep);
    font-weight: 500;
  }
  .pub-venue {
    color: var(--sage);
    font-style: italic;
  }
  .pub-arxiv {
    display: block;
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--teal-accent);
    margin-top: var(--space-xs);
  }
  @media (max-width: 600px) {
    .pub-item { grid-template-columns: 1fr; }
    .pub-year { margin-bottom: var(--space-xs); }
  }
</style>
