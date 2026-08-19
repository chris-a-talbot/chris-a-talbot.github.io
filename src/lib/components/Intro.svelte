<script lang="ts">
  import { bio, contact } from '$lib/data/bio';
</script>

<div class="intro paper">
  <p class="intro-bio">{bio}</p>
  <div class="intro-actions">
    <a class="action" href="/blog/">Read my blog <span aria-hidden="true">&rarr;</span></a>
    <div class="intro-links">
      <a href={contact.github} class="intro-link">GitHub</a>
      <a href={contact.linkedin} class="intro-link">LinkedIn</a>
      <span class="intro-link intro-email">{contact.email}</span>
    </div>
  </div>
</div>

<style>
  .intro {
    padding: var(--space-lg);
  }
  .intro-bio {
    line-height: 1.7;
    margin-bottom: var(--space-lg);
  }
  /* Button and links share a row, the links optically centred against the button. */
  .intro-actions {
    display: flex;
    align-items: center;
    gap: var(--space-lg);
    flex-wrap: wrap;
  }
  /* Tighter than the gap to the button, so the three read as one group beside it
     rather than as four evenly spaced items. */
  .intro-links {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    flex-wrap: wrap;
  }
  .intro-link {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
  }
  .intro-email {
    color: var(--sage);
    user-select: all;
  }
</style>
